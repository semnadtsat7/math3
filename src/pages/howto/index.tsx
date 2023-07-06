import React, { createRef } from 'react'

import Parent from '../../components/Parent'
import Header from '../students.ts.v1/Header';

const Comp: React.FC = () =>
{
  const parent = createRef<Parent>();

  return (
    <Parent ref={parent} >
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title="วิธีการใช้งาน"
      />
      <iframe
        title="how-to-embed" 
        //คู่มือ เป็น google slide อยู่ใน gdrive อีเมลอื่น
        //src="https://docs.google.com/presentation/d/e/2PACX-1vSot1jUCjZ6WJVGFVp96waSH2Y5Oovs2GAtjuNb6Bphc4BxqfGcYtbVqFbgiJPzh3GiQKeH3QI4k6u6/embed?start=false&loop=false&delayms=3000" 
        //คู่มือ เป็น google slide อยู่ใน gdrive อีเมล 2018nexgen@gmail.com
        src="https://docs.google.com/presentation/d/e/2PACX-1vSykpsx6R8whsLvaYiz9KONJI3u6WjqqNqb6V1PDpjkx6TgMditumFC8s9C1MeK4rbsANOWLcuPp7hL/embed?start=false&loop=false&delayms=3000"
        frameBorder={0} 
        width={960}
        height={749} 
        allowFullScreen={true}
        style={
          {
            maxWidth: `100%`
          }
        }
      />
    </Parent>
  )
}

export default Comp