<?php
    // Outputs information of whatever it is sent showing method and payload (DELETE, PUT, HEAD, etc)
    header('Content-Type: text/html; charset=utf-8');
    $method = $_SERVER['REQUEST_METHOD'];
    $protocol = $_SERVER['SERVER_PROTOCOL'];
    $query = $_SERVER['QUERY_STRING'];
    $body = file_get_contents('php://input');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>General Request Echo</title>
</head>
<body>
    <h1>General Request Echo</h1>
    <hr>
    <p><strong>Request Method: </strong><?php echo $method; ?></p>
    <p><strong>Protocol: </strong><?php echo $protocol; ?></p>
    <p><strong>Query:</strong><?php echo $query; ?></p>
    <p><strong>Message Body: </strong><?php echo $body; ?></p>
</body>
</html>