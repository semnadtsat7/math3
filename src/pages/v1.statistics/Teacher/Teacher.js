import React, { useRef, useState, useEffect } from "react";
import { ScrollView, Card } from "../../../core/components";
import {} from "../../../components/Statistics";
import {} from "@ant-design/icons";

import TeacherTable from "./TeacherTable";
import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";

import { Spin } from "antd";

import { TeacherService, SchoolService } from "../../../services/Statistics";

export default function Teacher() {
  const parent = useRef(Parent);

  const _schoolId = window.localStorage.getItem("schoolId");

  const [lessions, setLessions] = useState({
    loading: true,
    data: {},
  });
  const [schoolProfile, setSchoolProfile] = useState({
    loading: true,
    data: {},
  });

  useEffect(() => {
    TeacherService.getSectionLessionsBySchoolId().then(setLessions);
    if (_schoolId) {
      SchoolService.getSchoolProfileBySchoolIdAsync(_schoolId).then(
        (result) => {
          setSchoolProfile(result);
        }
      );
    }
  }, []);

  const getTitle = () => {
    const title = "รายชื่อครูในหมวดวิชาในโรงเรียน";
    if (schoolProfile?.loading) {
      return (
        <>
          {title} : {<Spin />}{" "}
        </>
      );
    }

    return (
      <>
        {title} : {schoolProfile?.name?.thai}
      </>
    );
  };

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title={getTitle()}
      />
      <Card>
        <ScrollView>
          <TeacherTable
            datasource={lessions?.loading ? [] : lessions}
            loading={lessions?.loading}
          />
        </ScrollView>
      </Card>
    </Parent>
  );
}
