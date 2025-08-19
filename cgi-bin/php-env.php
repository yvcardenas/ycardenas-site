<?php
    //Outputs an echo of the environment variables of a request (HTTP request headers + Server variables)
    header('Content-Type: text/html; charset=utf-8');
    $env_vars = [];
    $server_vars = [];

    foreach ($_SERVER as $key => $value){
        if (strpos($key, 'HTTP_') === 0 || strpos($key, 'REQUEST_') === 0 || strpos($key, 'SERVER_') === 0 || strpos($key, 'CONTEXT_') === 0|| strpos($key, 'SSL_') === 0 || in_array($key, [
            'HTTPS', 'REMOTE_ADDR','REMOTE_PORT', 'SERVER_NAME', 'SERVER_ADDR', 
            'SERVER_PORT', 'SERVER_PROTOCOL', 'REQUEST_METHOD', 'SCRIPT_NAME', 'DOCUMENT_ROOT',
            'SCRIPT_URI', 'SCRIPT_URL', 'UNIQUE_ID', 'PHP_SELF', 'QUERY_STRING', 'GATEWAY_INTERFACE',
            'SCRIPT_FILENAME'
        ], true)) {
            $server_vars[$key] = $value;
        } else {
            $env_vars[$key] = $value;
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Environment Variables</title>
</head>
<body>
    <h1>Environment Variables</h1>
    <hr>
    <h2>Environment Variables</h2>
    <ul>
        <?php foreach ($env_vars as $key => $value): ?>
            <li><strong><?php echo $key;?></strong>: <?php echo $value?></li>
        <?php endforeach; ?>
    </ul>
    <h2>Server Variables</h2>
    <ul>
        <?php foreach ($server_vars as $key => $value): ?>
            <li><strong><?php echo $key;?></strong>: <?php echo $value?></li>
        <?php endforeach; ?>
    </ul>
</body>
</html>