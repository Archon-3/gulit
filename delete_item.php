<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection
require_once 'config.php';

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    $item_id = isset($data['item_id']) ? intval($data['item_id']) : 0;
    $user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
    
    // Validate required fields
    if ($item_id <= 0 || $user_id <= 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Item ID and User ID are required'
        ]);
        exit;
    }
     try {
        // Verify item belongs to user
        $stmt = $conn->prepare("SELECT image FROM items WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $item_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Item not found or you do not have permission to delete it'
            ]);
            $stmt->close();
            $conn->close();
            exit;
        }
        
        $item = $result->fetch_assoc();
        $stmt->close();
