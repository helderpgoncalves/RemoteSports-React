import React, { useState, useEffect } from "react";
import "../css/Home.css";
import GitHub from "../assets/GitHub_Logo_White.png";
import { useSelector } from "react-redux";
import MainInterface from "../components/MainInterface/MainInterface.js";

const Home = (props) => {
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) props.history.push("/mainpage");
  }, [user]);

  return (
    <>
      <div className="home" role="main">
        <MainInterface />
        <div id="screen2_container" className="screen">
          <h1 className="top-title" aria-level="3">
            Why choose RemoteSports?
          </h1>
          <div className="solutions text-center">
            <div className="solution-list clearfix">
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
            <h3 className="pl-5 pt-4">RemoteSports Team</h3>
            <li className="list-unstyled pl-5">
              <a
                style={{ color: "white" }}
                href="https://www.linkedin.com/in/heldergoncalves16/"
              >
                HÉLDER PIMENTA GONÇALVES
              </a>
            </li>
            <li className="list-unstyled pl-5">HUGO PEREIRA</li>
          </div>
          <div className="col pt-4">
            <h3>Want to contribute? Great!</h3>
            <a
              className="pl-5"
              href="https://github.com/helderpgoncalves/RemoteSports"
            >
              <img src={GitHub} alt="github" style={{ width: "30%" }} />
            </a>
          </div>
        </div>
        <hr />
        <div className="row text-center">
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
