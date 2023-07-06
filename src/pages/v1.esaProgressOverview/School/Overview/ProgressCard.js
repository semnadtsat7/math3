import React from "react";
import classes from "./ProgressCard.module.css";

function ProgressCard(props) {
  return (
    <div className={classes.card} onClick={props.handler}>
      <div className={classes.container}>
        <span className={classes.title}>{props.title}&nbsp;</span>
        <span className={classes.blue}>
          ({props.numberOfItems}&nbsp;{props.unit})
        </span>
        <p
          style={{
            fontSize: "0.8em",
            margin: "0px",
          }}
        >
          ความก้าวหน้าเฉลี่ยในแต่ละเขต (%)
        </p>
      </div>
    </div>
  );
}

export default ProgressCard;
