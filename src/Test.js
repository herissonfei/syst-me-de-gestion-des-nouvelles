import React from "react";
import style from "./test.module.scss";


export default function Test() {
  return (
    <div>
      Test
      <ul>
        <li className={style.item}>111</li>
        <li className={style.item}>222</li>
        <li>11</li>
      </ul>
    </div>
  );
}
