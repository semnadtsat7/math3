import React from "react";
import classes from "./SchoolRankingCard.module.css";

export default function SchoolRankingCard(props) {
  const { schoolName, percentage, color, handler } = props;

  return (
    <div className={classes.card} onClick={handler}>
      <div className={classes.container} style={{ backgroundColor: color }}>
        <div>
          <h6 className={classes.title}>{schoolName}</h6>
        </div>
        <div className={classes.lineBreak}></div>
        <div>
          <h6 className={classes.title}> คะแนน {percentage}%</h6>
        </div>
      </div>
    </div>
  );
}
