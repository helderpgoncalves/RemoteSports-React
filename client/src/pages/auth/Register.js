import React, { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "../../css/Register.css"
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const Register = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      // process para aceder as variaveis env

     // url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
     url: "http://localhost:3000/register/complete",
      handleCodeInApp: true,
    };

    await auth
      .sendSignInLinkToEmail(email, config)
      .then(function () {
        toast.success(
          `🚀 Perfect! Now you must check the ${email} inbox to finalise your registration!`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        // Guardar utilizador no local storage
        window.localStorage.setItem("emailForRegistration", email);

        // Limpar o state
        setEmail("");
      })
      .catch(function (error) {
        console.log(error)
        toast.error(`😥 ${error} Please try again!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setEmail("");
      });
  };

  // Esta separação é para melhor compreensão do código
  // Regras - Clean Code
  // Assim  o return nao fica super extenso

  const RegisterForm = () => (
    <form onSubmit={handleSubmit}>
      <TextField
            fullWidth
            required
            margin="normal"
            variant="outlined"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            label="Email Address"
          />
      <br />
      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        shape="round"
        block
        icon={<UserAddOutlined />}
        size="large"
        disabled={!email}
      >Register with Email
      </Button>
    </form>
  );

  return (
    <div className="text-center">
    <div id="register-container">
          <Typography variant="h3">Create New Account</Typography>
          {RegisterForm()}
    </div>
    </div>
  );
};

export default Register;
