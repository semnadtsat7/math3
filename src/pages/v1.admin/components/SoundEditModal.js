import React, { useState, useEffect } from "react";
import { Modal, Button, Select } from "antd";
import { SoundOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import jsonData from "./Data.json";
import "./SoundEditModal.css";

const { Option } = Select;

const MyModal = ({ id, item1, items, number }) => {
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  id = item1.uuid;

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    setData(jsonData.result);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const filteredMainData = data.filter(item => item._docId.includes(`Q-${item1.uuid}`));
  console.log(filteredMainData)


  const playAudio = (audiosrc) => {
    const audio = new Audio(audiosrc);
    audio.play();
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };



  return (
    <>
      <Button
        type="primary"
        style={{ margine: "0 5px", width: "70px" }}
        onClick={showModal}
      >
        แก้ไข
      </Button>
      <Modal
        title={
          <span>
            <SoundOutlined style={{ marginRight: "8px" }} />
            สร้างไฟล์เสียง
          </span>
        }
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        style={modalStyle}
        footer={[
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button key="submit" type="primary" onClick={handleOk}>
              Submit
            </Button>
          </div>,
        ]}
      >
        <h4>ชื่อบทเรียน : {item1.data.title}</h4>
        <header className="modal-header">
          <div>No</div>
          <div>Title</div>
          <div>Description</div>
          <div>Audio</div>
        </header>
        {filteredMainData.map((item,index) => (
          

          <div key={`item-${index}`}>
          <Select
            defaultValue="default"
            style={{ width: "800px" }}
            onChange={handleOptionChange}
          >
            <Option value="default" disabled>
              <h4>รหัสบทเรียน :{item1.uuid} </h4>
              
            </Option>

            {item.questions &&
              item.questions.map((question, index) => (
                <Option key={index} value={question.title}>
                  <div className="modal-content">
                    <div>{index + 1}</div>
                    <div>
                      <Button
                        type="primary"
                        style={{
                          margin: "0 5px",
                          width: "70px",
                        }}
                        onClick={() => playAudio(question.audio)}
                      >
                        Play
                      </Button>
                    </div>
                    <div className="title">{question.title}</div>
                    <div className="description">{question.description}</div>
                    
                  </div>
                </Option>
              ))}
          </Select>
        </div>
        ))}
        
      </Modal>
    </>
  );
};

export default MyModal;

// import React, { useState, useEffect } from "react";
// import { Modal, Button } from "antd";
// import { SoundOutlined} from "@ant-design/icons";
// import "antd/dist/antd.css";
// import jsonData from "./Data.json";

// const MyModal = ({ id, item1, items, number }) => {
//   const [data, setData] = useState(null);
//   const [visible, setVisible] = useState(false); // State to control the modal visibility
//   id = item1.uuid;
//   // console.log(item1);
//   // console.log(items);
//   // console.log(number);

//   const showModal = () => {
//     setVisible(true);
//   };

//   const handleOk = () => {
//     setVisible(false);
//   };

//   const handleCancel = () => {
//     setVisible(false);
//   };

//   useEffect(() => {
//     // Set the data from the imported JSON
//     setData(jsonData.result);
//   }, []);

//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   const filteredData = data.filter((item) => parseInt(item.id) === parseInt(id));

//   if (filteredData.length === 0) {
//     return <div>No data found for ID: {id}</div>;
//   }

//   const item = filteredData[0]; // Assuming there's only one item with the matching ID

//   const playAudio = (audiosrc) => {
//     const audio = new Audio(audiosrc);
//     audio.play();
//   };

//   const modalStyle = {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   };

//     return (
//     <>
//       <Button
//         type="primary"
//         style={{ margine: "0 5px", width: "70px" }}
//         onClick={showModal}
//       >
//         แก้ไข
//       </Button>
//       <Modal
//         title={
//           <span>
//             <SoundOutlined style={{ marginRight: "8px" }} />
//             สร้างไฟล์เสียง
//           </span>
//         }
//         visible={visible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         style={modalStyle}
//         footer={[
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <Button key="submit" type="primary" onClick={handleOk}>
//               Submit
//             </Button>
//           </div>,
//         ]}
//       >
//         <h5>รหัส : {item1.uuid}</h5>
//         <h4>ชื่อบทเรียน : {item1.data.title}</h4>
//         <h4>รหัสบทเรียน : xxxxxxx </h4>

//         <table key={item._docId}>
//           <tr>
//             <th>No.</th>
//             <th>Title</th>
//             <th>Description</th>
//             <th>Audio</th>
//           </tr>
//           {item.questions && item.questions.map((question, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{question.title}</td>
//               <td>{question.description}</td>
//               <td>
//                 <a href={question.audio}>
//                   <Button
//                     type="primary"
//                     style={{
//                       margine: "0 5px",
//                       width: "70px",
//                     }}
//                     onClick={() => playAudio(question.audio)}
//                   >
//                     Play
//                   </Button>
//                 </a>
//               </td>
//             </tr>
//           ))}
//         </table>
//       </Modal>
//     </>
//   );
// };

// export default MyModal;
