import React, { useState } from "react";
import "../css/Home.css";
import { Input, Button } from "@material-ui/core";
import { v1 as uuid } from "uuid";

const MainPage = (props) => {
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
      <div className="cointainer2">
        
      </div>
    </>
  );
};

export default MainPage;
