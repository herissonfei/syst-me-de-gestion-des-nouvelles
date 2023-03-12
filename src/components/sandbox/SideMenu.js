import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  UserOutlined,
  PieChartOutlined,
  TeamOutlined,
  DesktopOutlined,
  AuditOutlined,
  DeleteFilled,
  WarningFilled,
  FundFilled,
} from "@ant-design/icons";

import "./index.css";

const { Sider } = Layout;
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
  role: { rights },
} = JSON.parse(localStorage.getItem("token"))
  ? JSON.parse(localStorage.getItem("token"))
  : token;
// let rights = null;
// console.log(rights);
const checkPagePermissions = (item) => {
  // console.log(item);
  // console.log(item.key);
  return item.pagepermisson === 1 && rights.includes(item.key);
};

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <TeamOutlined />,
  "/user-manage/list": <TeamOutlined />,
  "/right-manage": <PieChartOutlined />,
  "/right-manage/role/list": <PieChartOutlined />,
  "/right-manage/right/list": <PieChartOutlined />,
  "/news-manage/add": <DesktopOutlined />,
  "/news-manage": <DesktopOutlined />,
  "/news-manage/draft": <DesktopOutlined />,
  "/news-manage/category": <DesktopOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/audit-manage/audit": <AuditOutlined />,
  "/audit-manage/list": <AuditOutlined />,
  "/publish-manage": <AuditOutlined />,
  "/publish-manage/unpublished": <WarningFilled />,
  "/publish-manage/published": <FundFilled />,
  "/publish-manage/sunset": <DeleteFilled />,
};

export default function SideMenu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      res.data.forEach(function (item) {
        if (item.children.length === 0) {
          delete item.children;
        }
        item["icon"] = iconList[item.key];
        if (item.children) {
          item.children.forEach(function (child) {
            delete child.rightId;
          });
          item.children = item.children.filter(function (item) {
            item["icon"] = iconList[item.key];
            return checkPagePermissions(item);
          });
        }
      });
      // 把pagepermission == 0 的第一级去掉
      let listMenu = res.data.filter(function (item) {
        return checkPagePermissions(item);
      });
      // console.log(listMenu);
      setMenu(listMenu);
    });
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // const history = useHistory();
  let location = useLocation().pathname;

  const openKeys = ["/" + location.split("/")[1]];
  // console.log(openKeys);
  // console.log(menu);
  return (
    <Sider
      width={276}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="logo">Système de nouvelle</div>

      <Menu
        theme="dark"
        selectedKeys={location}
        defaultOpenKeys={openKeys}
        mode="inline"
        items={menu}
        onClick={(e) => {
          navigate(e.key, {
            replace: false,
          });
        }}
      />
    </Sider>
  );
}
