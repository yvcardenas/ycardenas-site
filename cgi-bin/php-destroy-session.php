<?php
    session_start();
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]);
    }
    session_destroy();
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Session Destroyed</title>
</head>
<body>
<h1>Session Destroyed</h1>
    <a href="/hw2/php-cgiform.html">Back to the PHP CGI Form</a><br />
    <a href="/hw2/php-sessions-1.php">Back to Page 1</a><br />
    <a href="/hw2/php-sessions-2.php">Back to Page 2</a>
</body>
</html>