import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal, Switch } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";
const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setdataSource] = useState([]);
  const [roleList, setroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  const [optionSelect, setoptionSelect] = useState([]);
  const [current, setcurrent] = useState(null);
  const [optionSelectRole, setoptionSelectRole] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false);
  const addForm = useRef(null);
  const updateForm = useRef(null);

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    axios.get("/regions").then((res) => {
      // console.log(res.data);

      setregionList(res.data);
      let optionList = res.data;
      optionList = optionList.map(function (option) {
        return { value: option.value, label: option.label };
      });
      setoptionSelect(optionList);
    });
  }, []);

  useEffect(() => {
    axios.get("/roles").then((res) => {
      // console.log(res.data);
      // console.log(res.data.filter((item) => item.id === 1)[0]);
      // console.log(res.data.filter((item) => item.id === 2)[0]);
      // console.log(res.data.filter((item) => item.id === 3)[0]);
      setroleList(res.data);
      let optionList = res.data;
      optionList = optionList.map(function (option) {
        return { value: option.id, label: option.roleName };
      });
      // console.log(optionList);
      setoptionSelectRole(optionList);
    });
  }, []);

  useEffect(() => {
    // console.log(roleId);

    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };
    // console.log(roleObj[roleId]);
    axios.get("/users?_expand=role").then((res) => {
      const list = res.data;
      // console.log(list);

      setdataSource(
        roleObj[roleId] === "superadmin"
          ? list
          : [
              ...list.filter((item) => item.username === username),
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
      title: "Region",
      dataIndex: "region",
      filters: [
        ...regionList.map((item) => ({
          text: item.label,
          value: item.value,
        })),
        {
          text: "Mondial",
          value: "Mondial",
        },
      ],
      onFilter: (value, item) => {
        if (value === "Mondial") {
          return item.region === "";
        }
        return item.region === value;
      },
      render: (region) => {
        return <b>{region === "" ? "Mondial" : region}</b>;
      },
    },
    {
      title: "Nom de rôle",
      dataIndex: "role",
      render: (role) => {
        return role?.roleName;
      },
    },
    {
      title: "Nom d'utilisateur",
      dataIndex: "username",
    },
    {
      title: "Statut de l'utilisateur",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChange(item)}
          ></Switch>
        );
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
              disabled={item.default}
            ></Button>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => handleUpdate(item)}
            ></Button>
          </div>
        );
      },
    },
  ];

  const confirmMethod = (item) => {
    confirm({
      title: "Voulez-vous supprimer ce utilisateur ?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        
      },
    });
  };

  const deleteMethod = (item) => {
    // console.log(item);
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/users/${item.id}`);
  };

  const handleChange = (item) => {
    // console.log(item);
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);

    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  const addFormOk = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        // console.log(value);
        setIsOpen(false);
        addForm.current.resetFields();
        axios
          .post(`/users`, {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            setdataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ]);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateFormOk = () => {
    updateForm.current.validateFields().then((value) => {
      // console.log(value);
      // console.log(current);
      setisUpdate(false);
      setdataSource(
        dataSource.map((item) => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter((item) => item.id === value.roleId)[0],
            };
          }
          return item;
        })
      );
      // 不加这行的话会影响到其他角色
      setisUpdateDisabled(!isUpdateDisabled);

      axios.patch(`/users/${current.id}`, value);
    });
  };

  const handleUpdate = (item) => {
    setisUpdate(true);

    setTimeout(() => {
      if (item.roleId === 1) {
        setisUpdateDisabled(true);
      } else {
        setisUpdateDisabled(false);
      }
      updateForm.current.setFieldsValue(item);
    }, 0);
    setcurrent(item);
  };
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Ajouter un utilisateur
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />

      <Modal
        open={isOpen}
        title="Ajouter un utilisateur"
        okText="Ajouter"
        cancelText="Annuler"
        onCancel={() => {
          setIsOpen(false);
        }}
        onOk={() => addFormOk()}
      >
        <UserForm
          optionSelect={optionSelect}
          optionSelectRole={optionSelectRole}
          ref={addForm}
        ></UserForm>
      </Modal>

      <Modal
        open={isUpdate}
        title="Mettre à jour l'utilisateur"
        okText="Mettre à jour"
        cancelText="Annuler"
        onCancel={() => {
          setisUpdate(false);
          // console.log(isUpdateDisabled);
          setisUpdateDisabled(!isUpdateDisabled);
        }}
        onOk={() => updateFormOk()}
      >
        <UserForm
          optionSelect={optionSelect}
          optionSelectRole={optionSelectRole}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
          isUpdated={true}
          // 这里传的isUpdated是用来判断是不是点击了更改按钮
        ></UserForm>
      </Modal>
    </div>
  );
}
