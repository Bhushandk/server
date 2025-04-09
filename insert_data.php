<?php
require_once 'config.php';

date_default_timezone_set('Asia/Kolkata'); // Set correct timezone

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Log incoming request for debugging
error_log("Request received: " . file_get_contents('php://input'));

// Ensure request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// Read JSON input

$data = json_decode(file_get_contents('php://input'), true);

// Log parsed data
error_log("Parsed data: " . json_encode($data));

// Validate required fields
$missing_fields = [];

if (!isset($data['r_n'])) $missing_fields[] = 'r_n (room name)';
if (!isset($data['s_id'])) $missing_fields[] = 's_id (sensor ID)';
if (!isset($data['s_t'])) $missing_fields[] = 's_t (temperature)';
if (!isset($data['s_h'])) $missing_fields[] = 's_h (humidity)';

if (!empty($missing_fields)) {
    $error_message = 'Missing required parameters: ' . implode(', ', $missing_fields);
    error_log("Validation error: " . $error_message);
    echo json_encode(['status' => 'error', 'message' => $error_message]);
    exit;
}

// Connect to database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed']));
}

// Sanitize input
$room_name = trim($data['r_n']); 
$sensor_id = intval($data['s_id']);
$temperature = floatval($data['s_t']);
$humidity = floatval($data['s_h']);

// Log received values
error_log("Received values: r_n=$room_name, s_id=$sensor_id, temp=$temperature, humidity=$humidity");

// Get `room_id` from `room_name`
$room_stmt = mysqli_prepare($conn, "SELECT room_id FROM rooms WHERE room_name = ?");
mysqli_stmt_bind_param($room_stmt, "s", $room_name);
mysqli_stmt_execute($room_stmt);
mysqli_stmt_bind_result($room_stmt, $room_id);
mysqli_stmt_fetch($room_stmt);
mysqli_stmt_close($room_stmt);

// Check if room exists
if (!$room_id) {
    echo json_encode(['status' => 'error', 'message' => 'Room not found']);
    exit;
}

// Check if the sensor belongs to the room
$sensor_stmt = mysqli_prepare($conn, "SELECT sensor_id FROM sensors WHERE room_id = ? AND sensor_id = ?");
mysqli_stmt_bind_param($sensor_stmt, "ii", $room_id, $sensor_id);
mysqli_stmt_execute($sensor_stmt);
mysqli_stmt_store_result($sensor_stmt);

if (mysqli_stmt_num_rows($sensor_stmt) == 0) {
    echo json_encode(['status' => 'error', 'message' => 'Sensor does not belong to the specified room']);
    exit;
}

mysqli_stmt_close($sensor_stmt);

// Insert data into `sensor_readings` (reading_id is auto-incremented)
$insert_stmt = mysqli_prepare($conn, "INSERT INTO sensor_readings (sensor_id, temperature, humidity, timestamp) VALUES (?, ?, ?, NOW())");
mysqli_stmt_bind_param($insert_stmt, "idd", $sensor_id, $temperature, $humidity);

if (mysqli_stmt_execute($insert_stmt)) {
    echo json_encode(['status' => 'success', 'message' => 'Data inserted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to insert data']);
}







mysqli_stmt_close($insert_stmt);
$conn->close();
?>
