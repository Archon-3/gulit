<?php
// ⚠️ No space or newline before this tag
// Log requests for debugging
file_put_contents('debug.log', date('Y-m-d H:i:s') . ' ' . $_SERVER['REQUEST_METHOD'] . " request to login.php\n", FILE_APPEND);

// 1. Set CORS headers for all responses
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// 2. Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " OPTIONS request handled\n", FILE_APPEND);
    header("Access-Control-Max-Age: 86400");
    http_response_code(204);
    exit();
}

// 3. Include database connection
require_once 'config.php';

// 4. Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Check if required fields are present
    if (isset($data['email'], $data['password'])) {
        $email = $data['email'];
        $password = $data['password'];
        
        // Check for admin credentials
        if ($email === "abeni@gmail.com" && $password === "@@@@@@@") {
            file_put_contents('debug.log', date('Y-m-d H:i:s') . " Admin login successful\n", FILE_APPEND);
            echo json_encode([
                'status' => 'success',
                'message' => 'Admin login successful',
                'user' => [
                    'id' => 999,
                    'name' => 'Admin User',
                    'email' => 'abeni@gmail.com',
                    'isAdmin' => true
                ]
            ]);
            exit(); // Exit after admin login to prevent regular user authentication
        }
        
        // Regular user authentication
        $stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Verify password
            if (password_verify($password, $user['password'])) {
                file_put_contents('debug.log', date('Y-m-d H:i:s') . " Login successful for {$email}\n", FILE_APPEND);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email']
                    ]
                ]);
            } else {
                file_put_contents('debug.log', date('Y-m-d H:i:s') . " Invalid password for {$email}\n", FILE_APPEND);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid email or password'
                ]);
            }
        } else {
            file_put_contents('debug.log', date('Y-m-d H:i:s') . " User not found: {$email}\n", FILE_APPEND);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid email or password'
            ]);
        }
        
        $stmt->close();
    } else {
        file_put_contents('debug.log', date('Y-m-d H:i:s') . " Missing email or password\n", FILE_APPEND);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email and password are required'
        ]);
    }
} else {
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " Invalid request method\n", FILE_APPEND);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}

// 5. Close database connection
$conn->close();
?>