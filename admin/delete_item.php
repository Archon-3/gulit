<?php
// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Max-Age: 86400");
    http_response_code(204);
    exit();
}

// Include database connection
require_once '../config.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Check if required fields are present
    if (isset($data['item_id'])) {
        $item_id = $data['item_id'];
        
        try {
            // Prepare SQL statement to delete the item
            $stmt = $conn->prepare("DELETE FROM items WHERE id = ?");
            $stmt->bind_param("i", $item_id);
            $stmt->execute();
            
           
            
            $stmt->close();
        } catch (Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete item: ' . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Item ID is required'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}

// Close database connection
$conn->close();
?>
