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
    if (isset($data['user_id'])) {
        $user_id = $data['user_id'];
        
        // Don't allow deleting the admin user
        $stmt = $conn->prepare("SELECT email FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if ($user['email'] === 'abeni@gmail.com') {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Cannot delete admin user'
                ]);
                $stmt->close();
                $conn->close();
                exit();
            }
        }
        
        try {
            // Start transaction
            $conn->begin_transaction();
            
            // First delete all items from this user
            $stmt = $conn->prepare("DELETE FROM items WHERE user_id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $itemsDeleted = $stmt->affected_rows;
            $stmt->close();
            
            // Then delete the user
            $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            
       
            
            $stmt->close();
        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollback();
            
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'User ID is required'
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
