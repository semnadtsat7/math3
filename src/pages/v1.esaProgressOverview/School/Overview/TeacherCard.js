import React, { useState } from "react";
import classes from "./TeacherCard.module.css";

import { BsFillPeopleFill, BsEye } from "react-icons/bs";
import { VscGraphLine } from "react-icons/vsc";
import { GiNotebook } from "react-icons/gi";
import { AiOutlineClockCircle } from "react-icons/ai";

import { IconContext } from "react-icons";

import {
  CardWithTitleNoIcon,
  VerticalBarChartJsClassroomProgress,
} from "../../../../components/Statistics";

function TeacherCard(props) {
  const {
    prefix,
    firstName,
    lastName,
    classrooms,
    progess,
    homework,
    time,
    classroom,
  } = props;
  const boxWidth = "220px";
  const textSize = "13px";

  const [isOpened, setIsOpened] = useState(false);

  function toggle() {
    setIsOpened((wasOpened) => !wasOpened);
  }

  //เปลี่ยนสี background ของbar ขึ้นกับ value range ของคะแนนห้องเรียนในโรงเรียน
  const getClassroomBarChartBackgroundColor = (item) => {
    let color;
    if (!item) {
      return (color = "grey");
    }

    if (item.progess === 0) {
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

  return (
    <IconContext.Provider value={{ className: "shared-class", size: 45 }}>
      <div
        style={{
          marginBottom: "15px",
          background: "#FFFFFF",
          boxShadow: "0px 2px 7px rgba(165, 165, 165, 0.25)",
          borderRadius: "3px",
        }}
      >
        <CardWithTitleNoIcon
          title={
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className={classes.text}
                  style={{
                    color: "#0F409F",
                  }}
                >
                  {prefix + firstName + " " + lastName}
                </span>
                <span
                  className={classes.text}
                  style={{
                    width: "200px",
                    height: "30px",
                    margin: "0",
                    padding: "0",
                    border: "none",
                    filter:
                      "drop-shadow(0px 0px 8px rgba(137, 137, 137, 0.25))",
                  }}
                >
                  <button
                    onClick={toggle}
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
                      <p className={classes.showHideButtonText}>
                        แสดงข้อมูล
                        <BsEye
                          //onMouseOver={({target})=>target.style.background="white"}
                          //onMouseOut={({target})=>target.style.background="#5c7ebc"}
                          style={{
                            width: "30px",
                            height: "22px",
                            borderRadius: "4px",
                            padding: "10px 0 0 0",
                            margin: "0 0 0 0",
                            size: "15",
                          }}
                        />
                      </p>
                    </div>
                  </button>
                </span>
              </div>
            </>
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <div
              style={{
                width: boxWidth,
              }}
            >
              <div className={classes.alignItems}>
                <div className={classes.alignTextItemNoCursor}>
                  <div className={classes.alignContent}>
                    <span className={classes.text}>
                      <BsFillPeopleFill
                        style={{
                          color: "white",
                          background: "#64799D",
                          borderRadius: "4px",
                          padding: "4px",
                          marginTop: "10px",
                          cursor: "default",
                        }}
                      />
                    </span>
                    <span
                      className={classes.text}
                      style={{
                        margin: "10px",
                        cursor: "default",
                      }}
                    >
                      <p
                        style={{
                          fontSize: textSize,
                          marginBottom: "0",
                        }}
                      >
                        ห้องเรียนในการดูแล
                      </p>
                      <p
                        style={{
                          color: "#64799D",
                          fontSize: textSize,
                          marginBottom: "0",
                        }}
                      >
                        {classrooms || 0} ห้อง
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: boxWidth,
              }}
            >
              <div className={classes.alignItems}>
                <div className={classes.alignTextItemNoCursor}>
                  <div className={classes.alignContent}>
                    <span className={classes.text}>
                      <VscGraphLine
                        style={{
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
                      className={classes.text}
                      style={{
                        margin: "10px",
                        cursor: "default",
                      }}
                    >
                      <p
                        style={{
                          fontSize: textSize,
                          marginBottom: "0",
                        }}
                      >
                        ความก้าวหน้าเฉลี่ยของห้องที่ดูแล
                      </p>
                      <p
                        style={{
                          color: "#7D9C54",
                          fontSize: textSize,
                          marginBottom: "0",
                        }}
                      >
                        {(+progess).toFixed(0) || 0}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: boxWidth,
              }}
            >
              <div className={classes.alignItems}>
                <div className={classes.alignTextItemNoCursor}>
                  <div className={classes.alignContent}>
                    <span className={classes.text}>
                      <GiNotebook
                        style={{
                          color: "white",
                          background: "#CD680B",
                          borderRadius: "4px",
                          padding: "4px",
                          marginTop: "10px",
                          cursor: "default",
                        }}
                      />
                    </span>
                    <span
                      className={classes.text}
                      style={{
                        margin: "10px",
                        cursor: "default",
                      }}
                    >
                      <p
                        style={{
                          fontSize: textSize,
                          marginBottom: "0",
                        }}
                      >
                        สั่งการบ้านไปแล้ว
                      </p>
                      <p
                        style={{
                          color: "#CD680B",
                          fontSize: textSize,
                          marginBottom: "0",
                        }}
                      >
                        {homework || 0} ข้อ
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: boxWidth,
              }}
            >
              {/* <div className={classes.alignItems}>
                <div className={classes.alignTextItemNoCursor}>
                  <div className={classes.alignContent}>
                    <span className={classes.text}>
                      <AiOutlineClockCircle
                        style={{
                          color: "white",
                          background: "#817FC7",
                          borderRadius: "4px",
                          padding: "4px",
                          marginTop: "10px",
                          cursor: "default",
                        }}
                      />
                    </span>
                    <span className={classes.text}
                      style={{
                        margin: "10px",
                        cursor: "default",
                      }}
                    >
                      <p
                        style={{
                          fontSize: textSize,
                          marginBottom: "0",
                        }}
                      >
                        เวลาของครูที่ใช้แอพเฉลี่ยต่อวัน
                      </p>
                      <p
                        style={{
                          color: "#817FC7",
                          fontSize: textSize,
                          marginBottom: "0",
                        }}
                      >
                        {time || 0} นาที
                      </p>
                    </span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </CardWithTitleNoIcon>
        {isOpened && (
          <CardWithTitleNoIcon
            title={"สถิติความก้าวหน้าแบ่งตามห้องเรียนที่สอน"}
          >
            <VerticalBarChartJsClassroomProgress
              height={250}
              width={2500}
              loading={classroom?.loading}
              labels={
                classroom.loading
                  ? []
                  : classroom?.map((item) => {
                      return item?.name;
                    })
              }
              items={
                classroom?.loading
                  ? []
                  : classroom?.map((item) => {
                      return +item?.progess?.toFixed(0);
                    })
              }
              //color={"#7D9C54"}
              color={
                classroom?.loading
                  ? []
                  : classroom?.map((item) => {
                      return getClassroomBarChartBackgroundColor(item);
                    })
              }
            />
          </CardWithTitleNoIcon>
        )}
      </div>
    </IconContext.Provider>
  );
}

export default TeacherCard;
