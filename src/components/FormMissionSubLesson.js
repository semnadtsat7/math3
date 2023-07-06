import React, { useState } from 'react';
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md';
import FormMissionLevel from './FormMissionLevel';


const FormMissionSubLesson = (props) => {
    const { setHomeworkCreateDataQuizRemove } = props;
    const { setHomeworkCreateDataQuizAdd } = props;

    const [isExpand, setIsExpand] = useState(false);
  
    const onClickToggleExpand = () => {
      setIsExpand((state) => !state);
    };
  
    return (
      <div
        className="text-parent-primary mx-6
                 block
               flex cursor-pointer
               flex-col rounded-xl bg-white p-5 text-center
               text-xl font-medium shadow-md"
      >
        <div onClick={onClickToggleExpand}>
          {/* <p>{props.keyName}</p> */}
          {isExpand && <MdOutlineExpandLess size="2rem" className="align-middle" />}
          {!isExpand && <MdOutlineExpandMore size="2rem" className="align-middle" />}
        </div>
        {isExpand && (
          <div className="px-5 text-lg">
            {props.data.easy.quizzesId.length > 0 && (
              <FormMissionLevel
                data={props.data.easy}
                keyName="ง่าย"
                BGColor="#2ec00e" //green
                setHomeworkCreateDataQuizRemove={setHomeworkCreateDataQuizRemove}
                setHomeworkCreateDataQuizAdd={setHomeworkCreateDataQuizAdd}
              />
            )}
            {props.data.normal.quizzesId.length > 0 && (
              <FormMissionLevel
                data={props.data.normal}
                keyName="ปานกลาง"
                BGColor="#f1c232" //orange
                setHomeworkCreateDataQuizRemove={setHomeworkCreateDataQuizRemove}
                setHomeworkCreateDataQuizAdd={setHomeworkCreateDataQuizAdd}
              />
            )}
            {props.data.hard.quizzesId.length > 0 && (
              <FormMissionLevel
                data={props.data.hard}
                keyName="ยาก"
                BGColor="#f84444" //red
                setHomeworkCreateDataQuizRemove={setHomeworkCreateDataQuizRemove}
                setHomeworkCreateDataQuizAdd={setHomeworkCreateDataQuizAdd}
              />
            )}
          </div>
        )}
      </div>
    );
  };

export default FormMissionSubLesson;