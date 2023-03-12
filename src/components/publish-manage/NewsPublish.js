import React from "react";
import { Table } from "antd";

export default function NewsPublish(props) {
  //   console.log(props.dataSource);
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
        return <div>{props.button(item.id)}</div>;
      },
    },
  ];

  return (
    <div>
      <Table
        dataSource={props.dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
