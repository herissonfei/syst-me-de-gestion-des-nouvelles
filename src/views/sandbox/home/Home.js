import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Row, List, Avatar, Drawer } from "antd";
import * as Echarts from "echarts";
import _ from "lodash";

import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Meta } = Card;
export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setallList] = useState([]);
  const [visible, setvisible] = useState(false);
  const [pieChart, setpieChart] = useState(null);

  const barRef = useRef();
  const pieRef = useRef();

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      // console.log(res.data);
      // console.log(_.groupBy(res.data, (item) => item.category.value));

      renderBarView(_.groupBy(res.data, (item) => item.category.value));

      setallList(res.data);
    });
    // 组件销毁的时候
    return () => {
      window.onresize = null;
    };
    // console.log(barRef);
    // console.log(barRef.current);
  }, []);
  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6"
      )
      .then((res) => {
        setviewList(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6"
      )
      .then((res) => {
        // console.log(res.data)
        setstarList(res.data);
      });
  }, []);

  const renderBarView = (obj) => {
    var myChart = Echarts.init(barRef.current);
    // console.log(barRef.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "Carte de classement des actualités",
      },
      tooltip: {},
      legend: {
        data: ["Quantité"],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          // rotate: "45",
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "Quantité",
          type: "bar",
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      // console.log("resize")
      // 自适应
      myChart.resize();
    };
  };

  const renderPieView = (obj) => {
    //数据处理工作

    var currentList = allList.filter((item) => item.author === username);
    // _.groupBy(currentList, (item) => item.category.value);对数据进行分类
    var groupObj = _.groupBy(currentList, (item) => item.category.value);
    // console.log(groupObj);
    var list = [];
    for (let i in groupObj) {
      list.push({
        // 分类
        name: i,
        // 数量
        value: groupObj[i].length,
      });
    }
    // console.log(list);

    // pieRef.current这是装pieRef的那个div
    var myChart;
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current);
      setpieChart(myChart);
    } else {
      myChart = pieChart;
    }
    var option;

    option = {
      title: {
        text: "Catégories personnelles",
        left: "35%",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Quantité",
          type: "pie",
          radius: "50%",
          data: list,
          emphasis: {
            itemStyle: {
              // marginTop: 30,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);
  };

  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Les plus consultés par les utilisateurs" bordered={true}>
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.label}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Les plus aimés par les utilisateurs" bordered={false}>
            <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.label}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setvisible(true);
                  setTimeout(() => {
                    // init初始化
                    renderPieView();
                  }, 0);
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : "Mondial"}</b>
                  <span
                    style={{
                      paddingLeft: "30px",
                    }}
                  >
                    {roleName}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="600px"
        title="Catégorie de nouvelles personnelles"
        placement="right"
        closable={true}
        onClose={() => {
          setvisible(false);
        }}
        open={visible}
      >
        <div
          ref={pieRef}
          style={{
            width: "100%",
            height: "700px",
            marginTop: "30px",
          }}
        ></div>
      </Drawer>
      <div
        ref={barRef}
        style={{
          width: "90%",
          height: "400px",
          marginTop: "30px",
        }}
      ></div>
    </div>
  );
}
