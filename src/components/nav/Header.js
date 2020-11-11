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

const { SubMenu } = Menu; // Menu.SubMenu também de pode escrever isto

const Header = () => {
  //Atribuir algum valor
  const [current, setCurrent] = useState("home");

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  function gitHub() {
    window.open('http://www.github.com')
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        RemoteSports
      </Menu.Item>

      <Menu.Item key="github" icon={<GithubOutlined />} className="float-right" onClick={gitHub}>
        Source Code 
      </Menu.Item>
      <Menu.Item
        key="register"
        icon={<UserAddOutlined />}
        className="float-right"
      >
        Register
      </Menu.Item>

      <Menu.Item key="login" icon={<UserOutlined />} className="float-right">
        Login
      </Menu.Item>

      <SubMenu icon={<SettingOutlined />} title="Username">
        <Menu.Item key="setting:1">settings 1</Menu.Item>
        <Menu.Item key="setting:2">settings 2</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Header;
