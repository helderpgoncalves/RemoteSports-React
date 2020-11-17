import React from "react";
import logo from "../assets/logo_transparent.png";

const Home = () => {
  return (
    <>
      <div className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img style={{ width: "50%" }} src={logo} alt="Logo" />
      </div>
      <div>
      <div className="container">
        <h1>CONTENT FOR FOOTER</h1>
        <h1>CONTENT FOR FOOTER</h1>
        <h1>CONTENT FOR FOOTER</h1>
        <h1>CONTENT FOR FOOTER</h1>
      </div>
      </div>
    </>
  );
};

export default Home;
