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

    $user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
    $name = isset($data['name']) ? $data['name'] : '';
    $email = isset($data['email']) ? $data['email'] : '';
    $current_password = isset($data['current_password']) ? $data['current_password'] : '';
    $new_password = isset($data['new_password']) ? $data['new_password'] : null;

    // Validate required fields
    if ($user_id <= 0 || empty($name) || empty($email)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'User ID, name, and email are required'
        ]);
        exit;
    }

    try {
        // Check if email already exists for another user
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->bind_param("si", $email, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Email already in use by another account'
            ]);
            $stmt->close();
            $conn->close();
            exit;
        }

        $stmt->close();

        // If changing password, verify current password
        if ($new_password !== null) {
            if (empty($current_password)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Current password is required to change password'
                ]);
                $conn->close();
                exit;
            }

            $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'User not found'
                ]);
                $stmt->close();
                $conn->close();
                exit;
            }

            $user = $result->fetch_assoc();
            $stmt->close();

            // Verify current password
            if (!password_verify($current_password, $user['password'])) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Current password is incorrect'
                ]);
                $conn->close();
                exit;
            }

            // Update user with new password
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, password = ?, updated_at = NOW() WHERE id = ?");
            $stmt->bind_param("sssi", $name, $email, $hashed_password, $user_id);
        } else {
            // Update user without changing password
            $stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?");
            $stmt->bind_param("ssi", $name, $email, $user_id);
        }

        if ($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Profile updated successfully'
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update profile: ' . $stmt->error
            ]);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }


    $conn->close();
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}
?>

