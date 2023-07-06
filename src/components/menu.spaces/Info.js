import React from 'react'
import styled from 'styled-components'

import { 
    Button,
} from 'antd'

const Container = styled.div`
    width: 100%;
    padding: 0 8px 8px;
`

const Label = styled.small`

`

const Slug = styled.span`

`

function Comp (
    {
        id,
        name,
        slug,
    }
)
{
    return (
        <Container>
            {/* <Label>รหัสระดับชั้น/ห้องเรียน</Label>
            <Slug>{slug}</Slug> */}
            <Button
                type="primary"
                // size="small"
                block={true}
            >
                ข้อมูลระดับชั้น/ห้องเรียน
            </Button>
        </Container>
    )
}

export default Comp