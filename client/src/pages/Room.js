import React, { Component } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { IconButton, Badge, Input, Button } from "@material-ui/core";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import StopIcon from "@material-ui/icons/Stop";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import CallEndIcon from "@material-ui/icons/CallEnd";
import ChatIcon from "@material-ui/icons/Chat";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { message } from "antd";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import "antd/dist/antd.css";
import { Row } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.css";
import "../css/Room.css";
import BlurOnIcon from "@material-ui/icons/BlurOn";
import BlurOffIcon from "@material-ui/icons/BlurOff";
import SendIcon from "@material-ui/icons/Send";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import { drawHand } from "../utilities"; // Canvas Draws on the Hand
import * as fp from "fingerpose";
import thumbs_up from "../assets/thumbs_up.png";
import victory from "../assets/victory.png";

// mimeType - The mimeType read-only property returns the MIME
// media type that was specified when creating the
// MediaRecorder object,
const videoType = "video/webm;codecs=vp8";

const server_url =
  process.env.NODE_ENV === "production"
    ? "https://remotesports.herokuapp.com/"
    : "http://localhost:5000";

var connections = {};
const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
var socket = io(server_url);
var socketId = null;
var elms = 0;

class Room extends Component {
  constructor(props) {
    super(props);

    this.localVideoref = React.createRef();

    this.videoAvailable = false;
    this.audioAvailable = false;

    this.canvasRef = React.createRef();

    this.state = {
      video: false,
      audio: false,
      screen: false,
      showModal: false,
      screenAvailable: false,
      messages: [],
      message: "",
      notification: "",
      newmessages: 0,
      askForUsername: true,
      username: "",
      videos: [],
      recording: false,
      blur: false,
      net: null,
      emoji: null,
      images: {
        thumbs_up: thumbs_up,
        victory: victory,
      },
    };
    connections = {};

    this.getPermissions();
  }

  runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");

    setInterval(() => {
      this.detect(net);
    }, 100);
  };

  detect = async (net) => {
    // Check data is available
    if (
      typeof this.localVideoref.current !== "undefined" &&
      this.localVideoref.current !== null
    ) {
      const videoWidth = document.getElementById("my-video").style.width;
      const videoHeight = document.getElementById("my-video").style.height;

      // Get Video Properties
      const video = document.getElementById("my-video");

      const vidStyleData = video.getBoundingClientRect();

      //  const videoWidth = this.localVideoref.current.video.videoWidth;
      //  const videoHeight = this.localVideoref.current.video.videoHeight;

      // Set video width
      // this.localVideoref.current.video.width = videoWidth;
      // this.localVideoref.current.video.height = videoHeight;

      // Set canvas height and width
      var canvas = document.getElementById("canvas");

      canvas.style.setProperty("width", videoWidth);
      canvas.style.setProperty("height", videoHeight);

      // Make Detections
      const hand = await net.estimateHands(video);
      //  console.log(hand);

      // add "✌🏻" and "👍" as sample gestures
      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 7);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          // console.log(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          // console.log(gesture.gestures[maxConfidence].name);
          this.setState({
            emoji: gesture.gestures[maxConfidence].name,
          });
        }
      }

      // Draw mesh
      // const ctx = this.canvasRef.current.getContext("2d");
      // drawHand(hand, ctx);
    }
  };

  getPermissions = async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => (this.videoAvailable = true))
        .catch(() => (this.videoAvailable = false));

      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => (this.audioAvailable = true))
        .catch(() => (this.audioAvailable = false));

      if (navigator.mediaDevices.getDisplayMedia) {
        this.setState({ screenAvailable: true });
      } else {
        this.setState({ screenAvailable: false });
      }

      if (this.videoAvailable || this.audioAvailable) {
        navigator.mediaDevices
          .getUserMedia({
            video: this.videoAvailable,
            audio: this.audioAvailable,
          })
          .then((stream) => {
            window.localStream = stream;
            this.localVideoref.current.srcObject = stream;
          })
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };

  getMedia = () => {
    // Primeira função a ser lida
    // Tentamos ir buscar o video e audio do utilizador
    this.setState(
      {
        video: this.videoAvailable,
        audio: this.audioAvailable,
      },
      () => {
        this.getUserMedia(); //atribuir media ao utilizador
        this.connectToSocketServer(); // conecção a sala
      }
    );
  };

  getUserMedia = () => {
    if (
      (this.state.video && this.videoAvailable) ||
      (this.state.audio && this.audioAvailable)
    ) {
      // se conseguirmos atribuir a media e audio ao utilizador
      navigator.mediaDevices
        .getUserMedia({ video: this.state.video, audio: this.state.audio })
        .then(this.getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = this.localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  // Função mais importante
  getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    this.localVideoref.current.srcObject = stream;

    //    this.runHandpose();

    toast.success("👍 Thumbs Up for the Webcam for making a question!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: videoType,
    });
    // init data storage for video chunks
    this.chunks = [];
    // listen for data from media recorder
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };

    for (let id in connections) {
      if (id === socketId) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          this.setState(
            {
              video: false,
              audio: false,
            },
            () => {
              try {
                let tracks = this.localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
              } catch (e) {
                console.log(e);
              }

              // Ficar indisponivel até carregar o video
              let blackSilence = (...args) =>
                new MediaStream([this.black(...args), this.silence()]);
              window.localStream = blackSilence();
              this.localVideoref.current.srcObject = window.localStream;

              for (let id in connections) {
                connections[id].addStream(window.localStream);

                connections[id].createOffer().then((description) => {
                  connections[id]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        id,
                        JSON.stringify({
                          sdp: connections[id].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                });
              }
            }
          );
        })
    );
  };

  getDislayMedia = () => {
    //media a ser "displayed" do utilizador
    if (this.state.screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(this.getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  startBlur(e) {
    this.setState({
      blur: true,
    });

    //  this.loadBodyPix();
  }

  loadBodyPix = async () => {
    const videoElement = document.getElementById("my-video");

    const net = await bodyPix.load();

    // Convert the personSegmentation into a mask to darken the background.
    const segmentation = net.segmentPerson(videoElement);

    const backgroundBlurAmount = 6;
    const edgeBlurAmount = 2;
    const flipHorizontal = true;

    const canvas = document.getElementById("canvas");

    bodyPix.drawBokehEffect(
      canvas,
      videoElement,
      segmentation,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    );
  };

  stopBlur(e) {
    this.setState({
      blur: false,
    });
  }

  startRecording(e) {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(100);

    toast("🎬 You start recording!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // say that we're recording
    this.setState({ recording: true });
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();

    toast.dark("🛑 You stop recording!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // say that we're not recording
    this.setState({ recording: false });
    // save the video to memory
    this.saveVideo();
  }

  saveVideo() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: "video/mp4" });

    // generate video url from blob
    const videoURL = window.URL.createObjectURL(blob);

    // append videoURL to list of saved videos for rendering
    const videos = this.state.videos.concat([videoURL]);
    this.setState({ videos });
  }

  deleteVideo(videoURL) {
    // filter out current videoURL from the list of saved videos
    const videos = this.state.videos.filter((v) => v !== videoURL);
    this.setState({ videos });
  }

  getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    this.localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketId) continue;

      connections[id].addStream(window.localStream); //adicionar a stream do utilizador

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          this.setState(
            {
              screen: false,
            },
            () => {
              try {
                let tracks = this.localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
              } catch (e) {
                console.log(e);
              }

              let blackSilence = (...args) =>
                new MediaStream([this.black(...args), this.silence()]);
              window.localStream = blackSilence();
              this.localVideoref.current.srcObject = window.localStream;

              this.getUserMedia();
            }
          );
        })
    );
  };

  gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketId) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  changeCssVideos = (main) => {
    let widthMain = main.offsetWidth;
    let minWidth = "30%";
    if ((widthMain * 30) / 100 < 300) {
      minWidth = "300px";
    }
    let minHeight = "40%";

    let height = String(100 / elms) + "%";
    let width = "";
    if (elms === 0 || elms === 1) {
      width = "90%";
      height = "90%";
    } else if (elms === 2) {
      width = "45%";
      height = "100%";
    } else if (elms === 3 || elms === 4) {
      width = "35%";
      height = "50%";
    } else {
      width = String(100 / elms) + "%";
    }

    let videos = main.querySelectorAll("video");
    for (let a = 0; a < videos.length; ++a) {
      videos[a].style.setProperty("borderColor", "#001529");
      videos[a].style.setProperty("bordeRadius", "50px");
      videos[a].style.minWidth = minWidth;
      videos[a].style.minHeight = minHeight;
      videos[a].style.setProperty("width", width);
      videos[a].style.setProperty("height", height);
    }

    return { minWidth, minHeight, width, height };
  };

  connectToSocketServer = () => {
    socket = io.connect(server_url, { secure: true });

    socket.on("signal", this.gotMessageFromServer);

    socket.on("connect", () => {
      socket.emit("join-call", window.location.href);
      socketId = socket.id;

      socket.on("chat-message", this.addMessage);

      socket.on("notification", this.addNotification);

      socket.on("user-left", (id) => {
        let video = document.querySelector(`[data-socket="${id}"]`);
        if (video !== null) {
          elms--;
          video.parentNode.removeChild(video);

          let main = document.getElementById("main");
          this.changeCssVideos(main);
        }
      });

      socket.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConnectionConfig
          );
          // Wait for their ice candidate
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socket.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Wait for their video stream
          connections[socketListId].onaddstream = (event) => {
            // TODO mute button, full screen button
            var searchVidep = document.querySelector(
              `[data-socket="${socketListId}"]`
            );
            if (searchVidep !== null) {
              // if i don't do this check it make an empty square
              searchVidep.srcObject = event.stream;
            } else {
              elms = clients.length;
              let main = document.getElementById("main");
              let cssMesure = this.changeCssVideos(main);

              let video = document.createElement("video");

              let css = {
                minWidth: cssMesure.minWidth,
                minHeight: cssMesure.minHeight,
                maxHeight: "100%",
                margin: "10px",
                borderStyle: "solid",
                borderColor: "#bdbdbd",
                objectFit: "fill",
              };
              for (let i in css) video.style[i] = css[i];

              video.style.setProperty("width", cssMesure.width);
              video.style.setProperty("height", cssMesure.height);
              video.setAttribute("data-socket", socketListId);
              video.srcObject = event.stream;
              video.autoplay = true;
              video.playsinline = true;

              main.appendChild(video);
            }
          };

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([this.black(...args), this.silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketId) {
          for (let id2 in connections) {
            if (id2 === socketId) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socket.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  handleVideo = () =>
    this.setState({ video: !this.state.video }, () => this.getUserMedia());
  handleAudio = () =>
    this.setState({ audio: !this.state.audio }, () => this.getUserMedia());
  handleScreen = () =>
    this.setState({ screen: !this.state.screen }, () => this.getDislayMedia());

  handleEndCall = () => {
    try {
      let tracks = this.localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      toast.error("You leave the Meeting! 👋", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (e) {}
    window.location.href = "/";
  };

  openChat = () => this.setState({ showModal: true, newmessages: 0 });
  closeChat = () => this.setState({ showModal: false });
  handleMessage = (e) => this.setState({ message: e.target.value });

  askQuestion = () => {
    socket.emit("notification", this.state.username);
  };

  addMessage = (data, sender, socketIdSender) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, { sender: sender, data: data }],
    }));
    if (socketIdSender !== socketId) {
      this.setState({ newmessages: this.state.newmessages + 1 });
    }
  };

  addNotification = (sender) => {
    toast.dark(`❓ ${sender} wants to ask a question!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  handleUsername = (e) => this.setState({ username: e.target.value });

  sendMessage = () => {
    socket.emit("chat-message", this.state.message, this.state.username);
    this.setState({ message: "", sender: this.state.username });
  };

  copyUrl = () => {
    let text = window.location.href;
    if (!navigator.clipboard) {
      let textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        message.success("Link copied to clipboard!");
      } catch (err) {
        message.error("Failed to copy");
      }
      document.body.removeChild(textArea);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        message.success("Link copied to clipboard!");
      },
      () => {
        message.error("Failed to copy");
      }
    );
  };

  enumerateDevicesFunction = () => {
    let select1 = document.getElementById("select1");
    let select3 = document.getElementById("select3");

    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (deviceInfo) {
          var option = document.createElement("option");
          option.value = deviceInfo.deviceId;

          if (deviceInfo.kind === "audioinput") {
            option.label = deviceInfo.label;
            option.value = deviceInfo.deviceId;

            // console.log(option.value);

            select1.appendChild(option);
          } else if (deviceInfo.kind === "videoinput") {
            option.label = deviceInfo.label;
            option.value = deviceInfo.deviceId;

            // console.log(option.value);

            select3.appendChild(option);
          }
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  };

  connect = () =>
    this.setState({ askForUsername: false }, () => this.getMedia());

  isChrome = function () {
    let userAgent = (navigator && (navigator.userAgent || "")).toLowerCase();
    let vendor = (navigator && (navigator.vendor || "")).toLowerCase();
    let matchChrome = /google inc/.test(vendor)
      ? userAgent.match(/(?:chrome|crios)\/(\d+)/)
      : null;
    return matchChrome !== null;
  };

  render() {
    const { recording, videos, blur, emoji } = this.state;

    if (this.isChrome() === false) {
      return (
        <div
          style={{
            background: "white",
            width: "30%",
            height: "auto",
            padding: "20px",
            minWidth: "400px",
            textAlign: "center",
            margin: "auto",
            marginTop: "50px",
            justifyContent: "center",
          }}
        >
          <h1>Sorry, this works only with Google Chrome</h1>
        </div>
      );
    }
    return (
      <div>
        {this.state.askForUsername === true ? (
          <div className="card1 card-2">
            <div className="text-center">
              <Typography component="h1" variant="h5">
                Set your username
              </Typography>
              <TextField
                fullWidth
                required
                label="Username"
                value={this.state.username}
                onChange={(e) => this.handleUsername(e)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={this.connect}
                disabled={!this.state.username}
                style={{ margin: "20px" }}
              >
                Connect
              </Button>
            </div>
            <div
              style={{
                justifyContent: "center",
                textAlign: "center",
                paddingTop: "10px",
              }}
            >
              <video
                id="my-video"
                ref={this.localVideoref}
                autoPlay
                muted
                style={{
                  borderRadius: "50px",
                  borderStyle: "solid",
                  borderColor: "#001529",
                  objectFit: "fill",
                  width: "100%",
                  height: "30%",
                }}
              ></video>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center" style={{ background: "#969696" }}>
              {videos.map((videoURL, i) => (
                <div className="pt-3 pb-3" key={`video_${i}`}>
                  <video style={{ width: 200 }} src={videoURL} />
                  <div>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() => this.deleteVideo(videoURL)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                    >
                      <a
                        style={{ textDecoration: "none" }}
                        className="text-white"
                        target="_blank"
                        href={videoURL}
                      >
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#ecf0f3" }}>
              <div
                className="btn-down"
                style={{
                  backgroundColor: "#001529",
                  color: "#001529",
                  textAlign: "center",
                }}
              >
                <IconButton
                  style={{ color: "white" }}
                  onClick={this.handleVideo}
                >
                  {this.state.video === true ? (
                    <VideocamIcon />
                  ) : (
                    <VideocamOffIcon />
                  )}
                </IconButton>

                <IconButton
                  style={{ color: "#f44336" }}
                  onClick={this.handleEndCall}
                >
                  <CallEndIcon />
                </IconButton>

                <IconButton
                  style={{ color: "white" }}
                  onClick={this.handleAudio}
                >
                  {this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
                </IconButton>

                {!recording && (
                  <IconButton
                    style={{ color: "white" }}
                    onClick={(e) => this.startRecording(e)}
                  >
                    <PlayCircleFilledWhiteIcon />
                  </IconButton>
                )}

                {recording && (
                  <IconButton
                    style={{ color: "#f44336" }}
                    onClick={(e) => this.stopRecording(e)}
                  >
                    <StopIcon />
                  </IconButton>
                )}

                {!blur && (
                  <IconButton
                    style={{ color: "white" }}
                    onClick={(e) => this.startBlur(e)}
                  >
                    <BlurOnIcon />
                  </IconButton>
                )}

                {blur && (
                  <IconButton
                    style={{ color: "#f44336" }}
                    onClick={(e) => this.stopBlur(e)}
                  >
                    <BlurOffIcon />
                  </IconButton>
                )}

                {this.state.screenAvailable === true ? (
                  <IconButton
                    style={{ color: "white" }}
                    onClick={this.handleScreen}
                  >
                    {this.state.screen === true ? (
                      <ScreenShareIcon />
                    ) : (
                      <StopScreenShareIcon />
                    )}
                  </IconButton>
                ) : null}

                <Badge
                  badgeContent={this.state.newmessages}
                  max={999}
                  color="secondary"
                  onClick={this.openChat}
                >
                  <IconButton
                    style={{ color: "white" }}
                    onClick={this.openChat}
                  >
                    <ChatIcon />
                  </IconButton>
                </Badge>

                <IconButton
                  style={{ color: "white" }}
                  onClick={this.askQuestion}
                >
                  <LiveHelpIcon />
                </IconButton>
              </div>

              <Modal
                show={this.state.showModal}
                onHide={this.closeChat}
                style={{ zIndex: "999999" }}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Chat Room</Modal.Title>
                </Modal.Header>
                <Modal.Body
                  style={{
                    overflow: "auto",
                    overflowY: "auto",
                    height: "400px",
                    textAlign: "left",
                  }}
                >
                  {this.state.messages.length > 0 ? (
                    this.state.messages.map((item, index) => (
                      <div key={index} style={{ textAlign: "left" }}>
                        <p style={{ wordBreak: "break-all" }}>
                          <b>{item.sender}</b>: {item.data}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No messages yet</p>
                  )}
                </Modal.Body>
                <Modal.Footer className="div-send-msg">
                  <Input
                    placeholder="Message"
                    value={this.state.message}
                    onChange={(e) => this.handleMessage(e)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.sendMessage}
                    startIcon={<SendIcon />}
                  >
                    Send
                  </Button>
                </Modal.Footer>
              </Modal>

              <div className="container">
                <div style={{ paddingTop: "20px" }}>
                  <Input value={window.location.href} disable="true"></Input>
                  <Button
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "whitesmoke",
                      marginLeft: "20px",
                      marginTop: "10px",
                      width: "120px",
                      fontSize: "10px",
                    }}
                    onClick={this.copyUrl}
                  >
                    Copy invite link
                  </Button>
                  <br />
                </div>
                <div className="pt-4">
                  <div className="select">
                    <label for="select1">Audio Source: </label>
                    <select
                      value={this.state.video}
                      id="select1"
                      className="pr-3"
                    ></select>
                    <div className="select__arrow"></div>
                  </div>
                  <div className="select">
                    <label for="select3">Video Source: </label>
                    <select
                      value={this.state.audio}
                      id="select3"
                      className="pr-3"
                    ></select>
                    <div className="select__arrow"></div>
                    {this.enumerateDevicesFunction()}
                  </div>
                </div>

                <Row
                  id="main"
                  className="flex-container"
                  style={{ margin: 0, padding: 0 }}
                >
                  <video
                    id="my-video"
                    ref={this.localVideoref}
                    autoPlay
                    muted
                    style={{
                      borderRadius: "50px",
                      borderStyle: "solid",
                      borderColor: "#001529",
                      margin: "10px",
                      objectFit: "fill",
                      width: "90%",
                      height: "90%",
                    }}
                  ></video>
                  {this.state.video && (
                    <canvas
                      id="canvas"
                      ref={this.canvasRef}
                      style={{
                        position: "absolute",
                        objectFit: "fill",
                        backgroundColor: "transparent",
                      }}
                    />
                  )}
                </Row>
              </div>
            </div>
            {emoji !== null ? (
              <img
                src={this.state.images[emoji]}
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  right: "32px",
                  top: "64px",
                  textAlign: "center",
                  height: 100,
                }}
              />
            ) : (
              ""
            )}
          </>
        )}
      </div>
    );
  }
}

export default Room;
