// import React, { useState, useEffect } from 'react'

// function Comp (
//     {

//     }
// )
// {
//     function handleValidate (file)
//     {
//         const types = [ 'text/csv' ]
//         const size  = 3

//         const isType = types.indexOf(file.type) >= 0

//         if (!isType)
//         {
//             message.error('กรุณาอัพโหลดไฟล์ที่มีนามสกุล csv เท่านั้น')
//         }

//         const isSmall = file.size / 1024 / 1024 < size

//         if (!isSmall)
//         {
//             message.error(`กรุณาอัพโหลดไฟล์ที่มีขนาดไม่เกิน ${size}MB`)
//         }

//         return !!isType && !!isSmall
//     }

//     return (
//         <div>
            
//         </div>
//     )
// }

// export default Page