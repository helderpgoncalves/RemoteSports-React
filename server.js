const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const xss = require("xss");

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://remotesports.herokuapp.com/",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
  });
}

app.set("port", process.env.PORT || 5000);

sanitizeString = (str) => {
  return xss(str);
};

connections = {};
messages = {};
timeOnline = {};

io.on("connection", (socket) => {
  socket.on("join-call", (path) => {
    if (connections[path] === undefined) {
      connections[path] = [];
    }
    connections[path].push(socket.id);

    timeOnline[socket.id] = new Date();

    for (let a = 0; a < connections[path].length; ++a) {
      io.to(connections[path][a]).emit(
        "user-joined",
        socket.id,
        connections[path]
      );
    }

    if (messages[path] !== undefined) {
      for (let a = 0; a < messages[path].length; ++a) {
        io.to(socket.id).emit(
          "chat-message",
          messages[path][a]["data"],
          messages[path][a]["sender"],
          messages[path][a]["socket-id-sender"]
        );
      }
    }

    console.log(path, connections[path]);
  });

  socket.on("signal", (toId, message) => {
    io.to(toId).emit("signal", socket.id, message);
  });

  socket.on("chat-message", (data, sender) => {
    data = sanitizeString(data);
    sender = sanitizeString(sender);

    var key;
    var ok = false;
    for (const [k, v] of Object.entries(connections)) {
      for (let a = 0; a < v.length; ++a) {
        if (v[a] === socket.id) {
          key = k;
          ok = true;
        }
      }
    }

    if (ok === true) {
      if (messages[key] === undefined) {
        messages[key] = [];
      }
      messages[key].push({
        sender: sender,
        data: data,
        "socket-id-sender": socket.id,
      });
      console.log("message", key, ":", sender, data);

      for (let a = 0; a < connections[key].length; ++a) {
        io.to(connections[key][a]).emit(
          "chat-message",
          data,
          sender,
          socket.id
        );
      }
    }
  });

  socket.on("message", function (data) {
    var fileName = uuid.v4();

    socket.emit("ffmpeg-output", 0);

    writeToDisk(data.audio.dataURL, fileName + ".wav");

    // if it is chrome
    if (data.video) {
      writeToDisk(data.video.dataURL, fileName + ".webm");
      merge(socket, fileName);
    }

    // if it is firefox or if user is recording only audio
    else socket.emit("merged", fileName + ".wav");
  });

  socket.on("disconnect", () => {
    var diffTime = Math.abs(timeOnline[socket.id] - new Date());
    var key;
    for (const [k, v] of JSON.parse(
      JSON.stringify(Object.entries(connections))
    )) {
      for (let a = 0; a < v.length; ++a) {
        if (v[a] === socket.id) {
          key = k;

          for (let a = 0; a < connections[key].length; ++a) {
            io.to(connections[key][a]).emit("user-left", socket.id);
          }

          var index = connections[key].indexOf(socket.id);
          connections[key].splice(index, 1);

          console.log(key, socket.id, Math.ceil(diffTime / 1000));

          if (connections[key].length === 0) {
            delete connections[key];
          }
        }
      }
    }
  });
});

function writeToDisk(dataURL, fileName) {
  var fileExtension = fileName.split(".").pop(),
    fileRootNameWithBase = "./uploads/" + fileName,
    filePath = fileRootNameWithBase,
    fileID = 2,
    fileBuffer;

  // @todo return the new filename to client
  while (fs.existsSync(filePath)) {
    filePath = fileRootNameWithBase + "(" + fileID + ")." + fileExtension;
    fileID += 1;
  }

  dataURL = dataURL.split(",").pop();
  fileBuffer = new Buffer(dataURL, "base64");
  fs.writeFileSync(filePath, fileBuffer);

  console.log("filePath", filePath);
}

function merge(socket, fileName) {
  var FFmpeg = require("fluent-ffmpeg");

  var audioFile = path.join(__dirname, "uploads", fileName + ".wav"),
    videoFile = path.join(__dirname, "uploads", fileName + ".webm"),
    mergedFile = path.join(__dirname, "uploads", fileName + "-merged.webm");

  new FFmpeg({
    source: videoFile,
  })
    .addInput(audioFile)
    .on("error", function (err) {
      socket.emit("ffmpeg-error", "ffmpeg : An error occurred: " + err.message);
    })
    .on("progress", function (progress) {
      socket.emit("ffmpeg-output", Math.round(progress.percent));
    })
    .on("end", function () {
      socket.emit("merged", fileName + "-merged.webm");
      console.log("Merging finished !");

      // removing audio/video files
      fs.unlinkSync(audioFile);
      fs.unlinkSync(videoFile);
    })
    .saveToFile(mergedFile);
}

server.listen(app.get("port"), () => {
  console.log("listening on", app.get("port"));
});
