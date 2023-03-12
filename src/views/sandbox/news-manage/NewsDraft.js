import React, { useState, useEffect } from "react";
import { Table, Button, Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;

export default function NewsDraft() {
  const [dataSource, setdataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        setdataSource(res.data);
      });
  }, [username]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
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
        return category.value;
      },
    },
    {
      title: "Fonctionnalité",

      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            ></Button>

            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/news-manage/update/${item.id}`);
                // console.log("1");
              }}
            ></Button>

            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => handleCheck(item.id)}
            ></Button>
          </div>
        );
      },
    },
  ];

  const handleCheck = (id) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
        navigate("/audit-manage/list");

        notification.info({
          message: `Notification`,
          description: `Vous pouvez consulter vos actualités dans ${"Liste d'audit"}`,
          placement: "bottomRight",
        });
      });
  };

  const confirmMethod = (item) => {
    confirm({
      title: "Voulez-vous supprimer ces éléments ?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  const deleteMethod = (item) => {
    // console.log(item);
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/news/${item.id}`);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
