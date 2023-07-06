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
dayjs.extend(customParseFormat);
moment.locale("th");
const currentDate = moment();
const AssignmentForm = ({ mode, missionId }) => {
  const history = useHistory();
  const [assignmentType, setAssignmentType] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("-");
  const [selectedSubLesson, setSelectedSubLesson] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("-");
  const [selectedReward, setSelectedReward] = useState("-");
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
    const teacher = spaceID || Firebase.auth().currentUser.uid
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
        setGroups(data);
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
        setRewards(data);
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

  const handleChangeDeadline = (e) => {
    if (e && e.isBefore(endDate)) {
      alert("วันที่เลทได้ต้องอยู่หลังระยะเวลาในการทำ");
      return;
    }
    setDeadline(e);
  };

  const handleChangeSelectLesson = async (lessonId) => {
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

  const onSubLessonChange = (subLessons) => {
    setSelectedSubLesson(subLessons);
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
  };

  const getMapIds = () => {
    const translate = {
      ง่าย: "easy",
      ปานกลาง: "normal",
      ยาก: "hard",
    };
    const levels = selectedLevel.map((level) => translate[level]);
    return subLessonsWithDetail
      .filter(
        (subLessonWithDetail) =>
          selectedSubLesson.includes(subLessonWithDetail.title) &&
          levels.includes(subLessonWithDetail.level)
      )
      .map((subLesson) => subLesson._docId);
  };

  const getLessonNameFromId = () => {
    const lessonFound = lessons.find(
      (lesson) => lesson._docId === selectedLesson
    );
    return lessonFound.title;
  };

  const getRewardFromId = () => {
    return rewards.find((reward) => reward.id === selectedReward);
  };

  const getGroupFromId = () => {
    return groups.find((group) => group.id === selectedGroup);
  };

  const onSubmitForm = async () => {
    // if (!assignmentType) {
    //   alert("โปรดเลืิอกชนิดของการสั่งงาน");
    //   return;
    // }
    setLoading(true);
    if (selectedLesson === "-") {
      alert("โปรดเลืิอกบทเรียน");
      setLoading(false);
      return;
    }
    if (selectedSubLesson === "-") {
      alert("โปรดเลืิอกบทเรียนย่อย");
      setLoading(false);
      return;
    }
    if (selectedLevel.length <= 0) {
      alert("โปรดเลือกระดับความยาก");
      setLoading(false);
      return;
    }
    // if (startMap === 0) {
    //   alert("โปรดเลืิอกด่านเริ่มต้น");
    //   return;
    // }
    // if (endMap === 0) {
    //   alert("โปรดเลืิอกด่านสิ้นสุด");
    //   return;
    // }
    if (selectedGroup === "-") {
      alert("โปรดเลืิอกกลุ่มเรียน");
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

    const levelWithWeight = {
      ง่าย: 1,
      ปานกลาง: 2,
      ยาก: 3,
    };

    let data = {
      teacher: spaceID,
      assignmentType,
      status: "enabled",
      lessonId: selectedLesson,
      lesson: getLessonNameFromId(),
      subLesson: selectedSubLesson,
      mapIds: getMapIds(),
      level: selectedLevel.sort(
        (a, b) => levelWithWeight[a] - levelWithWeight[b]
      ),
      group: getGroupFromId(),
      reward: getRewardFromId(),
      startMap,
      endMap,
      startDate: startDate.format("YYYY-MM-DD HH:mm:ss"),
      endDate: endDate.format("YYYY-MM-DD HH:mm:ss"),
      deadline: deadline ? deadline.format("YYYY-MM-DD HH:mm:ss") : null,
    };
    let fnName = "teacher-mission-create";
    if (mode === "edit") {
      fnName = "teacher-mission-update";
      data.id = missionId;
    }
    try {
      console.log(JSON.stringify(data));
      await Firebase.functions().httpsCallable(fnName)(data);
      setLoading(false);
      message.success(
        mode === "edit" ? "อัพเดตข้อมูลเรียบร้อย" : "สร้างข้อมูลเรียบร้อย",
        3
      );
      history.push("/missions");
    } catch (error) {
      message.error("เกิดข้อผิดพลาด", 3);
      history.push("/missions");
      console.error(error);
    }
  };

  const getEditData = async () => {
    if (!missionId) return;
    const result = await Firebase.firestore()
      .collection("teachers")
      .doc(spaceID)
      .collection("missions")
      .doc(missionId)
      .get();
    const editData = result.data();
    setAssignmentType(editData.assignmentType);
    handleChangeSelectLesson(editData.lessonId);
    setSelectedSubLesson(editData.subLesson);
    setSelectedLevel(editData.level);
    setStartMap(editData.startMap);
    setEndMap(editData.endMap);
    setSelectedGroup(editData.group.id);
    setSelectedReward(editData.reward ? editData.reward.id : "");
    setStartDate(moment(editData.startDate, "YYYY-MM-DD HH:mm:ss"));
    setEndDate(moment(editData.endDate, "YYYY-MM-DD HH:mm:ss"));
    setDeadline(moment(editData.deadline, "YYYY-MM-DD HH:mm:ss"));
  };

  const initialForm = () => {
    getFormData();
    if (mode !== "edit") return;
    getEditData();
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day").subtract(1, "days");
  };

  useEffect(initialForm, [spaceID]);

  return (
    <Form name="validate_other" style={{ padding: "10px 20px" }}>
      <Row>
        <Col md={12} style={customColStyle}>
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
        <Col md={12} style={customColStyle}>
          <Form.Item
            label="บทเรียนย่อย"
            required
            tooltip="This is a required field"
          >
            <Select
              mode="multiple"
              placeholder="เลือกบทเรียนย่อย"
              value={selectedSubLesson}
              onChange={(subLesson) => onSubLessonChange(subLesson)}
            >
              {subLessons.map((subLesson) => (
                <Select.Option value={subLesson}>{subLesson}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={12} style={customColStyle}>
          <Form.Item label="ระดับความยาก">
            <Checkbox.Group
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e)}
            >
              <Checkbox value="ง่าย">ง่าย</Checkbox>
              <Checkbox value="ปานกลาง">ปานกลาง</Checkbox>
              <Checkbox value="ยาก">ยาก</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Col>
        {/* <Col md={12} style={customColStyle}>
          <Form.Item
            label="จำนวนด่าน"
            required
            tooltip="This is a required field"
          >
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <p style={{ marginRight: "20px" }}>ด่าน</p>
              <Input
                type="number"
                style={{ width: "60px", marginRight: "20px" }}
                value={startMap}
                onChange={(e) => {
                  setStartMap(e.target.value);
                  if (endMap < e.target.value) setEndMap(e.target.value);
                }}
                min={minMap}
                max={maxMap}
              />
              <p style={{ marginRight: "20px" }}>ถึง</p>
              <Input
                type="number"
                style={{ width: "60px", marginRight: "20px" }}
                value={endMap}
                onChange={(e) => setEndMap(e.target.value)}
                min={startMap}
                max={maxMap}
              />
            </div>
          </Form.Item>
        </Col> */}
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
              value={selectedReward}
              onChange={(reward) => setSelectedReward(reward)}
            >
              {rewards.map((reward) => (
                <Select.Option key={reward.id} value={reward.id}>
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
        {/* <Col md={12} style={customColStyle}>
          <Form.Item
            label="วันที่สามารถเลทได้"
            tooltip="This is a required field"
          >
            <DatePicker
              onFocus={(e) => (e.target.readOnly = true)}
              showTime
              placeholder="เลืิอกวันที่สามารถเลท"
              format={"DD MMM YYYY HH:mm:ss"}
              value={deadline}
              onChange={(e) => handleChangeDeadline(e)}
            />
          </Form.Item>
        </Col> */}
      </Row>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Col md={12} sm={12} style={customColStyle}>
        </Col>
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
