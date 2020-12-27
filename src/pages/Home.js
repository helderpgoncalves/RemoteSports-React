import React, { useState } from "react";
import logo from "../assets/logo_transparent.png";
import "../css/Home.css";
import GitHub from "../assets/GitHub_Logo_White.png";
import { Input, Button } from "@material-ui/core";

import { v1 as uuid } from "uuid";

const Home = (props) => {
  const [url, setURL] = useState("");

  const create = () => {
    if (url !== "") {
      props.history.push(`${url}`);
    } else {
      const id = uuid();
      props.history.push(`/room/${id}`);
    }
  };

  return (
    <>
      <div className="home" role="main">
        <div
          className="image"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", 
          }}
        >
          <img style={{ width: "50%" }} src={logo} alt="Logo" />
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
        <div id="screen2_container" className="screen">
          <h1 className="top-title" aria-level="3">
            Why choose RemoteSports?
          </h1>
          <div class="solutions">
            <div class="solution-list clearfix">
              <div className="solution-box">
                <div className="icon">
                  <a href="http://localhost:3000/register">
                    <img
                      className="solution-img"
                      alt="Create an Account and start your very own meeting"
                      src="https://www.flaticon.com/svg/static/icons/svg/681/681392.svg"
                      style={{ width: 100 }}
                    ></img>
                    <span className="sr-only">Create Free Account!</span>
                  </a>
                </div>
                <h3>100% Free Account</h3>
                <p>
                  Create an free account and start your very own meeting.
                  Connect to multiple people.
                </p>
              </div>
              <div className="solution-box">
                <div className="icon">
                  <img
                    className="solution-img"
                    alt="Multi Cameras"
                    src="https://www.flaticon.com/svg/static/icons/svg/3617/3617090.svg"
                  ></img>
                  <span className="sr-only">Multi Cameras</span>
                </div>
                <h3>Multi Camera</h3>
                <p>
                  Automatically cycle through all the users cameras too see if
                  everyone is perfoming the exercise correctly.
                </p>
              </div>
              <div className="solution-box">
                <div className="icon">
                  <img
                    className="solution-img"
                    alt="Chat and Share Files"
                    src="https://www.flaticon.com/svg/static/icons/svg/2924/2924704.svg"
                  ></img>
                  <span className="sr-only">Chat and Share Files</span>
                </div>
                <h3>Chat and Share Files</h3>
                <p>Chat and Share Big Files with your meeting mates.</p>
              </div>
              <div className="solution-box">
                <div className="icon">
                  <img
                    className="solution-img"
                    alt="Calendar"
                    src="https://www.flaticon.com/svg/static/icons/svg/3079/3079014.svg"
                    style={{ width: 100, alignContent: "center" }}
                  ></img>
                  <span className="sr-only">Calendar</span>
                </div>
                <h3>You will never forget!</h3>
                <p>
                  Never fail your meeting! Automatically send out invites to
                  registered users to join your meeting/class. It will also be
                  on your Calendar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="row">
          <div className="col">
            <h3>RemoteSports Team</h3>
            <ui className="list-unstyled">
              <li>
                <a
                  style={{ color: "white" }}
                  href="https://www.linkedin.com/in/heldergoncalves16/"
                >
                  HÉLDER PIMENTA GONÇALVES
                </a>
              </li>
              <li>HUGO PEREIRA</li>
            </ui>
          </div>
          <div className="col">
            <h3>Want to contribute? Great!</h3>
            <a href="https://github.com/helderpgoncalves/RemoteSports">
              <img src={GitHub} alt="github" style={{ width: "50%" }} />
            </a>
          </div>
        </div>
        <hr />
        <div className="row">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} RemoteSports |{" "}
            <a
              href="http://www.ipvc.pt"
              style={{ color: "white", alignItems: "center" }}
            >
              Instituto Politénico de Viana Do Castelo
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
