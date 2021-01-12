import React, { useState } from "react";
import "../css/Home.css";
import { Input, Button } from "@material-ui/core";
import { v1 as uuid } from "uuid";
import SearchFirestore from "../components/SearchFirestore/SearchFirestore";
import { useSelector } from "react-redux";
import { auth, db, storage } from "../firebase";
import profile from "../assets/blankprofilepicture.png";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MyCalendar from "../components/MyCalendar/MyCalendar"

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  
}));

function handleClick(event) {
  event.preventDefault();
  alert("You clicked a breadcrumb.");
  console.info("You clicked a breadcrumb.");
}

const MainPage = (props) => {
  const [url, setURL] = useState("");
  const [urlPhoto, setUrlPhoto] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState("");
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [showImg, setShowImg] = useState("");

  const classes = useStyles();

  const create = () => {
    if (url !== "") {
      props.history.push(`${url}`);
    } else {
      const id = uuid();
      props.history.push(`/room/${id}`);
    }
  };

  const hideImg = (event) => {
    setShowImg(false);
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
      <Grid alignContent="center">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href="/"
            onClick={handleClick}
            className={classes.link}
          >
            <HomeIcon className={classes.icon} />
            Material-UI
          </Link>
          <Link
            color="inherit"
            href="/getting-started/installation/"
            onClick={handleClick}
            className={classes.link}
          >
            <WhatshotIcon className={classes.icon} />
            Core
          </Link>
          <Typography color="textPrimary" className={classes.link}>
            <GrainIcon className={classes.icon} />
            Breadcrumb
          </Typography>
        </Breadcrumbs>
      </Grid>
      <div className="row pt-5 pb-5">
        <div className="col text-center">
          {showImg ? (
            <img
              style={{ width: "40%" }}
              id="myimg"
              src={urlPhoto}
              alt="urlPhoto"
              onError={hideImg()}
            />
          ) : (
            <img
              style={{ width: "40%" }}
              id="myimg"
              src={profile}
              alt="profile"
            />
          )}
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
      <MyCalendar />
    </>
  );
};

export default MainPage;
