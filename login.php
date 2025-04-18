<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once 'config.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Check if required fields are present
    if (isset($data['email']) && isset($data['password'])) {
        $email = $data['email'];
        $password = $data['password'];
        
        // Prepare SQL statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Password is correct, generate session data
                $response = [
                    'status' => 'success',
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email']
                    ]
                ];
                
                echo json_encode($response);
            } else {
                // Invalid password
                $response = [
                    'status' => 'error',
                    'message' => 'Invalid email or password'
                ];
                
                echo json_encode($response);
            }
        } else {
            // User not found
            $response = [
                'status' => 'error',
                'message' => 'Invalid email or password'
            ];
            
            echo json_encode($response);
        }
        
        $stmt->close();
    } else {
        // Missing required fields
        $response = [
            'status' => 'error',
            'message' => 'Email and password are required'
        ];
        
        echo json_encode($response);
    }
} else {
    // Invalid request method
    $response = [
        'status' => 'error',
        'message' => 'Invalid request method'
    ];
    
    echo json_encode($response);
}

// Close database connection
$conn->close();
?>