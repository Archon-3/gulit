<?php
// Log requests for debugging
file_put_contents('debug.log', date('Y-m-d H:i:s') . ' ' . $_SERVER['REQUEST_METHOD'] . " request to signup.php\n", FILE_APPEND);

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " OPTIONS request handled\n", FILE_APPEND);
    http_response_code(204);
    exit;
}

// Include database connection
require_once 'config.php';

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        file_put_contents('debug.log', date('Y-m-d H:i:s') . " Missing signup data\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Email and password required']);
        exit;
    }

    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        file_put_contents('debug.log', date('Y-m-d H:i:s') . " Email already exists: $email\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
        exit;
    }
    $stmt->close();

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashed_password);
    if ($stmt->execute()) {
        file_put_contents('debug.log', date('Y-m-d H:i:s') . " User registered: $email\n", FILE_APPEND);
        echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
    } else {
        file_put_contents('debug.log', date('Y-m-d H:i:s') . " Registration failed: " . $conn->error . "\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>