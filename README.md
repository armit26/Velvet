VELVET.

REALITY ENGINE / 01

See beyond the surface.

VELVET is an experimental, browser-based computer vision platform that transforms live camera input into an interactive perception interface.

Exploring the intersection of computer vision, machine learning and spatial intelligence.

✦ FEATURES
Live camera perception — Access your webcam directly in the browser.
Real-time object detection — Detect supported objects using MediaPipe.
Visual detection overlays — Display bounding boxes around detected objects.
Confidence scoring — View model confidence percentages.
Scene inspector — Explore detected objects through a live dashboard.
Local inference — Process camera frames directly in the browser.
◈ TECHNOLOGY STACK
Technology	Purpose
React	User interface
TypeScript	Application logic
Vite	Development and build tooling
MediaPipe Tasks Vision	Object detection
Lucide React	Interface icons
Framer Motion	UI animations
◈ HOW IT WORKS
The browser requests camera permission.
The camera provides a live video stream.
MediaPipe loads a pretrained object detection model.
The model processes video frames.
Detected objects are displayed with bounding boxes and confidence scores.
Results appear in the VELVET perception dashboard.
◈ GETTING STARTED
Requirements
Node.js
npm
Modern browser
Webcam
Installation

1. Clone the repository

bash
git clone https://github.com/armit26/Velvet.git
cd Velvet


2. Install dependencies

bash
npm install


3. Start the development server

bash
npm run dev


Open the localhost URL displayed in your terminal.

Camera permissions

Allow camera access when prompted by your browser.

Camera access requires a secure browser context. Localhost is supported during development.

The first launch may download the MediaPipe model and vision runtime.

◈ PROJECT STRUCTURE
text
Velvet/
├── public/
├── src/
│   ├── assets/
│   ├── vision/
│   │   └── detector.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
├── package-lock.json
└── vite.config.ts

◈ DEVELOPMENT STATUS
Component	Status
Monochrome interface	Complete
Live camera input	Complete
MediaPipe integration	Complete
Object detection	Complete
Bounding box rendering	Complete
Confidence display	Complete
Persistent object tracking	Planned
Spatial mapping	Planned
Interactive 3D environment	Planned
◈ VISION

VELVET aims to evolve beyond object detection into a platform for understanding physical environments.

Future experiments include persistent object tracking, spatial mapping, scene intelligence and interactive digital representations.

◈ PRIVACY

Camera access requires explicit browser permission. Video processing is performed locally in the browser using MediaPipe.

The current application does not intentionally upload camera footage to a custom backend.

<p align="center">
<strong>VELVET — REALITY, REIMAGINED.</strong>
<br>
<sub>An independent experimental project. Built with curiosity.</sub>
</p>