import React from "react";
import classes from "./EsaRankingCard.module.css";

export default function EsaRankingCard(props) {
  const { esaName, handler } = props;
    return (
      <div className={classes.card} onClick={handler}>
        <div className={classes.container}>
          <h6 className={classes.title}>{esaName}</h6>
        </div>
      </div>
    );
}
