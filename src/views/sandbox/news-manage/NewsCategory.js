import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, Table, Modal, Form, Input } from "antd";
import axios from "axios";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export default function NewsCategory() {
  const [dataSource, setdataSource] = useState([]);

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setdataSource(res.data);
    });
  }, []);

  const handleSave = (record) => {
    console.log(record);
    setdataSource(
      dataSource.map((item) => {
        if (item.id === record.id) {
          return {
            id: item.id,
            label: record.value,
            value: record.value,
          };
        }
        return item;
      })
    );

    axios.patch(`/categories/${record.id}`, {
      label: record.value,
      value: record.value,
    });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "Nom de rubrique",
      dataIndex: "value",
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "value",
        title: "Nom de rubrique",
        handleSave: handleSave,
      }),
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
            />
          </div>
        );
      },
    },
  ];

  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除?",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        deleteMethod(item);
      },
      onCancel() {},
    });
  };

  //删除
  const deleteMethod = (item) => {
    // console.log(item)
    // 当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/categories/${item.id}`);
  };

  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        {/* 用作跨级通信的Context对象，一个供应商 */}
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
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
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
      />
    </div>
  );
}
