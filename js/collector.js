(() => {
  // Base path for reverse proxy
  const BASE = '/json';                
  // Endpoint for sessions documents
  const SESSIONS_URL = `${BASE}/sessions`;
  // Endpoint for events stream
  const EVENTS_URL   = `${BASE}/events`;
  const IDLE_MS = 2000;                 // idle if no activity for >= 2s
  const THROTTLE_MS = 250;              // reduce mouse/scroll spam

  // HELPERS 
  const nowIso = () => new Date().toISOString();
  const uuid = () =>
    (crypto?.randomUUID ? crypto.randomUUID() : (Date.now() + Math.random().toString(16).slice(2)));

  // Simple throttle
  const throttle = (fn, wait) => {
    let last = 0;
    return (...args) => {
      const t = Date.now();
      if (t - last >= wait) { last = t; fn(...args); }
    };
  };

  // SESSION IDs
  const storage = window.localStorage;
  let sid = storage.getItem('collector_sid');
  if (!sid) { sid = uuid(); storage.setItem('collector_sid', sid); }
  const pid = uuid(); // pageview id 

  // queue in localStorage, flush periodically
  const QKEY = 'collector_queue';
  // Load the local queue
  const loadQ = () => { try { return JSON.parse(storage.getItem(QKEY) || '[]'); } catch { return []; } };
  // Save the local queue
  const saveQ = (q) => { try { storage.setItem(QKEY, JSON.stringify(q)); } catch {} };
  // Push a single event into the local queue
  const enqueue = (evt) => { const q = loadQ(); q.push(evt); saveQ(q); };
  
  // POST JSON with fetch
  async function postJSON(url, body) {
    try {
      const res = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), keepalive: true
      });
      return res.ok;
    } catch { return false; }
  }
  
  // Send everything the queue "flush"
  async function flush() {
    const q = loadQ();
    while (q.length) {
      const evt = q[0];
      const ok = await postJSON(EVENTS_URL, evt);
      if (!ok) break;       // stop on first failure; try again later
      q.shift();
    }
    saveQ(q);
  }
  // FLush o a timer and when the network comes back
  setInterval(flush, 5000);
  window.addEventListener('online', flush);

  // If the user allows cookies
  // try to set and read a temp cookie, then delete it
  function cookiesEnabled() {
    try {
      document.cookie = 'c_t=1; samesite=lax; path=/';
      const ok = document.cookie.includes('c_t=');
      document.cookie = 'c_t=; Max-Age=0; path=/';
      return ok;
    } catch { return false; }
  }

  // If the user allows JS
  // Since we are runnning js, then it works
  function jsEnabled() { return true; } 
  
  // If the user allows CSS
  // Inject a style that moces a probe div
  function cssEnabled() {
    try {
      const style = document.createElement('style');
      style.textContent = '#css_probe{left:12345px;position:absolute}';
      document.head.appendChild(style);
      const probe = document.createElement('div'); probe.id = 'css_probe';
      document.body.appendChild(probe);
      const ok = window.getComputedStyle(probe).left === '12345px';
      style.remove(); probe.remove();
      return ok;
    } catch { return false; }
  }

  // If the user allows images
  // Try to load a 1x1 transparent GIF
  function imagesEnabled() {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      } catch { resolve(false); }
    });
  }

  // User's network connection type
  function connectionInfo() {
    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return { type: 'unknown' };
    const { effectiveType, type, downlink, rtt, saveData } = c;
    return { effectiveType, type, downlink, rtt, saveData };
  }

  // PERFORMANCE (collected after the page has loaded)
  function gatherPerformance() {
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    if (nav) {
      const start = performance.timeOrigin + nav.startTime;
      const end   = performance.timeOrigin + nav.loadEventEnd;
      return {
        // When the page started loading
        startTimeMs: Math.round(start),
        // When the page ended loading
        endTimeMs:   Math.round(end),
        // Total load time
        totalLoadTimeMs: Math.max(0, Math.round(nav.loadEventEnd - nav.startTime)),
        navigation: nav.toJSON ? nav.toJSON() : nav
      };
    }
    // Fallback
    const t = performance.timing;
    const start = t.navigationStart;
    const end   = t.loadEventEnd || Date.now();
    return {
      // When the page started loading
      startTimeMs: start,
      // When the page ended loading
      endTimeMs: end,
      // Total load time
      totalLoadTimeMs: Math.max(0, end - start),
      // The whole timing object
      timing: t
    };
  }

  // STATIC (collected after the page has loaded)
  async function gatherStatic() {
    return {
      // User agent string
      ua: navigator.userAgent,
      // User's language
      language: navigator.language || navigator.languages?.[0] || 'unknown',
      // If the user accepts cookies
      cookieOk: cookiesEnabled(),
      // If the user allows JS
      jsOk: jsEnabled(),
      // If the user allows CSS
      cssOk: cssEnabled(),
      // If the user allows images
      imgOk: await imagesEnabled(),
      // User's screen dimensions
      screen: {
        width: screen.width, height: screen.height,
        availWidth: screen.availWidth, availHeight: screen.availHeight,
        pixelRatio: window.devicePixelRatio || 1
      },
      // User's window dimensions
      window: {
        innerWidth: window.innerWidth, innerHeight: window.innerHeight,
        outerWidth: window.outerWidth, outerHeight: window.outerHeight
      },
      // User's network connection type
      connection: connectionInfo()
    };
  }

  // Build an event object with sid, pid, url information, timestamp, and data
  const build = (type, data) => ({
    sid, pid, type,
    url: location.href,
    path: location.pathname + location.search + location.hash,
    ts: nowIso(),
    data
  });
  
  // Try to POST an event now, if fails queue for later
  async function send(evt) {
    const ok = await postJSON(EVENTS_URL, evt);
    if (!ok) enqueue(evt);
  }

  // ACTIVITY (continuously collected)
  let idleTimer = null;
  let idleStart = null;

  function resetIdleTimer() {
    // If we were idle, this activity ends the idle period → send duration
    if (idleStart !== null) {
      const ended = Date.now();
      const durationMs = ended - idleStart;
      send(build('idle', { idleEndedAt: new Date(ended).toISOString(), durationMs }));
      idleStart = null;
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      // became idle; record start time, but only send on resume so we have duration
      idleStart = Date.now();
    }, IDLE_MS);
  }

  // Mouse (throttled)
  window.addEventListener('mousemove', throttle((e) => {
    resetIdleTimer();
    send(build('mouse', { x: e.clientX, y: e.clientY }));
  }, THROTTLE_MS), { passive: true });
  // Scrolling (throttled)
  window.addEventListener('scroll', throttle(() => {
    resetIdleTimer();
    send(build('scroll', { x: window.scrollX, y: window.scrollY }));
  }, THROTTLE_MS), { passive: true });
  // Clicks
  window.addEventListener('click', (e) => {
    resetIdleTimer();
    const t = e.target; const tag = t?.tagName?.toLowerCase() || null;
    send(build('click', { button: e.button, x: e.clientX, y: e.clientY, target: tag, targetId: t?.id || null }));
  }, { passive: true });

  // Keyboard (redact exact keys inside inputs/textarea/contentEditable)
  const isInputLike = (el) => !!el && (['input','textarea'].includes(el.tagName?.toLowerCase()) || el.isContentEditable);
  function keyPayload(e) {
    const redact = isInputLike(e.target);
    return { kind: e.type, key: redact ? '•' : e.key, code: e.code, ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, meta: e.metaKey };
  }
  window.addEventListener('keydown', (e) => { resetIdleTimer(); send(build('keydown', keyPayload(e))); });
  window.addEventListener('keyup',   (e) => { resetIdleTimer(); send(build('keyup',   keyPayload(e))); });

  // Errors
  window.addEventListener('error', (e) => {
    send(build('error', { message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno, stack: e.error?.stack || null }));
  });
  window.addEventListener('unhandledrejection', (e) => {
    send(build('error', { reason: e.reason?.message || String(e.reason), stack: e.reason?.stack || null }));
  });

  // Page enter/exit
  send(build('page_enter', { referrer: document.referrer || null }));

  function sendExit() {
    const evt = build('page_exit', {});
    try {
      const blob = new Blob([JSON.stringify(evt)], { type: 'application/json' });
      const ok = navigator.sendBeacon?.(EVENTS_URL, blob);
      if (!ok) enqueue(evt);
    } catch { enqueue(evt); }
    flush(); 
  }
  window.addEventListener('pagehide', sendExit);
  window.addEventListener('beforeunload', sendExit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendExit();
  });

  // CREATE SESSION DOC (static + performance)
  async function initSession() {
    const staticData = await gatherStatic();
    const performanceData = gatherPerformance();
    await postJSON(SESSIONS_URL, {
      sid, pid,
      startedAt: nowIso(),
      url: location.href,
      path: location.pathname + location.search + location.hash,
      referrer: document.referrer || null,
      static: staticData,
      performance: performanceData
    });
    resetIdleTimer(); // begin idle tracking after first load
  }

  if (document.readyState === 'complete') initSession();
  else window.addEventListener('load', initSession);
})();
