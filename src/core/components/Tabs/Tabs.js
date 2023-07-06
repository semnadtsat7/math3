import { Tabs as AntTabs } from "antd";

import styled from "styled-components";

const Tabs = styled(AntTabs)`
  .ant-tabs-nav {
    margin: 0 !important;
  }
  .ant-tabs-content-holder {
    background-color: #fff !important;
    padding: 10px !important;
  }
  .ant-tabs-card {
    border: 1px solid #f0f0f0 !important;
  }
  .ant-tabs-tab {
    // padding: 16px 21px !important;
  }

  @media only screen and (max-width: 480px) {
    .ant-tabs-content-holder {
      padding: 0px !important;
    }
  }
`;

const TabPane = styled(Tabs.TabPane)``;

Tabs.TabPane = TabPane;

export default Tabs;
