import React, { useState } from 'react'
import styled from 'styled-components'

import { Button, Row, Col, Modal, Upload, Icon, message } from 'antd'
import Lightbox from './Lightbox'

const Container = styled.div`
    display: flex;

    flex-direction: column;
    flex-wrap: nowrap;

    width: 100%;
    padding: 4px;

    margin-bottom: 4px;

    ${props => props.width && `
        max-width: ${props.width}px;
    `}
`

const Item = styled.div`
    padding: 4px;

    .ant-upload
    {
        width: 100%;
    }
`

const ImageLayout = styled.div`
    position: relative;
    width: 100%;

    border-radius: 4px;
    border: 1px dashed #d9d9d9;

    box-sizing: border-box;
`

const Zoomable = styled.div`
    position: absolute;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    &::after
    {
        content: '';
        
        position: absolute;

        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        background-color: transparent;
        transition: background-color 0.2s ease;

        text-align: center;
    }

    &:hover::after
    {
        content: 'คลิกเพื่อขยาย';
        cursor: pointer;

        background-color: rgba(0,0,0, 0.75);
        color: white;

        display: flex;

        flex-direction: row;

        align-items: center;
        justify-content: center;
    }

    ${props => props.disabled && `
        pointer-events: none;
        opacity: 0.8;
    `}
`

const Image = styled.img`
    pointer-events: none;
    user-select: none;

    position: absolute;

    left: 0;
    right: 0;

    top: 0;

    max-width: 100%;

    width: 100%;
    height: 100%;

    object-fit: contain;
`

const Empty = styled.div`
    position: absolute;

    border-radius: 4px;
    background-color: #e8e8e8;

    color: #a7a7a7;

    width: 100%;
    height: 100%;

    left: 0;
    right: 0;

    top: 0;

    font-size: 24px;

    text-align: center;

    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;
`

function Img (
    {
        disabled,
        viewport,
        bucket,
        path,
        width,
        height,

        maxSize,

        onFocus,
        onBlur,
    }
)
{
    const [ open, setOpen ] = useState (false)
    const url = `https://res.cloudinary.com`
    
    return (
        <>
            <Zoomable
                disabled={disabled}
                onClick={() => 
                {
                    setOpen (true)
                    onFocus ()
                }}
            >
                <Image 
                    src={`${url}/${bucket}/image/upload/w_${viewport.width},h_${viewport.height},c_fit,q_auto:good,f_auto/${path}`} 
                />
            </Zoomable>
            <Lightbox 
                image={{ bucket, path, width, height }}
                maxSize={maxSize}
                open={open}
                onClose={() => 
                {
                    setOpen (false)
                    onBlur ()
                }}
            />
        </>
    )
}

function Comp (
    {
        viewport = { width: 80, height: 80 },
        fileSize = 3,
        maxSize,

        disabled,

        value,

        onChange,
        onFocus,
        onBlur,

        onUploadStart,
        onUploadEnd,
    }
)
{
    const [ uploading, setUploading ] = useState (false)
    const height = (viewport.height / viewport.width) * 100
    
    function handleValidate (file)
    {
        const types = [ 'image/jpeg', 'image/png' ]
        const isType = types.indexOf(file.type) >= 0

        if (!isType)
        {
            message.error('กรุณาอัพโหลดรูปที่มีนามสกุล jpg หรือ png เท่านั้น')
        }

        const isSmall = file.size / 1024 / 1024 < fileSize

        if (!isSmall)
        {
            message.error(`กรุณาอัพโหลดรูปที่มีขนาดไม่เกิน ${fileSize}MB`)
        }

        return !!isType && !!isSmall
    }

    function handleUploadStart (file)
    {
        if (handleValidate (file))
        {
            setUploading (true)

            onUploadStart ()
            onChange (null)
            onFocus ()

            // console.log ('begin')

            return true
        }

        return false
    }

    function handleUploadEnd (info)
    {
        if (info.file.status === 'done')
        {
            if (Array.isArray (info.file.response))
            {
                onChange (info.file.response[0])
            }
            else if (!!info.file.response)
            {
                onChange (info.file.response)
            }
            
            setUploading (false)
            
            onUploadEnd ()
            onBlur ()
            
            // console.log ('end')
        }
    }

    function handleDelete ()
    {
        onChange (null)
    }

    return (
        <Container width={viewport.width} >
            <Item>
                <ImageLayout style={{ paddingBottom: `${height}%` }} >
                    {
                        !!uploading ? <Empty children={<Icon type="loading" />} />
                        :
                        !!value ? 
                        <Img
                            disabled={disabled}
                            viewport={viewport} 
                            maxSize={maxSize} 
                            onFocus={onFocus}
                            onBlur={onBlur}
                            {...value}
                        />
                        :
                        <Empty children={<Icon type="file-image" />} />
                    }
                </ImageLayout>
            </Item>
            <Item>
                <Row gutter={8}>
                    <Col xs={12}>
                        <Upload
                            listType="picture"
                            multiple={false}
                            showUploadList={false}
                            action={`https://asia-east2-clever-math-hkg.cloudfunctions.net/admin-image?action=upload`}
                            beforeUpload={handleUploadStart}
                            onChange={handleUploadEnd}
                            disabled={disabled}
                        >
                            <Button 
                                disabled={disabled}
                                type="primary"
                                // icon="upload"
                                size="small"
                                block={true}
                                children="+"
                                onClick={() =>
                                {
                                    if (typeof onFocus === 'function')
                                    {
                                        onFocus ()
                                    }
                                }}
                            />
                        </Upload>
                    </Col>
                    <Col xs={12}>
                        <Button 
                            disabled={disabled || !value}
                            type="danger"
                            icon="delete"
                            size="small"
                            block={true}
                            // children="-"
                            onClick={() =>
                            {
                                if (typeof onFocus === 'function')
                                {
                                    onFocus ()
                                }

                                const m = Modal.confirm(
                                    {
                                        title: `ต้องการลบ ?`,
                                        okButtonProps: { type: 'danger' },
                                        okText: 'ใช่',
                                        cancelText: 'ไม่ใช่',
                                        onOk: () => 
                                        {
                                            if (typeof onBlur === 'function')
                                            {
                                                onBlur ()
                                            }

                                            handleDelete ()
                                            m.destroy ()
                                        },
                                        onCancel: () =>
                                        {
                                            if (typeof onBlur === 'function')
                                            {
                                                onBlur ()
                                            }
                                        },
                                    }
                                )
                            }}
                        />
                    </Col>
                </Row>
            </Item>
        </Container>
    )
}

export default Comp