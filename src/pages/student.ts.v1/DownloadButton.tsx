// import React, { useState, useEffect, useMemo } from 'react';
// import { createPortal } from 'react-dom';

// import { Button } from 'antd';

// interface Props
// {
//   disabled: boolean;
//   onClick: Function;
// }

// const Comp: React.FC<Props> = (
//   {
//     disabled,
//     onClick,
//   }
// ) =>
// {
//   const [mounted, setMounted] = useState(false);
//   const element = useMemo(() => document.getElementById('download-button'), [mounted]);

//   function handleClick ()
//   {
//     if (onClick)
//     {
//       onClick ();
//     }
//   }

//   function handleMount ()
//   {
//     setTimeout(() => setMounted(true), 1000);
//   }

//   useEffect (handleMount, []);

//   if (disabled || !element)
//   {
//     return null;
//   }

//   return createPortal(
//     <Button
//       type="primary"
//       onClick={handleClick}
//     >
//       ดาวน์โหลดสถิติ
//     </Button>,
//     element
//   );
// }

// export default Comp;

export default () => null;