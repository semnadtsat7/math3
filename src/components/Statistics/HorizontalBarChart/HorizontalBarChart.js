import "./HorizontalBarChart.css";
import React from "react";
import { useEffect, useMemo } from "react";

import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Spin, Box } from "../../../core/components";

import { Empty } from "antd";

export default function HorizontalBarChart(props) {
  useEffect(() => {}, []);

  const {
    title = "ความก้าวหน้าของแต่ละบทเรียน",
    isTitleDisplay = false,
    datasets = {
      backgroundColor: "#92c5dc",
      borderColor: "#225297",
    },
    items = [],
    labels = [
      "บทเรียนที่1",
      "บทเรียนที่2",
      "บทเรียนที่3",
      "บทเรียนที่4",
      "บทเรียนที่5",
    ],
    yText = "-- บทเรียน --",
    xText = "-- % ส่งแล้ว  --",
    isLabelIcon = false,
    labelIconIndex = 0,
    suffix = "",
    xMax = 100,
    xStepSize = 25,
    height = 150,
    // width = 300,
    loading = false,
  } = props;

  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        barThickness: 20,
        data: items,
        icons: ["\f19c"],
        backgroundColor: datasets.backgroundColor,
        borderColor: datasets.borderColor,
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: false,
    scales: {
      x: {
        min: 0,
        max: xMax,
        ticks: {
          // forces step size to be 50 units
          stepSize: xStepSize,
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
    const width = items.length <= 12 ? items.length * 80 : items.length * 50;
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

  function getLoading() {
    return (
      <>
        {/* <Spin></Spin> */}
        <div className="chart-container">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        </div>
      </>
    );
  }

  return <Box>{loading ? getLoading() : getChart()}</Box>;
}
