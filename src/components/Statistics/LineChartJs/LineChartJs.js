import React, { useEffect } from "react";

import { Line } from "react-chartjs-2";

export default function LineChartJs(props) {
  useEffect(() => {}, []);
  const {
    title,
    yText = "-- ชั่วโมงการใช้งาน --",
    xText = "-- วันที่ --",
    suffix = " ชั่วโมง",
    datasets = [
      {
        label: title,
        data: [1.2, 3.2, 1.8, 2.2, 4.7, 1.3, 3.6],
        borderColor: "#416aa0",
        backgroundColor: "#416aa0",
      },
    ],
    height = 150,
  } = props;

  const data = {
    labels: [
      "2/2 2563",
      "3/2 2563",
      "4/2 2563",
      "5/2 2563",
      "6/2 2563",
      "7/2 2563",
      "8/2 2563",
    ],
    datasets: datasets,
  };

  const options = {
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          // forces step size to be 50 units
          stepSize: 2,
          // Include a percen sign in the ticks
          callback: function (value, index, values) {
            return `${value}${suffix}`;
          },
        },
        title: {
          color: "red",
          display: true,
          text: yText,
        },
      },
      x: {
        title: {
          color: "red",
          display: true,
          text: xText,
        },
        grid: {
          offset: true,
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: title,
      },
    },
  };

  return <Line data={data} options={options} height={height} />;
}
