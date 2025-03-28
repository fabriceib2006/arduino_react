CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Device name (e.g., "Arduino Uno")
    serial_number VARCHAR(100) UNIQUE, -- Unique identifier for the device
    status ENUM('connected', 'disconnected') DEFAULT 'disconnected', -- Connection status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE connection_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL, -- Foreign key to the devices table
    action ENUM('connect', 'disconnect') NOT NULL, -- Action performed
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);
CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL, -- Foreign key to the devices table
    data_type VARCHAR(50) NOT NULL, -- Type of data (e.g., "temperature", "humidity")
    value FLOAT NOT NULL, -- Sensor value
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL, -- Foreign key to the devices table
    setting_key VARCHAR(50) NOT NULL, -- Name of the setting (e.g., "baud_rate")
    setting_value VARCHAR(100) NOT NULL, -- Value of the setting
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);