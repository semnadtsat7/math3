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
import { Upload, Icon, Select, Spin } from "antd";
import { Link, useHistory } from "react-router-dom";

import UserTable from "./UserTable";
import { UserService, PositionService, RoleService } from "../../services/User";
import { Input } from "../../core/components";

import CloseIcon from "@material-ui/icons/Close";

export default function Affiliate() {
  const parent = useRef(Parent);
  const history = useHistory();
  const [role, setRole] = useState();

  const [users, setUsers] = useState({
    loading: true,
    data: {},
  });
  const [usersFilter, setUsersFilter] = useState({
    loading: true,
    data: {},
  });
  const [roles, setRoles] = useState({
    loading: true,
    data: {},
  });
  const [positions, setPositions] = useState({
    loading: true,
    data: {},
  });

  const [originalData, setOriginalData] = useState(null);
  const clearFilters = () => {
    setUsersFilter(originalData);
  };

  useEffect(() => {
    setRole(window.localStorage.getItem("roles"));
    //UserService.getAllUser().then((result) => {
      UserService.getAllUserV2().then((result) => {
      setUsers(result);
      setUsersFilter(result);
      setOriginalData(result);
    });
    PositionService.getAllPositions().then(setPositions);
    RoleService.getAllRoles().then(setRoles);
  }, []);

  const search = (value) => {
    const usersFilter = users.filter((e) => {
      return (
        e.email.includes(value) ||
        e.roles === value ||
        e.positions?.name.thai === value ||
        (typeof e.name === 'string' && e.name?.includes(value))
      );
    });
    setUsersFilter(usersFilter);
  };

  return (
    <Parent ref={parent}>
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title="ผู้ใช้งาน"
      />
      <Box mt="3" mb="3">
        <Row gutter={[8, 8]} justify="center" type="flex">
          <Col xs={24} sm={12}>
            <Box>
              <Input
                placeholder="ค้นหาตามชื่อ หรือ อีเมล"
                onChange={(e) => {
                  search(e.target.value);
                }}
                loading={users?.loading}
                allowClear={{ clearIcon: <CloseIcon onClick={clearFilters} /> }}
              />
            </Box>
          </Col>
          <Col>
            {roles?.loading ? (
              <Spin />
            ) : (
              <Select
                style={{ width: 150 }}
                onChange={(e) => {
                  search(e);
                }}
                placeholder="บทบาท"
              >
                <Select.Option value={""}>
                  All
                </Select.Option>
                {roles.map((role) => {
                  return (
                    <Select.Option key={role.id} value={role.name}>
                      {role.name ?? "N/A"}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Col>
          <Col>
            {positions?.loading ? (
              <Spin />
            ) : (
              <Select
                style={{ width: 150 }}
                onChange={(e) => {
                  search(e);
                }}
                placeholder="ตำแหน่ง"
              >
                <Select.Option value={""}>
                  All
                </Select.Option>
                {positions.map((position) => {
                  return (
                    <Select.Option
                      key={position.id}
                      value={position?.name?.thai}
                    >
                      {position?.name?.thai ?? "N/A"}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Col>
        </Row>
      </Box>
      <Box>
        <div className="Users">
          <Card bordered={false} className="w-100 User-Container">
            <Box>
              <UserTable
                datasource={usersFilter?.loading ? [] : usersFilter}
                loading={usersFilter?.loading}
                role={role}
              />
            </Box>
          </Card>
        </div>
      </Box>
    </Parent>
  );
}
