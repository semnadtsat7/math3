import React from "react";
import classes from "./RankingCard.module.css";

function RankingCard(props) {
  return (
    <div className={classes.card} onClick={props.handler}>
      <div className={classes.container}>
        <h6 className={classes.title}>
          {props.districtInspect}
        </h6>
      </div>
    </div>
  );
}

export default RankingCard;
