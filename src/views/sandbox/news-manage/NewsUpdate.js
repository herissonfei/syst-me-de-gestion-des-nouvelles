import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Comment } from "@ant-design/compatible";
import { PageHeader } from "@ant-design/pro-layout";
import {
  Steps,
  Button,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
// import { Button, Divider, notification, Space } from 'antd';
import axios from "axios";

import style from "./News.module.css";
import NewsEditor from "../../../components/news-manage/NewsEditor";

export default function NewsUpdate() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

  const [forInfo, setforInfo] = useState({});
  const [content, setcontent] = useState("");

  //   const User = JSON.parse(localStorage.getItem("token"));
  const NewsForm = useRef(null);
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          // console.log(res);
          // 储存表单的标题和分类
          setforInfo(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //   console.log(forInfo, content);
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  // 发布新闻，   以下时新闻的字段
  const navigate = useNavigate();
  // const [api] = notification.useNotification();
  const handleSave = (auditState) => {
    // console.log(forInfo);
    axios
      .patch(`./news/${id}`, {
        ...forInfo,
        content: content,
        auditState: auditState,
      })
      .then((res) => {
        navigate(auditState === 0 ? "/news-manage/draft" : "/news-manage/list");
        // 右下角弹出通知
        notification.info({
          message: `Notification`,
          description: `Vous pouvez consulter vos actualités dans ${
            auditState === 0 ? "Brouillon" : "Liste d'audit"
          }`,
          placement: "bottomRight",
        });
      });
  };

  useEffect(() => {
    axios.get("/categories").then((res) => {
      // categoryList
      let list = res.data;
      list = list.map((category) => {
        return { label: category.label, value: category.id };
      });
      // console.log(list);
      setCategoryList(list);
    });
  }, []);

  const { id } = useParams();
  useEffect(() => {
    axios.get(`/news/${id}?_expand=category&_expand=role`).then((res) => {
      let { title, categoryId, content } = res.data;
      //   把请求过来的title, categoryId的值，赋给表单里name等于title和categoryId的输入框
      NewsForm.current.setFieldsValue({
        title,
        categoryId,
      });
      setcontent(content);
    });
  }, [id]);

  return (
    <div>
      <PageHeader
        title="Mettre à jour les nouvelles"
        subTitle="This is a subtitle"
        onBack={() => window.history.back()}
      />
      <Comment />

      <Steps
        current={current}
        items={[
          {
            title: "Informations de base",
            description: "Titre,catégorie",
          },
          {
            title: "Contenu de l'actualité",
            description: "Contenu principal de l'actualité",
            // subTitle: "Left 00:00:08",
          },
          {
            title: "Soumission de nouvelles",
            description:
              "Enregistrer le brouillon ou le soumettre pour révision",
          },
        ]}
      />

      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 16,
            }}
            // ref用法表单的验证
            ref={NewsForm}
          >
            <Form.Item
              label="Titre"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Catégorie"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Select options={categoryList} />
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? "" : style.active}>
          <NewsEditor
            getContent={(value) => {
              // console.log(value);
              setcontent(value);
            }}
            content={content}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}></div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            {/* 传0 是草稿箱， 1 是审核列表 */}
            <Button type="primary" onClick={() => handleSave(0)}>
              Enregistrer les brouillons
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              Soumettre pour révision
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            Suivante
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>Précédent</Button>}
      </div>
    </div>
  );
}
