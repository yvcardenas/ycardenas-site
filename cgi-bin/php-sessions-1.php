<?php
session_start();

if(isset($_POST['username']) && $_POST['username'] !== '') {
    $_SESSION['username'] = $_POST['username'];
}
$name = isset($_SESSION['username']) ? $_SESSION['username'] : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Session 1</title>
</head>
<body>  
    <h1>PHP Session 1</h1>
    <hr>
    <p><b>Name:</b> <?php echo $name; ?></p>
    <br><br>
    <a href="/hw2/php-sessions-2.php">Session Page 2</a><br/>
    <a href="/hw2/php-cgiform.html">PHPCGI Form</a><br />
    <form style="margin-top:30px" action="/hw2/php-destroy-session.php" method="post">
    <button type="submit">Destroy Session</button>
    </form>
</body>
</html>
