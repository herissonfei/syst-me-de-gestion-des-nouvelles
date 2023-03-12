import React from "react";
import { Layout, Dropdown, Space, Avatar } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./TopHeader.css";
const { Header } = Layout;

export default function TopHeader() {
  // const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  let token;
  if (!JSON.parse(localStorage.getItem("token"))) {
    token = {
      id: 1,
      username: "admin",
      password: 123456,
      roleState: true,
      default: true,
      region: "",
      roleId: 1,
      role: {
        id: 1,
        roleName: "super administrateur",
        roleType: 1,
        rights: [
          "/user-manage/add",
          "/user-manage/delete",
          "/user-manage/update",
          "/user-manage/list",
          "/right-manage",
          "/right-manage/role/list",
          "/right-manage/right/list",
          "/right-manage/role/update",
          "/right-manage/role/delete",
          "/right-manage/right/update",
          "/right-manage/right/delete",
          "/news-manage",
          "/news-manage/list",
          "/news-manage/add",
          "/news-manage/update/:id",
          "/news-manage/preview/:id",
          "/news-manage/draft",
          "/news-manage/category",
          "/audit-manage",
          "/audit-manage/audit",
          "/audit-manage/list",
          "/publish-manage",
          "/publish-manage/unpublished",
          "/publish-manage/published",
          "/publish-manage/sunset",
          "/user-manage",
          "/home",
        ],
      },
    };
  }
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"))
    ? JSON.parse(localStorage.getItem("token"))
    : token;
  // let roleName, username;
  // console.log(roleName);
  const onClick = () => {
    // message.info(`Click on item ${key}`);
    // console.log(key);
    // ---------------------------------------------------------这里看下之后需不需要改
    localStorage.removeItem("token");

    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: roleName,
    },
    {
      key: "2",
      danger: true,
      label: "se déconnecter",
    },
  ];
  return (
    <Header
      style={{
        padding: "0 24px",
        // marginLeft: 50
        // background: colorBgContainer,
      }}
    >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => setCollapsed(!collapsed),
      })} */}
      {/* {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} */}
      <div className="profil">
        <Dropdown
          menu={{
            items,
            onClick,
          }}
        >
          <a
            href="https://www.google.ca/?msclkid=68948fc1b06b11ec9dd1a4c3e4c809d4"
            onClick={(e) => e.preventDefault()}
          >
            <Space>
              Welcome<span className="uname">{username}</span>
              <Avatar size="large" icon={<UserOutlined />} />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}
