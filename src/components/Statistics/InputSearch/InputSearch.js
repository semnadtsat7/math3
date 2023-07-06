import React from "react";
import "./InputSearch.css";
import { Input } from "../../../core/components";
import styled from "styled-components";

const Search = styled(Input.Search)`
  .ant-input-group > .ant-input:first-child,
  .ant-input-group-addon:first-child {
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
  }
`;

export default function InputSearch(props) {
  const { placeholder, disabled = false } = props;
  function onSearch(value) {
    if (props.onSearch) {
      props.onSearch(value);
    }
  }

  return (
    <Search
      placeholder={placeholder}
      onSearch={(value) => onSearch(value)}
      style={{ width: "100%" }}
      disabled={disabled}
    />
  );
}
