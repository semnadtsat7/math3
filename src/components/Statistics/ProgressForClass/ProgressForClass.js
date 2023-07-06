import React from "react";
import { Progress, Card, Box } from "../../../core/components";
import styled from "styled-components";
import { Row, Col } from "antd";

const AntCard = styled(Card)``;

export default function ProgressForClass(props) {
  const { name, value } = props;

  return (
    <Box className="w-100">
      <h4>
        <strong>{name}</strong>
      </h4>
      <Row gutter={[8, 8]}>
        {value.lessons.map((item, i) => {
          return (
            <Col md={10} lg={8} key={i}>
              <AntCard
                className="w-100"
                //bordered={false}
                style={{
                  backgroundColor: "rgb(247 247 247)",
                  border: "0px",
                  borderRadius: "20px",
                }}
              >
                <div className="text-center">
                  <p className="mb-0">{item.title}</p>
                </div>
                <Progress percent={item.percentage} />
              </AntCard>
            </Col>
          );
        })}
      </Row>
    </Box>
  );
}
