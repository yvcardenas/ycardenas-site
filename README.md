# CSE 135
## Team Members
- **Yvanna Cardenas** - [About Page](https://ycardenas.site/members/yvannacardenas.html) <br>

## Grader Account Information
**Username:** `grader` <br>
**Password:** `c4ardenAass`

## Site Links
**Main Site:** [ycardenas.site](https://ycardenas.site/) <br>
**Reporting Site:** [reporting.ycardenas.site](https://reporting.ycardenas.site/)

# Homework 1
## Homepage Content Includes:
- Team member info with link to their about pages
- Link to:
    - `/hw1/hello.php`
    - `/hw1/report.html`
- favicon
- `robots.txt`

## Protect Page Login Information
**Username:** `yvanna` <br>
**Password:** `c4ardenAass`

## Details of GitHub Auto Deploy

## HTML Compression
After enabling mod_deflate on Apache, my HTML, CSS, and JS files were compressed before being sent to the browser. In Chrome DevTools, the Content-Encoding: gzip header confirmed the compression. This reduces file size and improves page load time.

## Obscuring the Server's Identity
I set up another program called Nginx in front of my Apache server so it handles all requests first. I made Apache only listen privately, then told Nginx to hide Apache’s information and replace it with the custom text Server: CSE135 Server before sending responses back to visitors.

## Media
**initial-index.jpg**
![initial-index.jpg](/media/initial-index.jpg) Default Apache2 page to prove Apache is working

**modified-index.jpg**
![modified-index.jpg](/media/modified-index.jpg) First change to index.html

**validator-initial.jpg**
![validator-initial.jpg](/media/validator-initial.jpg) - validating your copied index.html

**vhosts-verify.jpg**
![vhosts-verify.jpg](/media/vhosts-verify.jpg) Demonstrating a functional domain.site, collector.domain.site, reporting.domain.sites <br>

**ssl-verify.jpg**
![ssl-verify.jpg](/media/) Verify your site uses HTTPS

**github-deploy.mov** <br>
![github-deploy.gif](/media/Github-Deploy.gif)
Showing Github deploy process

**php-verification.jpg**
![php-verification.jpg](/media/php-verification.jpg) Demonstration of working php page

**compression-verify.jpg**
![compression-verify.jpg](/media/compression-verify.jpg) Demonstration of compression

**header-verify.jpg**
![header-verify.jpg](/media/header-verify.jpg) Demonstration of 'server: cse135 server' response header

**error-page.jpg**
![error-page.jpg](/media/error-page.jpg) Demonstration of functional 404 page

**log-verification.jpg**
![log-verification.jpg](/media/log-verification.jpg) Showing you know where your log files are

**report-verification.jpg**
![report-verification.jpg](/media/report-verification.jpg) GoAccess screen capture


# Homework 3
## Checkpoint 3
### Dashboard
The reporting dashboard is deployed at **[reporting.ycardenas.site](https://reporting.ycardenas.site)**.  <br> <br>
It displays real data collected via the pipeline: <br>
collector.js -> /api (Node + MySQL) -> reporting dashboard

This ensures that what is shown on the dashboard reflects actual user interactions, environment data, and errors logged from the main site.

#### Metrics Chosen

For the dashboard, I intentionally chose **three different types of metrics**, each with a different visualization style.

1. **Daily Active Sessions (DAU) – Line Chart**  
   - **Reason for inclusion**: DAU is one of the most widely used “pulse metrics” for web applications. It shows whether the site is attracting unique users consistently.  
   - **Why a line chart?**  
     A line chart makes it easy to spot usage trends over time, whether activity is stable, increasing, or dropping. Other options (like bar or pie charts) would obscure the temporal nature of this data.  
   - **User benefit**: Anyone looking at this dashboard can immediately get a sense of whether usage is healthy and whether changes to the site impact traffic.

2. **Top Languages – Bar Chart**  
   - **Reason for inclusion**: Language data reveals who the audience is and whether localization or accessibility efforts might be necessary.  
   - **Why a bar chart?**  
     Categorical data is best compared visually with bars. Bars make relative frequency differences (e.g., “English users vs. Spanish users”) clear at a glance. A pie chart, for example, would be harder to read with many categories, while a line chart wouldn’t make sense at all.  
   - **User benefit**: This visualization can guide decisions around prioritizing translations or tailoring content to the actual user base.

3. **Recent Errors – Grid (Table)**  
   - **Reason for inclusion**: Errors provide actionable debugging information. Unlike the previous metrics, a visualization here would lose important details like timestamps, messages, and file names.  
   - **Why a grid instead of a chart?**  
     A grid gives a structured, searchable way to see raw error data. Developers can read it directly, sort by time, and look for patterns.  
   - **User benefit**: Instead of a vague error rate percentage, the table empowers developers to take immediate action on the specific problems users encounter.

#### Polishing and User-Centered Design

Beyond the baseline requirements, I added a few usability touches to ensure the dashboard is **clear, readable, and helpful**:

- **Axis labels**:  
  - Sessions chart Y-axis explicitly labeled as *“Sessions”*.  
  - Languages chart Y-axis explicitly labeled as *“Count”*.  
  This avoids forcing the user to guess what the numbers mean.

- **Timeframe limit (last 7 days)**:  
  The DAU chart only shows the most recent 7 days. Without this, sparse data over long time ranges can make the chart look misleadingly flat or empty.

- **Empty-state messaging**:  
  If a query returns 0 rows, the chart title temporarily displays a message like *“No session data available”*. This avoids confusing blank screens and gives users immediate context.

- **Consistent visual hierarchy**:  
  Each section uses a clear heading (`h2`) and figcaption for context. Charts don’t float without explanation, they’re tied to specific questions (“Unique sessions per day”, “Counts by language”).  

The goal is not just to display raw data, but to make it obvious, interpretable, and useful for decision making.

#### Reflections

The dashboard demonstrates three important aspects of analytics:

- **Monitoring overall health (DAU)**  
- **Understanding the audience (languages)**  
- **Identifying and acting on issues (errors)**  

While I could have added more metrics (e.g., devices, bounce rate, error rates over time), I intentionally kept the dashboard simple but representative. Each visualization serves a different role and matches the nature of the data.  

--- 
### Report - Error Analysis
**Question:** *How many users are hitting JavaScript errors, how does that change over time, and what are the top issues right now?*  
**URL:** `https://reporting.ycardenas.site/error-report.html` (linked from the dashboard’s “Recent Errors” panel)

#### Why this metric?

I chose to report on **client-side errors** because they have a direct, visible impact on user experience and developer priorities. Unlike aggregate usage metrics, errors map to actionable work items: which users were affected, when spikes happened, and what to fix first.

#### Data & pipeline

The page uses the exact same collection and storage pipeline as the dashboard: <br><br>
collector.js -> /api/activity -> MySQL -> error-report.html

The report filters `event = "error"` and analyzes the last **14 days** to balance signal vs. noise (short enough to reflect current code, long enough to show meaningful trend).

#### Visuals & Components

1) **Line Chart — Errors per day (last 14 days)**  
   - **Why a line?** Errors are time series. A line chart best communicates spikes, regressions, or improvements across days.  
   - **Y-axis labeled “Errors”** so the scale is obvious.  
   - **Empty state**: if there are no errors in the range, the chart title clearly states that.

2) **Grid — Error details**  
   - **Why a grid?** Debugging needs raw context (timestamp, session, message, file). A chart hides this. A table lets developers scan and sort quickly.  
   - Columns included: `created_at`, `session_id`, `message`, `file`.

3) **Summary strip**  
   - Presents **total errors**, **impacted sessions (unique)**, and the **top error message** for the last 14 days.  
   - This previews the information before diving into details.

#### Design decisions & user-centered reasoning

- **Timeframe (last 14 days)**: If we use “all time,” the chart tends to look flat or misleading. A recent window reflects the current code state and focuses the reader on actionable trend changes.  
- **One chart + one grid**: Each modality serves a different user need: trend recognition vs. diagnosis.  
- **Terminology & labeling**: Axis labels and captions avoid guesswork. The empty-state for 0 rows prevents “is this broken?” confusion.  
- **Simplicity**: Kept interaction minimal (just a refresh button). In a real team context we could add filters (by page, by message, by environment).

#### Alternatives considered

- **Pie/stacked charts** for error distribution by message: visually busy with many categories; less useful than a sortable table.  
- **Cumulative counts**: for small datasets this can mask spikes. Daily bins make anomalies stand out.  
- **DAU or Languages for the report**: those are already summarized effectively on the dashboard and don’t need row-level context as urgently as errors.

#### Outcome

The report helps answer:
- Are users currently running into errors?
- How widespread is the impact (unique sessions)?
- What should we fix first?

This combines **trend awareness** (line chart) with **immediate actionability** (grid), and is built with the same collection layer as the dashboard for consistency.