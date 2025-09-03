const express = require('express');
const fs = require('fs');
const path = require('path');

const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'db-mysql-sfo3-96768-do-user-24552608-0.l.db.ondigitalocean.com',
    port: 25060,
    user: 'doadmin',
    password: 'AVNS_GGH6rwM7sVhjdD-aCr8',
    database: 'logs',
    ssl: {
       rejectUnauthorized: true,
       ca: fs.readFileSync('/etc/ssl/do/ca-certificate.crt')
    },
    waitForConnections: true,
    connectionLimit: 10
});

// Async handler wrapper
const ah = (fn) => (request, response, next) => Promise.resolve(fn(request, response, next)).catch(next);

const app = express();
app.use(express.json());

const DB_PATH = path.join(__dirname, 'static.json');

// Load initial data
function loadData() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
    }
    catch {
        return [];
    }
};
function saveData(arr){
    fs.writeFileSync(DB_PATH, JSON.stringify(arr, null, 2));
};

// Base path for the api
const api = express.Router();
app.use('/api', api);


// -------- STATIC ------------
// GET /api/static: Retrieve every entry logged in the static table
// request object contains details like the HTTP method , headers and request post
// responce object defines the information that we want to send
api.get("/static", ah(async(request, response) => {
    const limit = Math.min(parseInt(request.query.limit || '100', 10), 500);
    const offset = parseInt(request.query.offset || '0', 10);
    const [rows] = await pool.query (
                  'SELECT * FROM static ORDER BY created_at DESC LIMIT ? OFFSET ?',
                  [limit, offset]
                  );
    response.json(rows);
}));
// GET /api/static/{id}: Retrieve a specific entry logged in the static 
// table(that matches the given id)
api.get("/static/:id", ah(async(request, response) => {
    const [rows] = await pool.query('SELECT * FROM static WHERE id = ?', [request.params.id]);
    if(rows.length === 0)
       return response.status(404).json({error: 'Not Found'});
    response.json(rows[0]);
}));

// POST /api/static: Add a new entry to the static table
api.post("/static", ah(async(request, response) => {
    const body = request.body || {};
    // minimal validation
    const session_id = body.session_id || 'demo';
    const lang = body.lang || null;
    const platform = body.platform || null;
    const screen_w = body.screen_w ?? null;
    const screen_h = body.screen_h ?? null;

    const [result] = await pool.query(
      'INSERT INTO static (session_id, lang, platform, screen_w, screen_h, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [session_id, lang, platform, screen_w, screen_h]
    );
    const [rows] = await pool.query('SELECT * FROM static WHERE id = ?', [result.insertId]);
    response.status(201).json(rows[0]);
}));

// DELETE /api/static/{id}: Delete a specific entry from the static table 
// (that matches the given id)
api.delete("/static/:id", ah(async(request, response) => {
    const id = request.params.id;
    const [rows] = await pool.query('SELECT * FROM static WHERE id = ?', [id]);
    if (rows.length === 0)
       return response.status(404).json({ error: 'Not Found' });
    await pool.query('DELETE FROM static WHERE id = ?', [id]);
    response.json(rows[0]);
}));

// PUT /api/static/{id}: Update a specific entry from the static table 
// (that matches the given id)
api.put("/static/:id", ah(async(request, response) => {
    const id = request.params.id;
    const body = request.body || {};
    const [exists] = await pool.query('SELECT id FROM static WHERE id = ?', [id]);
    if (exists.length === 0) 
       return response.status(404).json({ error: 'Not Found' });

    const fields = ['session_id','lang','platform','screen_w','screen_h'];
    const sets = [];
    const vals = [];
    for (const f of fields) {
      if (body[f] !== undefined) { 
         sets.push(`${f} = ?`); 
         vals.push(body[f]); 
         }
    }
    if (sets.length === 0) 
       return response.status(400).json({ error: 'No fields to update' });

    await pool.query(`UPDATE static SET ${sets.join(', ')} WHERE id = ?`, [...vals, id]);
    const [rows] = await pool.query('SELECT * FROM static WHERE id = ?', [id]);
    response.json(rows[0]);
}));

// ----------- PERFORMANCE ------------------
// GET /api/performance?limit=100&offset=0
api.get('/performance', ah(async(request, response, next) => {
  try {
    const limit = Math.min(parseInt(request.query.limit || '100', 10), 500);
    const offset = parseInt(request.query.offset || '0', 10);
    const [rows] = await pool.query(
      'SELECT * FROM performance ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    response.json(rows);
  } catch (err) { 
      next(err);
  }
}));

// GET /api/performance/:id
api.get('/performance/:id', ah(async(request, response, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM performance WHERE id = ?', [request.params.id]);
    if (rows.length === 0) return response.status(404).json({ error: 'Not found' });
    response.json(rows[0]);
  } catch (err) { next(err); }
}));

// POST /api/performance  { session_id, metric, value_ms }
api.post('/performance', ah(async(request, response, next) => {
  try {
    const { session_id = 'demo-123', metric, value_ms = null } = request.body || {};
    if (!metric) return response.status(400).json({ error: 'metric is required' });
    const [result] = await pool.query(
      'INSERT INTO performance (session_id, metric, value_ms, created_at) VALUES (?, ?, ?, NOW())',
      [session_id, metric, value_ms]
    );
    const [rows] = await pool.query('SELECT * FROM performance WHERE id = ?', [result.insertId]);
    response.status(201).json(rows[0]);
  } catch (err) { 
      next(err); 
  }
}));

// ----------- ACTIVITY --------------------
// GET /api/activity?limit=100&offset=0
api.get('/activity', ah(async(request, response, next) => {
  try {
    const limit = Math.min(parseInt(request.query.limit || '100', 10), 500);
    const offset = parseInt(request.query.offset || '0', 10);
    const [rows] = await pool.query(
      "SELECT id, session_id, event, JSON_EXTRACT(payload, '$') AS payload, created_at " +
      "FROM activity ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    const normalized = rows.map(r => ({
      ...r,
      payload: typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload
    }));
    response.json(normalized);
  } catch (err) { 
      next(err); 
  }
}));

// GET /api/activity/:id
api.get('/activity/:id', ah(async(request, response, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, session_id, event, JSON_EXTRACT(payload, '$') AS payload, created_at FROM activity WHERE id = ?", [request.params.id]
    );
    if (rows.length === 0) return response.status(404).json({ error: 'Not found' });
    const r = rows[0];
    r.payload = typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload;
    response.json(r);
  } catch (err) { 
      next(err); 
  }
}));

// POST /api/activity  { session_id, event, payload }
api.post('/activity',ah(async(request, response, next) => {
  try {
    const { session_id = 'demo-123', event, payload = null } = request.body || {};
    if (!event) 
       return response.status(400).json({ error: 'event is required' });
    const payloadStr = payload ? JSON.stringify(payload) : null;
    const [result] = await pool.query(
      'INSERT INTO activity (session_id, event, payload, created_at) VALUES (?, ?, ?, NOW())',
      [session_id, event, payloadStr]
    );
    const [rows] = await pool.query(
      "SELECT id, session_id, event, JSON_EXTRACT(payload, '$') AS payload, created_at FROM activity WHERE id = ?",
      [result.insertId]
    );
    const r = rows[0];
    r.payload = typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload;
    response.status(201).json(r);
  } catch (err) { 
      next(err); 
  }
}));

// Defining a route that listens to requests 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API server listening on http://127.0.0.1:${PORT}/api`)
});
