<?php
    // Outputs a page with data from the HTTP post request message body
    header('Content-Type: text/html; charset=utf-8');
    $method = $_SERVER['REQUEST_METHOD'];
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $rawBody = file_get_contents('php://input');

    $fields = [];

    if ($method === 'POST'){
        if (strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
            $fields = $_POST;
        } elseif (strpos($contentType, 'application/json') !== false) {
            $fields = json_decode($rawBody, true);
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POST Request Echo</title>
</head>
<body>
    <h1>POST Request Echo</h1>
    <hr>
    <p><b>Message Body: </b> <?php echo $rawBody; ?></p>
    <ul>
        <?php if (!empty($fields)): ?>
        <?php foreach ($fields as $key => $value): ?>
            <li><?php echo $key . ': ' . $value; ?></li>
        <?php endforeach; ?>
        <?php endif; ?>
    </ul>
</body>
</html>