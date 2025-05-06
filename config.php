<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$host = "localhost"; // Or "127.0.0.1" if localhost fails
$port = 3306;
$db = "guilt_shop";
$user = "root";
$pass = "";

try {
    // Create connection
    $conn = new mysqli($host, $user, $pass, $db, $port);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Log successful connection
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " Database connection successful\n", FILE_APPEND);
    
} catch (Exception $e) {
    // Log error
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " Database connection error: " . $e->getMessage() . "\n", FILE_APPEND);
    
    // Output JSON error and exit
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: http://localhost:5173');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}
?>