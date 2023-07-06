import React, { useState, useEffect } from "react";
import Index from "../components/Field.Index";

import Table from "../components/Table";
import Select from "../components/Input.Select";
import TextArea from "../components/Input.TextArea";

import Collection from "../utils/Collection";

function Comp({ actions = [], addAction, removeAction }) {
  // const collection = `${window.testconfig.space}/admin/maps`
  const collection = `production/admin/maps`;

  const [items, setItems] = useState([]);
  const [sizes, setSizes] = useState({});
  const [focus, setFocus] = useState(-1);

  const _exludes = ["saving", "typing"];
  const _actions = actions.filter((e) => _exludes.indexOf(e) < 0);

  const disabled = _actions.length > 0;

  const columns = [
    {
      title: "รหัส",
      field: "uuid",
      width: 64,
      resizable: false,
      render: ({ uuid }, index, lock) => {
        return <Index value={uuid} />;
      },
    },
    {
      title: "บทเรียน",
      field: "title",
      width: sizes[1] || 320,
      resizable: true,
      render: ({ data }, index, lock) => {
        return (
          <TextArea
            disabled={disabled || lock}
            rows={2}
            value={data.title}
            onChange={(value) => handleUpdate(index, "title", value)}
            onFocus={() => setFocus(index)}
            onBlur={() => setFocus(-1)}
            onTypingStart={() => addAction("typing")}
            onTypingEnd={() => removeAction("typing")}
          />
        );
      },
    },
    {
      title: "ประเภท",
      field: "type",
      width: 140,
      resizable: false,
      render: ({ data }, index, lock) => {
        return (
          <Select
            disabled={disabled || lock}
            value={data.type || "normal"}
            onChange={(value) => handleUpdate(index, "type", value)}
            onFocus={() => setFocus(index)}
            onBlur={() => setFocus(-1)}
            options={[
              {
                key: `${index}-type-normal`,
                value: `normal`,
                children: <span style={{ color: `#3e2723` }}>ปกติ</span>,
              },
              {
                key: `${index}-type-tutorial`,
                value: `tutorial`,
                children: <span style={{ color: `#6200ea` }}>วิธีการเล่น</span>,
              },
            ]}
          />
        );
      },
    },
    {
      title: "สถานะ",
      field: "status",
      width: 120,
      resizable: false,
      render: ({ data }, index, lock) => {
        return (
          <Select
            disabled={disabled || lock}
            value={data.status || "draft"}
            onChange={(value) => handleUpdate(index, "status", value)}
            onFocus={() => setFocus(index)}
            onBlur={() => setFocus(-1)}
            options={[
              {
                key: `${index}-status-draft`,
                value: `draft`,
                children: <span style={{ color: `#ff6d00` }}>แบบร่าง</span>,
              },
              {
                key: `${index}-status-publish`,
                value: `publish`,
                children: <span style={{ color: `#00c853` }}>เผยแพร่</span>,
              },
            ]}
          />
        );
      },
    },
  ];

  const handleCreate = async () => {
    addAction("saving");

    const docs = items;
    let id = "0000";

    function filter(_id) {
      return docs.filter(({ uuid }) => uuid === _id);
    }

    for (let i = 1; i <= 9999; i++) {
      id = i.toString(10).padStart(4, "0");

      if (filter(id).length === 0) {
        break;
      }
    }

    await Collection.create({ collection, docs, uuid: id });

    removeAction("saving");
    // console.log ('create')
  };

  const handleDelete = async (index) => {
    addAction("saving");

    const docs = items;

    Collection.delete({ collection, docs, index });

    removeAction("saving");
    // console.log ('delete')
  };

  const handleUpdate = async (index, field, value) => {
    addAction("saving");

    const docs = items;
    const data = { [field]: value };

    await Collection.update({ collection, docs, index, data });

    removeAction("saving");
    // console.log ('update')
  };

  const handleMove = async ({ oldIndex, newIndex }) => {
    addAction("saving");

    // if (Math.abs (oldIndex - newIndex) > 1)
    // {
    //     setAction ('saving')
    // }

    const docs = items;
    const onUpdate = setItems;

    await Collection.move({ collection, docs, oldIndex, newIndex, onUpdate });

    removeAction("saving");
    // setAction (null)
    // console.log ('move')
  };

  const handleResize = (index, width) => {
    setSizes({ ...sizes, [index]: width });
  };

  const handleMount = () => {
    addAction("loading");

    const callback = (docs) => {
      setItems(docs);
      removeAction("loading");
    };

    const unsubscribes = [Collection.listen({ collection, callback })];

    return () => {
      unsubscribes.forEach((fn) => fn());
    };
  };

  const handleBody = () => {
    const unlock = () => {
      setFocus(-1);
    };

    window.addEventListener("focus", unlock);

    return () => {
      window.removeEventListener("focus", unlock);
    };
  };

  const handleFocusing = () => {
    if (focus >= 0) {
      const lock = async () => {
        await Collection.lock({ collection, docs: items, index: focus });
        // console.log ('focusing', focus)
      };

      const unlock = async () => {
        await Collection.unlock({ collection, docs: items, index: focus });
        // console.log ('blurring', focus)
      };

      lock();

      const interval = setInterval(lock, 5000);

      return () => {
        clearInterval(interval);
        unlock();
      };
    }
  };

  const handleBlurring = () => {
    const editor = window.localStorage.getItem("_editorID");

    const unlock = () => {
      const now = new Date().getTime();
      let hasChanged = false;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const lock = item.data.lock;

        if (!!lock && lock.editor !== editor && now - lock.time >= 10000) {
          item.data.lock = null;
          hasChanged = true;
        }
      }

      if (!!hasChanged) {
        setItems([...items]);
      }
    };

    unlock();
    const interval = setInterval(unlock, 5000);

    return () => {
      clearInterval(interval);
    };
  };

  useEffect(handleMount, []);
  useEffect(handleBody, []);
  useEffect(handleBlurring, [items]);
  useEffect(handleFocusing, [focus]);

  return (
    <Table
      addText="เพิ่มบทเรียน"
      emptyText="ไม่มีบทเรียน"
      actions={_actions}
      items={items}
      columns={columns}
      onAdd={handleCreate}
      onRemove={handleDelete}
      onSort={handleMove}
      onResize={handleResize}
    />
  );
}

export default Comp;
