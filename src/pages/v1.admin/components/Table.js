import React, { createRef, useState, useEffect } from "react";
import styled from "styled-components";

import { Button, Icon, Empty, Modal } from "antd";
import { Resizable } from "react-resizable";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";

import EditModal from './SoundEditModal';


import FieldIndex from "./Field.Index";

const Table = styled.div`
  font-family: Tahoma, sans-serif;
  font-size: 14px;

  display: flex;

  flex-direction: column;
  flex-wrap: nowrap;

  /* overflow-x: auto;
    overflow-y: hidden; */

  width: 100%;

  padding: 0 !important;
  margin: 0 !important;
`;

const TableRow = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  ${(props) =>
    props.lock &&
    `
        opacity: 0.5;
        
        pointer-events: none;
        position: relative;

        &:after
        {
            content: 'กำลังแก้ไขโดยผู้ใช้อื่น';
            position: absolute;
            left: 0;
            top: 0;

            background-color: black;

            color: white;

            padding: 4px 8px;

            font-size: 0.8em;
        }
    `}
`;

const TableHead = styled.div`
  position: relative;
  z-index: 10;
`;

const TableBody = styled.div`
  /* overflow-x: visible; */
`;

const TableCell = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  box-sizing: border-box;
  background-color: white;

  border-bottom: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;

  &:first-child {
    border-left: 1px solid #d9d9d9;
  }

  &.react-resizable {
    position: relative;
    background-clip: padding-box;
  }

  .react-resizable-handle {
    position: absolute;
    width: 10px;
    height: 100%;
    bottom: 0;
    right: -5px;
    cursor: col-resize;
    z-index: 1;
  }

  ${(props) =>
    props.head &&
    `
        border-top: 1px solid #d9d9d9;
        padding: 8px 12px;
    
        background-color: #f0f0f0;

        font-weight: bold;
    `}

  ${(props) =>
    props.width &&
    `
        min-width: ${props.width}px;
        width: ${props.width}px;
    `}

    ${(props) =>
    !props.width &&
    `
        flex-grow: 1;
    `}

    ${(props) =>
    props.minWidth &&
    `
        min-width: ${props.minWidth}px;
    `}

    ${(props) =>
    props.lock &&
    `
        border-top: 1px solid black;
        pointer-events: none;
    `}
`;

const TableCellEmpty = styled.div`
  padding: 8px 12px;
`;

const Center = styled.div`
  padding: 24px 12px;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;
`;

const Handle = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;

  align-items: center;
  justify-content: center;

  cursor: move;
  user-select: none;

  line-height: 1;

  width: 16px;
  height: 16px;

  margin: 8px auto auto;

  border-radius: 50%;
  padding: 16px;

  transition: background-color 0.2s ease;

  color: #333;

  @media (hover: hover) {
    &:hover {
      background-color: #ddd;
    }
  }

  ${(props) =>
    props.disabled &&
    `
        pointer-events: none;
        opacity: 0.5;
    `}
`;

const Actions = styled.div`
  padding:0 8px;
`;

const SortableTableBody = SortableContainer(TableBody);
const SortableTableRow = SortableElement(TableRow);
const SortableTableRowHandle = SortableHandle(Handle);

function TableCellResizable(props) {
  const { onResize, resizable, width, ...restProps } = props;

  if (!width || !resizable) {
    return <TableCell {...restProps} width={width} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <TableCell {...restProps} width={width} />
    </Resizable>
  );
}

function Comp({
  addText = "เพิ่ม",
  emptyText = "ไม่มีข้อมูล",

  items = [],
  columns = [],

  index = true,
  limit = 1000,

  onAdd,
  onRemove,

  onSort,
  onResize,

  actions = [],
}) {
  const [editor, setEditor] = useState("null");

  const table = createRef();
  const head = createRef();

  const enabled = actions.length === 0;
  const sortable = items.length > 1 && enabled;
  const now = new Date().getTime();

  function onEffect() {
    setEditor(window.localStorage.getItem("_editorID"));

    const e1 = table.current;
    const e2 = head.current;

    const handleScroll = (e) => {
      const b = e1.getBoundingClientRect();

      if (b.top < 0) {
        e2.style.top = `${-b.top}px`;
      } else {
        e2.style.top = null;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: false,
    });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }

  useEffect(onEffect, []);

  return (
    <Table ref={table}>
      <TableHead ref={head}>
        <TableRow>
          <TableCell width={40} head={true}></TableCell>
          {!!index && (
            <TableCell width={70} head={true}>
              ลำดับ
            </TableCell>
          )}
          {columns.map((col, index) => {
            return (
              <TableCellResizable
                key={`table-row-head-${index}`}
                resizable={col.resizable && enabled}
                minWidth={col.minWidth}
                width={col.width}
                head={true}
                onResize={(e, { size }) => {
                  if (typeof onResize === "function") {
                    onResize(index, size.width);
                  }
                }}
              >
                {col.title}
              </TableCellResizable>
            );
          })}
          <TableCell minWidth={100} head={true}></TableCell>
        </TableRow>
      </TableHead>
      {actions.indexOf("loading") >= 0 ? (
        <Center>
          <Icon type="loading" />
        </Center>
      ) : items.length === 0 ? (
        <Center>
          <Empty description={emptyText} />
        </Center>
      ) : (
        <SortableTableBody
          axis="y"
          useDragHandle={true}
          onSortEnd={!!sortable ? onSort : null}
        >
          {items.map((item, itemIndex) => {
            const key = item.id || `table-row-body-${itemIndex}`;
            const { lock } = item.data;

            let isLock = false;

            if (!!lock && lock.editor !== editor && now - lock.time < 10000) {
              isLock = true;
            }

            return (
              <SortableTableRow
                key={key}
                lock={isLock}
                index={itemIndex}
                sortIndex={itemIndex}
              >
                <TableCell width={40} lock={isLock}>
                  <SortableTableRowHandle disabled={!sortable}>
                    ::
                  </SortableTableRowHandle>
                </TableCell>
                <TableCell width={70} lock={isLock}>
                  <FieldIndex value={itemIndex + 1} />
                </TableCell>
                {columns.map((col) => {
                  return (
                    <TableCell
                      key={`${key}-${col.field}`}
                      minWidth={col.minWidth}
                      width={col.width}
                      lock={isLock}
                    >
                      {col.render ? (
                        col.render(item, itemIndex, isLock)
                      ) : (
                        <TableCellEmpty />
                      )}
                    </TableCell>
                  );
                })}
                <TableCell minWidth={100} lock={isLock}>
                  {/* <TableCellEmpty /> */}
                  <Actions>
                    <EditModal 
                    item1 = {item} //1 item mapping
                    items = {items}//all items
                    number = {itemIndex} 
                  />
                  </Actions>
                  
                  <Actions>
                    <Button
                      type="danger"
                      icon="delete"
                      disabled={!enabled}
                      onClick={() => {
                        const m = Modal.confirm({
                          title: `ต้องการลบ ?`,
                          okButtonProps: { type: "danger" },
                          okText: "ใช่",
                          cancelText: "ไม่ใช่",
                          onOk: () => {
                            onRemove(itemIndex);
                            m.destroy();
                          },
                        });
                      }}
                    >
                      ลบ
                    </Button>
                    

                  </Actions>
                    
                  

                </TableCell>
              </SortableTableRow>
            );
          })}
        </SortableTableBody>
      )}

      <div
        style={{
          padding: 8,
          width: `240px`,
          margin: items.length === 0 ? "auto" : 0,
        }}
      >
        {items.length < limit && (
          <Button
            type="primary"
            block={true}
            onClick={onAdd}
            disabled={!enabled}
          >
            {addText}
          </Button>
        )}
      </div>
    </Table>
  );
}

export default Comp;
