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
    if (isset($data['email']) && isset($data['password']) && isset($data['name'])) {
        $email = $data['email'];
        $password = $data['password'];
        $name = $data['name'];
        
        // Check if email already exists
        $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check_stmt->bind_param("s", $email);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        
        if ($check_result->num_rows > 0) {
            // Email already exists
            $response = [
                'status' => 'error',
                'message' => 'Email already registered'
            ];
            
            echo json_encode($response);
            $check_stmt->close();
            $conn->close();
            exit;
        }
        
        $check_stmt->close();
        
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Prepare SQL statement to prevent SQL injection
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->bind_param("sss", $name, $email, $hashed_password);
        
        if ($stmt->execute()) {
            // Registration successful
            $user_id = $stmt->insert_id;
            
            $response = [
                'status' => 'success',
                'message' => 'Registration successful',
                'user' => [
                    'id' => $user_id,
                    'email' => $email,
                    'name' => $name
                ]
            ];
            
            echo json_encode($response);
        } else {
            // Registration failed
            $response = [
                'status' => 'error',
                'message' => 'Registration failed: ' . $stmt->error
            ];
            
            echo json_encode($response);
        }
        
        $stmt->close();
    } else {
        // Missing required fields
        $response = [
            'status' => 'error',
            'message' => 'Name, email, and password are required'
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