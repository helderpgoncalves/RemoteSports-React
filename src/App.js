import React from "react";
//Importar os Routers
import { Switch, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Header from "./components/nav/Header";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
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
      </Switch>
    </>
    //Falta o Route para o video mas este tem que receber o id do utilizador etc
  );
};

export default App;
