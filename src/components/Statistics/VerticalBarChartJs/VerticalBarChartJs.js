import "./VerticalBarChartJs.css";
import React from "react";
import { useEffect, useMemo } from "react";

import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Spin, Box } from "../../../core/components";

export default function VerticalBarChartJs(props) {
  useEffect(() => {}, []);

  const {
    title = "ภาพรวมสถิติของโรงเรียนในจังหวัดสุราษฎร์ธานี",
    isTitleDisplay = false,
    datasets = {
      backgroundColor: "#92c5dc",
      borderColor: "#225297",
    },
    items = [],
    labels = ["อ.ชัยบุรี", "อ.เวียงสระ", "อ.พนม", "อ.พระแสง", "อ.เคียนชา"],
    yText = "-- คะแนนเฉลี่ย --",
    xText = "-- อำเภอ --",
    isLabelIcon = false,
    labelIconIndex = 0,
    suffix = "%",
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

  return <Box>{loading ? <Spin></Spin> : getChart()}</Box>;
}
