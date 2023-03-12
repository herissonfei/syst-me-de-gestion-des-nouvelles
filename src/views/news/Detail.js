import React, { useEffect, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { useParams } from "react-router-dom";
import { Descriptions } from "antd";
import moment from "moment";

import axios from "axios";
import { HeartTwoTone } from "@ant-design/icons";

export default function Detail(props) {
  const [newsInfo, setnewsInfo] = useState(null);

  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`/news/${id}?_expand=category&_expand=role`)
      .then((res) => {
        // console.log(res.data);
        setnewsInfo({
          // 先把对象展开，然后更改view这个属性（会把之前的覆盖掉）
          ...res.data,
          view: res.data.view + 1,
        });

        //同步后端
        return res.data;
      })
      .then((res) => {
        axios.patch(`/news/${id}`, {
          view: res.view + 1,
        });
      });
  }, [id]);
  const handleStar = () => {
    setnewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1,
    });

    axios.patch(`/news/${id}`, {
      star: newsInfo.star + 1,
    });
  };
  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader
            title={newsInfo.title}
            subTitle={
              <div>
                {newsInfo.category.value}
                <HeartTwoTone
                  twoToneColor="#eb2f96"
                  onClick={() => handleStar()}
                />
              </div>
            }
            onBack={() => window.history.back()}
          />
          <Descriptions>
            <Descriptions.Item label="创建者">
              {newsInfo.author}
            </Descriptions.Item>

            <Descriptions.Item label="发布时间">
              {newsInfo.publishTime
                ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="区域">
              {newsInfo.region}
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
