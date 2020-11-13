import React, { useState } from "react";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    const config = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.

      url: "http://localhost:3000/register/complete",
      handleCodeInApp: true,
    };

    await auth.sendSignInLinkToEmail(email, config);
    toast.success(`Email is sent to ${email}. Click the link to complete your registration.`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    // Guardar utilizador no local storage

    window.localStorage.setItem("emailForRegistration", email);

    // Limpar o state

    setEmail("");
  };

  // Esta separação é para melhor compreensão do código
  // Regras - Clean Code
  // Assim  o return nao fica super extenso

  const RegisterForm = () => (
    <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />{" "}
      <button type="submit" className="btn btn-raised">
        Register
      </button>
      <ToastContainer />
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3>Create New Account</h3>
          <ToastContainer />
          {RegisterForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
