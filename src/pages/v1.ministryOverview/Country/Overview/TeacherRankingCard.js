import React from "react";
import classes from "./TeacherRankingCard.module.css";

export default function TeacherRankingCard(props) {
  const {
    teacherName,
    homework,
    avgStagePass,
    maxStage,
    avgScore,
    maxScore,
    color2 /*handler*/,
  } = props;

  return (
    <div className={classes.card} /*onClick={handler}*/>
      <div className={classes.container} style={{ backgroundColor: color2 }}>
        <div>
          <h6 className={classes.title}>{teacherName}</h6>
        </div>
        <div className={classes.lineBreak}></div>
        <div>
          <h6 className={classes.title}>ประสิทธิภาพ/engagement/KPI</h6>
        </div>
        <div className={classes.lineBreak}></div>
        <div>
          <h6 className={classes.titleUnderLined}> การบ้าน {homework}</h6>
        </div>
        <div className={classes.lineBreak}></div>
        <div>
          <h6 className={classes.title}>
            {" "}
            ด่านที่ผ่านเฉลี่ย {avgStagePass} / {maxStage}
          </h6>
        </div>
        <div className={classes.lineBreak}></div>
        <div>
          <h6 className={classes.title}>
            {" "}
            คะแนนเฉลี่ย {avgScore} / {maxScore}
          </h6>
        </div>
      </div>
    </div>
  );
}
