// Barra de Navegação Entre Paginas - Utilizou-se Ant Design Menu

import React, { useState } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  GithubOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import firebase from "firebase";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";

const { SubMenu } = Menu; // Menu.SubMenu também de pode escrever isto

const Header = () => {
  //Atribuir algum valor
  const [current, setCurrent] = useState("home");

  let dispatch = useDispatch();
  let history = useHistory();

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  function gitHub() {
    window.open("https://github.com/helderpgoncalves/RemoteSports");
  }



  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });

    history.push("/login");
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">RemoteSports</Link>
      </Menu.Item>
      <Menu.Item
        key="github"
        icon={<GithubOutlined />}
        className="float-right"
        onClick={gitHub}
      >
        Github
      </Menu.Item>
      <SubMenu key="login" icon={<UserOutlined />} title="User">
        <Menu.Item key="register" icon={<UserAddOutlined />}>
          <Link to="/register">Register</Link>
        </Menu.Item>

        <Menu.Item key="login" icon={<UserOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
          Logout
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Header;
