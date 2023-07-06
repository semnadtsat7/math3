import { Table as AntTable } from "antd";

import styled from "styled-components";
import { space } from "styled-system";

const Table = styled(AntTable)`
  ${space};
  .ant-table {
    white-space: nowrap !important;
  }
`;

export default Table;
