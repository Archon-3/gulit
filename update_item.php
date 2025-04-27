<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection
require_once 'config.php';

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $item_id = isset($_POST['item_id']) ? intval($_POST['item_id']) : 0;
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $description = isset($_POST['description']) ? $_POST['description'] : '';
    $price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
    $category = isset($_POST['category']) ? $_POST['category'] : 'electronics';
    $user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
    
    // Validate required fields
    if ($item_id <= 0 || empty($name) || empty($description) || $price <= 0 || $user_id <= 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'All fields are required'
        ]);
        exit;
    }
    // Verify item belongs to user
    $stmt = $conn->prepare("SELECT user_id FROM items WHERE id = ?");
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Item not found'
        ]);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $item = $result->fetch_assoc();
    
    if ($item['user_id'] != $user_id) {
        echo json_encode([
            'status' => 'error',
            'message' => 'You do not have permission to update this item'
        ]);
        $stmt->close();
        // Handle image upload or URL
    $image_update = '';
    $image_params = '';
    
    // If image URL is provided
    if (isset($_POST['image_url']) && !empty($_POST['image_url'])) {
        $image_update = ", image = ?";
        $image_params = $_POST['image_url'];
    } 
    // If image file is uploaded
    elseif (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/';
        
        // Create directory if it doesn't exist
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        // Generate unique filename
        $file_extension = pathinfo($_FILES['image_file']['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $file_extension;
        $target_file = $upload_dir . $filename;
        
        // Move uploaded file
        if (move_uploaded_file($_FILES['image_file']['tmp_name'], $target_file)) {
            $image_update = ", image = ?";
            $image_params = $target_file;
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to upload image'
            ]);
            exit;
        }
    }
        $conn->close();
        exit;
    }
    
    $stmt->close();
    // Handle image upload or URL
    $image_update = '';
    $image_params = '';
    
    // If image URL is provided
    if (isset($_POST['image_url']) && !empty($_POST['image_url'])) {
        $image_update = ", image = ?";
        $image_params = $_POST['image_url'];
    } 
    // If image file is uploaded
    elseif (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/';
        
        // Create directory if it doesn't exist
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
