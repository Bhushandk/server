<?php
require_once 'config.php';

// Set the timezone
date_default_timezone_set('Asia/Kolkata');

// Get today's date
$today = date('Y-m-d');

// Start transaction for consistency
mysqli_begin_transaction($conn);

try {
    // Step 1: Aggregate daily values from `sensor_readings`
    $query = "
        INSERT INTO daily_aggregates (sensor_id, room_id, record_date, avg_temperature, min_temperature, max_temperature, avg_humidity, min_humidity, max_humidity)
        SELECT sr.sensor_id, s.room_id, ?, 
               AVG(sr.temperature), MIN(sr.temperature), MAX(sr.temperature),
               AVG(sr.humidity), MIN(sr.humidity), MAX(sr.humidity)
        FROM sensor_readings sr
        JOIN sensors s ON sr.sensor_id = s.sensor_id
        WHERE DATE(sr.timestamp) = ?
        GROUP BY sr.sensor_id, s.room_id
        ON DUPLICATE KEY UPDATE 
            avg_temperature = VALUES(avg_temperature),
            min_temperature = VALUES(min_temperature),
            max_temperature = VALUES(max_temperature),
            avg_humidity = VALUES(avg_humidity),
            min_humidity = VALUES(min_humidity),
            max_humidity = VALUES(max_humidity)";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }
    
    $stmt->bind_param("ss", $today, $today);
    if (!$stmt->execute()) {
        throw new Exception("Execution failed: " . $stmt->error);
    }
    $stmt->close();

    // Step 2: Delete sensor readings older than 1 day
    $deleteQuery = "DELETE FROM sensor_readings WHERE DATE(timestamp) < ?";
    $stmtDelete = $conn->prepare($deleteQuery);
    if (!$stmtDelete) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }

    $stmtDelete->bind_param("s", $today);
    if (!$stmtDelete->execute()) {
        throw new Exception("Execution failed: " . $stmtDelete->error);
    }
    $stmtDelete->close();

    // Commit transaction
    mysqli_commit($conn);
    echo json_encode(["status" => "success", "message" => "Daily aggregates updated and old sensor readings deleted"]);
} catch (Exception $e) {
    mysqli_rollback($conn);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
