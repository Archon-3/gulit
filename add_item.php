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
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $description = isset($_POST['description']) ? $_POST['description'] : '';
    $price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
    $category = isset($_POST['category']) ? $_POST['category'] : 'electronics';
    $user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
    
    // Validate required fields
    if (empty($name) || empty($description) || $price <= 0 || $user_id <= 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'All fields are required'
        ]);
        exit;
    }
    
    // Handle image upload or URL
    $image_path = '';
    
    // If image URL is provided
    if (isset($_POST['image_url']) && !empty($_POST['image_url'])) {
        $image_path = $_POST['image_url'];
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
            $image_path = $target_file;
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to upload image'
            ]);
            exit;
        }
    } else {
        // Default placeholder image
        $image_path = '/placeholder.svg';
    }
    
    try {
        // Insert item into database
        $stmt = $conn->prepare("INSERT INTO items (name, description, price, image, category, user_id, created_at) 
                               VALUES (?, ?, ?, ?, ?, ?, NOW())");
        
        $stmt->bind_param("ssdssi", $name, $description, $price, $image_path, $category, $user_id);
        
        if ($stmt->execute()) {
            $item_id = $conn->insert_id;
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Item added successfully',
                'item_id' => $item_id
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to add item: ' . $stmt->error
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
