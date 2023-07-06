import React, { useState, useRef, useEffect } from 'react'
import Parent from "../../../components/Parent";
import styled from 'styled-components'
import firebase from 'firebase'
import axios from 'axios'

import Build from './util.build'

import { Button, Upload, message } from 'antd'

import Header from './Header'

const Container = styled.div`
    padding: 16px;
`

const Pre = styled.pre`
    padding: 16px;

    border-radius: 4px;
    border: 1px solid #d9d9d9;
    background: #fcfcfc;

    max-height: 480px;
`

function PageQuizzes() {
    const parent = useRef(Parent);
    const [action, setAction] = useState(false)
    const [result, setResult] = useState('กดที่ปุ่ม "นำเข้าไฟล์ CSV" เพื่อเริ่มต้นกระบวนการ')
    const [json, setJson] = useState(null)

    const disabled = !!action

    async function handleImport(file) {
        try {
            const json = await Build.toJSON(file)
            const maps = {}

            json.forEach(e => {
                maps[e.map] = true
            })

            if (Object.keys(maps).length === 1) {
                setJson(json)
                setResult(
                    [
                        `พบด่านทั้งหมดจำนวน ${json.length} ด่าน`,
                        JSON.stringify(json, null, 2),
                    ].join('<br />')
                )
            }
            else {
                setResult(`
                    <span style="color:red;" >ไม่สามารถประมวลผลไฟล์ CSV ได้ เนื่องจากมีการระบุสาระการเรียนรู้มากกว่า 1 สาระ</span>
                `)
            }
        }
        catch (err) {
            setResult(`
                <span style="color:red;" >ไม่สามารถประมวลผลไฟล์ CSV ได้ กรุณาตรวจสอบและลองใหม่อีกครั้ง</span>
            `)
        }
    }

    async function handleUpload() {
        setAction('saving')

        console.log(json)

        setAction(false)
    }

    return (
        <Parent ref={parent}>
            <div>
                <Header />
                <Container>
                    {
                        action === 'loading' ?
                            `กำลังโหลด...`
                            :
                            <>
                                <Upload
                                    accept=".csv"
                                    showUploadList={false}
                                    action={handleImport}
                                    disabled={disabled}
                                >
                                    <Button
                                        type="primary"
                                        disabled={disabled}
                                    >
                                        นำเข้าไฟล์ CSV
                                    </Button>
                                </Upload>
                                <div style={{ height: 16 }} />
                                <Pre dangerouslySetInnerHTML={{ __html: result.trim() }} />
                                <div style={{ height: 16 }} />
                                <Button
                                    type="primary"
                                    disabled={disabled || !json}
                                    onClick={handleUpload}
                                >
                                    {action === 'saving' ? 'กำลังอัปโหลด' : 'อัปโหลด และ เผยแพร่'}
                                </Button>
                            </>
                    }
                </Container>
            </div>
        </Parent>
    )
}

export default PageQuizzes