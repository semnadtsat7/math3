// import React, { useState } from 'react';
// import styled from 'styled-components';

// import { Button, Popover, Checkbox } from 'antd';
// import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// const Footer = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex-wrap: nowrap;
// `;

// const FooterDivider = styled.span`
//   width: calc(100% + 32px);
//   height: 1px;

//   background-color: #e8e8e8;

//   margin-left: -16px;
//   margin-top: 12px;
//   margin-bottom: 12px;

//   flex-shrink: 0;
// `;

// type Item = 
//   {
//     id: string;
//     name: string;
//   }

// type Props = 
//   {
//     items: Item[];

//     value: any;
//     onChange?(value: any): void;

//     footer?: any;
//   }

// const Comp: React.FC<Props> = (
//   {
//     items,

//     value,
//     onChange,

//     footer,
//   }
// ) =>
// {
//   const [visible, setVisible] = useState(false);

//   function handleChange (e: CheckboxChangeEvent)
//   {
//     if (onChange)
//     {
//       const name = e.target.name ?? '';
//       const checked = e.target.checked;

//       onChange({ ...value, [name]: checked });
//     }
//   }

//   return (
//     <div>
//       <Popover
//         trigger="click"
//         placement="topLeft"
//         visible={visible}
//         onVisibleChange={setVisible}
//         title={
//           items?.length > 0 ?
//           <div style={{ padding: '8px 0' }} >
//             ตั้งค่าคอลัมน์
//           </div>
//           :
//           undefined
//         }
//         content={
//           <div style={{ maxWidth: 240 }} >
//             {
//               items.map (
//                 ({ id, name }) =>
//                 {
//                   return (
//                     <div 
//                       key={id}
//                       style={{ padding: `8px 0` }}
//                     >
//                       <Checkbox
//                         name={id}
//                         checked={value[id]}
//                         onChange={handleChange}
//                       >
//                         {name}
//                       </Checkbox>
//                     </div>
//                   );
//                 }
//               )
//             }
//             {
//               footer && 
//               <Footer>
//                 {
//                   items?.length > 0 &&
//                   <FooterDivider />
//                 }
//                 {footer}
//               </Footer>
//             }
//           </div>
//         }

//       >
//         <Button
//           type="primary"
//           icon="setting"
//           // ghost={true}
//           size="small"
//           style={{ lineHeight: 1 }}
//         />
//       </Popover>
      
//     </div>
//   );
// }

// export default Comp;
export default () => null;