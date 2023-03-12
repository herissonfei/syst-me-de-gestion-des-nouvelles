import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Tree } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalOpen, setisModalOpen] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "Nom de rôle",
      dataIndex: "roleName",
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
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                // console.log(item);
                setisModalOpen(true);
                // console.log(item.rights);
                setCurrentRights(item.rights);
                setCurrentId(item.id);
              }}
            ></Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    axios.get("/roles").then((res) => {
      // console.log(res.data);

      setDataSource(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      // Tree组件需要title属性，所以给数据中添加一个和label的值一样的title属性
      res.data.forEach((item) => {
        item.title = item.label;
        item.children.forEach((child) => {
          child.title = child.label;
        });
      });
      setRightList(res.data);
    });
  }, []);

  const confirmMethod = (item) => {
    confirm({
      title: "Voulez-vous supprimer ces éléments ?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        
      },
    });
  };

  const deleteMethod = (item) => {
    console.log(item);
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`);
  };

  const handleOk = () => {
    // console.log(currentRights);
    setisModalOpen(false);

    setDataSource(
      dataSource.map((item) => {
        // console.log(item);
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights,
          };
        }

        return item;
      })
    );

    axios.patch(`/roles/${currentId}`, {
      rights: currentRights,
    });
  };

  const handleCancel = () => {
    setisModalOpen(false);
  };

  const onCheck = (checkedKeys) => {
    // console.log(checkedKeys);
    setCurrentRights(checkedKeys.checked);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      ></Table>

      <Modal
        title="Attribution d'autorité"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}
