# CSE 135 Homework 1
## Team Members
- **Yvanna Cardenas** - [About Page](https://ycardenas.site/members/yvannacardenas.html)


## Grader Account Information
**Username:** `grader` <br>
**Password:** `c4ardenAass`

## Site Links
**Main Site:** [ycardenas.site](https://ycardenas.site/)

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

## Compression
After enabling mod_deflate on Apache, my HTML, CSS, and JS files were compressed before being sent to the browser. In Chrome DevTools, the Content-Encoding: gzip header confirmed the compression. This reduces file size and improves page load time.

## Obscuring the Server's Identity
I set up another program called Nginx in front of my Apache server so it handles all requests first. I made Apache only listen privately, then told Nginx to hide Apache’s information and replace it with the custom text Server: CSE135 Server before sending responses back to visitors.