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
        title="ดาวน์โหลดเกม"
      />
      <iframe
        title="download"
        //คู่มือใหม่ เป็น gdrive ของ 2018nextgen@gmail.com   
        src="https://docs.google.com/presentation/d/e/2PACX-1vTqfVOkIvUUSlcavl4uups6IWTU42642RS1b_loyanKnoBCY4txEuZ72HZOHynXC1G50hxwsX-9b63g/embed?start=true&loop=false&delayms=3000" 
        //คู่มือใหม่ เป็น gdrive ของอีเมลอื่น
        //src="https://docs.google.com/presentation/d/e/2PACX-1vTalZR_bObYC1hUGjUgVWd2FIgCJwjLhRuQ_B_hRaW2dvYBFJnv2EnJ6tTvCtDs5uXCAnGbsya33-Di/embed?start=true&loop=false&delayms=3000" 
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