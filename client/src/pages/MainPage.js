import React, { useState } from "react";
import "../css/MainPage.css";
import { Input, Button } from "@material-ui/core";
import { v1 as uuid } from "uuid";
import MenuProfessor from "../components/MenuProfessor/MenuProfessor";
import { useSelector } from "react-redux";
import { auth, db, storage } from "../firebase";
import profile from "../assets/blankprofilepicture.png";
import Typography from "@material-ui/core/Typography";
import MenuAluno from "../components/MenuAluno/MenuAluno"

const MainPage = (props) => {
  const [url, setURL] = useState("");
  const [urlPhoto, setUrlPhoto] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState("");
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");

  const create = () => {
    if (url !== "") {
      props.history.push(`${url}`);
    } else {
      const id = uuid();
      props.history.push(`/room/${id}`);
    }
  };

  const hideImg = () => {
    var img = document.getElementById("myimg");
    img.src = profile;
  };

  var docRef = db.collection("users").doc(auth.currentUser.uid);

  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        if (doc.data) {
          setTipoPerfil(doc.data().isTeacher);
          setName(doc.data().name);
          const email = JSON.stringify(doc.data().email);
          const isTeacher = JSON.stringify(doc.data().isTeacher);
          localStorage.setItem("isTeacher", isTeacher);
          localStorage.setItem("email", email);
        }
      } else {
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });

  // Create a reference to the file we want to download
  var starsRef = storage
    .ref("images")
    .child(auth.currentUser.uid)
    .child("profileImage");

  // Get the download URL
  starsRef
    .getDownloadURL()
    .then(function (urlPhoto) {
      var img = document.getElementById("myimg");
      setUrlPhoto(urlPhoto);
      img.src = urlPhoto;
    })
    .catch(function (error) {
      switch (error.code) {
        case "storage/object-not-found":
          var img = document.getElementById("myimg");
          img.src = profile;
          break;

        case "storage/unauthorized":
          console.log(error.code);
          var img = document.getElementById("myimg");
          img.src = profile;
          break;

        case "storage/canceled":
          console.log(error.code);
          var img = document.getElementById("myimg");
          img.src = profile;
          break;

        case "storage/unknown":
          console.log(error.code);
          var img = document.getElementById("myimg");
          img.src = profile;
          break;
      }
    });

  return (
    <>
      <div className="text-center pt-3">
        <img
          style={{ width: 250, height: 250, borderRadius: "50%" }}
          id="myimg"
          src={profile}
          alt="profile"
          onError={hideImg}
        />
      </div>
      <div className="text-center pt-3">
        <Typography variant="h3" gutterBottom>
          {name}
        </Typography>
      </div>
      <hr id="hr" />
      <div className="text-center" id="joinRoom">
        <p
          style={{
            alignContent: "center",
            margin: 0,
            fontWeight: "bold",
            paddingRight: "50px",
          }}
        >
          Start or join a meeting
        </p>
        <Input placeholder="URL" onChange={(e) => setURL(e.target.value)} />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={create}
          style={{ margin: "20px" }}
        >
          Go
        </Button>
      </div>
      <div className="cointainer2 text-center pb-5">
        {tipoPerfil == "true" ? <MenuProfessor /> : <MenuAluno />}
      </div>
    </>
  );
};

export default MainPage;
