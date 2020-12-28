import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "../../css/RegisterComplete.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import FileUploader from "react-firebase-file-uploader";

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [country, selectCountry] = useState("");
  const [region, selectRegion] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isTeacher, setIsTeacher] = useState("");
  const [school, setSchool] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error("You forgot some details!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters!");
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );

      if (result.user.emailVerified) {
        // remover o email da local storage

        window.localStorage.removeItem("emailForRegistration");

        // receber o token do id utilizador

        let user = auth.currentUser;
        await user.updatePassword(password);

        toast.success(
          `🤪 Excellent! You complete your registration! Welcome to RemoteSports!`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        db.collection("users")
          .doc(auth.currentUser.uid)
          .set({
            email: email,
            name: name,
            country: country,
            region: region,
            phoneNumber: phoneNumber,
            isTeacher: isTeacher,
            school: school,
            profileImage: profileImage,
          })

          .then(function () {
            console.log("Document successfully written!");
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
            toast.error(error);
          });

        history.push("/mainpage");
      }
    } catch (error) {
      toast.error(`😥 ${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <label>Profile Image</label>
          {profileImage && <img src={profileImage} alt=""/>}
          <FileUploader
            accept="image/*"
            name="avatar"
            randomizeFilename
            onUploadSuccess={(e) => setProfileImage(e.target.value)}
          />
      <br />
      <br />
      <input type="email" className="form-control" value={email} readOnly />
      <br />
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        required
      />
      <br />
      <input
        type="text"
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        autoFocus
        required="true"
      />
      <br />
      <CountryDropdown
        value={country}
        onChange={selectCountry}
        style={{ fontSize: 15 }}
      />
      <br />
      <br />
      <RegionDropdown
        disableWhenEmpty={true}
        country={country}
        value={region}
        onChange={selectRegion}
        style={{ fontSize: 15 }}
      />
      <br />
      <br />
      <PhoneInput
        international
        defaultCountry="PT"
        value={phoneNumber}
        onChange={setPhoneNumber}
      />
      <br />
      <h3>Type of User</h3>
      <select onChange={(e) => setIsTeacher(e.target.value)}>
        <option value={isTeacher}>Teacher</option>
        <option value={isTeacher}>Student</option>
        <option value={isTeacher}>Other</option>
      </select>
      <br />
      <br />
      <input
        type="text"
        className="form-control"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        placeholder="School"
        autoFocus
        required="false"
      />
      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        shape="round"
        block
        icon={<CheckOutlined />}
        size="large"
        disabled={!email || !password || !country}
      >
        Finish your Registration
      </Button>
    </form>
  );

  return (
    <div className="wrapper">
      <div className="container p-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h3>Complete your Registration</h3>
            {completeRegistrationForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
