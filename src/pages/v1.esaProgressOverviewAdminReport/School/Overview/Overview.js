import classes from "./Overview.module.css";

import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Spin,
  Col,
  Row,
  Card,
  Box,
  Menu,
  Tabs,
} from "../../../../core/components";

import JsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  CardWithTitleNoIcon,
  DropdownFormNoTitle,
  VerticalBarChartJsInspectDistrictProgress,
  VerticalBarChartJsEsaProgress,
  VerticalBarChartJsSchoolProgress,
  VerticalBarChartJsClassroomProgress,
} from "../../../../components/Statistics";

import { DatePicker, message, Button } from "antd";

import { VscGraphLine } from "react-icons/vsc";

import ProgressCard from "./ProgressCard";
import TeacherCard from "./TeacherCard";

import Parent from "../../../../components/Parent";
import Header from "../../../students.ts.v1/Header";

import {
  SchoolService,
  ProgressReportService,
} from "../../../../services/Statistics";

import ReactHTMLTableToExcel from "react-html-table-to-excel";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// ReactHTMLTableToExcel.format = (s, c) => {
//   if (c && c['table']) {
//     const html = c.table;
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');
//     const rows = doc.querySelectorAll('tr');

//     for (const row of rows) row.removeChild(row.firstChild);

//     c.table = doc.querySelector('table').outerHTML;
//   }

//   return s.replace(/{(\w+)}/g, (m, p) => c[p]);
// };

//html2canvas = allows you to take "screenshots" of webpages or parts of it, directly on the users browser

// jspdf = pdf generator
// cannot convert svg images
//'report' is the component wrapping div tag id.
//So here I’m exporting the every content inside this div tag as a PDF document.
//PDF file orientation — default is portrait
//Units (px/pt/mm..) — default is mm
//PDF file size(A4/A2/A3..) — default is A4
// const generatePDF = () => {
//   const report = new JsPDF('portrait','pt','a4');
//   report.html(document.querySelector('#report')).then(() => {
//       report.save('report.pdf');
//   });
// }

export default function PageESAProgressOverviewAdminReport() {
  const parent = useRef(Parent);

  //JsPDF to save code as PDF file
  //html2canvas to convert SVG images into readable format
  const generatePDF = () => {
    const fileName = `รายงานความก้าวหน้า ${districtInspectorStartTime} - ${districtInspectorEndTime}.pdf`;
    const pdf = new JsPDF({
      //orientation: 'portrait',
      orientation: "landscape",
      //unit: "mm",
      //format: "a0",
      unit: "px",
      format: "a1",
      //putOnlyUsedFonts: true,
    });

    const convertElements = document.querySelectorAll("#printTarget");
    const elements = Array.from(convertElements); //as HTMLElement[];

    if (elements.length > 0) {
      Promise.all(
        elements.map(async (element) => {
          const canvas = await html2canvas(element);
          element.replaceWith(canvas);
        })
      ).then(() => {
        pdf.html(document.body, {
          callback: (generatedPdf) => {
            generatedPdf.save(fileName);
          },
        });
      });
    } else {
      pdf.html(document.body, {
        callback: (generatedPdf) => {
          generatedPdf.save(fileName);
        },
      });
    }
  };

  //config antd message distance from top
  message.config({
    top: 100,
    duration: 5,
    maxCount: 3,
  });

  //position ของ user ที่ login (eg. S-1)
  const [position, setPosition] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    setPosition(window.localStorage.getItem("positions"));
  }, []);

  //สังกัด ของ user ที่ login (rh. กรุงเทพมหานคร)
  const [affiliation, setAffiliation] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    setAffiliation(window.localStorage.getItem("affiliationName"));
  }, []);

  //data รายงานความก้าวหน้าแบ่งตามเขตตรวจ, ข้อมูลความก้าวหน้าทั้งหมด getProgessReportAsync
  const [dataDistrictInspector, setDataDistrictInspector] = useState({
    loading: true,
    data: {},
  });

  //data เขตตรวจ
  const [chosenDistrictInspectorData, setChosenDistrictInspectorData] =
    useState({
      loading: true,
      data: {},
    });

  //data เขตพื้นที่
  const [chosenESAData, setChosenESAData] = useState({
    loading: true,
    data: {},
  });
  //data เขตพื้นที่(report)
  const [chosenESADataZ, setChosenESADataZ] = useState({
    loading: true,
    data: {},
  });

  //data เขตพื้นที่ (ข้อมูลระดับเขตพื้นที่การศึกษา ของ R-2 ใช้เพื่อกำหนด chosenSchoolData3) getSchoolsInfoByESAAsync
  const [chosenESAData2, setChosenESAData2] = useState({
    loading: true,
    data: {},
  });

  //data โรงเรียน
  const [chosenSchoolData, setChosenSchoolData] = useState({
    loading: true,
    data: {},
  });

  //data โรงเรียน (ข้อมูลโรงเรียน ของ S-1..4 R-3, R-5 ใช้แทน chosenSchoolData) getSchoolInfoBySchoolIdAsync
  const [chosenSchoolData2, setChosenSchoolData2] = useState({
    loading: true,
    data: {},
  });

  //data โรงเรียน (ข้อมูลโรงเรียน ของ R-2 ใช้แทน chosenSchoolData)
  const [chosenSchoolData3, setChosenSchoolData3] = useState({
    loading: true,
    data: {},
  });

  // data ห้องเรียน
  const [chosenClassroomData, setChosenClassroomData] = useState({
    loading: true,
    data: {},
  });

  //เปลี่ยนสี background ของbutton ขึ้นกับ percentage ของคะแนนเขตพื้นที่ในเขตตรวจ
  const getDistrictInspectorButtonBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item.percentage === 0) {
      color = "grey";
    } else if (item.percentage >= 1 && item.percentage < 20) {
      color = "#C22E1A";
    } else if (item.percentage >= 20 && item.percentage < 40) {
      color = "#D26C0D";
    } else if (item.percentage >= 40 && item.percentage < 60) {
      color = "#EFB622";
    } else if (item.percentage >= 60 && item.percentage < 80) {
      color = "#AEB024";
    } else if (item.percentage >= 80) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbutton ขึ้นกับ percentage ของคะแนนโรงเรียนในเขตพื้นที่
  const getESAButtonBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.percentage === 0) {
      color = "grey";
    } else if (item.percentage >= 1 && item.percentage < 20) {
      color = "#C22E1A";
    } else if (item.percentage >= 20 && item.percentage < 40) {
      color = "#D26C0D";
    } else if (item.percentage >= 40 && item.percentage < 60) {
      color = "#EFB622";
    } else if (item.percentage >= 60 && item.percentage < 80) {
      color = "#AEB024";
    } else if (item.percentage >= 80) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbutton ขึ้นกับ percentage ของคะแนนห้องเรียนในโรงเรียน
  const getSchoolButtonBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.percentage === 0) {
      color = "grey";
    } else if (item.percentage >= 1 && item.percentage < 20) {
      color = "#C22E1A";
    } else if (item.percentage >= 20 && item.percentage < 40) {
      color = "#D26C0D";
    } else if (item.percentage >= 40 && item.percentage < 60) {
      color = "#EFB622";
    } else if (item.percentage >= 60 && item.percentage < 80) {
      color = "#AEB024";
    } else if (item.percentage >= 80) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนโรงเรียนในเขตตรวจ
  const getDistrictInspectorBarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.progess === 0) {
      color = "grey";
    } else if (item.progess >= 1 && item.progess < 50) {
      color = "#C22E1A";
    } else if (item.progess >= 50 && item.progess < 100) {
      color = "#D26C0D";
    } else if (item.progess >= 100 && item.progess < 150) {
      color = "#EFB622";
    } else if (item.progess >= 150 && item.progess < 200) {
      color = "#AEB024";
    } else if (item.progess >= 200) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนเขตพื้นที่
  const getESABarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.averageProgess === 0) {
      color = "grey";
    } else if (item.averageProgess >= 1 && item.averageProgess < 50) {
      color = "#C22E1A";
    } else if (item.averageProgess >= 50 && item.averageProgess < 100) {
      color = "#D26C0D";
    } else if (item.averageProgess >= 100 && item.averageProgess < 150) {
      color = "#EFB622";
    } else if (item.averageProgess >= 150 && item.averageProgess < 200) {
      color = "#AEB024";
    } else if (item.averageProgess >= 200) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนห้องเรียนในโรงเรียน
  const getSchoolBarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.averageProgess === 0) {
      color = "grey";
    } else if (item.averageProgess >= 1 && item.averageProgess < 50) {
      color = "#C22E1A";
    } else if (item.averageProgess >= 50 && item.averageProgess < 100) {
      color = "#D26C0D";
    } else if (item.averageProgess >= 100 && item.averageProgess < 150) {
      color = "#EFB622";
    } else if (item.averageProgess >= 150 && item.averageProgess < 200) {
      color = "#AEB024";
    } else if (item.averageProgess >= 200) {
      color = "#7D9C54";
    }
    return color;
  };

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนห้องเรียนในtabข้อมูลห้องเรียน
  const getClassroomBarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item?.progess === 0) {
      color = "grey";
    } else if (item.progess >= 1 && item.progess < 50) {
      color = "#C22E1A";
    } else if (item.progess >= 50 && item.progess < 100) {
      color = "#D26C0D";
    } else if (item.progess >= 100 && item.progess < 150) {
      color = "#EFB622";
    } else if (item.progess >= 150 && item.progess < 200) {
      color = "#AEB024";
    } else if (item.progess >= 200) {
      color = "#7D9C54";
    }
    return color;
  };

  //bar chart คะแนนเขตตรวจ loading
  const [
    barChartStatisticsByDistricInspector,
    setBarChartStatisticsByDistricInspector,
  ] = useState({
    loading: true,
  });

  //bar chart คะแนนเขตพื้นที่ loading
  const [barChartStatisticsByESA, setBarChartStatisticsByESA] = useState({
    loading: true,
  });

  //bar chart คะแนนโรงเรียนที่ loading
  const [barChartStatisticsBySchool, setBarChartStatisticsBySchool] = useState({
    loading: true,
  });

  //bar chart คะแนนห้องเรียนที่ loading
  const [barChartStatisticsByClassroom, setBarChartStatisticsByClassroom] =
    useState({
      loading: true,
    });

  //bar chart ข้อมูลห้องเรียน loading
  const [barChartStatisticsByClassroom2, setBarChartStatisticsByClassroom2] =
    useState({
      loading: true,
    });

  //ชื่อต่างๆที่เลือกใน dropdown 4 อัน
  const [chosenDistricInspectorName, setChosenDistricInspectorName] =
    useState(null);
  const [chosenESAName, setChosenESAName] = useState(null);
  const [chosenSchoolName, setChosenSchoolName] = useState(null);
  //โรงเรียนที่เลือกของ ระดับเขตพื้นที่ R-2
  const [chosenSchoolName2, setChosenSchoolName2] = useState(null);
  const [chosenClassroomName, setChosenClassroomName] = useState(null);
  //ห้องที่เลือกของ ของ S-1..4 R-3, R-5
  const [chosenClassroomName2, setChosenClassroomName2] = useState(null);
  //ห้องที่เลือกของ ของ R-2
  const [chosenClassroomName3, setChosenClassroomName3] = useState(null);

  const onChosenDistrictInspectorName = ({ key }) => {
    let item = "";
    Object.entries(dataDistrictInspector).forEach((data) => {
      if (data?.[1]?.name === key) {
        item = data?.[1];
      }
    });
    setChosenDistricInspectorName(item?.name);
    setChosenDistrictInspectorData(item);
    //แก้บัค Table 4 render empty rows
    setChosenESADataZ({ loading: true });
    setTimeout(() => {
      setChosenESADataZ(item?.giReport?.[0]?.esaReport);
    }, 1000);
    setBarChartStatisticsByESA({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsByESA({ loading: false });
    }, 500);
  };

  //แก้การตั้งค่า default ระหว่าง 3 dropdown เวลาเลือกอันใดอันหนึ่ง
  useEffect(() => {
    if (chosenDistrictInspectorData.loading !== true) {
      setTimeout(() => {
        setChosenESAData(chosenDistrictInspectorData?.giReport?.[0]);
        // setChosenESADataZ(
        //   chosenDistrictInspectorData?.giReport?.[0]?.esaReport
        // );
        setChosenESAName(chosenDistrictInspectorData?.giReport?.[0]?.name);
      }, 500);
    }
  }, [chosenDistrictInspectorData]);
  useEffect(() => {
    if (chosenESAData.loading !== true) {
      const item = chosenESAData?.esaReport;
      setTimeout(() => {
        if (
          typeof item !== "undefined" &&
          typeof item !== "null" &&
          item?.[0]?.length > 0
        ) {
          setChosenSchoolData(item?.[0]);
          setChosenSchoolName(item?.[0]?.name?.thai);
        }
      }, 500);
    }
  }, [chosenESAData]);

  //dropdownเลือกเขตตรวจ ระดับเขตตรวจที่เห็นแค่เขตตรวจตัวเอง
  // const onChosenDistrictInspectorName2 = ({ key }) => {
  //   let item = "";
  //   Object.entries(dataDistrictInspector).forEach((data) => {
  //     if (data?.[1]?.name === key) {
  //       item = data?.[1];
  //     }
  //   });
  //   setChosenDistricInspectorName(item?.name);
  //   setChosenDistrictInspectorData(item);
  //   setBarChartStatisticsByESA({ loading: true });
  //   setTimeout(() => {
  //     setBarChartStatisticsByESA({ loading: false });
  //   }, 500);
  // };

  const onChosenESAName = ({ key }) => {
    const item = chosenDistrictInspectorData?.giReport?.filter((data) => {
      if (data?.name === key) return data;
    });
    console.log(item);
    setChosenESAData({ loading: true });
    setChosenESAName(item?.[0]?.name);
    setChosenESAData(item?.[0]);
    //แก้บัค Table4 render empty rows
    setChosenESADataZ({ loading: true });
    setTimeout(() => {
      if (
        typeof item !== "undefined" &&
        typeof item !== "null" &&
        item?.[0]?.esaReport?.length > 0
      ) {
        setChosenESADataZ(item?.[0]?.esaReport);
      }
    }, 200);
    // setTimeout(() => {
    //   setChosenESADataZ({ loading: false });
    // }, 200);
    setBarChartStatisticsBySchool({ loading: true });
    setTimeout(() => {
      setBarChartStatisticsBySchool({ loading: false });
    }, 500);
  };

  //Set Report default item for esa report
  useEffect(() => {
    if (dataDistrictInspector.loading !== true) {
      setChosenESADataZ(dataDistrictInspector?.[0]?.giReport?.[0]?.esaReport);
    }
  }, [dataDistrictInspector]);

  //dropdownเลือกเขตพื้นที่ ระดับเขตพื้นที่เห็นแค่เขตพื้นที่ตัวเอง
  // const onChosenESAName2 = ({ key }) => {
  //   const item = chosenDistrictInspectorData?.giReport?.filter(
  //     (data) => {
  //       if (data?.name === key) return data;
  //     }
  //   );
  //   console.log(item);
  //   setChosenESAData({ loading: true });
  //   setChosenESAData(item?.[0]);
  //   setBarChartStatisticsBySchool({ loading: true });
  //   setTimeout(() => {
  //     setBarChartStatisticsBySchool({ loading: false });
  //   }, 500);
  // };

  const onChosenSchoolName = ({ key }) => {
    if (chosenESAData.loading !== true) {
      const item = chosenESAData?.esaReport?.filter((data) => {
        if (data?.name?.thai === key) return data;
      });
      console.log(item);
      setChosenSchoolName(item?.[0]?.name?.thai);
      setChosenSchoolData(item?.[0]);
      setBarChartStatisticsByClassroom({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom({ loading: false });
      }, 500);
    }
  };

  //dropdownเลือกโรงเรียน ระดับเขตพื้นที่เห็นแค่โรงเรียนในเขตพื้นที่ตัวเอง
  const onChosenSchoolName2 = ({ key }) => {
    if (chosenESAData2.loading !== true) {
      const item = Object.values(chosenESAData2)?.filter((data) => {
        if (data?.name?.thai === key) return data;
      });
      console.log(item);
      setChosenSchoolName2(item?.[0]?.name?.thai);
      setChosenSchoolData3(item?.[0]);
      setBarChartStatisticsByClassroom({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom({ loading: false });
      }, 500);
    }
  };

  const onChosenClassroomName = ({ key }) => {
    if (chosenSchoolData.loading !== true) {
      const item = Object.values(
        chosenSchoolData?.schoolReport?.schoolInfo?.classes
      ).filter((data) => {
        if (data?.name === key) return data;
      });
      console.log(item);
      setChosenClassroomName(item?.[0]?.name);
      setChosenClassroomData(item?.[0]);
      setBarChartStatisticsByClassroom2({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom2({ loading: false });
      }, 500);
    }
  };

  //ข้อมูลห้องเรียน ของ S-1..4 R-3, R-5 ใช้แทน chosenSchoolData) getSchoolInfoBySchoolIdAsync
  const onChosenClassroomName2 = ({ key }) => {
    if (chosenSchoolData2.loading !== true) {
      const item = Object.values(chosenSchoolData2.schoolInfo?.classes).filter(
        (data) => {
          if (data?.name === key) return data;
        }
      );
      console.log(item);
      setChosenClassroomName2(item?.[0]?.name);
      setChosenClassroomData(item);
      setBarChartStatisticsByClassroom2({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom2({ loading: false });
      }, 500);
    }
  };

  //ข้อมูลห้องเรียน ของ R-2 getSchoolInfoByESAAsync
  const onChosenClassroomName3 = ({ key }) => {
    if (chosenSchoolData3.loading !== true) {
      const item = Object.values(
        chosenSchoolData3.schoolReport?.schoolInfo?.classes
      ).filter((data) => {
        if (data?.name === key) return data;
      });
      console.log(item);
      setChosenClassroomName3(item?.[0]?.name);
      setChosenClassroomData(item);
      setBarChartStatisticsByClassroom2({ loading: true });
      setTimeout(() => {
        setBarChartStatisticsByClassroom2({ loading: false });
      }, 500);
    }
  };

  //ชื่อเขตตรวจของ user ที่ login (เขตตรวจ) เผื่อ filter dropdrop เหลือแค่เขตตรวจตัวเอง
  // const [userDistrictInspectorName, setUserDistrictInspectorName] = useState({
  //   loading: true,
  // });
  // const district = window.localStorage.getItem("districtInspector");
  // useEffect(() => {
  //   setUserDistrictInspectorName("เขตตรวจ" + " " + district);
  // }, [district]);

  //ชื่อเขตพื้นที่ของ user ที่ login (ระดับเขตพื้นที่) เผื่อ filter dropdrop เหลือแค่เขตตัวเอง
  const [userESAName, setUserESAName] = useState({
    loading: true,
  });
  const esa = window.localStorage.getItem("educationServiceArea");
  useEffect(() => {
    setUserESAName(esa);
  }, [esa]);

  //ชื่อโรงเรียนของ user ที่ login (ครู รอง ผอ หัวหน้าฝ่ายวิชาการ หัวหน้าหมวด) เผื่อ filter dropdrop เหลือแค่โรงเรียนตัวเอง
  const [userSchoolName, setUserSchoolName] = useState({
    loading: true,
  });

  const schoolId = window.localStorage.getItem("schoolId");

  useEffect(() => {
    if (
      position === "S-1" ||
      position === "S-2" ||
      position === "S-3" ||
      position === "R-3"
    ) {
      SchoolService.getSchoolProfileBySchoolIdAsync(schoolId).then((res) => {
        setUserSchoolName(res);
      });
    }
  }, [schoolId, position]);

  //ระยะเวลาในการแสดงผล ระยะเวลาในการแสดงผล (รายงานความก้าวหน้าแบ่งตามเขตตรวจ, ข้อมูลความก้าวหน้าทั้งหมด)
  const [districtInspectorStartTime, setDistrictInspectorStartTime] = useState({
    loading: true,
    data: {},
  });
  const [districtInspectorEndTime, setDistrictInspectorEndTime] = useState({
    loading: true,
    data: {},
  });

  // //ระยะเวลาในการแสดงผล ระยะเวลาในการแสดงผล (ข้อมูลโรงเรียน - ข้อมูลครู)
  // const [teacherStartTime, setTeacherStartTime] = useState({
  //   loading: true,
  //   data: {},
  // });
  // const [teacherEndTime, setTeacherEndTime] = useState({
  //   loading: true,
  //   data: {},
  // });

  // //Sent time after picking a date on ระยะเวลาในการแสดงผล (ข้อมูลครู)
  // const onClickTime = (value) => {
  //   console.log(value);
  //   setTeacherStartTime(value?.[0]?._d);
  //   setTeacherEndTime(value?.[1]?._d);
  //   console.log(teacherStartTime);
  //   console.log(teacherEndTime);
  // };

  // //ระยะเวลาในการแสดงผล ระยะเวลาในการแสดงผล (ข้อมูลโรงเรียน - ข้อมูลห้องเรียน)
  // const [classroomStartTime, setClassroomStartTime] = useState({
  //   loading: true,
  //   data: {},
  // });
  // const [classroomEndTime, setClassroomEndTime] = useState({
  //   loading: true,
  //   data: {},
  // });

  // //Sent time after picking a date on ระยะเวลาในการแสดงผล (ข้อมูลครู)
  // const onClickTime2 = (value) => {
  //   console.log(value);
  //   setClassroomStartTime(value?.[0]?._d);
  //   setClassroomEndTime(value?.[1]?._d);
  //   console.log(classroomStartTime);
  //   console.log(classroomEndTime);
  // };

  //default time for rangepicker รายงานความก้าวหน้า
  const startTime = new Date();
  const endTime = new Date();
  startTime.setMonth(startTime.getMonth() - 12);

  useEffect(() => {
    setDistrictInspectorStartTime(startTime);
    setDistrictInspectorEndTime(endTime);
    // setTeacherStartTime(startTime);
    // setTeacherEndTime(endTime);
    // setClassroomStartTime(startTime);
    // setClassroomEndTime(endTime);
  }, []);

  //getProgessReportAsync
  useEffect(() => {
    if (
      districtInspectorStartTime.loading !== true &&
      districtInspectorEndTime.loading !== true
    ) {
      const startTime = districtInspectorStartTime.toString();
      const endTime = districtInspectorEndTime.toString();

      const filter = {
        startTime: startTime.toString(),
        endTime: endTime.toString(),
      };

      ProgressReportService.getProgessReportAsync(filter).then((res) => {
        if (res.error) {
          setDataDistrictInspector({
            ...dataDistrictInspector,
            error: res.error,
          });
        } else {
          setDataDistrictInspector(res);
        }
      });
    }
  }, [districtInspectorStartTime, districtInspectorEndTime]);

  //getGIInfoByGIIdAsync not used, because the dropdown menu of R-4 (เขตตรวจ เขตพื้นที่) is frontend filtered already
  //เขตตรวจ ของ user ที่ login (eg. 1)
  // const [gi, setGI] = useState({
  //   loading: true,
  //   data: {},
  // });

  // useEffect(() => {
  //   setGI(window.localStorage.getItem("districtInspector"));
  // }, []);

  // //GIInfo data
  // const [GIInfo, setGIInfo] = useState({
  //   loading: true,
  //   data: {},
  // });

  // useEffect(() => {
  //   if (
  //     districtInspectorStartTime.loading !== true &&
  //     districtInspectorEndTime.loading !== true
  //   ) {
  //     //const gi = "1";
  //     const startTime = districtInspectorStartTime.toString();
  //     const endTime = districtInspectorEndTime.toString();

  //     const filter = {
  //       time: {
  //         startTime: startTime.toString(),
  //         endTime: endTime.toString(),
  //       },
  //     };

  //     ProgressReportService.getGIInfoByGIIdAsync(gi, filter).then((res) => {
  //       if (res.error) {
  //         setGIInfo({
  //           ...GIInfo,
  //           error: res.error,
  //         });
  //       } else {
  //         setGIInfo(res);
  //       }
  //     });
  //   }
  // }, [districtInspectorStartTime, districtInspectorEndTime, gi]);

  //getSchoolsInfoByESAAsync the esa data to make school dropdown menu of R-2 (โรงเรียน) is rendered conditionally by position
  useEffect(() => {
    if (position === "R-2") {
      const esa = window.localStorage.getItem("educationServiceArea");
      //const esa = "สพป.พระนครศรีอยุธยา เขต 2";//.toString()
      const startTime = districtInspectorStartTime.toString();
      const endTime = districtInspectorEndTime.toString();

      const filter = {
        startTime: startTime.toString(),
        endTime: endTime.toString(),
      };

      ProgressReportService.getSchoolsInfoByESAAsync(esa, filter).then(
        (res) => {
          if (res.error) {
            setChosenESAData2({
              ...chosenESAData2,
              error: res.error,
            });
          } else {
            setChosenESAData2(res);
          }
        }
      );
    }
  }, [districtInspectorStartTime, districtInspectorEndTime]);

  //getSchoolInfoBySchoolId the dropdown menu of S-1,2,3,4, R-3 (โรงเรียน) is rendered conditionally by position
  useEffect(() => {
    if (
      position === "S-1" ||
      position === "S-2" ||
      position === "S-3" ||
      position === "R-3"
    ) {
      const schoolId = window.localStorage.getItem("schoolId");
      //const schoolId = "C6S57ALtqah1MwsLjcQp"; //.toString()
      const startTime = districtInspectorStartTime.toString();
      const endTime = districtInspectorEndTime.toString();

      const filter = {
        startTime: startTime.toString(),
        endTime: endTime.toString(),
      };

      ProgressReportService.getSchoolInfoBySchoolIdAsync(schoolId, filter).then(
        (res) => {
          if (res.error) {
            setChosenSchoolData2({
              ...chosenSchoolData2,
              error: res.error,
            });
          } else {
            setChosenSchoolData2(res);
          }
        }
      );
    }
  }, [districtInspectorStartTime, districtInspectorEndTime]);

  //getTeachersInfoBySchoolId working
  // useEffect(() => {
  //   if (
  //     districtInspectorStartTime.loading !== true &&
  //     districtInspectorEndTime.loading !== true
  //   ) {
  //     const schoolId = "C6S57ALtqah1MwsLjcQp"; //.toString()
  //     const startTime = districtInspectorStartTime.toString();
  //     const endTime = districtInspectorEndTime.toString();

  //     const filter = {
  //       time: {
  //         startTime: startTime.toString(),
  //         endTime: endTime.toString(),
  //       },
  //     };

  //     ProgressReportService.getTeachersInfoBySchoolIdAsync(
  //       schoolId,
  //       filter
  //     ).then((res) => {
  //       if (res.error) {
  //         setDataDistrictInspector({
  //           ...dataDistrictInspector,
  //           error: res.error,
  //         });
  //       } else {
  //         setDataDistrictInspector(res);
  //       }
  //     });
  //   }
  // }, [districtInspectorStartTime, districtInspectorEndTime]);

  //getTeacherKPIByUserId working
  // useEffect(() => {
  //   if (
  //     districtInspectorStartTime.loading !== true &&
  //     districtInspectorEndTime.loading !== true
  //   ) {
  //     const userId = "5Mw7gfCdQwhkE39LkY5I2LmU8YB2"; //.toString()
  //     const startTime = districtInspectorStartTime.toString();
  //     const endTime = districtInspectorEndTime.toString();

  //     const filter = {
  //       time: {
  //         startTime: startTime.toString(),
  //         endTime: endTime.toString(),
  //       },
  //     };

  //     ProgressReportService.getTeacherKPIByUserIdAsync(userId, filter).then(
  //       (res) => {
  //         if (res.error) {
  //           setDataDistrictInspector({
  //             ...dataDistrictInspector,
  //             error: res.error,
  //           });
  //         } else {
  //           setDataDistrictInspector(res);
  //         }
  //       }
  //     );
  //   }
  // }, [districtInspectorStartTime, districtInspectorEndTime]);

  //getClassKPIByTeacherId working
  // useEffect(() => {
  //   if (
  //     districtInspectorStartTime.loading !== true &&
  //     districtInspectorEndTime.loading !== true
  //   ) {
  //     const teacherId = "5Mw7gfCdQwhkE39LkY5I2LmU8YB2";
  //     //5Mw7gfCdQwhkE39LkY5I2LmU8YB2   working
  //     //fdZyjngrekeX93Ae34dqEgRy3Tz1   not working
  //     const startTime = districtInspectorStartTime.toString();
  //     const endTime = districtInspectorEndTime.toString();

  //     const filter = {
  //       time: {
  //         startTime: startTime.toString(),
  //         endTime: endTime.toString(),
  //       },
  //     };

  //     ProgressReportService.getClassKPIByTeacherIdAsync(teacherId, filter).then(
  //       (res) => {
  //         if (res.error) {
  //           setDataDistrictInspector({
  //             ...dataDistrictInspector,
  //             error: res.error,
  //           });
  //         } else {
  //           setDataDistrictInspector(res);
  //         }
  //       }
  //     );
  //   }
  // }, [districtInspectorStartTime, districtInspectorEndTime]);

  const onClick = () => {
    //console.log(chosenDistrictInspectorData);
    //console.log(Object.entries(chosenDistrictInspectorData));
    console.log(chosenESAData);
    console.log(Object.entries(chosenESADataZ));
    //console.log(chosenESAData2);
    /*ใช้เพื่อทำ chosenSchoolData3 ใน user R-2 (ระดับเขตพื้นที่, ข้อมูลโรงเรียน) */
    //console.log(chosenSchoolData3);
    //console.log(chosenSchoolData);
    //console.log(chosenSchoolData2);
    /*ใช้แทน chosenSchoolData ใน user S-1...4, R-3 (ระดับโรงเรียน, ข้อมูลโรงเรียน) */
    //console.log(chosenClassroomData);
    // console.log(position);
    //console.log(userESAName);
    // console.log(userSchoolName);
    //console.log(Object.entries(dataDistrictInspector));
  };

  //Sent time after picking a date on top of page (รายงานความก้าวหน้าแบ่งตามเขตตรวจ ข้อมูลความก้าวหน้าทั้งหมด ข้อมูลโรงเรียน)
  const onClickProgressTime = (value) => {
    //console.log(value);
    setDistrictInspectorStartTime(value?.[0]?._d || new Date());
    setDistrictInspectorEndTime(value?.[1]?._d || new Date());
    message.info(
      "กำลังดำเนินการอัพเดทข้อมูลโรงเรียน . . . กรุณารอประมาณ 1 นาที"
    );
  };

  //set รายงานความก้าวหน้าทั้งหมด/ เขตตรวจทั้งหมด/ เขตพื้นที่ทั้งหมด /โรงเรียน/ ข้อมูลห้องเรียน เป็น item แรก (default)
  useEffect(() => {
    if (dataDistrictInspector.loading !== true) {
      setBarChartStatisticsByDistricInspector(false);

      setChosenDistrictInspectorData(dataDistrictInspector?.[0]);
      setChosenDistricInspectorName(dataDistrictInspector?.[0]?.name);
      setBarChartStatisticsByESA(false);

      setChosenESAData(dataDistrictInspector?.[0]?.giReport?.[0]);
      setChosenESAName(dataDistrictInspector?.[0]?.giReport?.[0]?.name);
      setBarChartStatisticsBySchool(false);

      setChosenSchoolData(
        dataDistrictInspector?.[0]?.giReport?.[0]?.esaReport?.[0]
      );
      setChosenSchoolName(
        dataDistrictInspector?.[0]?.giReport?.[0]?.esaReport?.[0]?.name?.thai
      );
      setBarChartStatisticsByClassroom(false);

      if (position === "A-1" || position === "S-4") {
        const item = Object.values(
          dataDistrictInspector?.[0]?.giReport?.[0]?.esaReport?.[0]
            ?.schoolReport?.schoolInfo?.classes
        );
        setChosenClassroomName(item?.[0]?.name);
        setChosenClassroomData(item);
        setTimeout(() => {
          setBarChartStatisticsByClassroom2({ loading: false });
        }, 500);
      }
    }
  }, [dataDistrictInspector]);

  //ข้อมูลห้องเรียน เป็น item แรก (default) ของ ของ S-1..4 R-3, R-5
  useEffect(() => {
    if (chosenSchoolData2.loading !== true) {
      const item = Object.values(chosenSchoolData2.schoolInfo?.classes);

      setChosenClassroomName2(item?.[0]?.name);
      setChosenClassroomData(item);
      setTimeout(() => {
        setBarChartStatisticsByClassroom2({ loading: false });
      }, 500);
    }
  }, [chosenSchoolData2]);

  //ข้อมูลห้องเรียน เป็น item แรก (default) ของ ของ R-2
  useEffect(() => {
    if (chosenSchoolData3.loading !== true) {
      if (position === "R-2") {
        const item = Object.values(
          chosenSchoolData3.schoolReport?.schoolInfo?.classes
        );
        setChosenClassroomName3(item?.[0]?.name);
        setChosenClassroomData(item);
        setTimeout(() => {
          setBarChartStatisticsByClassroom2({ loading: false });
        }, 500);
      }
    }
  }, [chosenSchoolData3]);

  //dropdown default ข้อมูลโรงเรียน R-2
  useEffect(() => {
    if (chosenESAData2.loading !== true) {
      setChosenSchoolName2(chosenESAData2?.[0]?.name?.thai);
      setChosenSchoolData3(chosenESAData2?.[0]);
    }
  }, [chosenESAData2]);

  //render Table 3 report
  const renderTable3 = (
    <tbody>
      {Object.entries(chosenESADataZ)?.map((key, index) => {
        return (
          <tr key={index}>
            <td className={classes.tableBorder} key={index + 1}>
              {index + 1}
            </td>
            <td
              className={classes.tableBorder}
              key={chosenDistricInspectorName}
            >
              {chosenDistricInspectorName}
            </td>
            <td className={classes.tableBorder} key={chosenESAName}>
              {chosenESAName}
            </td>
            <td
              className={classes.tableBorder3}
              key={Object.values(key)[1]?.name?.thai}
            >
              {Object.values(key)[1]?.name?.thai}
            </td>
            <td
              className={classes.tableBorder}
              key={
                Object.values(key)[1]?.schoolReport?.schoolInfo?.averageProgess
              }
            >
              {Object.values(
                key
              )[1]?.schoolReport?.schoolInfo?.averageProgess?.toFixed(2) ||
                "0.00"}
            </td>
          </tr>
        );
      })}
    </tbody>
  );

  //render Table 4 report
  const renderTable4 = (
    <tbody>
      {Object.entries(chosenESADataZ)?.map((key, index) => {
        return (
          <tr key={index}>
            <td className={classes.tableBorder} key={index + 1}>
              {index + 1}
            </td>
            <td
              className={classes.tableBorder}
              key={chosenDistricInspectorName}
            >
              {chosenDistricInspectorName}
            </td>
            <td className={classes.tableBorder} key={chosenESAName}>
              {chosenESAName}
            </td>
            <td
              className={classes.tableBorder3}
              key={Object.values(key)[1]?.name?.thai}
            >
              {Object.values(key)[1]?.name?.thai}
            </td>
            <td
              className={classes.tableBorder}
              key={
                Object.values(key)[1]?.schoolReport?.schoolInfo?.classes?.[4]
                  ?.averageProgess
              }
            >
              {Object.values(
                key
              )[1]?.schoolReport?.schoolInfo?.classes?.[4]?.averageProgess?.toFixed(
                2
              ) || "0.00"}
            </td>
            <td
              className={classes.tableBorder}
              key={
                Object.values(key)[1]?.schoolReport?.schoolInfo?.classes?.[5]
                  ?.averageProgess
              }
            >
              {Object.values(
                key
              )[1]?.schoolReport?.schoolInfo?.classes?.[5]?.averageProgess?.toFixed(
                2
              ) || "0.00"}
            </td>
            <td
              className={classes.tableBorder}
              key={
                Object.keys(key)[1]?.schoolReport?.schoolInfo?.classes?.[6]
                  ?.averageProgess
              }
            >
              {Object.keys(
                key
              )[1]?.schoolReport?.schoolInfo?.classes?.[6]?.averageProgess?.toFixed(
                2
              ) || "0.00"}
            </td>
          </tr>
        );
      })}
    </tbody>
  );

  return (
    <Parent ref={parent}>
      <div data-html2canvas-ignore="true">
        <Header
          onMenuClick={() => parent?.current?.toggleMenu()}
          title="ความก้าวหน้าเขต"
        />
      </div>
      <div id="printTarget">
        <Box>
          <div className="Overview">
            <Card bordered={false} className="w-100 Overview-Container">
              <Row gutter={[8, 8]} type="flex">
                <Col span={24}>
                  <Tabs type="card" defaultActiveKey="1">
                    <TabPane tab="รายงานความก้าวหน้า" key="1">
                      <div data-html2canvas-ignore="true">
                        <Button onClick={generatePDF} type="button">
                          ดาวโหลดไฟล์ PDF
                        </Button>
                      </div>
                      <Box mt="2">
                        <Row gutter={[8, 8]} type="flex">
                          <Col span={24} offset={0}>
                            <div>
                              <span
                                style={{
                                  color: "#1c4e91",
                                  fontSize: "0.9rem",
                                }}
                              >
                                ระยะเวลาในการแสดงผล
                              </span>{" "}
                              <RangePicker
                                defaultValue={[
                                  moment(startTime, "DD-MM-YYYY"),
                                  moment(endTime, "DD-MM-YYYY"),
                                ]}
                                format="DD-MM-YYYY"
                                placeholder={["เริ่มวันที่", "ถึงวันที่"]}
                                size={"default"}
                                style={{
                                  marginLeft: "10px",
                                  width: 220,
                                }}
                                onChange={onClickProgressTime}
                                //hides calendar icon because it crashes when clicked
                                suffixIcon={
                                  <div
                                    style={{
                                      pointerEvents: "none",
                                    }}
                                  ></div>
                                }
                              />
                              {/* <div onClick={onClick}>test</div> */}
                            </div>
                            {affiliation !== "กรุงเทพมหานคร" && (
                              <CardWithTitleNoIcon title="รายงานความก้าวหน้าแบ่งตามเขตตรวจ">
                                <VerticalBarChartJsInspectDistrictProgress
                                  height={250}
                                  width={2500}
                                  loading={
                                    barChartStatisticsByDistricInspector?.loading
                                    //dataDistrictInspector?.loading
                                  }
                                  labels={
                                    dataDistrictInspector.loading
                                      ? []
                                      : dataDistrictInspector
                                          ?.sort((a, b) => a.id - b.id)
                                          .map((item) => {
                                            return item?.name;
                                          })
                                  }
                                  items={
                                    dataDistrictInspector?.loading
                                      ? []
                                      : dataDistrictInspector?.map((item) => {
                                          return item?.progess;
                                        })
                                  }
                                  color={
                                    dataDistrictInspector?.loading
                                      ? []
                                      : dataDistrictInspector?.map((item) => {
                                          return getDistrictInspectorBarChartBackgroundColor(
                                            item
                                          );
                                        })
                                  }
                                />
                              </CardWithTitleNoIcon>
                            )}
                          </Col>
                          <Col span={24} offset={0}>
                            <CardWithTitleNoIcon title="ข้อมูลความก้าวหน้าทั้งหมด">
                              <div
                                style={{
                                  marginBottom: "15px",
                                }}
                              >
                                <ProgressCard
                                  title="เขตตรวจทั้งหมด"
                                  numberOfItems={
                                    dataDistrictInspector?.length || 0
                                  }
                                  unit="เขต"
                                />
                                <ProgressCard
                                  title="เขตพื้นที่ทั้งหมด"
                                  numberOfItems={
                                    chosenDistrictInspectorData?.giReport
                                      ?.length || 0
                                  }
                                  unit="เขต"
                                />
                                <ProgressCard
                                  title="โรงเรียน"
                                  numberOfItems={
                                    chosenESAData?.esaReport?.length || 0
                                  }
                                  unit="โรงเรียน"
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    alignContent: "left",
                                    justifyContent: "left",
                                    marginLeft: "0px",
                                    marginTop: "0px",
                                  }}
                                >
                                  <span
                                    style={{
                                      marginLeft: "0px",
                                      marginTop: "0px",
                                    }}
                                  >
                                    <DropdownFormNoTitle
                                      placeholder={
                                        (
                                          <>
                                            {chosenDistricInspectorName}
                                            <button
                                              style={{
                                                margin: "0px",
                                                padding: "2px",
                                                //backgroundColor: "#4CA309",
                                                backgroundColor:
                                                  getDistrictInspectorButtonBackgroundColor(
                                                    chosenDistrictInspectorData
                                                  ) || "grey",
                                                border: "none",
                                                borderRadius: "4px",
                                                color: "white",
                                                fontSize: "0.8em",
                                                width: "60px",
                                              }}
                                            >
                                              {+chosenDistrictInspectorData?.percentage?.toFixed(
                                                0
                                              ) || 0}
                                              %
                                            </button>
                                          </>
                                        ) ?? (
                                          <>
                                            กรุณาเลือกเขตตรวจ{" "}
                                            <button>0%</button>
                                          </>
                                        )
                                      }
                                      titlespan={0}
                                      dropdownspan={4}
                                      md={8}
                                      lg={7}
                                      loading={dataDistrictInspector?.loading}
                                      overlay={
                                        dataDistrictInspector?.loading ? (
                                          <></>
                                        ) : (
                                          <Menu
                                            onClick={
                                              onChosenDistrictInspectorName
                                            }
                                          >
                                            {Object.entries(
                                              dataDistrictInspector
                                            ).map((key) => {
                                              return (
                                                <Menu.Item
                                                  key={
                                                    Object.values(key)[1].name
                                                  }
                                                >
                                                  {Object.values(key)[1].name}
                                                </Menu.Item>
                                              );
                                            })}
                                          </Menu>
                                        )
                                      }
                                    />
                                  </span>
                                  <span
                                    style={{
                                      marginLeft: "30px",
                                      marginTop: "0px",
                                    }}
                                  >
                                    <DropdownFormNoTitle
                                      placeholder={
                                        (
                                          <>
                                            {chosenESAName}{" "}
                                            <button
                                              style={{
                                                margin: "0px",
                                                padding: "2px",
                                                backgroundColor:
                                                  getESAButtonBackgroundColor(
                                                    chosenESAData
                                                  ) || "grey",
                                                border: "none",
                                                borderRadius: "4px",
                                                color: "white",
                                                fontSize: "0.8em",
                                                width: "60px",
                                              }}
                                            >
                                              {+chosenESAData?.percentage?.toFixed(
                                                0
                                              ) || 0}
                                              %
                                            </button>
                                          </>
                                        ) ?? (
                                          <>
                                            กรุณาเลือกเขตพื้นที่{" "}
                                            <button>0%</button>
                                          </>
                                        )
                                      }
                                      titlespan={0}
                                      dropdownspan={4}
                                      md={8}
                                      lg={7}
                                      loading={
                                        chosenDistrictInspectorData?.loading
                                      }
                                      overlay={
                                        chosenDistrictInspectorData?.loading ? (
                                          <></>
                                        ) : (
                                          <Menu onClick={onChosenESAName}>
                                            {chosenDistrictInspectorData?.giReport?.map(
                                              (key) => {
                                                return (
                                                  <Menu.Item key={key.name}>
                                                    {key.name}
                                                  </Menu.Item>
                                                );
                                              }
                                            )}
                                          </Menu>
                                        )
                                      }
                                    />
                                  </span>
                                  <span
                                    style={{
                                      marginLeft: "30px",
                                      marginTop: "0px",
                                    }}
                                  >
                                    <DropdownFormNoTitle
                                      placeholder={
                                        (
                                          <>
                                            {chosenSchoolName}{" "}
                                            <button
                                              style={{
                                                margin: "0px",
                                                padding: "2px",
                                                backgroundColor:
                                                  getSchoolButtonBackgroundColor(
                                                    chosenSchoolData
                                                  ) || "grey",
                                                border: "none",
                                                borderRadius: "4px",
                                                color: "white",
                                                fontSize: "0.8em",
                                                width: "60px",
                                              }}
                                            >
                                              {+chosenSchoolData?.percentage?.toFixed(
                                                0
                                              ) || 0}
                                              %
                                            </button>
                                          </>
                                        ) ?? (
                                          <>
                                            กรุณาเลือกโรงเรียน{" "}
                                            <button>0%</button>
                                          </>
                                        )
                                      }
                                      titlespan={0}
                                      dropdownspan={4}
                                      md={8}
                                      lg={7}
                                      loading={chosenESAData?.loading}
                                      overlay={
                                        chosenESAData?.loading ? (
                                          <></>
                                        ) : (
                                          <Menu onClick={onChosenSchoolName}>
                                            {chosenESAData?.esaReport?.map(
                                              (key) => {
                                                return (
                                                  <Menu.Item
                                                    key={key?.name?.thai}
                                                  >
                                                    {key?.name?.thai}
                                                  </Menu.Item>
                                                );
                                              }
                                            )}
                                          </Menu>
                                        )
                                      }
                                    />
                                  </span>
                                </div>
                              </div>
                              <CardWithTitleNoIcon
                                title={
                                  "ภาพรวมข้อมูล" +
                                  (chosenDistricInspectorName || "")
                                }
                              >
                                <VerticalBarChartJsEsaProgress
                                  height={250}
                                  width={2500}
                                  loading={barChartStatisticsByESA?.loading}
                                  labels={
                                    chosenDistrictInspectorData.loading
                                      ? []
                                      : chosenDistrictInspectorData?.giReport?.map(
                                          (item) => {
                                            return [
                                              item?.type || "",
                                              item?.name || "",
                                            ];
                                          }
                                        )
                                  }
                                  items={
                                    chosenDistrictInspectorData?.loading
                                      ? []
                                      : chosenDistrictInspectorData?.giReport?.map(
                                          (item) => {
                                            return item?.progess;
                                          }
                                        )
                                  }
                                  color={
                                    chosenDistrictInspectorData?.loading
                                      ? []
                                      : chosenDistrictInspectorData?.giReport?.map(
                                          (item) => {
                                            return getESABarChartBackgroundColor(
                                              item
                                            );
                                          }
                                        )
                                  }
                                />
                              </CardWithTitleNoIcon>
                              <CardWithTitleNoIcon title={chosenESAName || ""}>
                                <VerticalBarChartJsSchoolProgress
                                  height={250}
                                  width={2500}
                                  loading={barChartStatisticsBySchool?.loading}
                                  labels={
                                    chosenESAData?.loading
                                      ? []
                                      : chosenESAData?.esaReport?.map(
                                          (item) => {
                                            return item?.name?.thai;
                                          }
                                        )
                                  }
                                  items={
                                    chosenESAData?.loading
                                      ? []
                                      : chosenESAData?.esaReport?.map(
                                          (item) => {
                                            return item?.schoolReport
                                              ?.schoolInfo?.averageProgess;
                                          }
                                        )
                                  }
                                  color={
                                    chosenESAData?.loading
                                      ? []
                                      : chosenESAData?.esaReport?.map(
                                          (item) => {
                                            return getESABarChartBackgroundColor(
                                              item?.schoolReport?.schoolInfo
                                            );
                                          }
                                        )
                                  }
                                />
                              </CardWithTitleNoIcon>
                              <CardWithTitleNoIcon
                                title={"โรงเรียน" + (chosenSchoolName || "")}
                              >
                                <VerticalBarChartJsClassroomProgress
                                  height={250}
                                  width={2500}
                                  loading={
                                    barChartStatisticsByClassroom?.loading
                                  }
                                  labels={
                                    chosenSchoolData?.loading
                                      ? []
                                      : Object.values(
                                          chosenSchoolData?.schoolReport
                                            ?.schoolInfo?.classes
                                        ).map((item) => {
                                          return item?.name;
                                        })
                                  }
                                  items={
                                    chosenSchoolData?.loading
                                      ? []
                                      : Object.values(
                                          chosenSchoolData?.schoolReport
                                            ?.schoolInfo?.classes
                                        ).map((item) => {
                                          return item?.averageProgess;
                                        })
                                  }
                                  color={
                                    chosenSchoolData?.loading
                                      ? []
                                      : Object.values(
                                          chosenSchoolData?.schoolReport
                                            ?.schoolInfo?.classes
                                        ).map((item) => {
                                          return getSchoolBarChartBackgroundColor(
                                            item
                                          );
                                        })
                                  }
                                />
                              </CardWithTitleNoIcon>
                            </CardWithTitleNoIcon>
                          </Col>
                          <Col span={24} offset={0}>
                            {/*  userSchoolName?.name?.thai for user ระดับโรงเรียน S-1...4 , R-3 only*/}
                            {/*  userESAName for user ระดับเขตพื้นที่ R-2 only*/}
                            <CardWithTitleNoIcon
                              title={
                                "ข้อมูลโรงเรียน" +
                                ((userSchoolName &&
                                  userSchoolName?.name?.thai) ||
                                  "") +
                                (userESAName && "ใน" + (userESAName || ""))
                              }
                            >
                              <div>
                                {(position === "A-1" || position === "S-4") && (
                                  <ProgressCard
                                    title="เขตตรวจทั้งหมด"
                                    numberOfItems={
                                      dataDistrictInspector?.length || 0
                                    }
                                    unit="เขต"
                                  />
                                )}
                                {(position === "A-1" || position === "S-4") && (
                                  <ProgressCard
                                    title="เขตพื้นที่ทั้งหมด"
                                    numberOfItems={
                                      chosenDistrictInspectorData?.giReport
                                        ?.length || 0
                                    }
                                    unit="เขต"
                                  />
                                )}
                                {(position === "A-1" || position === "S-4") && (
                                  <ProgressCard
                                    title="โรงเรียน"
                                    numberOfItems={
                                      chosenESAData?.esaReport?.length || 0
                                    }
                                    unit="โรงเรียน"
                                  />
                                )}
                                <div
                                  style={{
                                    display: "flex",
                                    alignContent: "left",
                                    justifyContent: "left",
                                    marginLeft: "0px",
                                    marginTop: "0px",
                                  }}
                                >
                                  <span
                                    style={{
                                      marginLeft: "0px",
                                      marginTop: "0px",
                                    }}
                                  >
                                    {(position === "A-1" ||
                                      position === "S-4") && (
                                      <DropdownFormNoTitle
                                        placeholder={
                                          (
                                            <>
                                              {chosenDistricInspectorName}{" "}
                                              <button
                                                style={{
                                                  margin: "0px",
                                                  padding: "2px",
                                                  //backgroundColor: "#4CA309",
                                                  backgroundColor:
                                                    getDistrictInspectorButtonBackgroundColor(
                                                      chosenDistrictInspectorData
                                                    ) || "grey",
                                                  border: "none",
                                                  borderRadius: "4px",
                                                  color: "white",
                                                  fontSize: "0.8em",
                                                  width: "60px",
                                                }}
                                              >
                                                {+chosenDistrictInspectorData?.percentage?.toFixed(
                                                  0
                                                ) || 0}
                                                %
                                              </button>
                                            </>
                                          ) ?? (
                                            <>
                                              กรุณาเลือกเขตตรวจ{" "}
                                              <button>0%</button>
                                            </>
                                          )
                                        }
                                        titlespan={0}
                                        dropdownspan={4}
                                        md={8}
                                        lg={7}
                                        loading={dataDistrictInspector?.loading}
                                        overlay={
                                          dataDistrictInspector?.loading ? (
                                            <></>
                                          ) : (
                                            <Menu
                                              onClick={
                                                onChosenDistrictInspectorName
                                              }
                                            >
                                              {Object.entries(
                                                dataDistrictInspector
                                              ).map((key) => {
                                                return (
                                                  <Menu.Item
                                                    key={
                                                      Object.values(key)[1].name
                                                    }
                                                  >
                                                    {Object.values(key)[1].name}
                                                  </Menu.Item>
                                                );
                                              })}
                                            </Menu>
                                          )
                                        }
                                      />
                                    )}
                                  </span>
                                  {(position === "A-1" ||
                                    position === "S-4") && (
                                    <span
                                      style={{
                                        marginLeft: "30px",
                                        marginTop: "0px",
                                      }}
                                    >
                                      <DropdownFormNoTitle
                                        placeholder={
                                          (
                                            <>
                                              {chosenESAName}{" "}
                                              <button
                                                style={{
                                                  margin: "0px",
                                                  padding: "2px",
                                                  backgroundColor:
                                                    getESAButtonBackgroundColor(
                                                      chosenESAData
                                                    ) || "grey",
                                                  border: "none",
                                                  borderRadius: "4px",
                                                  color: "white",
                                                  fontSize: "0.8em",
                                                  width: "60px",
                                                }}
                                              >
                                                {+chosenESAData?.percentage?.toFixed(
                                                  0
                                                ) || 0}
                                                %
                                              </button>
                                            </>
                                          ) ?? (
                                            <>
                                              กรุณาเลือกเขตพื้นที่{" "}
                                              <button>0%</button>
                                            </>
                                          )
                                        }
                                        titlespan={0}
                                        dropdownspan={4}
                                        md={8}
                                        lg={7}
                                        loading={
                                          chosenDistrictInspectorData?.loading
                                        }
                                        overlay={
                                          chosenDistrictInspectorData?.loading ? (
                                            <></>
                                          ) : (
                                            <Menu onClick={onChosenESAName}>
                                              {chosenDistrictInspectorData?.giReport?.map(
                                                (key) => {
                                                  return (
                                                    <Menu.Item key={key.name}>
                                                      {key.name}
                                                    </Menu.Item>
                                                  );
                                                }
                                              )}
                                            </Menu>
                                          )
                                        }
                                      />
                                    </span>
                                  )}

                                  {position === "R-2" && (
                                    <span
                                      style={{
                                        marginLeft: "0px",
                                        marginTop: "0px",
                                      }}
                                    >
                                      <DropdownFormNoTitle
                                        placeholder={
                                          <>{chosenSchoolName2} </> ?? (
                                            <>
                                              กรุณาเลือกโรงเรียน{" "}
                                              <button>0%</button>
                                            </>
                                          )
                                        }
                                        titlespan={0}
                                        dropdownspan={4}
                                        md={8}
                                        lg={7}
                                        loading={chosenESAData2?.loading}
                                        overlay={
                                          chosenESAData2?.loading ? (
                                            <></>
                                          ) : (
                                            <Menu onClick={onChosenSchoolName2}>
                                              {Object.values(
                                                chosenESAData2
                                              )?.map((key) => {
                                                return (
                                                  <Menu.Item
                                                    key={key?.name?.thai}
                                                  >
                                                    {key?.name?.thai}
                                                  </Menu.Item>
                                                );
                                              })}
                                            </Menu>
                                          )
                                        }
                                      />
                                    </span>
                                  )}

                                  {(position === "A-1" ||
                                    position === "S-4") && (
                                    <span
                                      style={{
                                        marginLeft: "30px",
                                        marginTop: "0px",
                                      }}
                                    >
                                      <DropdownFormNoTitle
                                        placeholder={
                                          (
                                            <>
                                              {chosenSchoolName}{" "}
                                              <button
                                                style={{
                                                  margin: "0px",
                                                  padding: "2px",
                                                  backgroundColor:
                                                    getSchoolButtonBackgroundColor(
                                                      chosenSchoolData
                                                    ) || "grey",
                                                  border: "none",
                                                  borderRadius: "4px",
                                                  color: "white",
                                                  fontSize: "0.8em",
                                                  width: "60px",
                                                }}
                                              >
                                                {+chosenSchoolData?.percentage?.toFixed(
                                                  0
                                                ) || 0}
                                                %
                                              </button>
                                            </>
                                          ) ?? (
                                            <>
                                              กรุณาเลือกโรงเรียน{" "}
                                              <button>0%</button>
                                            </>
                                          )
                                        }
                                        titlespan={0}
                                        dropdownspan={4}
                                        md={8}
                                        lg={7}
                                        loading={chosenESAData?.loading}
                                        overlay={
                                          chosenESAData?.loading ? (
                                            <></>
                                          ) : (
                                            <Menu onClick={onChosenSchoolName}>
                                              {chosenESAData?.esaReport?.map(
                                                (key) => {
                                                  return (
                                                    <Menu.Item
                                                      key={key?.name?.thai}
                                                    >
                                                      {key?.name?.thai}
                                                    </Menu.Item>
                                                  );
                                                }
                                              )}
                                            </Menu>
                                          )
                                        }
                                      />
                                    </span>
                                  )}
                                </div>
                              </div>
                              <br />
                              {(position === "A-1" || position === "S-4") && (
                                <Tabs type="card" defaultActiveKey="1">
                                  <TabPane tab="ข้อมูลครู" key="1">
                                    <div>
                                      {chosenSchoolData?.schoolReport?.teachersInfo?.map(
                                        (item) => (
                                          <TeacherCard
                                            prefix={
                                              item?.userInfo?.prefix || ""
                                            }
                                            firstName={
                                              item?.userInfo?.firstName || ""
                                            }
                                            lastName={
                                              item?.userInfo?.lastName || ""
                                            }
                                            classrooms={
                                              item?.stats?.numberOfClasses || ""
                                            }
                                            progess={
                                              item?.stats?.averageProgess || ""
                                            }
                                            homework={
                                              item?.stats
                                                ?.numberOfHomeworkAssigned || ""
                                            }
                                            time={
                                              item?.userInfo?.loginTime || ""
                                            }
                                            classroom={item?.classes || []}
                                          />
                                        )
                                      )}
                                    </div>
                                  </TabPane>
                                  <TabPane tab="ข้อมูลห้องเรียน" key="2">
                                    <div>
                                      <div className={classes.alignItems}>
                                        <div className={classes.alignTextItem}>
                                          <div className={classes.alignContent}>
                                            <span
                                              style={{
                                                color: "#1c4e91",
                                                fontSize: "0.9rem",
                                              }}
                                            >
                                              ระดับชั้น
                                              <br />
                                              <span
                                                style={{
                                                  marginLeft: "0px",
                                                  marginTop: "0px",
                                                }}
                                              >
                                                <DropdownFormNoTitle
                                                  placeholder={
                                                    chosenClassroomName ??
                                                    "กรุณาเลือกห้องเรียน"
                                                  }
                                                  titlespan={0}
                                                  dropdownspan={4}
                                                  md={8}
                                                  lg={7}
                                                  loading={
                                                    chosenSchoolData?.loading
                                                  }
                                                  overlay={
                                                    chosenSchoolData?.loading ? (
                                                      <></>
                                                    ) : (
                                                      <Menu
                                                        onClick={
                                                          onChosenClassroomName
                                                        }
                                                      >
                                                        {Object.values(
                                                          chosenSchoolData
                                                            ?.schoolReport
                                                            ?.schoolInfo
                                                            ?.classes
                                                        ).map((key) => {
                                                          return (
                                                            <Menu.Item
                                                              key={key.name}
                                                            >
                                                              {key.name}
                                                            </Menu.Item>
                                                          );
                                                        })}
                                                      </Menu>
                                                    )
                                                  }
                                                />
                                              </span>
                                            </span>
                                            <span
                                              style={{
                                                width: "20px",
                                                height: "53.6px",
                                              }}
                                            />
                                            {/* <Link
                                        to={`/statistics/teacherOverview/${chosenSchoolData?.schoolId}`}
                                      >
                                        <span
                                          style={{
                                            width: "200px",
                                            height: "30px",
                                            margin: "0 0 0 400px",
                                            padding: "0",
                                            border: "none",
                                          }}
                                        >
                                          <button
                                            //onClick={toggle}
                                            style={{
                                              border: "none",
                                              width: "200px",
                                              height: "30px",
                                              margin: "0",
                                              padding: "0",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <div
                                              className={classes.showHideButton}
                                              style={{
                                                width: "200px",
                                                height: "30px",
                                                margin: "0",
                                                padding: "0",
                                                border: "2px solid #B6CCF3",
                                                borderRadius: "4px",
                                              }}
                                            >
                                              <p
                                                className={
                                                  classes.showHideButtonText
                                                }
                                              >
                                                ไปยังข้อมูลวิเคราะห์เชิงลึก
                                              </p>
                                            </div>
                                          </button>
                                        </span>
                                      </Link> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <CardWithTitleNoIcon title={""}>
                                      {chosenClassroomData?.loading !==
                                        true && (
                                        <div className={classes.alignItems}>
                                          <div
                                            className={
                                              classes.alignTextItemNoCursor
                                            }
                                          >
                                            <div
                                              className={
                                                classes.alignContentRight
                                              }
                                            >
                                              <span>
                                                <VscGraphLine
                                                  style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    color: "white",
                                                    background: "#7D9C54",
                                                    borderRadius: "4px",
                                                    padding: "4px",
                                                    marginTop: "10px",
                                                    cursor: "default",
                                                  }}
                                                />
                                              </span>
                                              <span
                                                style={{
                                                  marginLeft: "15px",
                                                }}
                                              >
                                                <p
                                                  style={{
                                                    fontSize: "15px",
                                                    marginBottom: "0px",
                                                  }}
                                                >
                                                  ความก้าวหน้าเฉลี่ยของโรงเรียน
                                                </p>
                                                <p
                                                  style={{
                                                    color: "#7D9C54",
                                                    fontSize: "15px",
                                                    marginBottom: "0px",
                                                  }}
                                                >
                                                  {+chosenSchoolData?.schoolReport?.schoolInfo?.averageProgess?.toFixed(
                                                    0
                                                  ) || 0}
                                                </p>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <VerticalBarChartJsClassroomProgress
                                        height={250}
                                        width={2500}
                                        loading={
                                          barChartStatisticsByClassroom2?.loading
                                        }
                                        labels={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.classes?.map(
                                                (item) => {
                                                  return [
                                                    item?.name || "",
                                                    "การบ้านทั้งหมด",
                                                    item?.homeworkAssigned +
                                                      "ข้อ" || "",
                                                  ];
                                                }
                                              )
                                        }
                                        items={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.classes?.map(
                                                (item) => {
                                                  return item?.progess;
                                                }
                                              )
                                        }
                                        //color={"#7D9C54"}
                                        color={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.classes?.map(
                                                (item) => {
                                                  return getClassroomBarChartBackgroundColor(
                                                    item
                                                  );
                                                }
                                              )
                                        }
                                      />
                                    </CardWithTitleNoIcon>
                                  </TabPane>
                                </Tabs>
                              )}
                              {position === "R-2" && (
                                <Tabs type="card" defaultActiveKey="1">
                                  <TabPane tab="ข้อมูลครู" key="1">
                                    <div>
                                      {chosenSchoolData3?.schoolReport?.teachersInfo?.map(
                                        (item) => (
                                          <TeacherCard
                                            prefix={
                                              item?.userInfo?.namePrefix || ""
                                            }
                                            firstName={
                                              item?.userInfo?.firstName || ""
                                            }
                                            lastName={
                                              item?.userInfo?.lastName || ""
                                            }
                                            classrooms={
                                              item?.stats?.numberOfClasses || ""
                                            }
                                            progess={
                                              item?.stats?.averageProgess || ""
                                            }
                                            homework={
                                              item?.stats
                                                ?.numberOfHomeworkAssigned || ""
                                            }
                                            time={item?.stats?.loginTime || ""}
                                            classroom={item?.classes || []}
                                          />
                                        )
                                      )}
                                    </div>
                                  </TabPane>
                                  <TabPane tab="ข้อมูลห้องเรียน" key="2">
                                    <div>
                                      <div className={classes.alignItems}>
                                        <div className={classes.alignTextItem}>
                                          <div className={classes.alignContent}>
                                            <span
                                              style={{
                                                color: "#1c4e91",
                                                fontSize: "0.9rem",
                                              }}
                                            >
                                              ระดับชั้น
                                              <br />
                                              <span
                                                style={{
                                                  marginLeft: "0px",
                                                  marginTop: "0px",
                                                }}
                                              >
                                                <DropdownFormNoTitle
                                                  placeholder={
                                                    chosenClassroomName3 ??
                                                    "กรุณาเลือกห้องเรียน"
                                                  }
                                                  titlespan={0}
                                                  dropdownspan={4}
                                                  md={8}
                                                  lg={7}
                                                  loading={
                                                    chosenSchoolData3?.loading
                                                  }
                                                  overlay={
                                                    chosenSchoolData3?.loading ? (
                                                      <></>
                                                    ) : (
                                                      <Menu
                                                        onClick={
                                                          onChosenClassroomName3
                                                        }
                                                      >
                                                        {Object.values(
                                                          chosenSchoolData3
                                                            ?.schoolReport
                                                            ?.schoolInfo
                                                            ?.classes
                                                        )?.map((key) => {
                                                          return (
                                                            <Menu.Item
                                                              key={key.name}
                                                            >
                                                              {key.name}
                                                            </Menu.Item>
                                                          );
                                                        })}
                                                      </Menu>
                                                    )
                                                  }
                                                />
                                              </span>
                                            </span>
                                            <span
                                              style={{
                                                width: "20px",
                                                height: "53.6px",
                                              }}
                                            />
                                            {/* <Link
                                        to={`/statistics/teacherOverview/${chosenSchoolData3?.schoolId}`}
                                      >
                                        <span
                                          style={{
                                            width: "200px",
                                            height: "30px",
                                            margin: "0 0 0 400px",
                                            padding: "0",
                                            border: "none",
                                          }}
                                        >
                                          <button
                                            //onClick={toggle}
                                            style={{
                                              border: "none",
                                              width: "200px",
                                              height: "30px",
                                              margin: "0",
                                              padding: "0",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <div
                                              className={classes.showHideButton}
                                              style={{
                                                width: "200px",
                                                height: "30px",
                                                margin: "0",
                                                padding: "0",
                                                border: "2px solid #B6CCF3",
                                                borderRadius: "4px",
                                              }}
                                            >
                                              <p
                                                className={
                                                  classes.showHideButtonText
                                                }
                                              >
                                                ไปยังข้อมูลวิเคราะห์เชิงลึก
                                              </p>
                                            </div>
                                          </button>
                                        </span>
                                      </Link> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <CardWithTitleNoIcon title={""}>
                                      {chosenClassroomData?.loading !==
                                        true && (
                                        <div className={classes.alignItems}>
                                          <div
                                            className={
                                              classes.alignTextItemNoCursor
                                            }
                                          >
                                            <div
                                              className={
                                                classes.alignContentRight
                                              }
                                            >
                                              <span>
                                                <VscGraphLine
                                                  style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    color: "white",
                                                    background: "#7D9C54",
                                                    borderRadius: "4px",
                                                    padding: "4px",
                                                    marginTop: "10px",
                                                    cursor: "default",
                                                  }}
                                                />
                                              </span>
                                              <span
                                                style={{
                                                  marginLeft: "15px",
                                                }}
                                              >
                                                <p
                                                  style={{
                                                    fontSize: "15px",
                                                    marginBottom: "0px",
                                                  }}
                                                >
                                                  ความก้าวหน้าเฉลี่ยของโรงเรียน
                                                </p>
                                                <p
                                                  style={{
                                                    color: "#7D9C54",
                                                    fontSize: "15px",
                                                    marginBottom: "0px",
                                                  }}
                                                >
                                                  {+chosenSchoolData3?.schoolReport?.schoolInfo?.averageProgess?.toFixed(
                                                    0
                                                  ) || 0}
                                                </p>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <VerticalBarChartJsClassroomProgress
                                        height={250}
                                        width={2500}
                                        loading={
                                          barChartStatisticsByClassroom2?.loading
                                        }
                                        labels={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.[0]?.classes?.map(
                                                (item) => {
                                                  return [
                                                    item?.name || "",
                                                    "การบ้านทั้งหมด",
                                                    item?.homeworkAssigned +
                                                      "ข้อ" || "",
                                                  ];
                                                }
                                              )
                                        }
                                        items={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.[0]?.classes?.map(
                                                (item) => {
                                                  return item?.progess;
                                                }
                                              )
                                        }
                                        //color={"#7D9C54"}
                                        color={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.[0]?.classes?.map(
                                                (item) => {
                                                  return getClassroomBarChartBackgroundColor(
                                                    item
                                                  );
                                                }
                                              )
                                        }
                                      />
                                    </CardWithTitleNoIcon>
                                  </TabPane>
                                </Tabs>
                              )}
                              {(position === "S-1" ||
                                position === "S-2" ||
                                position === "S-3" ||
                                position === "R-3") && (
                                <Tabs type="card" defaultActiveKey="1">
                                  <TabPane tab="ข้อมูลครู" key="1">
                                    <div>
                                      {chosenSchoolData2?.teachersInfo?.map(
                                        (item) => (
                                          <TeacherCard
                                            prefix={
                                              item?.userInfo?.namePrefix || ""
                                            }
                                            firstName={
                                              item?.userInfo?.firstName || ""
                                            }
                                            lastName={
                                              item?.userInfo?.lastName || ""
                                            }
                                            classrooms={
                                              item?.stats?.numberOfClasses || ""
                                            }
                                            progess={
                                              item?.stats?.averageProgess || ""
                                            }
                                            homework={
                                              item?.stats
                                                ?.numberOfHomeworkAssigned || ""
                                            }
                                            time={item?.stats?.loginTime || ""}
                                            classroom={item?.classes || []}
                                          />
                                        )
                                      )}
                                    </div>
                                  </TabPane>
                                  <TabPane tab="ข้อมูลห้องเรียน" key="2">
                                    <div>
                                      <div className={classes.alignItems}>
                                        <div className={classes.alignTextItem}>
                                          <div className={classes.alignContent}>
                                            <span
                                              style={{
                                                color: "#1c4e91",
                                                fontSize: "0.9rem",
                                              }}
                                            >
                                              ระดับชั้น
                                              <br />
                                              <span
                                                style={{
                                                  marginLeft: "0px",
                                                  marginTop: "0px",
                                                }}
                                              >
                                                <DropdownFormNoTitle
                                                  placeholder={
                                                    chosenClassroomName2 ??
                                                    "กรุณาเลือกห้องเรียน"
                                                  }
                                                  titlespan={0}
                                                  dropdownspan={4}
                                                  md={8}
                                                  lg={7}
                                                  loading={
                                                    chosenSchoolData2?.loading
                                                  }
                                                  overlay={
                                                    chosenSchoolData2?.loading ? (
                                                      <></>
                                                    ) : (
                                                      <Menu
                                                        onClick={
                                                          onChosenClassroomName2
                                                        }
                                                      >
                                                        {Object.values(
                                                          chosenSchoolData2
                                                            .schoolInfo?.classes
                                                        ).map((key) => {
                                                          return (
                                                            <Menu.Item
                                                              key={key.name}
                                                            >
                                                              {key.name}
                                                            </Menu.Item>
                                                          );
                                                        })}
                                                      </Menu>
                                                    )
                                                  }
                                                />
                                              </span>
                                            </span>
                                            <span
                                              style={{
                                                width: "20px",
                                                height: "53.6px",
                                              }}
                                            />
                                            {/* <Link
                                        to={`/statistics/teacherOverview/${chosenSchoolData2?.schoolId}`}
                                      >
                                        <span
                                          style={{
                                            width: "200px",
                                            height: "30px",
                                            margin: "0 0 0 400px",
                                            padding: "0",
                                            border: "none",
                                          }}
                                        >
                                          <button
                                            //onClick={toggle}
                                            style={{
                                              border: "none",
                                              width: "200px",
                                              height: "30px",
                                              margin: "0",
                                              padding: "0",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <div
                                              className={classes.showHideButton}
                                              style={{
                                                width: "200px",
                                                height: "30px",
                                                margin: "0",
                                                padding: "0",
                                                border: "2px solid #B6CCF3",
                                                borderRadius: "4px",
                                              }}
                                            >
                                              <p
                                                className={
                                                  classes.showHideButtonText
                                                }
                                              >
                                                ไปยังข้อมูลวิเคราะห์เชิงลึก
                                              </p>
                                            </div>
                                          </button>
                                        </span>
                                      </Link> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <CardWithTitleNoIcon title={""}>
                                      {chosenClassroomData?.loading !==
                                        true && (
                                        <div className={classes.alignItems}>
                                          <div
                                            className={
                                              classes.alignTextItemNoCursor
                                            }
                                          >
                                            <div
                                              className={
                                                classes.alignContentRight
                                              }
                                            >
                                              <span>
                                                <VscGraphLine
                                                  style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    color: "white",
                                                    background: "#7D9C54",
                                                    borderRadius: "4px",
                                                    padding: "4px",
                                                    marginTop: "10px",
                                                    cursor: "default",
                                                  }}
                                                />
                                              </span>
                                              <span
                                                style={{
                                                  marginLeft: "15px",
                                                }}
                                              >
                                                <p
                                                  style={{
                                                    fontSize: "15px",
                                                    marginBottom: "0px",
                                                  }}
                                                >
                                                  ความก้าวหน้าเฉลี่ยของโรงเรียน
                                                </p>
                                                <p
                                                  style={{
                                                    color: "#7D9C54",
                                                    fontSize: "15px",
                                                    marginBottom: "0px",
                                                  }}
                                                >
                                                  {+chosenSchoolData2?.schoolInfo?.averageProgess?.toFixed(
                                                    0
                                                  ) || 0}
                                                </p>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <VerticalBarChartJsClassroomProgress
                                        height={250}
                                        width={2500}
                                        loading={
                                          barChartStatisticsByClassroom2?.loading
                                        }
                                        labels={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.[0]?.classes?.map(
                                                (item) => {
                                                  return [
                                                    item?.name || "",
                                                    "การบ้านทั้งหมด",
                                                    item?.homeworkAssigned +
                                                      "ข้อ" || "",
                                                  ];
                                                }
                                              )
                                        }
                                        items={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.[0]?.classes?.map(
                                                (item) => {
                                                  return item?.progess;
                                                }
                                              )
                                        }
                                        //color={"#7D9C54"}
                                        color={
                                          chosenClassroomData?.loading
                                            ? []
                                            : chosenClassroomData?.[0]?.classes?.map(
                                                (item) => {
                                                  return getClassroomBarChartBackgroundColor(
                                                    item
                                                  );
                                                }
                                              )
                                        }
                                      />
                                    </CardWithTitleNoIcon>
                                  </TabPane>
                                </Tabs>
                              )}
                            </CardWithTitleNoIcon>
                          </Col>
                        </Row>
                      </Box>
                    </TabPane>

                    <TabPane tab="Report ระดับเขตตรวจราชการ" key="2">
                      <ReactHTMLTableToExcel
                        id="table1"
                        className="download-table-xls-button"
                        table="ระดับเขตตรวจราชการ"
                        filename={`ความก้าวหน้าแบ่งตามเขตตรวจ ${districtInspectorStartTime?.toLocaleString()} - ${districtInspectorEndTime?.toLocaleString()}`}
                        sheet="ความก้าวหน้าแบ่งตามเขตตรวจ"
                        buttonText="ดาวโหลดไฟล์ Excel"
                      />
                      <p>
                        ระยะเวลาในการแสดงผล
                        {districtInspectorStartTime?.toLocaleString() || ""} -
                        {districtInspectorEndTime?.toLocaleString() || ""}
                      </p>
                      <table id="ระดับเขตตรวจราชการ">
                        <thead>
                          <tr>
                            <th className={classes.tableHeader}>ลำดับ</th>
                            <th className={classes.tableHeader}>
                              เขตตรวจราชการ
                            </th>
                            <th className={classes.tableHeader}>
                              ค่าความก้าวหน้า
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(dataDistrictInspector)?.map(
                            (key, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    className={classes.tableBorder}
                                    key={index + 1}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    className={classes.tableBorder}
                                    key={Object.values(key)[1].name}
                                  >
                                    {Object.values(key)[1].name}
                                  </td>

                                  <td
                                    className={classes.tableBorder}
                                    key={Object.values(key)[1].progess}
                                  >
                                    {Object.values(key)[1].progess?.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </TabPane>

                    <TabPane
                      tab="Report ระดับสำนักงานเขตพื้นที่การศึกษา"
                      key="3"
                    >
                      <span
                        style={{
                          marginLeft: "0px",
                          marginTop: "0px",
                        }}
                      >
                        <ProgressCard
                          title="เขตตรวจทั้งหมด"
                          numberOfItems={dataDistrictInspector?.length || 0}
                          unit="เขต"
                        />
                        <DropdownFormNoTitle
                          placeholder={
                            (
                              <>
                                {chosenDistricInspectorName}
                                <button
                                  style={{
                                    margin: "0px",
                                    padding: "2px",
                                    //backgroundColor: "#4CA309",
                                    backgroundColor:
                                      getDistrictInspectorButtonBackgroundColor(
                                        chosenDistrictInspectorData
                                      ) || "grey",
                                    border: "none",
                                    borderRadius: "4px",
                                    color: "white",
                                    fontSize: "0.8em",
                                    width: "60px",
                                  }}
                                >
                                  {+chosenDistrictInspectorData?.percentage?.toFixed(
                                    0
                                  ) || 0}
                                  %
                                </button>
                              </>
                            ) ?? (
                              <>
                                กรุณาเลือกเขตตรวจ <button>0%</button>
                              </>
                            )
                          }
                          titlespan={0}
                          dropdownspan={4}
                          md={8}
                          lg={7}
                          loading={dataDistrictInspector?.loading}
                          overlay={
                            dataDistrictInspector?.loading ? (
                              <></>
                            ) : (
                              <Menu onClick={onChosenDistrictInspectorName}>
                                {Object.entries(dataDistrictInspector).map(
                                  (key) => {
                                    return (
                                      <Menu.Item
                                        key={Object.values(key)[1].name}
                                      >
                                        {Object.values(key)[1].name}
                                      </Menu.Item>
                                    );
                                  }
                                )}
                              </Menu>
                            )
                          }
                        />
                      </span>
                      <ReactHTMLTableToExcel
                        id="table2"
                        className="download-table-xls-button"
                        table="ระดับสำนักงานเขตพื้นที่การศึกษา"
                        filename={`ความก้าวหน้าแบ่งตามเขตพื้นที่ใน${chosenDistricInspectorName} ${districtInspectorStartTime?.toLocaleString()} - ${districtInspectorEndTime?.toLocaleString()}`}
                        sheet="ความก้าวหน้าแบ่งตามเขตพื้นที่"
                        buttonText="ดาวโหลดไฟล์ Excel"
                      />
                      <p>
                        ระยะเวลาในการแสดงผล
                        {districtInspectorStartTime?.toLocaleString() || ""} -
                        {districtInspectorEndTime?.toLocaleString() || ""}
                      </p>
                      <table id="ระดับสำนักงานเขตพื้นที่การศึกษา">
                        <thead>
                          <tr>
                            <th className={classes.tableHeader}>ลำดับ</th>
                            <th className={classes.tableHeader}>
                              เขตตรวจราชการ
                            </th>
                            <th className={classes.tableHeader2}>
                              สำนักงานเขตพื้นที่การศึกษา
                            </th>
                            <th className={classes.tableHeader}>
                              ค่าความก้าวหน้า
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {chosenDistrictInspectorData?.giReport?.map(
                            (key, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    className={classes.tableBorder}
                                    key={index + 1}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    className={classes.tableBorder}
                                    key={chosenDistricInspectorName}
                                  >
                                    {chosenDistricInspectorName}
                                  </td>

                                  <td
                                    className={classes.tableBorder}
                                    key={key?.name}
                                  >
                                    {key?.name}
                                  </td>
                                  <td
                                    className={classes.tableBorder}
                                    key={key?.progess}
                                  >
                                    {key?.progess?.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </TabPane>

                    <TabPane tab="Report ระดับโรงเรียน" key="4">
                      <ProgressCard
                        title="เขตตรวจทั้งหมด"
                        numberOfItems={dataDistrictInspector?.length || 0}
                        unit="เขต"
                      />
                      <ProgressCard
                        title="เขตพื้นที่ทั้งหมด"
                        numberOfItems={
                          chosenDistrictInspectorData?.giReport?.length || 0
                        }
                        unit="เขต"
                      />
                      <div
                        style={{
                          display: "flex",
                          alignContent: "left",
                          justifyContent: "left",
                          marginLeft: "0px",
                          marginTop: "0px",
                        }}
                      >
                        <span
                          style={{
                            marginLeft: "0px",
                            marginTop: "0px",
                          }}
                        >
                          <DropdownFormNoTitle
                            placeholder={
                              (
                                <>
                                  {chosenDistricInspectorName}
                                  <button
                                    style={{
                                      margin: "0px",
                                      padding: "2px",
                                      //backgroundColor: "#4CA309",
                                      backgroundColor:
                                        getDistrictInspectorButtonBackgroundColor(
                                          chosenDistrictInspectorData
                                        ) || "grey",
                                      border: "none",
                                      borderRadius: "4px",
                                      color: "white",
                                      fontSize: "0.8em",
                                      width: "60px",
                                    }}
                                  >
                                    {+chosenDistrictInspectorData?.percentage?.toFixed(
                                      0
                                    ) || 0}
                                    %
                                  </button>
                                </>
                              ) ?? (
                                <>
                                  กรุณาเลือกเขตตรวจ <button>0%</button>
                                </>
                              )
                            }
                            titlespan={0}
                            dropdownspan={4}
                            md={8}
                            lg={7}
                            loading={dataDistrictInspector?.loading}
                            overlay={
                              dataDistrictInspector?.loading ? (
                                <></>
                              ) : (
                                <Menu onClick={onChosenDistrictInspectorName}>
                                  {Object.entries(dataDistrictInspector).map(
                                    (key) => {
                                      return (
                                        <Menu.Item
                                          key={Object.values(key)[1].name}
                                        >
                                          {Object.values(key)[1].name}
                                        </Menu.Item>
                                      );
                                    }
                                  )}
                                </Menu>
                              )
                            }
                          />
                        </span>
                        <span
                          style={{
                            marginLeft: "30px",
                            marginTop: "0px",
                          }}
                        >
                          <DropdownFormNoTitle
                            placeholder={
                              (
                                <>
                                  {chosenESAName}
                                  <button
                                    style={{
                                      margin: "0px",
                                      padding: "2px",
                                      backgroundColor:
                                        getESAButtonBackgroundColor(
                                          chosenESAData
                                        ) || "grey",
                                      border: "none",
                                      borderRadius: "4px",
                                      color: "white",
                                      fontSize: "0.8em",
                                      width: "60px",
                                    }}
                                  >
                                    {+chosenESAData?.percentage?.toFixed(0) ||
                                      0}
                                    %
                                  </button>
                                </>
                              ) ?? (
                                <>
                                  กรุณาเลือกเขตพื้นที่ <button>0%</button>
                                </>
                              )
                            }
                            titlespan={0}
                            dropdownspan={4}
                            md={8}
                            lg={7}
                            loading={chosenDistrictInspectorData?.loading}
                            overlay={
                              chosenDistrictInspectorData?.loading ? (
                                <></>
                              ) : (
                                <Menu onClick={onChosenESAName}>
                                  {chosenDistrictInspectorData?.giReport?.map(
                                    (key) => {
                                      return (
                                        <Menu.Item key={key.name}>
                                          {key.name}
                                        </Menu.Item>
                                      );
                                    }
                                  )}
                                </Menu>
                              )
                            }
                          />
                        </span>
                      </div>
                      <ReactHTMLTableToExcel
                        id="table3"
                        className="download-table-xls-button"
                        table="ระดับโรงเรียน"
                        filename={`ความก้าวหน้าแบ่งตามโรงเรียนใน${chosenDistricInspectorName} ใน${chosenESAName} ${districtInspectorStartTime?.toLocaleString()} - ${districtInspectorEndTime?.toLocaleString()}`}
                        sheet="ความก้าวหน้าแบ่งตามโรงเรียน"
                        buttonText="ดาวโหลดไฟล์ Excel"
                      />
                      <p>
                        ระยะเวลาในการแสดงผล
                        {districtInspectorStartTime?.toLocaleString() || ""} -
                        {districtInspectorEndTime?.toLocaleString() || ""}
                      </p>
                      <table id="ระดับโรงเรียน">
                        <thead>
                          <tr>
                            <th className={classes.tableHeader}>ลำดับ</th>
                            <th className={classes.tableHeader}>
                              เขตตรวจราชการ
                            </th>
                            <th className={classes.tableHeader2}>
                              สำนักงานเขตพื้นที่การศึกษา
                            </th>
                            <th className={classes.tableHeader3}>โรงเรียน</th>
                            <th className={classes.tableHeader}>
                              ค่าความก้าวหน้า
                            </th>
                          </tr>
                        </thead>
                        {chosenESADataZ.loading ? <Spin></Spin> : renderTable3}
                      </table>
                    </TabPane>

                    <TabPane tab="Report ระดับโรงเรียน (ป4.-ป.6)" key="5">
                      <ProgressCard
                        title="เขตตรวจทั้งหมด"
                        numberOfItems={dataDistrictInspector?.length || 0}
                        unit="เขต"
                      />
                      <ProgressCard
                        title="เขตพื้นที่ทั้งหมด"
                        numberOfItems={
                          chosenDistrictInspectorData?.giReport?.length || 0
                        }
                        unit="เขต"
                      />
                      <div
                        style={{
                          display: "flex",
                          alignContent: "left",
                          justifyContent: "left",
                          marginLeft: "0px",
                          marginTop: "0px",
                        }}
                      >
                        <span
                          style={{
                            marginLeft: "0px",
                            marginTop: "0px",
                          }}
                        >
                          <DropdownFormNoTitle
                            placeholder={
                              (
                                <>
                                  {chosenDistricInspectorName}
                                  <button
                                    style={{
                                      margin: "0px",
                                      padding: "2px",
                                      //backgroundColor: "#4CA309",
                                      backgroundColor:
                                        getDistrictInspectorButtonBackgroundColor(
                                          chosenDistrictInspectorData
                                        ) || "grey",
                                      border: "none",
                                      borderRadius: "4px",
                                      color: "white",
                                      fontSize: "0.8em",
                                      width: "60px",
                                    }}
                                  >
                                    {+chosenDistrictInspectorData?.percentage?.toFixed(
                                      0
                                    ) || 0}
                                    %
                                  </button>
                                </>
                              ) ?? (
                                <>
                                  กรุณาเลือกเขตตรวจ <button>0%</button>
                                </>
                              )
                            }
                            titlespan={0}
                            dropdownspan={4}
                            md={8}
                            lg={7}
                            loading={dataDistrictInspector?.loading}
                            overlay={
                              dataDistrictInspector?.loading ? (
                                <></>
                              ) : (
                                <Menu onClick={onChosenDistrictInspectorName}>
                                  {Object.entries(dataDistrictInspector).map(
                                    (key) => {
                                      return (
                                        <Menu.Item
                                          key={Object.values(key)[1].name}
                                        >
                                          {Object.values(key)[1].name}
                                        </Menu.Item>
                                      );
                                    }
                                  )}
                                </Menu>
                              )
                            }
                          />
                        </span>
                        <span
                          style={{
                            marginLeft: "30px",
                            marginTop: "0px",
                          }}
                        >
                          <DropdownFormNoTitle
                            placeholder={
                              (
                                <>
                                  {chosenESAName}
                                  <button
                                    style={{
                                      margin: "0px",
                                      padding: "2px",
                                      backgroundColor:
                                        getESAButtonBackgroundColor(
                                          chosenESAData
                                        ) || "grey",
                                      border: "none",
                                      borderRadius: "4px",
                                      color: "white",
                                      fontSize: "0.8em",
                                      width: "60px",
                                    }}
                                  >
                                    {+chosenESAData?.percentage?.toFixed(0) ||
                                      0}
                                    %
                                  </button>
                                </>
                              ) ?? (
                                <>
                                  กรุณาเลือกเขตพื้นที่ <button>0%</button>
                                </>
                              )
                            }
                            titlespan={0}
                            dropdownspan={4}
                            md={8}
                            lg={7}
                            loading={chosenDistrictInspectorData?.loading}
                            overlay={
                              chosenDistrictInspectorData?.loading ? (
                                <></>
                              ) : (
                                <Menu onClick={onChosenESAName}>
                                  {chosenDistrictInspectorData?.giReport?.map(
                                    (key) => {
                                      return (
                                        <Menu.Item key={key.name}>
                                          {key.name}
                                        </Menu.Item>
                                      );
                                    }
                                  )}
                                </Menu>
                              )
                            }
                          />
                        </span>
                      </div>
                      <ReactHTMLTableToExcel
                        id="table4"
                        className="download-table-xls-button"
                        table="ระดับโรงเรียน (ป4.-ป.6)"
                        filename={`ความก้าวหน้าแบ่งตามชั้นเรียนของโรงเรียนใน${chosenDistricInspectorName} ใน${chosenESAName} ${districtInspectorStartTime?.toLocaleString()} - ${districtInspectorEndTime?.toLocaleString()}`}
                        sheet="ความก้าวหน้าแบ่งตามโรงเรียน"
                        buttonText="ดาวโหลดไฟล์ Excel"
                      />
                      <p>
                        ระยะเวลาในการแสดงผล
                        {districtInspectorStartTime?.toLocaleString() || ""} -
                        {districtInspectorEndTime?.toLocaleString() || ""}
                      </p>
                      <table id="ระดับโรงเรียน (ป4.-ป.6)">
                        <thead>
                          <tr>
                            <th className={classes.tableHeader}>ลำดับ</th>
                            <th className={classes.tableHeader}>
                              เขตตรวจราชการ
                            </th>
                            <th className={classes.tableHeader2}>
                              สำนักงานเขตพื้นที่การศึกษา
                            </th>
                            <th className={classes.tableHeader3}>โรงเรียน</th>
                            <th className={classes.tableHeader}>
                              ค่าความก้าวหน้า ป.4
                            </th>
                            <th className={classes.tableHeader}>
                              ค่าความก้าวหน้า ป.5
                            </th>
                            <th className={classes.tableHeader}>
                              ค่าความก้าวหน้า ป.6
                            </th>
                          </tr>
                        </thead>
                        {chosenESADataZ.loading ? <Spin></Spin> : renderTable4}
                      </table>
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
            </Card>
          </div>
        </Box>
      </div>
    </Parent>
  );
}
