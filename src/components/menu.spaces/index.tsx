import React, { useContext } from 'react'
import { withRouter, useHistory } from 'react-router-dom'

import styled from 'styled-components'

import {
    // Select,
    Modal,
    message,
} from 'antd'

import AppContext from '../../AppContext'
import useSpaces from './useSpaces'

import Firebase from '../../utils/Firebase';

import Dropdown from '../Table/Filter/MenuDropdownWithGearIcon';

// import Info from './Info'

// const { Option } = Select

const Container = styled.div`
    width: 100%;

    flex-shrink: 0;
    
    border-bottom: 1px solid rgba(0,0,0,0.2);

    > div
    {
        margin: 8px;
    }

    > div > label
    {
        color: white;
        margin-bottom: 8px;
    }

    /* Deprecated */
    /* .ant-select
    {
        font-size: 0.9em;
        width: calc(100% - 16px);

        margin: 8px;

        .ant-select-selection
        {
            border-color: #666;

            background-color: #2c2c2c;
            color: white;

            .ant-select-selection__rendered
            {
            }

            .ant-select-arrow
            {
                color: inherit;
            }
        }
    } */
`

const Loading = styled.small`
    display: flex;

    flex-direction: row;

    align-items: center;

    color: white;

    height: 32px;

    margin: 8px 0;
    padding: 8px 16px;
`

function Comp ()
{
    const spaces = useSpaces ()
    const { setSpace } = useContext (AppContext);

    const history = useHistory();

    async function handleCreate ()
    {
        const root = document.getElementById ('root');
        
        if (root)
        {
            root.classList.add ('loading');
        }

        const m = Modal.info (
            {
                title: 'กำลังสร้างระดับชั้น/ห้องเรียนใหม่',
                content: `กรุณารอสักครู่ . . .`,
                zIndex: 10000,
                keyboard: false,
                okButtonProps:
                {
                    style: { display: 'none' }
                },
            }
        )

        try
        {
            // await new Promise (r => setTimeout (r, 1000));
            const fn = Firebase.functions ()
            const result = await fn.httpsCallable (`teacher-space-create`) ({  })

            await new Promise (r => setTimeout (r, 1000));
            
            const spaceID = result.data;

            if (typeof spaceID === 'string' && setSpace)
            {
                setSpace (spaceID);
            }

            message.success ('สร้างระดับชั้น/ห้องเรียนใหม่เรียบร้อยแล้ว', 3)

            history.push('/info');
        }
        catch (err)
        {
            console.log (err)
            message.error ('พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 3)
        }

        if (root)
        {
            root.classList.remove ('loading')
        }

        m.destroy ()
    }

    return (
        <Container>
            {
                !!spaces.fetching ?
                <Loading>
                    กำลังโหลด . . .
                </Loading>
                :
                <AppContext.Consumer>
                    {
                        ({ space, setSpace }) => 
                        {
                            const filters = spaces.items.filter ((e: any) => e.id === space)

                            if (filters.length === 0)
                            {
                                if (spaces.items.length > 0)
                                {
                                    const spaceID = spaces.items[0]?.id;

                                    if (typeof spaceID === 'string' && setSpace)
                                    {
                                        setSpace (spaceID);
                                    }
                                }

                                return null
                            }

                            return (
                                <Dropdown 
                                    label="เลือกระดับชั้น/ห้องเรียน"
                                    value={space}
                                    onChange={(value: string) => 
                                        {
                                            if (value === 'create')
                                            {
                                                handleCreate ();
                                            }
                                            else if (setSpace)
                                            {
                                                setSpace (value)
                                            }
                                        }
                                    }
                                    items={
                                        // [{ value: 'none', label: 'ทั้งหมด' }].concat(
                                        // groups.map(e => { return { value: e._id, label: e.name } })
                                        // )
                                        [
                                            ...spaces.items.map(
                                                (e: any) => {
                                                    return { 
                                                        value: e.id,
                                                        label: e.name,
                                                    }
                                                }
                                            ),
                                            spaces.items.length < 21 ?
                                            {
                                                value: 'create',
                                                label: '+ สร้างระดับชั้น/ห้องเรียนใหม่'
                                            }
                                            :
                                            null
                                        ]
                                        .filter(e => !!e)
                                    }
                                />
                            );

                            // return (
                            //     <Select
                            //         dropdownMatchSelectWidth={false}
                            //         dropdownStyle={{ zIndex: 10000 }}
                            //         value={space}
                            //         onChange={(value: string) => 
                            //         {
                            //             if (value === 'create')
                            //             {
                            //                 handleCreate ();
                            //             }
                            //             else if (setSpace)
                            //             {
                            //                 setSpace (value)
                            //             }
                            //         }}
                            //     >
                            //         {
                            //             spaces
                            //             .items
                            //             .map ((item: any) =>
                            //             {
                            //                 return (
                            //                     <Option
                            //                         key={item.id}
                            //                         value={item.id}
                            //                     >
                            //                         {item.name}
                            //                     </Option>
                            //                 )
                            //             })
                            //         }
                            //         {
                            //             spaces.items.length < 5 &&
                            //             <Option
                            //                 key="create"
                            //                 value="create"
                            //             >
                            //                 + สร้างระดับชั้นใหม่
                            //             </Option>
                            //         }
                            //     </Select>
                            // )
                        }
                    }
                </AppContext.Consumer>
            }
        </Container>
    )
}

export default withRouter (Comp)