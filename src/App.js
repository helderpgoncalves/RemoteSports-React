import React, { useEffect } from "react";

//Importar os Routers
import { Switch, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Header from "./components/nav/Header";
import RegisterComplete from "./pages/auth/RegisterComplete";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "./firebase";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();

  // Para receber o state do firebase auth

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        console.log("user", user); // Testar
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          }
        });
      }
    });
    return () => unsubscribe();
  }, [])

  return (
    //Necessitamos de retornar os componentes
    //Para isso utiliza-se o switch

    //Necesasario este fragmento <> para colocar dois componentes
    //É tipo uma <div>
    <>
      <Header />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route excat path="/register/complete/" component={RegisterComplete} />
      </Switch>
    </>
    //Falta o Route para o video mas este tem que receber o id do utilizador etc
  );
};

export default App;
