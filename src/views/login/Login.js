import React from "react";
import { Form, Button, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
// import Particles from "react-tsparticles";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // console.log("Received values of form: ", values);
    axios
      .get(
        `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.length === 0) {
          message.error("用户密码不匹配");
          // message来自antd
        } else {
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          navigate("/");
        }
      });
  };

  return (
    <div className="login">
      {/* <Particles />  */}
      <div className="formContainer">
        <div className="logintitle">Système de gestion de nouvelle</div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Se connecter
            </Button>
            {/* Or <a href="#">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
