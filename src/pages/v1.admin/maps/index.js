import React, { useRef, useReducer } from "react";
import Parent from "../../../components/Parent";
import Header from "./Header";
import Table from "./Table";
function reducer(state, action) {
  if (action.type === "add") {
    return [...state, action.payload];
  } else if (action.type === "remove") {
    return state.filter((e) => e !== action.payload);
  } else {
    throw new Error();
  }
}
function PageMaps() {
  const parent = useRef(Parent);

  const [actions, dispatch] = useReducer(reducer, []);

  const addAction = (action) => dispatch({ type: "add", payload: action });
  const removeAction = (action) =>
    dispatch({ type: "remove", payload: action });

  return (
    <Parent ref={parent}>
      <div>
        <Header
          actions={actions}
          addAction={addAction}
          removeAction={removeAction}
        />
        <Table
          actions={actions}
          addAction={addAction}
          removeAction={removeAction}
        />
      </div>
    </Parent>
  );
}
export default PageMaps;
