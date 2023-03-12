import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, notification } from "antd";

export default function Audit() {
  const [dataSource, setdataSource] = useState([]);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };
    // auditState=1 正在审核中
    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      const list = res.data;
      setdataSource(
        roleObj[roleId] === "superadmin"
          ? list
          : [
              // 区域管理：自己
              ...list.filter((item) => item.author === username),
              // 同一个区域的编辑
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, [roleId, region, username]);

  const columns = [
    {
      title: "Titre",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "Auteur",
      dataIndex: "author",
    },
    {
      title: "Catégorie",
      dataIndex: "category",
      render: (category) => {
        return <div>{category.value}</div>;
      },
    },
    {
      title: "Fonctionnalité",
      render: (item) => {
        return (
          <div>
            <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>
              En publiant
            </Button>
            <Button danger onClick={() => handleAudit(item, 3, 0)}>
              Refuser
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAudit = (item, auditState, publishState) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));

    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `Vous pouvez accéder à [Audits/Liste d'audit] pour vérifier l'état d'audit de vos actualités`,
          placement: "bottomRight",
        });
      });
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
