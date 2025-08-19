<!-- "hello-json-world" - The same as the hello-html-world demo, but it returns a JSON packed instead of HTML. -->
 <?php
    // Tell the browser that this is a JSON response
    header('Content-Type: application/json');
    // Set the local time zone
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
    // Create an array with the response data
    $response = [
        'message' => 'Hello World from PHP!',
        'date' => "Todays's date is $now",
        'ip_address' => $client_ip
    ];
    // Output the response as JSON
    echo json_encode($response);
    exit; // Ensure no further output is sent
?>
