import { Progress as AntProgress } from "antd";

import styled from "styled-components";
import { space } from "styled-system";

const Progress = styled(AntProgress)`
.ant-progress-text {
  color: #1C4E91;
}
  ${space};
`;

export default Progress;
