<?php
    // Outputs a page with data from the HTTP get request query string
    header('Content-Type: text/html; charset=utf-8');
    $query_string = $_SERVER['QUERY_STRING'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GET Request Echo</title>
</head>
<body> 
    <h1>GET Request Echo</h1>
    <hr>
    <p><strong>Query String:</strong> <?php echo $query_string; ?></p>
    <ul>
        <?php if (!empty($_GET)): ?>
        <?php foreach ($_GET as $key => $value): ?>
            <li><strong><?php echo $key; ?></strong>: <?php echo $value; ?></li>
        <?php endforeach; ?>
        <?php endif; ?>
    </ul>
</body>
</html>