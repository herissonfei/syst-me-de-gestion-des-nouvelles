import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Popover, Switch } from "antd";

import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { confirm } = Modal;
export default function RightList() {
  let [dataSource, setdataSource] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      // const list = res.data;
      res.data.forEach((item) => {
        if (item.children.length === 0) {
          item.children = "";
        }
      });
      setdataSource(res.data);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "Nom de l'autorisation",
      dataIndex: "label",
    },
    {
      title: "Chemin d'autorisation",
      dataIndex: "key",
      render: (key) => {
        return <Tag color="orange">{key}</Tag>;
      },
    },
    {
      title: "Fonctionnalité",

      render: (item) => {
        // console.log(item);
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            ></Button>
            <Popover
              content={
                <div style={{ textAlign: "center" }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => {
                      switchMethod(item);
                    }}
                  ></Switch>
                </div>
              }
              title="页面配置项"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              ></Button>
            </Popover>
          </div>
        );
      },
    },
  ];

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
    // 当前页面同步状态 + 后端同步

    if (item.grade === 1) {
      setdataSource(dataSource.filter((data) => data.id !== item.id));

      axios.delete(`/rights/${item.id}`);
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId);
      // console.log(list);
      list[0].children = list[0].children.filter((data) => data.id !== item.id);

      setdataSource([...dataSource]);
      axios.delete(`/children/${item.id}`);
    }
  };

  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setdataSource([...dataSource]);
    console.log(item);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
      console.log(item);
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
