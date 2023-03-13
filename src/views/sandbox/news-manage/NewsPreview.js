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

  const auditList = ["Pas révisé", "À l'audit", "Passé", "Refusé"];
  const publishList = [
    "Inédit",
    "En attente d'être libéré",
    "En ligne",
    "Hors ligne",
  ];

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
            <Descriptions.Item label="Auteur">
              {newsInfo.author}
            </Descriptions.Item>
            <Descriptions.Item label="temps de creation">
              {/* 时间 */}
              {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="temps de publication">
              {newsInfo.publishTime
                ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Region">
              {newsInfo.region}
            </Descriptions.Item>
            <Descriptions.Item label="Statut d'audit">
              <span style={{ color: colorList[newsInfo.auditState] }}>
                {auditList[newsInfo.auditState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Statut de la publication">
              <span style={{ color: colorList[newsInfo.publishState] }}>
                {publishList[newsInfo.publishState]}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Nombre de visites">
              {newsInfo.view}
            </Descriptions.Item>
            <Descriptions.Item label="Nombre d'aimer">
              {newsInfo.star}
            </Descriptions.Item>
            <Descriptions.Item label="Nombre de commentaires">
              0
            </Descriptions.Item>
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
