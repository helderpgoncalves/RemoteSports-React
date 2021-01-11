import React from "react";
import { auth, db, storage } from "../firebase";
import profile from "../assets/blankprofilepicture.png";

const ProfileSettings = ({ history }) => {
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
      <div className="text-center pt-5">
        <img style={{ width: "40%" }} id="myimg" src={profile} alt="profile" />
        <h1>OLÁ</h1>
      </div>
    </>
  );
};

export default ProfileSettings;
