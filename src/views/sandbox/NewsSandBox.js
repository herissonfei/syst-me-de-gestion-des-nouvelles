import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
// 加载功能
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// css
import "./NewsSandBox.css";

// antd
import { Layout } from "antd";
const { Content } = Layout;

export default function NewsSandBox() {
  // 上方的加载进度条
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
