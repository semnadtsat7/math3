import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Radio, Checkbox, Form, Input, Select, Button } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { RootContext } from "../root";
import { DatePicker, message } from "antd";
import Firebase from "../utils/Firebase";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";

import { TeacherService } from "../services/Statistics";

import FormMissionSubLesson from "./FormMissionSubLesson";
import { CardWithTitleNoIcon } from "../components/Statistics";

dayjs.extend(customParseFormat);
moment.locale("th");
const currentDate = moment();
const AssignmentForm = ({ mode, missionId }) => {
  const history = useHistory();
  const [missionId_, setMissionId] = useState({ missionId });
  const [assignmentType, setAssignmentType] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("-");
  const [selectedSubLesson, setSelectedSubLesson] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("-");
  const [selectedReward, setSelectedReward] = useState("-");
  const [selectedRewardId, setSelectedRewardId] = useState("-");
  const [startMap, setStartMap] = useState(0);
  const [endMap, setEndMap] = useState(0);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [subLessons, setSubLessons] = useState([]);
  const [subLessonsWithDetail, setSubLessonsWithDetail] = useState([]);
  const { spaceID } = useContext(RootContext);
  const customColStyle = {
    padding: "0px 20px",
  };

  const getActiveLesson = async (teacher, allLesson) => {
    const snapshot = await Firebase.database()
      .ref(`teachers/${teacher}/maps`)
      .once("value");
    const teacherLessons = [];
    snapshot.forEach((teacherLesson) => {
      if (teacherLesson.val()) {
        teacherLessons.push(teacherLesson.key);
      }
    });
    return allLesson.filter((lesson) => {
      return teacherLessons.includes(lesson._docId);
    });
  };

  const getFormData = async () => {
    const teacher = spaceID || Firebase.auth().currentUser.uid;
    const response = await axios.get("https://clevermath.imgix.net/maps.json");
    if (response && response.data) {
      setLessons(await getActiveLesson(teacher, response.data));
    }

    Firebase.firestore()
      .collection("teachers")
      .doc(spaceID)
      .collection("groups")
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        //setGroups(data);
        setGroups(data.filter((group) => group.isActive));
      });

    Firebase.firestore()
      .collection("teachers")
      .doc(teacher)
      .collection("rewards")
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        //setRewards(data);
        setRewards(data.filter((reward) => reward.isActive));
      });
  };

  const handleChangePeriod = (e) => {
    const [start, end] = e;
    if (start.isBefore(currentDate)) {
      alert("วันที่เริ่มทำการบ้านต้องอยู่หลังวันปัจจุบัน");
      return;
    }
    setStartDate(start);
    setEndDate(end);
    if (deadline && deadline.isBefore(end)) setDeadline(end);
  };

  const handleChangeSelectLesson = async (lessonId) => {
    setQuizzesArray([]);
    setSelectedSubLesson([]);
    setSelectedLesson(lessonId);
    const response = await axios.get(
      `https://clevermath.imgix.net/quizzes/${lessonId}.json`
    );
    if (response && response.data) {
      setSubLessonsWithDetail(response.data);
      setSubLessons(removeDuplicateSubLessons(response.data));
    }
  };

  const removeDuplicateSubLessons = (subLessons) => {
    return [...new Set(subLessons.map((subLesson) => subLesson.title))];
  };

  const resetForm = () => {
    setSelectedLesson("-");
    setSelectedLevel([]);
    setSelectedReward("-");
    setSubLessons([]);
    setSelectedSubLesson([]);
    setStartDate(moment());
    setEndDate(null);
    setSelectedGroup("-");

    setSubLessonsChoices([]);
    setQuizzesArray([]);
  };

  // const onSubmitForm = async () => {
  //   // if (!assignmentType) {
  //   //   alert("โปรดเลืิอกชนิดของการสั่งงาน");
  //   //   return;
  //   // }
  //   setLoading(true);
  //   if (selectedLesson === "-") {
  //     alert("โปรดเลืิอกบทเรียน");
  //     setLoading(false);
  //     return;
  //   }
  //   if (selectedSubLesson === "-") {
  //     alert("โปรดเลืิอกบทเรียนย่อย");
  //     setLoading(false);
  //     return;
  //   }
  //   if (selectedLevel.length <= 0) {
  //     alert("โปรดเลือกระดับความยาก");
  //     setLoading(false);
  //     return;
  //   }
  //   // if (startMap === 0) {
  //   //   alert("โปรดเลืิอกด่านเริ่มต้น");
  //   //   return;
  //   // }
  //   // if (endMap === 0) {
  //   //   alert("โปรดเลืิอกด่านสิ้นสุด");
  //   //   return;
  //   // }
  //   if (selectedGroup === "-") {
  //     alert("โปรดเลืิอกกลุ่มเรียน");
  //     return;
  //   }
  //   // if (selectedReward === "-") {
  //   //   alert("โปรดเลืิอกรางวัล");
  //   //   return;
  //   // }
  //   if (!startDate && !endDate) {
  //     alert("โปรดเลือกช่วงเวลาทำการบ้าน");
  //     return;
  //   }

  //   const levelWithWeight = {
  //     ง่าย: 1,
  //     ปานกลาง: 2,
  //     ยาก: 3,
  //   };

  //   let data = {
  //     teacher: spaceID,
  //     assignmentType,
  //     status: "enabled",
  //     lessonId: selectedLesson,
  //     lesson: getLessonNameFromId(),
  //     subLesson: selectedSubLesson,
  //     mapIds: getMapIds(),
  //     level: selectedLevel.sort(
  //       (a, b) => levelWithWeight[a] - levelWithWeight[b]
  //     ),
  //     group: getGroupFromId(),
  //     reward: getRewardFromId(),
  //     startMap,
  //     endMap,
  //     startDate: startDate.format("YYYY-MM-DD HH:mm:ss"),
  //     endDate: endDate.format("YYYY-MM-DD HH:mm:ss"),
  //     deadline: deadline ? deadline.format("YYYY-MM-DD HH:mm:ss") : null,
  //   };
  //   let fnName = "teacher-mission-create";
  //   if (mode === "edit") {
  //     fnName = "teacher-mission-update";
  //     data.id = missionId;
  //   }
  //   try {
  //     console.log(JSON.stringify(data));
  //     await Firebase.functions().httpsCallable(fnName)(data);
  //     setLoading(false);
  //     message.success(
  //       mode === "edit" ? "อัพเดตข้อมูลเรียบร้อย" : "สร้างข้อมูลเรียบร้อย",
  //       3
  //     );
  //     history.push("/missions");
  //   } catch (error) {
  //     message.error("เกิดข้อผิดพลาด", 3);
  //     history.push("/missions");
  //     console.error(error);
  //   }
  // };

  const getEditData = async () => {
    if (!missionId) return;
    const result = await Firebase.firestore()
      .collection("teachers")
      .doc(spaceID)
      .collection("missions")
      .doc(missionId)
      .get();
    const editData = result.data();
    // setAssignmentType(editData.assignmentType);
    // handleChangeSelectLesson(editData.lessonId);
    // setSelectedSubLesson(editData.subLesson);
    // setSelectedLevel(editData.level);
    // setStartMap(editData.startMap);
    // setEndMap(editData.endMap);
    // setSelectedGroup(editData.group.id);

    //setSelectedReward(editData.reward ? editData.reward.rewardId : "");
    //setStartDate(moment(editData.startDate, "YYYY-MM-DD HH:mm:ss"));
    //setEndDate(moment(editData.endDate, "YYYY-MM-DD HH:mm:ss"));
    //setDeadline(moment(editData.deadline, "YYYY-MM-DD HH:mm:ss"));
    console.log(editData);
  };

  const initialForm = () => {
    getFormData();
    if (mode !== "edit") return;
    //getEditData();
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day").subtract(1, "days");
  };

  useEffect(initialForm, [spaceID]);

  //Shane 20/1/2023
  //const [lessonsChoices, setLessonsChoices] = useState([]);
  const [missions, setMissions] = useState([]); //ข้อมูลการบ้านทั้งหมดสำหรับหน้า edit
  const [editMission, setEditMission] = useState([]); //ข้อมูลการบ้านสำหรับหน้า edit
  const [subLessonsChoices, setSubLessonsChoices] = useState([]);
  const [quizzesArray, setQuizzesArray] = useState([]);
  const [quizzesNumber, setQuizzesNumber] = useState(0);
  const [RewardsChoices, setRewardsChoices] = useState([]);

  //ไม่ได้ใช้ ใช้ getSubLessonsChoice แทน
  // const getLessonsChoices = (spaceID, selectedGroup) => {
  //   try {
  //     setLoading(true);
  //     TeacherService.getLessonsChoices({
  //       teacherId: spaceID, //"Hcp9aoxiluUZ6oVGoGbj"
  //       groupId: selectedGroup, //"6yyUJrk1fsCF7iB2Ppgh"
  //     }).then((res) => {
  //       console.log(res);
  //       setLessonsChoices(res);
  //       message.success("เรียกข้อมูลการบ้านเรียบร้อย", 3);
  //     });
  //   } catch (err) {
  //     message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
  //     console.error(err);
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (selectedLesson.length > 2) {
      getSubLessonsChoices(spaceID, selectedLesson);
    }
  }, [selectedLesson]);

  const getSubLessonsChoices = () => {
    try {
      setLoading(true);
      //TeacherService.getSubLessonsChoices(mapId).then((res) => {
      TeacherService.getSubLessonsChoices({
        //mapId: "selectedLesson = M-0029"
        mapId: selectedLesson?.substring(2),
      }).then((res) => {
        console.log(res);
        setSubLessonsChoices(res);
        message.success("เรียกข้อมูลการบ้านเรียบร้อย", 3);
      });
    } catch (err) {
      message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      console.error(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceID) {
      try {
        setLoading(true);
        TeacherService.getRewardsChoices({
          teacherId: spaceID, //"Hcp9aoxiluUZ6oVGoGbj"
        }).then((res) => {
          //console.log(res);
          setRewardsChoices(res);
        });
      } catch (err) {
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
        console.error(err);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }, [spaceID]);

  useEffect(() => {
    if (spaceID && mode === "edit") {
      try {
        setLoading(true);
        TeacherService.getMissions({
          teacherId: spaceID, //"Hcp9aoxiluUZ6oVGoGbj"
        }).then((res) => {
          console.log(res);
          setMissions(res);
        });
      } catch (err) {
        message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
        console.error(err);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }, [spaceID]);

  useEffect(() => {
    const item = missions.filter((data) => {
      if (data?.missionId === missionId_.missionId) return data;
    });
    setEditMission(item);
    // console.log(item);
    // console.log(missionId_);
  }, [missions, missionId_]);

  useEffect(() => {
    if (editMission?.[0]) {
      handleChangeSelectLesson(editMission?.[0]?.lessonId);
      setSelectedSubLesson(editMission?.[0]?.subLesson);
      setSelectedLevel(editMission?.[0]?.level);
      //setQuizzesArray(editMission?.[0]?.mapsId); //ใส่ default value ให้บทเรียนย่อยที่เลือก ไม่ได้เพราะ toggle buttons' states เก็บไว้ในฝั่ง client side
      setSelectedGroup(editMission?.[0]?.group.id);
      setSelectedReward(editMission?.[0]?.reward);
      //setStartDate(editMission?.[0]?.startDate);
      //setEndDate(editMission?.[0]?.endDate);
    }
  }, [editMission]);

  const onSubmitForm = () => {
    try {
      setLoading(true);
      if (selectedLesson === "-") {
        alert("โปรดเลือกบทเรียน");
        setLoading(false);
        return;
      }
      if (selectedGroup === "-") {
        alert("โปรดเลือกกลุ่มเรียน");
        return;
      }
      // if (selectedReward === "-") {
      //   alert("โปรดเลืิอกรางวัล");
      //   return;
      // }
      if (!startDate && !endDate) {
        alert("โปรดเลือกช่วงเวลาทำการบ้าน");
        return;
      }
      if (!quizzesArray) {
        alert("โปรดเลือกข้อบทเรียนย่อย");
        return;
      }
      if (!spaceID) {
        alert("ไม่มีข้อมูลห้องเรียน");
        return;
      }

      if (mode === "create") {
        try {
          TeacherService.createMission({
            startDate: startDate.format("YYYY-MM-DD HH:mm:ss"),
            endDate: endDate.format("YYYY-MM-DD HH:mm:ss"),
            teacherId: spaceID,
            groupId: selectedGroup,
            lessonId: selectedLesson?.substring(2), //a.k.a mapId
            reward: selectedReward,
            quizzesArray: quizzesArray,
          }).then((res) => {
            console.log(res);
          });
          message.success("สร้างการบ้านเรียบร้อย", 3);
          history.push("/missions");
        } catch (err) {
          message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
          console.error(err);
          console.log(err);
          resetForm();
          //history.push("/missions");
        } finally {
          setLoading(false);
        }
      }

      if (mode === "edit") {
        try {
          TeacherService.updateMission({
            startDate: startDate.format("YYYY-MM-DD HH:mm:ss"),
            endDate: endDate.format("YYYY-MM-DD HH:mm:ss"),
            teacherId: spaceID,
            groupId: selectedGroup,
            lessonId: selectedLesson?.substring(2), //a.k.a mapId
            reward: selectedReward || "",
            quizzesArray: quizzesArray,
            missionId: missionId_.missionId,
          }).then((res) => {
            console.log(res);
          });
          message.success("แก้ไขการบ้านเรียบร้อย", 3);
          history.push("/missions");
        } catch (err) {
          message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
          console.error(err);
          console.log(err);
          resetForm();
          //history.push("/missions");
        } finally {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  function setHomeworkCreateDataQuizRemove(e) {
    //quizzesArray, setQuizzesArray
    console.log(e);
    setQuizzesArray(quizzesArray.filter((item) => item !== e)); //return an array without the item
    setQuizzesNumber((count) => count - 1);
  }

  function setHomeworkCreateDataQuizAdd(e) {
    //quizzesArray, setQuizzesArray
    console.log(e);
    quizzesArray.push(e); //add item to the end of array
    setQuizzesNumber((count) => count + 1);
  }


  useEffect(() => {
    let item = "";
    Object.entries(RewardsChoices).forEach((data) => {
      if (data?.[1]?.rewardId === selectedRewardId) {
        item = data?.[1];
      }
    });
    setSelectedReward(item);
    console.log(item);
  }, [selectedRewardId]);

  const onClick = () => {
    console.log(selectedRewardId)
    console.log(selectedReward)
    console.log(RewardsChoices)
    //console.log(Object.entries(RewardsChoices))
    //console.log(missions); //ข้อมูลการบ้านสำหรับหน้า edit
    //console.log(editMission); //ข้อมูลการบ้านสำหรับหน้า edit
    //console.log(missionId_);
    // console.log("startDate:" + startDate.format("YYYY-MM-DD HH:mm:ss"));
    // console.log("endDate:" + endDate.format("YYYY-MM-DD HH:mm:ss"));
    // console.log("teacherId:" + spaceID);
    // console.log("groupId:" + selectedGroup);
    // console.log("lessonId:" + selectedLesson?.substring(2));
    // console.log("reward:" + selectedReward);
    // console.log("quizzesArray:" + quizzesArray);
    // console.log("missionId:" + missionId_.missionId);
  };

  return (
    <Form name="validate_other" style={{ padding: "10px 20px" }}>
      <Row>
        <Col md={12} style={customColStyle}>
          {/* <div onClick={getSubLessonsChoices}>getSubLessonsChoices</div> */}
          {/* <div onClick={onClick}>console log</div> */}
          <Form.Item
            label="บทเรียน"
            required
            tooltip="This is a required field"
          >
            <Select
              placeholder="เลือกบทเรียน"
              value={selectedLesson}
              onChange={(lessonId) => handleChangeSelectLesson(lessonId)}
            >
              {lessons.map((lesson) => (
                <Select.Option key={lesson._docId} value={lesson._docId}>
                  {lesson.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={24} style={customColStyle}>
          <Form.Item label="บทเรียนย่อย">
            {!loading && (
              <div className="flex flex-1 flex-col gap-y-5 overflow-y-auto scroll-smooth">
                {subLessonsChoices &&
                  Object.keys(subLessonsChoices).map((key, index) => {
                    return (
                      <div style={{ marginBottom: "10px" }}>
                        <CardWithTitleNoIcon title={key}>
                          <FormMissionSubLesson
                            key={index}
                            data={subLessonsChoices[key]}
                            keyName={key}
                            setHomeworkCreateDataQuizRemove={
                              setHomeworkCreateDataQuizRemove
                            }
                            setHomeworkCreateDataQuizAdd={
                              setHomeworkCreateDataQuizAdd
                            }
                          />
                        </CardWithTitleNoIcon>
                      </div>
                    );
                  })}
              </div>
            )}
          </Form.Item>
        </Col>
        <Col md={24} style={customColStyle}>
          <p>จำนวนด่านที่เลือก: {quizzesNumber}</p>
        </Col>
      </Row>
      <Row>
        <Col md={12} style={customColStyle}>
          <Form.Item
            label="ห้องเรียน"
            required
            tooltip="This is a required field"
          >
            <Select
              value={selectedGroup}
              onChange={(group) => setSelectedGroup(group)}
            >
              {groups.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} style={customColStyle}>
          <Form.Item label="รางวัล" tooltip="This is a required field">
            <Select
              //value={selectedReward}
              //onChange={(reward) => onChosenReward(reward)}
              onChange={(reward) => setSelectedRewardId(reward)}
            >
              {/* {rewards.map((reward) => ( */}
              {RewardsChoices?.map((reward) => (
                <Select.Option key={reward.rewardId} value={reward.rewardId}>
                {/* // <Select.Option key={reward} value={reward}>  */}
                  <>
                    <img src={reward.image} style={{ width: "25px" }} />
                    {reward.name}
                  </>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={12} style={customColStyle}>
          <Form.Item
            label="ระยะเวลาในการทำ"
            required
            tooltip="This is a required field"
          >
            <DatePicker.RangePicker
              showTime
              disabledDate={disabledDate}
              onFocus={(e) => (e.target.readOnly = true)}
              value={[startDate, endDate]}
              onChange={(e) => handleChangePeriod(e)}
              format={["DD MMM YYYY HH:mm", "DD MMM YYYY HH:mm"]}
              placeholder={["วันที่เริ่ม", "วันที่สิ้นสุด"]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Col md={12} sm={12} style={customColStyle}></Col>
        <Col
          md={12}
          sm={12}
          style={{
            ...customColStyle,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button style={{ margin: "0 5px" }} onClick={() => resetForm()}>
            ยกเลิก
          </Button>
          <Button
            style={{ margin: "0 5px" }}
            onClick={() => onSubmitForm()}
            type="primary"
            loading={loading}
          >
            {mode === "create" ? "สร้าง" : "บันทึก"}
          </Button>
        </Col>
        ​
      </Row>
    </Form>
  );
};

export default AssignmentForm;
