import React, { useState } from "react";

const FormMissionQuiz = (props) => {
  const { setHomeworkCreateDataQuizRemove } = props;
  const { setHomeworkCreateDataQuizAdd } = props;

  const [isSelect, setIsSelect] = useState(false);

  const sTextSplit = props.data.split("-");
  const sTextID = parseInt(sTextSplit[sTextSplit.length - 1]);

  const onClickToggle = () => {
    setIsSelect((state) => {
      if (state) {
        setHomeworkCreateDataQuizRemove(props.data);
      } else {
        setHomeworkCreateDataQuizAdd(props.data);
      }
      return !state;
    });
  };

  return (
    <span className="h-14 w-14 p-2" onClick={onClickToggle}>
      <div
        className={
          "flex h-full w-full items-center justify-center rounded-full "
          //+(isSelect ? ' text-white ' + props.BGColor : '')
        }
        style={{
          backgroundColor: isSelect ? props.BGColor : "",
          width: "40px",
          height: "40px",
          mozBorderRadius: "20px",
          webkitBorderRadius: "20px",
          borderRadius: "25px",
          display: "inline-block",
          marginRight: "5px",
          marginBottom: "5px",
          color: isSelect ? "white" : "black",
          paddingTop: "7px", 
        }}
      >
        {sTextID}
      </div>
    </span>
  );
};

export default FormMissionQuiz;
