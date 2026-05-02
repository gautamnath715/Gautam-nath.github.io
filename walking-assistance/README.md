# 🦯 Walking Assistance System for Vision-Impaired Users

**Tools:** C++ · Computer Vision · Embedded Systems

---

## Overview

A hardware-software integrated assistive technology project designed to help visually impaired individuals navigate independently. The system uses ultrasonic sensors and a camera module on an embedded platform to detect obstacles in real time and alert the user through haptic and audio feedback. Built as the final year B.Tech project at GB Pant Government Engineering College, New Delhi.

---

## Problem Statement

Over 12 million people in India have visual impairments (WHO, 2023). Conventional white canes provide limited spatial awareness — they detect only ground-level obstacles and give no warning about head-height or dynamic hazards. This project aimed to build a low-cost, wearable assistive system that extends spatial awareness in real time.

---

## System Architecture

```
[Camera Module]      [Ultrasonic Sensors x3]
       |                      |
       ▼                      ▼
  [Raspberry Pi / Arduino Microcontroller]
       |
  [C++ Processing Layer]
   - Object detection
   - Distance calculation
   - Threat classification
       |
  ┌────┴────┐
  ▼         ▼
[Buzzer]  [Vibration Motor]
(Audio)   (Haptic)
```

---

## Key Components

| Component | Role |
|---|---|
| Raspberry Pi 4 | Central processing unit |
| Arduino Uno | Sensor interface and motor control |
| HC-SR04 Ultrasonic Sensors (x3) | Left, front, right distance measurement |
| Pi Camera Module v2 | Visual obstacle detection |
| Vibration Motor | Directional haptic alerts |
| Buzzer | Audio proximity warning |
| OpenCV (C++) | Image processing pipeline |
| Serial Communication | RPi ↔ Arduino data exchange |

---

## Software Design

### Obstacle Detection Pipeline (C++)
```cpp
#include <opencv2/opencv.hpp>
#include <iostream>

// Frame capture and preprocessing
cv::VideoCapture cap(0);
cv::Mat frame, gray, blurred, edges;

cap >> frame;
cv::cvtColor(frame, gray, cv::COLOR_BGR2GRAY);
cv::GaussianBlur(gray, blurred, cv::Size(5,5), 0);
cv::Canny(blurred, edges, 50, 150);

// Contour detection for obstacle identification
std::vector<std::vector<cv::Point>> contours;
cv::findContours(edges, contours, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE);

for (auto& c : contours) {
    double area = cv::contourArea(c);
    if (area > OBSTACLE_AREA_THRESHOLD) {
        // Trigger alert
        sendAlert(OBSTACLE_DETECTED);
    }
}
```

### Distance-Based Alert Logic
```cpp
// Ultrasonic sensor read + threat zoning
int distance = readUltrasonic(FRONT_SENSOR);

if (distance < CRITICAL_ZONE_CM) {
    triggerHaptic(HIGH_INTENSITY);
    triggerBuzzer(RAPID_BEEP);
} else if (distance < WARNING_ZONE_CM) {
    triggerHaptic(LOW_INTENSITY);
    triggerBuzzer(SLOW_BEEP);
}
```

---

## Project Lifecycle

This project was managed end-to-end across hardware and software domains:

| Phase | Activities | Output |
|---|---|---|
| Requirements | User research, use-case definition | Requirements doc |
| Design | Circuit design, software architecture | System design spec |
| Development | Sensor integration, C++ coding, OpenCV | Working prototype |
| Testing | Obstacle detection accuracy tests, field trials | Test report |
| Delivery | Final demo, documentation | Presentation + report |

**Coordination:** Led cross-domain collaboration between hardware (sensor/circuit) and software (C++/OpenCV) workstreams; managed milestones and deliverables on a 6-month timeline.

---

## Results

- Obstacle detection accuracy: **~87%** in controlled indoor environments
- Detection range: **15 cm – 200 cm** (adjustable threshold zones)
- Alert latency: **< 300ms** from detection to user feedback
- Power consumption: **~1.8W** average (suitable for battery-powered wearable)

---

## Project Structure

```
walking-assistance/
│
├── src/
│   ├── main.cpp                  # Main processing loop
│   ├── obstacle_detection.cpp    # OpenCV pipeline
│   ├── sensor_interface.cpp      # Ultrasonic read functions
│   └── alert_system.cpp          # Haptic + audio output
│
├── arduino/
│   └── sensor_controller.ino     # Arduino sensor + motor code
│
├── docs/
│   ├── system_design.pdf         # Architecture diagrams
│   └── project_report.pdf        # Full B.Tech project report
│
├── hardware/
│   └── circuit_diagram.png       # Wiring schematic
│
└── README.md
```

---

## Skills Demonstrated

- C++ programming for embedded / real-time systems
- Computer vision with OpenCV (edge detection, contour analysis)
- Microcontroller programming (Arduino)
- Sensor integration and serial communication
- Full project lifecycle management (requirements → delivery)
- Cross-functional team coordination

---

## Author

**Gautam Nath** · [LinkedIn](https://linkedin.com/in/gautam-nath-230574139) · gautamnath715@gmail.com  
B.Tech, Electronics & Communication Engineering  
GB Pant Government Engineering College, New Delhi — 2021
