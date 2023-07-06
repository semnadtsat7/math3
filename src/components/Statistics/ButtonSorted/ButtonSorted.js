import React from "react";
import { useState, useEffect } from "react";

import { Button, Box } from "../../../core/components";

import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";

export default function ButtonSorted(props) {
  const { id = "isButtonSorted", title, width = 180, disabled = false } = props;

  useEffect(() => {}, []);

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem(id) === "true"
  );

  function handleOnButtonClicked() {
    const isButtonSorted = !collapsed;

    localStorage.setItem(id, isButtonSorted);
    setCollapsed(isButtonSorted);
    if(props.onClick) {
      props.onClick(isButtonSorted)
    }
  }

  function getIcon(collapse) {
    return collapse ? <CaretUpFilled /> : <CaretDownFilled />;
  }

  return (
    <Box>
      <Button onClick={handleOnButtonClicked} style={{ width: width }} disabled={disabled}>
        {title} {getIcon(collapsed)}
      </Button>
    </Box>
  );
}
