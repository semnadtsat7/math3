import React, { useRef, useState, useEffect } from "react";
import Parent from "../../components/Parent";
import Header from "../students.ts.v1/Header";
import {
  Menu,
  Col,
  Row,
  Card,
  Box,
  Button,
  Dropdown,
} from "../../core/components";
import { Upload, Icon } from "antd";
import { Link, useHistory } from "react-router-dom";

import AffiliateTable from "./AffiliateTable";
import { AffiliateService } from "../../services/Affiliate";

export default function Affiliate() {
  const parent = useRef(Parent);
  const history = useHistory();

  const [affiliates, setAffiliates] = useState({
    loading: true,
    data: {},
  });
  const [role, setRole] = useState();

  useEffect(() => {
    setRole(window.localStorage.getItem("roles"))
    AffiliateService.getAllAffiliations().then(setAffiliates);
  }, []);

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title="สังกัดทั้งหมด"
        actions={[
          <Button
            type="primary"
            onClick={() => history.push("/affiliates/create")}
          >
            เพิ่มสังกัด
          </Button>,
        ]}
      />
      <Box>
        <div className="Schools">
          <Card bordered={false} className="w-100 Schools-Container">
            <Box>
              <AffiliateTable
                datasource={affiliates?.loading ? [] : affiliates}
                loading={affiliates?.loading}
                role={role}
              />
            </Box>
          </Card>
        </div>
      </Box>
    </Parent>
  );
}
