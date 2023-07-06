import styled from 'styled-components'

interface ScrollViewProps
{
	fitParent?: any;
}

const ScrollView = styled.div<ScrollViewProps>`
    overflow-x: auto;
    overflow-y: auto;

    ${props => props.fitParent && `
        height: 100%;
    `}

    table
    {
        background: white;
    }
`

export default ScrollView;