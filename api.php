<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$response = [
    'message' => 'Hello from PHP!',
    'status' => 'success'
];

echo json_encode($response);
?>