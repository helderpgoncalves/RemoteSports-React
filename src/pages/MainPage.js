import React from "react";
import { Button, List, Avatar } from "antd";
import { VideoCameraAddOutlined } from "@ant-design/icons";

const data = [
  {
    email: "helderpimentagoncalvesxc@gmail.com",
    description: "Aluno da ESTG-IPVC",
  },
  {
    email: "hegs@ipvc.pt",
    description: "Aluno da ESCE-IPVC",
  },
  {
    email: "localteste@ipvc.pt",
    description: "Aluno da ESE-IPVC",
  },
  {
    email: "helderhelder@ipvc.pt",
    description: "Aluno da ESA-IPVC",
  },
];

const MainPage = () => {

  return (
    <>
      <div className="container">
        <div>
          <h1 style={{}}>Start new Meeting?</h1>
          <Button
            type="primary"
            className="mb-1"
            shape="round"
            block
            icon={<VideoCameraAddOutlined />}
            size="large"
          >
            Start
          </Button>
        </div>
        <br />
        <div>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{item.email}</a>}
                  description={item.description}
                />
                <div>
                  <a href={item.email}>Mail</a>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default MainPage;
