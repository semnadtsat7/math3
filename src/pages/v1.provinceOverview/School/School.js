import "./School.css";
import React, { useRef, useState, useEffect } from "react";
import { Col, Row, Card, Box } from "../../../core/components";

import SchoolTable from "./SchoolTable";
import Parent from "../../../components/Parent";
import Header from "../../students.ts.v1/Header";

import { SchoolService } from "../../../services/Statistics";

export default function School() {
  const parent = useRef(Parent);

  const [schoolsStatisticsByProvince, setSchoolsStatisticsByProvince] =
    useState({
      loading: true,
      data: {},
    });

  useEffect(() => {
    SchoolService.getSchoolsStatisticsByProvinceAsync().then(
      setSchoolsStatisticsByProvince
    );
  }, []);

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title="โรงเรียนในจังหวัด"
      />
      <Box>
        <div className="School">
          <Card bordered={false} className="w-100 School-Container">
            <Box mt="3">
              <SchoolTable
                datasource={schoolsStatisticsByProvince?.schoolList ?? []}
                loading={schoolsStatisticsByProvince?.loading}
                province={schoolsStatisticsByProvince?.province?.name ?? []}
              />
            </Box>
          </Card>
        </div>
      </Box>
    </Parent>
  );
}
