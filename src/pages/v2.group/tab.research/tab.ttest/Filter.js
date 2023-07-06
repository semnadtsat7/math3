import React from 'react'
import styled from 'styled-components'

// import {
//     Select,
// } from 'antd'

// import { 
//     Paper,
// } from '@material-ui/core'

import Flexbox from '../../../../components/Flexbox';
import Footer from '../../../../components/Table/Footer';

import Dropdown from '../../../../components/Table/Filter/Dropdown';

// const { Option } = Select

const Field = styled.div`
    padding: 4px;
    flex-shrink: 0;

    display: flex;

    flex-direction: column;

    align-items: flex-start;
    justify-content: center;

    ${props => props.align === "right" && `
        align-items: flex-end;
    `}
`

// const Label = styled.label`
//   font-size: 90%;

//   margin-bottom: 4px;
//   margin-left: 9px;
// `

// const Caption = styled.small`
//     opacity: 0.8;

//     margin-top: -2px;
//     margin-bottom: 4px;
//     margin-left: 9px;
// `

function Comp (
    {
        filters = {},
        setFilters,

        sheets = [],

        extra,
    }
)
{
    const { 
        sheet,
    } = filters

    function handleChange (name, value)
    {
        setFilters ({ ...filters, [name]: value })
    }

    return (
        <Footer>
            {
                extra &&
                <Field>
                    {extra}
                </Field>
            }

            {
                sheets.length > 0 &&
                <Dropdown 
                    label="บทเรียน"
                    value={sheet}
                    onChange={value => handleChange('sheet', value)}
                    items={
                        sheets.map(e => { return { value: e._docId, label: e.title } })
                    }
                />
            }
            {
                // sheets.length > 0 &&
                // <Field>
                //     <Label>บทเรียน</Label>
                //     <Select 
                //         dropdownMatchSelectWidth={false}
                //         style={{ width: 160 }}
                //         size="small"
                //         value={sheet} 
                //         onChange={value => handleChange ('sheet', value)}
                //     >
                //         {
                //             sheets
                //             .map (({ _docId, title }) =>
                //             {
                //                 return (
                //                     <Option 
                //                         key={_docId}
                //                         value={_docId} 
                //                     >
                //                         {title}
                //                     </Option>
                //                 )
                //             })
                //         }
                //     </Select>
                // </Field>
            }

            <Flexbox />
        </Footer>
    )
}

export default Comp