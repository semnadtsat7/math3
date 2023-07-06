import "./VerticalBarChartJsTeacherProfile.css";
import React from "react";
import { useEffect, useMemo } from "react";

import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Spin, Box } from "../../../core/components";

import { Empty } from "antd";

export default function VerticalBarChartJsTeacherProfile(props) {
  useEffect(() => {}, []);

  const {
    title = "ภาพรวมการบ้านทั้งหมด",
    isTitleDisplay = false,
    datasets = {
      backgroundColor: "#92c5dc",
      borderColor: "#225297",
    },
    items = [],
    labels = ["การบ้านครั้งที่ 1", "การบ้านครั้งที่ 2", "การบ้านครั้งที่ 3", "การบ้านครั้งที่ 4", "การบ้านครั้งที่ 5"],
    yText = "-- จำนวนคนที่ส่งแล้ว --",
    xText = "-- การบ้าน --",
    isLabelIcon = false,
    labelIconIndex = 0,
    suffix = "คน",
    yMax = 100,
    yStepSize = 25,
    height = 150,
    // width = 300,
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
        backgroundColor: datasets.backgroundColor,
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
    elements: {
      point: {
        //radius: 3,
        hitRadius: 10,
        pointStyle: "rect",
        hoverRadius: 10,
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
        <div>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        </div>
      </>
    );
  }

  return <Box>{loading ? /*<Spin></Spin>*/ getLoading() : getChart()}</Box>;
}
