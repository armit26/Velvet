
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Aperture, Camera, Scan, Box, Activity, Command,
  Settings2, Crosshair, Cpu, Layers3, Sparkles,
  CircleDot, Power, ChevronRight, ShieldCheck,
  Radio, Orbit
} from "lucide-react";
import { createDetector } from "./vision/detector";
import type { ObjectDetector } from "@mediapipe/tasks-vision";
import "./App.css";

type Detection = {
  name: string;
  score: number;
  box: { originX: number; originY: number; width: number; height: number };
};

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<ObjectDetector | null>(null);
  const animationRef = useRef<number>(0);
  const lastDetectionRef = useRef(0);

  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detections, setDetections] = useState<Detection[]>([]);

  async function startCamera() {
    if (loading || cameraOn) return;

    setError("");
    setLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) throw new Error("Video element unavailable");

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setCameraOn(true);

      if (!detectorRef.current) {
        try {
          detectorRef.current = await createDetector();
        } catch (gpuError) {
          console.warn("GPU initialization failed; trying CPU", gpuError);
          detectorRef.current = await createDetectorFallback();
        }
      }

      setLoading(false);
      runDetection();
    } catch (err) {
      console.error(err);
      stopCamera();
      setError(
        err instanceof Error
          ? err.message
          : "Could not initialize camera or vision engine."
      );
      setLoading(false);
    }
  }

  async function createDetectorFallback() {
    const { FilesetResolver, ObjectDetector } =
      await import("@mediapipe/tasks-vision");

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    return ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite",
        delegate: "CPU",
      },
      runningMode: "VIDEO",
      scoreThreshold: 0.35,
      maxResults: 15,
    });
  }

  function runDetection() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = detectorRef.current;

    if (!video || !canvas || !detector) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function frame() {
      if (!video || !canvas || !ctx || !detector) return;

      if (video.readyState >= 2) {
        const now = performance.now();

        if (now - lastDetectionRef.current >= 100) {
          lastDetectionRef.current = now;

          try {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const result = detector.detectForVideo(video, now);
            const objects: Detection[] = result.detections.flatMap((item) => {
              const category = item.categories[0];
              const box = item.boundingBox;

              if (!category || !box) return [];

              return [{
                name: category.categoryName || "Unknown",
                score: category.score,
                box,
              }];
            });

            setDetections(objects);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const object of objects) {
              const { originX, originY, width, height } = object.box;

              ctx.strokeStyle = "#B99AFF";
              ctx.lineWidth = 3;
              ctx.strokeRect(originX, originY, width, height);

              ctx.fillStyle = "#B99AFF";
              ctx.font = "bold 15px sans-serif";

              const label = `${object.name} ${Math.round(object.score * 100)}%`;
              const labelWidth = ctx.measureText(label).width + 16;
              const labelY = Math.max(0, originY - 27);

              ctx.fillRect(originX, labelY, labelWidth, 25);
              ctx.fillStyle = "#120d1d";
              ctx.fillText(label, originX + 8, labelY + 17);
            }
          } catch (err) {
            console.error("Detection error:", err);
          }
        }
      }

      animationRef.current = requestAnimationFrame(frame);
    }

    animationRef.current = requestAnimationFrame(frame);
  }

  function stopCamera() {
    cancelAnimationFrame(animationRef.current);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) videoRef.current.srcObject = null;

    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);

    setCameraOn(false);
    setLoading(false);
    setDetections([]);
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      detectorRef.current?.close();
    };
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Aperture size={22} /></div>
          <div>
            <div className="brand-name">VELVET<span>.</span></div>
            <div className="brand-caption">REALITY ENGINE / 01</div>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active"><Scan size={17}/> Perception <span className="nav-dot"/></div>
        <div className="nav-item"><Layers3 size={17}/> Scene explorer</div>
        <div className="nav-item"><Orbit size={17}/> Simulations <span className="soon">SOON</span></div>

        <div className="side-label second-label">SYSTEM</div>
        <div className="nav-item"><Activity size={17}/> Diagnostics</div>
        <div className="nav-item"><Settings2 size={17}/> Preferences</div>

        <div className="sidebar-bottom">
          <div className="system-card">
            <div className="system-card-top"><span className="live-dot"/> LOCAL SYSTEM</div>
            <div className="system-card-title">Your world, understood.</div>
            <div className="system-card-sub">Camera processing happens in your browser.</div>
          </div>
          <div className="profile">
            <div className="avatar">V</div>
            <div><strong>VELVET LAB</strong><small>EXPERIMENTAL BUILD</small></div>
            <Aperture size={17}/>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">WORKSPACE <ChevronRight size={13}/> <strong>PERCEPTION</strong></div>
          <div className="top-status"><span className="live-dot"/> SYSTEM READY <span className="top-divider"/> <span>LOCAL MODE</span></div>
        </header>

        <div className="content">
          <motion.div className="page-heading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <div className="eyebrow"><Sparkles size={13}/> SPATIAL INTELLIGENCE PLATFORM</div>
              <h1>See beyond <span>the surface.</span></h1>
              <p>Turn the physical world into an interactive digital environment.</p>
            </div>
            <div className="build-tag"><CircleDot size={13}/> BUILD 0.2.0</div>
          </motion.div>

          <div className="workspace-grid">
            <motion.section className="camera-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="panel-header">
                <div className="panel-title"><Camera size={16}/> LIVE CAPTURE</div>
                <div className={`capture-status ${cameraOn ? "active-status" : ""}`}>
                  <span className="status-dot"/> {loading ? "INITIALIZING ENGINE" : cameraOn ? "VISION ACTIVE" : "READY"}
                </div>
              </div>

              <div className="camera-stage">
                <video ref={videoRef} className={cameraOn ? "video-visible" : ""} muted playsInline />
                <canvas ref={canvasRef} className="detection-canvas" />

                {!cameraOn && (
                  <div className="camera-placeholder">
                    <motion.div className="camera-orb" animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }}>
                      <Aperture size={37}/>
                    </motion.div>
                    <h2>{loading ? "Initializing vision..." : "Your world starts here."}</h2>
                    <p>{loading ? "Loading the perception engine." : "Activate your camera to begin spatial perception."}</p>
                    <button className="primary-button" onClick={startCamera} disabled={loading}>
                      <Camera size={16}/> {loading ? "Loading..." : "Activate camera"}
                    </button>
                    <span className="permission-note"><ShieldCheck size={13}/> Camera access requires your permission</span>
                  </div>
                )}

                <div className="camera-corner top-left"/>
                <div className="camera-corner top-right"/>
                <div className="camera-corner bottom-left"/>
                <div className="camera-corner bottom-right"/>

                {cameraOn && (
                  <>
                    <div className="camera-overlay-label"><span className="live-dot"/> LIVE PERCEPTION</div>
                    <div className="camera-overlay-bottom">VELVET / OBJECT DETECTION</div>
                  </>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="camera-controls">
                <div className="control-info"><Radio size={14}/> {cameraOn ? "Vision engine connected" : "Awaiting video input"}</div>
                {cameraOn ? (
                  <button className="stop-button" onClick={stopCamera}><Power size={15}/> Stop camera</button>
                ) : (
                  <button className="secondary-button" onClick={startCamera} disabled={loading}>Connect input <ChevronRight size={15}/></button>
                )}
              </div>
            </motion.section>

            <motion.aside className="inspector" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
              <div className="panel-header">
                <div className="panel-title"><Crosshair size={16}/> PERCEPTION</div>
                <span className="muted-label">MEDIAPIPE</span>
              </div>

              <div className="metric-card">
                <div className="metric-heading">DETECTED OBJECTS <Box size={15}/></div>
                <div className="metric-value">{detections.length}</div>
                <div className="metric-foot">{cameraOn ? "Live detection results" : "Waiting for camera input"}</div>
              </div>

              <div className="inspector-section">
                <div className="section-heading">SCENE INTELLIGENCE <span>{String(detections.length).padStart(2, "0")}</span></div>
                <div className="detection-list">
                  {detections.length === 0 ? (
                    <div className="empty-state">
                      <Scan size={23}/>
                      <strong>{cameraOn ? "Scanning environment..." : "No scene analyzed"}</strong>
                      <span>{cameraOn ? "Move objects into the camera view." : "Activate the camera to begin object recognition."}</span>
                    </div>
                  ) : detections.map((item, index) => (
                    <div className="detection-item" key={`${item.name}-${index}`}>
                      <div className="detection-symbol"><Box size={15}/></div>
                      <div className="detection-info">
                        <strong>{item.name}</strong>
                        <span>OBJECT / DETECTED</span>
                      </div>
                      <div className="confidence">{Math.round(item.score * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="inspector-section engine-section">
                <div className="section-heading">ENGINE STATUS</div>
                <div className="engine-row"><span><Camera size={14}/> Camera input</span><b className={cameraOn ? "good" : ""}>{cameraOn ? "CONNECTED" : "STANDBY"}</b></div>
                <div className="engine-row"><span><Cpu size={14}/> Object detection</span><b className={cameraOn ? "good" : ""}>{cameraOn ? "ACTIVE" : "STANDBY"}</b></div>
                <div className="engine-row"><span><Orbit size={14}/> Scene engine</span><b>STANDBY</b></div>
              </div>
            </motion.aside>
          </div>

          <section className="command-panel">
            <div className="command-icon"><Command size={19}/></div>
            <div className="command-copy">
              <strong>Reality command interface</strong>
              <span>Natural language control is coming to VELVET.</span>
            </div>
            <div className="command-placeholder">Vision engine / {cameraOn ? `${detections.length} objects` : "STANDBY"} <Sparkles size={14}/></div>
          </section>

          <footer className="footer">
            <span>VELVET © 2026 — REALITY, REIMAGINED.</span>
            <span><span className="live-dot"/> {cameraOn ? "VISION ENGINE ACTIVE" : "SYSTEM STANDBY"}</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
