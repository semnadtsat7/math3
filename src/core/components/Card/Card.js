import { Card as AntCard } from "antd";

import styled from "styled-components";

const Card = styled(AntCard)`
  /* xs */
  @media only screen and (max-width: 480px) {
    .ant-card-head-wrapper {
      display: unset !important;
    }
    .ant-card-head-title {
      padding: 10px 0 0 0 !important;
      text-align: center !important;
      width: 100% !important;
    }
    .ant-card-extra {
      padding: 0 0 10px 0 !important;
      width: 100% !important;
    }
  }
`;

export default Card;
