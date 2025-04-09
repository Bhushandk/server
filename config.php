<?php
define('DB_HOST', 'localhost'); // Change if using a remote server
define('DB_USER', 'root');      // Your MySQL username
define('DB_PASS', 'ServerRoom123');          // Your MySQL password (default is empty for XAMPP)
define('DB_NAME', 'college_sensor_data'); // Your database name

// Create database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
