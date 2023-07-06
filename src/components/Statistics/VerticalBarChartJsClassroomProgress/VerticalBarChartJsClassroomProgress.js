import "./VerticalBarChartJsClassroomProgress.css";
import React from "react";
import { useEffect, useMemo } from "react";

import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Spin, Box } from "../../../core/components";

export default function VerticalBarChartJsClassroomProgress(props) {
  useEffect(() => {}, []);
  const {
    title = "ความก้าวหน้า",
    isTitleDisplay = false,
    datasets = {
      //backgroundColor: "#92c5dc",
      borderColor: "#225297",
    },
    items = [],
    labels = ["ห้องเรียน 1", "ห้องเรียน 2", "ห้องเรียน 3", "ห้องเรียน 4", "ห้องเรียน 5"],
    yText = "-- ความก้าวหน้า --",
    xText = "-- ห้องเรียน --",
    isLabelIcon = false,
    labelIconIndex = 0,
    suffix = "",
    yMax = 1000,
    yStepSize = 25,
    height = 150,
    //width = 300,
    loading = false,
  } = props;

  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        barThickness: 30,
        data: items,
        icons: ["\f19c"],
        backgroundColor: props.color,
        borderColor: datasets.borderColor,
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    responsive: false,
    scales: {
      y: {
        min: 0,
        max: yMax,
        ticks: {
          // forces step size to be 50 units
          stepSize: yStepSize,
          // Include a percen sign in the ticks
          callback: function (value, index, values) {
            return `${value?.toLocaleString()}${suffix}`;
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
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: isTitleDisplay,
        text: title,
        position: "top",
      },
      datalabels: {
        display: true,
        color: "red",
        align: "end",
        padding: {
          right: 2,
        },
        formatter: function (value, context) {
          if (context.dataIndex === labelIconIndex && isLabelIcon) {
            // return "insert-icon-here"; //context.dataset.icons[0];
          }

          return "";
        },
      },
    },
  };

  const barChart = useMemo(() => {
    const width = items.length <= 12 ? items.length * 160 : items.length * 100;
    return (
      <Bar
        data={data}
        options={options}
        plugins={[ChartDataLabels]}
        height={height}
        width={width}
      />
    );
  }, [data, options, height, items.length]);

  function getChart() {
    return (
      <>
        <div className="chart-container">{barChart}</div>
      </>
    );
  }

  return <Box>{loading ? /*<Spin></Spin>*/<div></div> : getChart()}</Box>;
}
