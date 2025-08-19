<?php
// Outputs an html document with a "Hello World" message as well as the current
// Date/Time and the user's IP address to show that the page was created dynamically.
// Set time zone to ensure correct time display
date_default_timezone_set('America/Los_Angeles');  
// Get current date and time
$now = date("Y-m-d H:i:s");
// Get user's IP address
function get_client_ip(){
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN IP';
    return $ipaddress;
}
$client_ip = get_client_ip();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello PHP World</title>
</head>
<body>
    <h1>Hello PHP World</h1>
    <hr>
    <p>Hello World</p>
    <p>This page was generated with the PHP programming language
    <p>This program was run at: <?php echo $now; ?></p>
    <p>Your current IP address is <?php echo client_ip(); ?></p>
</body>
</html>