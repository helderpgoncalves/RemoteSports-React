// Barra de Navegação Entre Paginas - Utilizou-se Ant Design Menu

import React, { useState } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  SettingOutlined
} from "@ant-design/icons";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";
import "./Header.css";

const { SubMenu } = Menu; // Menu.SubMenu também de pode escrever isto

const Header = () => {
  //Atribuir algum valor
  const [current, setCurrent] = useState("home");

  let dispatch = useDispatch();
  let { user } = useSelector((state) => ({ ...state }));

  let history = useHistory();

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => { //logout de utilizador
    auth.signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });

    history.push("/");
  };

  const goMainPage = () => {
    history.push("/mainpage");
  }

  return (
    <>
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        className="main-header"
        theme="dark"
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">RemoteSports</Link>
        </Menu.Item>

        {!user && (
          <Menu.Item
            key="register"
            icon={<UserAddOutlined />}
            className="float-right"
          >
            <Link to="/register">Register</Link>
          </Menu.Item>
        )}

        {!user && (
          <Menu.Item
            key="login"
            icon={<UserOutlined />}
            className="float-right"
          >
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}

        {user && (
          <SubMenu
            icon={<UserOutlined />}
            title={user.email && user.email.split("@")[0]}
            className="float-right"
            onTitleClick={goMainPage}
          >
            <Menu.Item icon={<SettingOutlined />}>
            <Link to="/settings">Profile Details</Link>
            </Menu.Item>
            <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Menu.Item>
          </SubMenu>
        )}
      </Menu>
    </>
  );
};

export default Header;
