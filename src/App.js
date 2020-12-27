import React, { useEffect } from "react";

//Importar os Routers
import { Switch, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Header from "./components/Header/Header.js";
import RegisterComplete from "./pages/auth/RegisterComplete";
import MainPage from "./pages/MainPage";
import Room from "./pages/Room";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "./firebase";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();

  // Para receber o state do firebase auth

  useEffect(() => { //React
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) { //Login está feito
        const idTokenResult = await user.getIdTokenResult();
        console.log("user", user); // Testar
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/mainpage" component={MainPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route excat path="/register/complete/" component={RegisterComplete} />
        <Route path="/room/:roomID" component={Room} />
      </Switch>
    </>
  );
};

export default App;
