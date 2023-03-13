import React, { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";

// import { Navigate } from "react-router-dom";
import Login from "../views/login/Login";
import Home from "../views/sandbox/home/Home";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import RightList from "../views/sandbox/right-manage/RightList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import UserList from "../views/sandbox/user-manage/UserList";
import NewsAdd from "../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import Published from "../views/sandbox/publish-manage/Published";
import Sunset from "../views/sandbox/publish-manage/Sunset";
import Nopermission from "../views/sandbox/nopermission/Nopermission";
import News from "../views/news/News";
import Detail from "../views/news/Detail";

import axios from "axios";
import NewsPreview from "../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate";

const LocalRouterMap = {
  "/home": <Home />,
  "/user-manage": <NewsSandBox />,
  "/right-manage": <NewsSandBox />,
  "/news-manage": <NewsSandBox />,
  "/audit-manage": <NewsSandBox />,
  "/publish-manage": <NewsSandBox />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <Sunset />,
};

export default function IndexRouter() {
  const [BackRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setBackRouteList(res.data);
    });
  }, []);

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

  const checkRoute = (route) => {
    return (
      LocalRouterMap[route.key] && (route.pagepermisson || route.routepermisson)
    );
  };

  const checkUserPermission = (route) => {
    return rights.includes(route.key);
  };

  // console.log(BackRouteList);

  const list = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/news",
      element: <News />,
    },
    {
      path: "/detail/:id",
      element: <Detail />,
    },
    {
      path: "/login",
      element: <Login />,
    },

    BackRouteList[0]?.pagepermisson
      ? {
          path: "/",
          element: <NewsSandBox />,
          children: [
            {
              path: "home",
              element: <Home />,
            },
          ],
        }
      : BackRouteList.length > 0 && {
          path: "*",
          element: <NewsSandBox />,
          children: [
            {
              path: "*",
              element: <Nopermission />,
            },
          ],
        },

    ...BackRouteList.map((route) =>
      checkRoute(route) && checkUserPermission(route)
        ? {
            path: route.key,
            element: LocalRouterMap[route.key],
            children: route.children.map((child) => ({
              path: child.key,
              element: LocalRouterMap[child.key],
            })),
          }
        : BackRouteList.length > 0 && {
            path: "*",
            element: <NewsSandBox />,
            children: [
              {
                path: "*",
                element: <Nopermission />,
              },
            ],
          }
    ),

    BackRouteList.length > 0 && {
      path: "*",
      element: <NewsSandBox />,
      children: [
        {
          path: "*",
          element: <Nopermission />,
        },
      ],
    },
  ];

  const routes = useRoutes(list);

  return routes;
}
