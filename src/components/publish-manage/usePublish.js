import { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";

// 自定义的hooks
function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem("token"));

  const [dataSource, setdataSource] = useState([]);
  useEffect(() => {
    // news中， 作者是当前用户
    axios(
      `/news?author=${username}&publishState=${type}&_expand=category`
    ).then((res) => {
      // 因为数据库的字段名不匹配，所以加了map遍历更改
      res.data = res.data.map((item) => {
        if (!item.title) {
          item.title = item?.label;
        }
        return item;
      });

      setdataSource(res.data);
    });
  }, [username, type]);

  const handlePublish = (id) => {
    setdataSource(dataSource.filter((item) => item.id !== id));

    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `Vous pouvez consulter vos actualités dans [Publication/Publié]`,
          placement: "bottomRight",
        });
      });
  };

  const handleSunset = (id) => {
    setdataSource(dataSource.filter((item) => item.id !== id));

    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then((res) => {
        notification.info({
          message: `Notification`,
          description: `Vous pouvez consulter vos actualités dans [Publication/A été retiré]`,
          placement: "bottomRight",
        });
      });
  };

  const handleDelete = (id) => {
    setdataSource(dataSource.filter((item) => item.id !== id));

    axios.delete(`/news/${id}`).then((res) => {
      notification.info({
        message: `Notification`,
        description: `Vous avez supprimé les actualités hors ligne`,
        placement: "bottomRight",
      });
    });
  };

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
}

export default usePublish;
