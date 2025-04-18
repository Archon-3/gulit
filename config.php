<?php
// Database configuration
$db_host = "localhost";
$db_user = "root"; // Replace with your database username
$db_pass = "Abenezer33"; // Replace with your database password
$db_name = "gulit_shop";

// Create database connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>