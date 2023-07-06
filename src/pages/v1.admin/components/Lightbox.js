import React from 'react'
//import Layer from '@bit/wirunekaewjai.components.layer'
import styled from 'styled-components'

import { Icon } from 'antd'

const a = "1";

const StyledLayer = styled(a)`
	background: rgba(0,0,0, 0.2);
	z-index: ${props => props.zIndex};
	
	> :first-child
	{
        transition: transform 0.2s ease;
	}

	&:not(.open) > :first-child
	{
        transform: scale(0);
	}
`

const StyledIcon = styled(Icon)`
    border-radius: 50%;
    padding: 4px;

    transition: background-color 0.2s ease;

    color: white;

    @media (hover: hover)
    {
        &:hover
        {
            background-color: #ddd;
        }
    }
`

const Container = styled.div`
    width: 100%;
    
    /* height: calc(100% - 48px); */

    margin: 24px;
    
    max-width: ${props => props.maxWidth}px;
    max-height: calc(100% - 48px);

    position: relative;

    overflow-x: hidden;
    overflow-y: hidden;
    
    border-radius: 4px;

    transform: scale(0);
    transition: transform 0.2s ease;

    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));

    display: flex;

    flex-direction: column;
    flex-wrap: nowrap;

    ${props => !!props.open && `
        transform: none;
    `}
`

const Header = styled.div`
    width: 100%;
    padding: 16px 0;

    display: flex;

    flex-direction: row;
    flex-wrap: nowrap;
    flex-shrink: 0;

    align-items: center;
    justify-content: flex-end;
`

const Content = styled.div`
    width: 100%;

    overflow-x: hidden;
    overflow-y: auto;

    padding: 4px;
    
    > div
    {
        width: 100%;
        position: relative;

        img
        {
            position: absolute;

            left: 0;
            right: 0;

            top: 0;

            max-width: 100%;

            width: 100%;
            height: 100%;

            object-fit: cover;
        }
    }
`

const MULTIPLY = 100

function Component (
    {
        image,

        open,
        onClose,

        zIndex = 1,
        maxSize = 1024,
    }
)
{
    if (!image)
    {
        return null
    }

    const { bucket, path, width, height } = image

    const paddingBottom = `${(height / width) * 100}%`
    const url = `https://res.cloudinary.com`

    if (!bucket || !path)
    {
        return null
    }

    const size = Math.min (maxSize, width, height)

    return (
        <StyledLayer 
            open={open}
            onClose={onClose} 
            zIndex={zIndex * MULTIPLY}
            closable={false}
        >   
            <Container open={!!open} maxWidth={size} >
                <Header>
                    <StyledIcon 
                        type="close"
                        className="button-close"
                        style={{ fontSize: 28 }}
                        onClick={() => onClose ()}
                    />
                </Header>
                <Content>
                    <div style={{ paddingBottom }} >
                        <img alt="popup" src={`${url}/${bucket}/image/upload/w_${size},h_${size},c_fit,q_auto:good,f_auto/${path}`} />
                    </div>
                </Content>
            </Container>
        </StyledLayer>
    )
}

export default Component