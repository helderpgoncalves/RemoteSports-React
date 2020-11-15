import React from "react";
import logo from "../assets/logo_transparent.png";
import { Button } from "antd";

const Home = () => {
  const handleSubmit = () => {

  }

  return (
    <>
      <div
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onClick={handleSubmit} type="primary" className="mb-3" danger size="large" shape="round">
          Teste Teste !
        </Button>
      </div>
    </>
  );
};

export default Home;
