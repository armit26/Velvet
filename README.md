VELVET.
Reality Engine / 01

See beyond the surface.

VELVET is an experimental, browser-based computer vision platform that transforms a live camera feed into an interactive perception interface.

Built to explore the intersection of computer vision, machine learning and spatial intelligence.

!VELVET

✦ Features
Live camera perception — Access your camera directly from the browser.
Real-time object detection — Recognize supported objects using Google's MediaPipe Object Detector.
Visual detection overlays — Draw bounding boxes around detected objects.
Confidence scoring — Display model confidence percentages for each detection.
Scene inspector — View detected objects and their confidence scores in a live dashboard.
Local inference — Run object detection in the browser without sending camera footage to a custom backend.
◈ Technology
Technology	Purpose
React	User interface
TypeScript	Application logic
Vite	Development and build tooling
MediaPipe Tasks Vision	Object detection
Lucide React	Interface icons
Framer Motion	UI animations
◈ How it works
The browser requests camera permission.
The camera provides a live video stream.
MediaPipe loads a pretrained object detection model.
The model processes video frames.
Detected objects are displayed with bounding boxes and confidence scores.
Results appear in the VELVET perception dashboard.
◈ Getting started
Requirements
Node.js
npm
A modern browser
A webcam
Installation

Clone the repository:

bash
git clone https://github.com/armit26/Velvet.git
cd Velvet


Install dependencies:

bash
npm install


Start the development server:

bash
npm run dev


Open the local URL displayed in your terminal.

Camera permissions

Allow camera access when prompted by your browser.

The application uses browser camera APIs and requires a secure context. Localhost is supported for development.

The first launch may download the MediaPipe model and vision runtime.

◈ Project structure
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
└── vite.config.ts

◈ Current development status
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
◈ Vision

VELVET aims to evolve beyond object detection into a platform for understanding physical environments.

Future experiments include persistent object tracking, spatial mapping, scene intelligence and interactive digital representations.

◈ Privacy

Camera access requires explicit browser permission. Video processing is performed locally in the browser using MediaPipe.

The current application does not intentionally upload camera footage to a custom backend.


<p align="center">
**VELVET — REALITY, REIMAGINED.**
</p>

An independent experimental project. Built with curiosity.