// Barra de Navegação Entre Paginas - Utilizou-se Ant Design Menu

import React, { useState } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  GithubOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu } = Menu; // Menu.SubMenu também de pode escrever isto

const Header = () => {
  //Atribuir algum valor
  const [current, setCurrent] = useState("home");

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  function gitHub() {
    window.open("https://github.com/helderpgoncalves/RemoteSports");
  }

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
      ></Menu.Item>
      <Menu.Item
        key="register"
        icon={<UserAddOutlined />}
        className="float-right"
      >
        <Link to="/register">Register</Link>
      </Menu.Item>

      <Menu.Item key="login" icon={<UserOutlined />} className="float-right">
        <Link to="/login">Login</Link>
      </Menu.Item>

      <SubMenu icon={<SettingOutlined />} title="Username">
        <Menu.Item key="setting:1">settings 1</Menu.Item>
        <Menu.Item key="setting:2">settings 2</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Header;
