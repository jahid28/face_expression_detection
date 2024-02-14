import * as faceapi from "face-api.js";
import React, { useRef } from "react";

function App() {
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  const videoRef = React.useRef();
  const videoHeight = 480;
  const videoWidth = 640;

  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => setModelsLoaded(true));
    }
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  }

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

      // Logging the face expressions
      if (detections && detections.length > 0 && detections[0].expressions) {
        console.log(detections[0].expressions);
      }
    }, 1000)
  }

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  }

  // const array = ["sq",'rec'];

  // // Function to get 5 random values from the array
  // const getRandomValues = (arr) => {
  //   const result = [];
  //   const len = arr.length;

  //   // Shuffle the array to ensure randomness
  //   // for (let i = len - 1; i > 0; i--) {
  //   //   const j = Math.floor(Math.random() * (i + 1));
  //   //   [arr[i], arr[j]] = [arr[j], arr[i]];
  //   // }

  //   console.log("ll",array[0])
  //   // Get the first 'numValues' elements from the shuffled array
  //   for (let i = 0; i < 1; i++) {
  //     // result.push(arr[i]);
  //     document.getElementById(`${array[0]}`).style.display = 'none';
  //     // document.getElementById(`${arr[i]}Cont`).style.display = 'none';
  //   }

  // };

  // // Get 5 random values from the array
  // getRandomValues(array);


  // const draggableRef = useRef(null);

  // const handleDragStart = (e) => {
  //   console.log("pop", draggableRef.current.id);
  //   e.dataTransfer.setData("text", draggableRef.current.id);
  // };

  // const handleDragOver = (e) => {
  //   e.preventDefault();
  // };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   const id = e.dataTransfer.getData("text");
  //   const draggableElement = document.getElementById(id);
  //   e.target.appendChild(draggableElement);
  // };
  return (
    <div>
      {/* <div className="ContCont" style={{ display: "flex" }}>
        <div
          id="sqCont"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "gray",
            border: "50px solid black",
          }}
        ></div>

        <div
          id="recCont"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            width: "150px",
            height: "80px",
            backgroundColor: "gray",
            border: "50px solid black",
          }}
        ></div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          id="sq"
          ref={draggableRef}
          draggable
          onDragStart={handleDragStart}
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "red",
            margin: "0px",
          }}
        ></div>

        <div
          id="rec"
          ref={draggableRef}
          draggable
          onDragStart={handleDragStart}
          style={{
            width: "150px",
            height: "80px",
            backgroundColor: "red",
            margin: "0px",
          }}
        ></div>
      </div> */}

      <div style={{ textAlign: 'center', padding: '10px' }}>
        {
          captureVideo && modelsLoaded ?
            <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Close Webcam
            </button>
            :
            <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Open Webcam
            </button>
        }
      </div>
      {
        captureVideo ?
          modelsLoaded ?
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
              <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
            </div>
            :
            <div>loading...</div>
          :
          <>
          </>
      }
      
    </div>
  );
}

export default App;
