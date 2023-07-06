import React, { useState } from "react";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import FormMissionQuiz from "./FormMissionQuiz";

const FormMissionLevel = (props) => {
  const { setHomeworkCreateDataQuizRemove } = props;
  const { setHomeworkCreateDataQuizAdd } = props;

  const [isExpand, setIsExpand] = useState(true);

  // console.log('props.data', props.data);
  return (
    <div className="mt-3 overflow-hidden rounded-xl shadow-md">
      <div onClick={() => setIsExpand((state) => !state)}>
        <p style={{ backgroundColor: props.BGColor, color: "white" }}>
          {props.keyName}
        </p>
        {/* {isExpand && (
          <MdOutlineExpandLess size="2rem" className="align-middle" />
        )}
        {!isExpand && (
          <MdOutlineExpandMore size="2rem" className="align-middle" />
        )} */}
      </div>
      {isExpand && (
        <div className="flex flex-wrap gap-x-2 gap-y-2 px-1 py-2">
          {props.data.quizzesId.map((data, key) => {
            return (
              <FormMissionQuiz
                key={data}
                data={data}
                BGColor={props.BGColor}
                setHomeworkCreateDataQuizRemove={
                  setHomeworkCreateDataQuizRemove
                }
                setHomeworkCreateDataQuizAdd={setHomeworkCreateDataQuizAdd}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormMissionLevel;
