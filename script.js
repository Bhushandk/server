$(document).ready(function() 
{
  let currentRoomId = null;
  let currentRoomName = null;
  let chart = null;
  let sensor1TempGauge = null;
  let sensor1HumidityGauge = null;
  let sensor2TempGauge = null;
  let sensor2HumidityGauge = null;
  let refreshInterval = null;

  
 

  // Initialize gauges for both sensors
  function initGauges() {
    // Clear previous gauges if they exist
    $("#sensor1TempGauge").empty();
    $("#sensor1HumidityGauge").empty(); 
    $("#sensor2TempGauge").empty();
    $("#sensor2HumidityGauge").empty();

    // Create temperature gauge for sensor 1
    sensor1TempGauge = GaugeChart.gaugeChart($("#sensor1TempGauge")[0], {
      hasNeedle: true,
      needleColor: "#f00",
      needleUpdateSpeed: 1000,
      arcColors: ["#00ff00", "#ffff00", "#ff0000"],
      arcDelimiters: [40, 70],
      rangeLabel: ["0°C", "50°C"],
      centralLabel: "0°C",
    });

    // Create humidity gauge for sensor 1
    sensor1HumidityGauge = GaugeChart.gaugeChart($("#sensor1HumidityGauge")[0], {
      hasNeedle: true,
      needleColor: "#00f",
      needleUpdateSpeed: 1000,
      arcColors: ["#ff0000", "#ffff00", "#00ff00"],
      arcDelimiters: [30, 60],
      rangeLabel: ["0%", "100%"],
      centralLabel: "0%",
    });

    // Create temperature gauge for sensor 2
    sensor2TempGauge = GaugeChart.gaugeChart($("#sensor2TempGauge")[0], {
      hasNeedle: true,
      needleColor: "#f00",
      needleUpdateSpeed: 1000,
      arcColors: ["#00ff00", "#ffff00", "#ff0000"],
      arcDelimiters: [40, 70],
      rangeLabel: ["0°C", "50°C"],
      centralLabel: "0°C",
    });

    // Create humidity gauge for sensor 2
    sensor2HumidityGauge = GaugeChart.gaugeChart($("#sensor2HumidityGauge")[0], {
      hasNeedle: true,
      needleColor: "#00f",
      needleUpdateSpeed: 1000,
      arcColors: ["#ff0000", "#ffff00", "#00ff00"],
      arcDelimiters: [30, 60],
      rangeLabel: ["0%", "100%"],
      centralLabel: "0%",
    });
  }

  // Update gauges with new data
  function updateSensor1Gauges(temperature, humidity) {
    if (sensor1TempGauge && sensor1HumidityGauge) {
      // Temperature gauge (0-50°C scale)
      const tempValue = Math.min(Math.max(temperature, 0), 50) / 50;
      sensor1TempGauge.updateNeedle(tempValue);
      $("#sensor1TempGauge .gauge-center-label").text(`${temperature}°C`);

      // Humidity gauge (0-100% scale)
      const humidityValue = Math.min(Math.max(humidity, 0), 100) / 100;
      sensor1HumidityGauge.updateNeedle(humidityValue);
      $("#sensor1HumidityGauge .gauge-center-label").text(`${humidity}%`);
    }
  }

  function updateSensor2Gauges(temperature, humidity) {
    if (sensor2TempGauge && sensor2HumidityGauge) {
      // Temperature gauge (0-50°C scale)
      const tempValue = Math.min(Math.max(temperature, 0), 50) / 50;
      sensor2TempGauge.updateNeedle(tempValue);
      $("#sensor2TempGauge .gauge-center-label").text(`${temperature}°C`);

      // Humidity gauge (0-100% scale)
      const humidityValue = Math.min(Math.max(humidity, 0), 100) / 100;
      sensor2HumidityGauge.updateNeedle(humidityValue);
      $("#sensor2HumidityGauge .gauge-center-label").text(`${humidity}%`);
    }
  }

  function loadRooms() {
    $.get("api.php?action=getRooms", function(rooms) {
      $("#roomList").empty();
      rooms.forEach(function(room) {
        $("#roomList").append(`
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="room-name" data-room-id="${room.room_id}" data-room-name="${room.room_name}">${room.room_name}</span>
            <button class="btn btn-danger btn-sm delete-room" data-room-id="${room.room_id}">Delete</button>
          </li>
        `);
      });

      // Add click event to room names after loading
      $(".room-name").click(function() {
        const roomId = $(this).data("room-id");
        const roomName = $(this).data("room-name");
        
        // Update current room info
        currentRoomId = roomId;
        currentRoomName = roomName;
        
        // Update room title
        $("#roomTitle").text(`Room: ${roomName}`);
        
        // Initialize gauges
        initGauges();
        
        // Load room data
        loadRoomData(roomId);
        
        // Start auto-refresh
        startAutoRefresh(roomId);
      });
    });
  }

  function loadRoomData(roomId) {
    if (!roomId) return;

    $.get(`api.php?action=getRoomData&room_id=${roomId}`, function(data) {
      $("#sensor1LatestData").empty();
      $("#sensor2LatestData").empty();

      if (data.length > 0) {
        // Group data by sensor ID
        const sensorData = {};
        data.forEach(function(item) {
          if (!sensorData[item.sensor_id]) {
            sensorData[item.sensor_id] = [];
          }
          sensorData[item.sensor_id].push(item);
        });

        // Get the list of sensor IDs
        const sensorIds = Object.keys(sensorData);

        // Display data for sensor 1 (if available)
        if (sensorIds.length > 0) {
          const sensor1Id = sensorIds[0];
          const sensor1LatestData = sensorData[sensor1Id][0]; // Most recent reading

          // Update the latest reading display for sensor 1
          $("#sensor1LatestData").html(`
            <table class="table table-bordered">
              <tr>
                <th>Sensor ID</th>
                <td>${sensor1LatestData.sensor_id}</td>
              </tr>
              <tr>
                <th>Temperature</th>
                <td>${sensor1LatestData.temperature}°C</td>
              </tr>
              <tr>
                <th>Humidity</th>
                <td>${sensor1LatestData.humidity}%</td>
              </tr>
              <tr>
                <th>Timestamp</th>
                <td>${new Date(sensor1LatestData.timestamp).toLocaleString()}</td>
              </tr>
            </table>
          `);

          // Update gauges for sensor 1
          updateSensor1Gauges(
            parseFloat(sensor1LatestData.temperature),
            parseFloat(sensor1LatestData.humidity)
          );
        } else {
          $("#sensor1LatestData").html("<p>No data available for Sensor 1.</p>");
          updateSensor1Gauges(0, 0);
        }

        // Display data for sensor 2 (if available)
        if (sensorIds.length > 1) {
          const sensor2Id = sensorIds[1];
          const sensor2LatestData = sensorData[sensor2Id][0]; // Most recent reading

          // Update the latest reading display for sensor 2
          $("#sensor2LatestData").html(`
            <table class="table table-bordered">
              <tr>
                <th>Sensor ID</th>
                <td>${sensor2LatestData.sensor_id}</td>
              </tr>
              <tr>
                <th>Temperature</th>
                <td>${sensor2LatestData.temperature}°C</td>
              </tr>
              <tr>
                <th>Humidity</th>
                <td>${sensor2LatestData.humidity}%</td>
              </tr>
              <tr>
                <th>Timestamp</th>
                <td>${new Date(sensor2LatestData.timestamp).toLocaleString()}</td>
              </tr>
            </table>
          `);

          // Update gauges for sensor 2
          updateSensor2Gauges(
            parseFloat(sensor2LatestData.temperature),
            parseFloat(sensor2LatestData.humidity)
          );
        } else {
          $("#sensor2LatestData").html("<p>No data available for Sensor 2.</p>");
          updateSensor2Gauges(0, 0);
        }
      } else {
        $("#sensor1LatestData").html("<p>No data available for this room.</p>");
        $("#sensor2LatestData").html("<p>No data available for this room.</p>");

        // Reset gauges to zero
        updateSensor1Gauges(0, 0);
        updateSensor2Gauges(0, 0);
      }
    });
  }

  // Function to auto-refresh room data every 10 seconds
  function startAutoRefresh(roomId) {
    // Stop any existing interval
    if (refreshInterval) clearInterval(refreshInterval);

    // Start a new interval
    refreshInterval = setInterval(function() {
      loadRoomData(roomId);
    }, 10000); // Refresh every 10 seconds
  }

  function createRoom(roomName, sensor1Id, sensor2Id) {
    console.log("Creating room:", roomName, sensor1Id, sensor2Id);
    $.ajax({
      url: "api.php?action=createRoom",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        room_name: roomName,
        sensor_ids: [sensor1Id, sensor2Id],
      }),
      success: function(response) {
        console.log("Create room response:", response);
        if (response.status === "success") {
          loadRooms();
          $("#createRoomModal").modal("hide");
          // Clear form fields
          $("#roomName").val("");
          $("#sensor1Id").val("");
          $("#sensor2Id").val("");
          alert("Room created successfully!");
          
          // Set current room and update UI
          currentRoomId = response.room_id;
          currentRoomName = roomName;
          $("#roomTitle").text(`Room: ${roomName}`);
          
          // Initialize gauges
          initGauges();
        } else {
          alert("Error creating room: " + response.message);
        }
      },
      error: function(xhr, status, error) {
        console.error("AJAX Error:", status, error);
        console.log("Response Text:", xhr.responseText);
        alert("Error creating room. Please check the console for details.");
      },
    });
  }

  function deleteRoom(roomId) {
    $(document).on("click", ".delete-room", function (e) {
      e.stopPropagation();
      const roomName = $(this).closest("li").find(".room-name").text().trim();
  
      if (!roomName) {
          alert("Error: Room name not found.");
          return;
      }
  
      if (!confirm(`Are you sure you want to delete the room "${roomName}"?`)) {
          return;
      }
  
      $.ajax({
          url: "api.php?action=deleteRoom",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ room_name: roomName }),
          success: function (response) {
              console.log(response);
              alert(response.message);
  
              if (response.status === "success") {
                  loadRooms(); // Refresh room list after deletion
                  $("#roomTitle").text("Select a Room");
                  $("#sensor1LatestData").empty();
                  $("#sensor2LatestData").empty();
              }
          },
          error: function (xhr, status, error) {
              console.error("AJAX Error:", status, error);
              alert("Failed to delete room. Check console for details.");
          }
      });
  });
  }  

// Attach delete event to dynamically loaded elements
$(document).off("click", ".delete-room").on("click", ".delete-room", function (e) {
  e.stopPropagation();
  const roomId = $(this).data("room-id");
  deleteRoom(roomId);
});


  function loadChartData(roomName) {
    // Get date range for the last 7 days
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    $.get(`api.php?action=getChartData&room_name=${roomName}&start_date=${startDate}&end_date=${endDate}`, function(data) {
      if (data.status === 'error') {
        alert(data.message);
        return;
      }
      
      // Show chart canvas
      $("#chartCanvas").show();
      
      // Destroy previous chart if exists
      if (chart) {
        chart.destroy();
      }
      
      // Prepare data for chart
      const dates = data.map(item => item.date);
      const avgTemps = data.map(item => parseFloat(item.avg));
      const minTemps = data.map(item => parseFloat(item.low));
      const maxTemps = data.map(item => parseFloat(item.high));
      
      // Create new chart
      const ctx = document.getElementById('chartCanvas').getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Average Temperature',
              data: avgTemps,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
              tension: 0.1
            },
            {
              label: 'Min Temperature',
              data: minTemps,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: false,
              tension: 0.1
            },
            {
              label: 'Max Temperature',
              data: maxTemps,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Temperature (°C)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Temperature Statistics for ${roomName}`
            }
          }
        }
      });
    });
  }

  

  // Event handler for view statistics button
  $("#viewStatisticsBtn").click(function() {
    if (currentRoomName) {
      loadChartData(currentRoomName);
    } else {
      alert("Please select a room first.");
    }
  });

  // Initialize gauges
  initGauges();
  
  // Initial load of rooms
  loadRooms();

  // Initialize Bootstrap components
  $(".modal").modal({
    show: false,
  });

  // Event handler for save room button
  $("#saveRoomBtn").click(function() {
    console.log("Save room button clicked");
    const roomName = $("#roomName").val();
    const sensor1Id = $("#sensor1Id").val();
    const sensor2Id = $("#sensor2Id").val();

    console.log("Form values:", roomName, sensor1Id, sensor2Id);

    if (!roomName || !sensor1Id || !sensor2Id) {
      alert("Please fill in all fields");
      return;
    }

    createRoom(roomName, sensor1Id, sensor2Id);
  });

  // Log when document is ready
  console.log("Document ready");
  
  // Log when create room modal is shown
  $("#createRoomModal").on("shown.bs.modal", function() {
    console.log("Create room modal shown");
  });
});