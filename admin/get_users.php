<?php
// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Max-Age: 86400");
    http_response_code(204);
    exit();
}

// Include database connection
require_once '../config.php';

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Get users with product count
        $query = "SELECT 
                    u.id, 
                    u.name, 
                    u.email, 
                    u.created_at,
                    COUNT(i.id) as product_count
                FROM 
                    users u
                LEFT JOIN 
                    items i ON u.id = i.user_id
                GROUP BY 
                    u.id
                ORDER BY 
                    u.id ASC";
        
        $result = $conn->query($query);
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            // Don't expose password hash
            unset($row['password']);
            
            // Convert numeric values to proper types
            $row['id'] = (int)$row['id'];
            $row['product_count'] = (int)$row['product_count'];
            
            $users[] = $row;
        }

        echo json_encode([
            'status' => 'success',
            'users' => $users
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch users: ' . $e->getMessage()
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
