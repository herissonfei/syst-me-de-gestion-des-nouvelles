import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Tag, notification } from "antd";
import { useNavigate } from "react-router-dom";

export default function AuditList() {
  const [dataSource, setdataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then((res) => {
        // console.log(res.data);
        setdataSource(res.data);
      });
  }, [username]);

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
      title: "Statut d'audit",
      dataIndex: "auditState",
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"];
        const auditList = ["Brouillon", "À l'audit", "Passé", "Refusé"];
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: "Fonctionnalité",
      render: (item) => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button onClick={() => handleRervert(item)}>Révoquer</Button>
            )}
            {item.auditState === 2 && (
              <Button danger onClick={() => handlePublish(item)}>
                Publier
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                Mettre à jour
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleRervert = (item) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));

    axios
      .patch(`/news/${item.id}`, {
        auditState: 0,
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `您可以到草稿箱中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };

  const handleUpdate = (item) => {
    // props.history.push(`/news-manage/update/${item.id}`);
    navigate(`/news-manage/update/${item.id}`);
  };

  const handlePublish = (item) => {
    axios
      .patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        // props.history.push("/publish-manage/published");
        navigate("/publish-manage/published");

        notification.info({
          message: `Notification`,
          description: `Vous pouvez consulter vos actualités dans [Pub;ication/Publié]`,
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
