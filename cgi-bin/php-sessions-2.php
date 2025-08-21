<?php
    session_start();
    $name = isset($_SESSION['username']) ? $_SESSION['username'] : null;
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Sessions</title></head>
<body>
    <h1>PHP Sessions Page 2</h1>
    <p><b>Name:</b> <?php echo $name ?></p>
    <a href="/cgi-bin/php-sessions-1.php">Session Page 1</a><br/>
    <a href="/hw2/php-cgiform.html">PHP CGI Form</a><br />
    <form style="margin-top:30px" action="/cgi-bin/php-destroy-session.php" method="post">
    <button type="submit">Destroy Session</button>
    </form>
</body>
</html>