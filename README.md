# CSE 135 Homework 1
## Team Members
- **Yvanna Cardenas** - [About Page](https://ycardenas.site/members/yvannacardenas.html) <br>
[If DNS not live PRESS ME](http://146.190.125.104/members/yvannacardenas.html)

## Grader Account Information
**Username:** `grader` <br>
**Password:** `c4ardenAass`

## Site Links
**Main Site:** [ycardenas.site](https://ycardenas.site/) <br>
[If DNS not live PRESS ME](http://146.190.125.104/) <br>
I am working on making her pretty, this is really the bare skeleton.

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
![vhosts-verify.jpg](/media/) Demonstrating a functional domain.site, collector.domain.site, reporting.domain.sites

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