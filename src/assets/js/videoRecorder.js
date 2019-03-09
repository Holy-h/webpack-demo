const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = event => {
  // console.log(event.data);
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  // console.log(link);
  link.download = "recorded.mp4";
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  // eslint-disable-next-line no-use-before-define
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "Start Recording";
};

const startRecording = () => {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  videoRecorder.start();
  recordBtn.addEventListener("click", stopRecording);
};

const getVideo = async () => {
  const constraints = {
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  };

  // catch(레코딩 거부 or 레코딩할 수 없는 경우)
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // videoPriview에 src를 줄 수 없음(파일이 아니기에)
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.onloadeddata = function recordPlay() {
      videoPreview.play();
      recordBtn.innerHTML = "Stop Recording";

      streamObject = stream;
      startRecording();
    };
    // console.log(stream);
  } catch (error) {
    recordBtn.innerHTML = ":( Cant Record";
  } finally {
    recordBtn.removeEventListener("click", getVideo);
  }
};

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}
