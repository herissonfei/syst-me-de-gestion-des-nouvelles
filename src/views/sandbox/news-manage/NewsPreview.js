import React, { useEffect, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { useParams } from "react-router-dom";
import { Descriptions } from "antd";
import moment from "moment";

import axios from "axios";

export default function NewsPreview(props) {
  const [newsInfo, setnewsInfo] = useState(null);

  const { id } = useParams();
  useEffect(() => {
    axios.get(`/news/${id}?_expand=category&_expand=role`).then((res) => {
      setnewsInfo(res.data);
    });
  }, [id]);

  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];

  const colorList = ["black", "orange", "green", "red"];
  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader
            title={newsInfo.title}
            subTitle={newsInfo.category.value}
            onBack={() => window.history.back()}
          />
          <Descriptions>
            <Descriptions.Item label="创建者">
              {newsInfo.author}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {/* 时间 */}
              {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {newsInfo.publishTime
                ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="区域">
              {newsInfo.region}
            </Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <span style={{ color: colorList[newsInfo.auditState] }}>
                {auditList[newsInfo.auditState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="发布状态">
              <span style={{ color: colorList[newsInfo.publishState] }}>
                {publishList[newsInfo.publishState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="访问数量">
              {newsInfo.view}
            </Descriptions.Item>
            <Descriptions.Item label="点赞数量">
              {newsInfo.star}
            </Descriptions.Item>
            <Descriptions.Item label="评论数量">0</Descriptions.Item>
          </Descriptions>

          <div
            dangerouslySetInnerHTML={{
              __html: newsInfo.content,
            }}
            style={{
              padding: "0 10px",
              border: "1px solid gray",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
