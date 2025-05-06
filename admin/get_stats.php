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
        // Get total users count
        $userQuery = "SELECT COUNT(*) as total_users FROM users";
        $userResult = $conn->query($userQuery);
        $totalUsers = $userResult->fetch_assoc()['total_users'];

        // Get total products count and sum of prices
        $productQuery = "SELECT 
                            COUNT(*) as total_products, 
                            SUM(price) as total_value,
                            AVG(price) as avg_price
                        FROM items";
        $productResult = $conn->query($productQuery);
        $productStats = $productResult->fetch_assoc();
        
        // Get category counts
        $categoryQuery = "SELECT 
                            category, 
                            COUNT(*) as count 
                        FROM items 
                        GROUP BY category";
        $categoryResult = $conn->query($categoryQuery);
        
        $categoryCounts = [];
        while ($row = $categoryResult->fetch_assoc()) {
            $category = $row['category'] ? $row['category'] : 'uncategorized';
            $categoryCounts[$category] = (int)$row['count'];
        }

        // Prepare response
        $stats = [
            'totalUsers' => (int)$totalUsers,
            'totalProducts' => (int)$productStats['total_products'],
            'totalValue' => (float)$productStats['total_value'],
            'avgPrice' => (float)$productStats['avg_price'],
            'categoryCounts' => $categoryCounts
        ];

        echo json_encode([
            'status' => 'success',
            'stats' => $stats
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch statistics: ' . $e->getMessage()
        ]);
    }
} 

// Close database connection
$conn->close();
?>
