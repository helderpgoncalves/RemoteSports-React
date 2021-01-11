import React, { useState } from "react";
import "../css/Home.css";
import { Input, Button } from "@material-ui/core";
import { v1 as uuid } from "uuid";
import SearchFirestore from "../components/SearchFirestore/SearchFirestore";
import { useSelector } from "react-redux";
import { auth, db, storage } from "../firebase";
import profile from "../assets/blankprofilepicture.png";

const MainPage = (props) => {
  const [url, setURL] = useState("");
  const [urlPhoto, setUrlPhoto] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState("");
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName]= useState("");

  const create = () => {
    if (url !== "") {
      props.history.push(`${url}`);
    } else {
      const id = uuid();
      props.history.push(`/room/${id}`);
    }
  };

  var docRef = db.collection("users").doc(auth.currentUser.uid);

  docRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        setTipoPerfil(doc.data().isTeacher);
        setName(doc.data().name);
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
          break;

        case "storage/canceled":
          console.log(error.code);
          break;

        case "storage/unknown":
          console.log(error.code);
          break;
      }
    });
  

  return (
    <>
      <div className="row pt-5 pb-5">
        <div className="col text-center">
          <img
            style={{ width: "40%" }}
            id="myimg"
            src={profile}
            alt="profile"
          />
        </div>
        <div className="col text-center">
          <h1>Welcome Back</h1>
          <h3>{name}</h3>
        </div>
      </div>
      <div
        style={{
          background: "white",
          width: "30%",
          height: "auto",
          padding: "20px",
          minWidth: "400px",
          textAlign: "center",
          margin: "auto",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>
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

      <div className="cointainer2 text-center">
      {tipoPerfil == "true" ? (
              <SearchFirestore />
            ) : (
              <h3>CONTA DE ESTUDANTE</h3>
            )}
      </div>
    </>
  );
};

export default MainPage;
