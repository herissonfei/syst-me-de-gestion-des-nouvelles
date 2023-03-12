import React, { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { Card, Col, Row, List } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { Comment } from "@ant-design/compatible";

export default function News() {
  const [list, setlist] = useState([]);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      // console.log(res.data);
      // console.log(_.groupBy(res.data, (item) => item.category.value));
      console.log(
        Object.entries(_.groupBy(res.data, (item) => item.category.value))
      );
      setlist(
        // Object.entries 转化为2唯数组
        Object.entries(_.groupBy(res.data, (item) => item.category.value))
      );
    });
  }, []);

  return (
    <div
      style={{
        width: "95%",
        margin: "0 auto",
      }}
    >
      <PageHeader title="Nouvelles Mondiales" subTitle="Voir les nouvelles" />
      <Comment />
      <Row gutter={[16, 16]}>
        {list.map((item) => (
          <Col span={8} key={item[0]}>
            <Card title={item[0]} bordered={true} hoverable={true}>
              <List
                size="small"
                bordered
                dataSource={item[1]}
                renderItem={(data) => (
                  <List.Item>
                    <a href={`#/detail/${data.id}`}>{data.label}</a>
                  </List.Item>
                )}
                pagination={{
                  pageSize: 3,
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
