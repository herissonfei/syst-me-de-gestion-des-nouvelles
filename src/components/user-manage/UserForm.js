import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";
import { forwardRef, useState } from "react";

const UserForm = forwardRef((props, ref) => {
  // console.log(props.isUpdated);

  // console.log(props.optionSelect);
  let optionSelectList = props.optionSelect;
  let optionSelectRoleList = props.optionSelectRole;

  const { roleId, region } = JSON.parse(localStorage.getItem("token"));
  const roleObj = {
    1: "superadmin",
    2: "admin",
    3: "editor",
  };

  const checkRegionDisabled = (option) => {
    if (props.isUpdated) {
      if (roleObj[roleId] === "superadmin") {
        return false;
        // return false 不禁用地区的选择
      } else {
        return true;
      }
    } else {
      //添加用户时
      if (roleObj[roleId] === "superadmin") {
        return false;
        // return false 不禁用地区的选择
      } else {
        return option.value !== region;
      }
    }
  };

  const checkRoleDisabled = (option) => {
    if (props.isUpdated) {
      if (roleObj[roleId] === "superadmin") {
        return false;
        // return false 不禁用地区的选择
      } else {
        return true;
      }
    } else {
      //添加用户时
      if (roleObj[roleId] === "superadmin") {
        return false;
        // return false 不禁用地区的选择
      } else {
        return roleObj[option.value] !== "editor";
      }
    }
  };

  optionSelectList = optionSelectList?.map((option) => {
    return {
      value: option.value,
      label: option.label,
      disabled: checkRegionDisabled(option),
    };
  });

  optionSelectRoleList = optionSelectRoleList.map((option) => {
    return {
      value: option.value,
      label: option.label,
      disabled: checkRoleDisabled(option),
    };
  });

  const [isDisabled, setisDisabled] = useState(false);

  useEffect(() => {
    setisDisabled(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);

  return (
    <Form ref={ref} layout="vertical">
      <Form.Item
        name="username"
        label="Nom d'utilisateur"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Mot de passe"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="Region"
        rules={
          isDisabled
            ? []
            : [
                {
                  required: true,
                  message: "Please input the title of collection!",
                },
              ]
        }
      >
        <Select
          style={{
            width: 120,
          }}
          disabled={isDisabled}
          //   onChange={handleChange}
          options={optionSelectList}
        />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="Rôle"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Select
          style={{
            width: 120,
          }}
          onChange={(value) => {
            if (value === 1) {
              setisDisabled(true);
              ref.current.setFieldsValue({
                region: "",
              });
            } else {
              setisDisabled(false);
            }
          }}
          options={optionSelectRoleList}
        />
      </Form.Item>
    </Form>
  );
});

export default UserForm;
