import React, { Fragment } from 'react'
import styled from 'styled-components'

import { 
    Typography,

    TableCell,
    TableRow,

    Grid,
} from '@material-ui/core'

import NumberUtil from '../../../../utils/Number'

const Name = styled.span`
    padding: 8px 24px;

    display: flex;

    flex-direction: column;
`

function Comp (
    {
        n,
        student,

        pretest,
        posttest,
    }
)
{
    if (!student)
    {
        return null
    }

    const hasPre = !pretest.fetching && Number.isSafeInteger (pretest.score);
    const hasPost = !posttest.fetching && Number.isSafeInteger (posttest.score);

    const className = !hasPre || !hasPost ? 'text inactive' : ''

    return (
        <TableRow>
            <TableCell align="right" padding="checkbox">
                <Typography variant="body2" noWrap className={className} >
                    {NumberUtil.prettify (n)}
                </Typography>
            </TableCell>
            <TableCell padding="none" >
                <Name className={className} >
                    {student.name}
                </Name>
            </TableCell>

            {
                (pretest.fetching || posttest.fetching) ?
                <TableCell 
                    align="right" 
                    padding="checkbox"
                    className="updating"
                    colSpan={2}
                >
                    <Typography align="center" className={className} >
                        กำลังดาวน์โหลด
                    </Typography>
                </TableCell>
                :
                <Fragment>
                    
                    <TableCell align="right" padding="none">
                        <Grid container={true} >
                            <Grid item={true} xs={12} style={{ padding: `4px 12px` }}>
                                <Typography className={className} >
                                    {hasPost ? NumberUtil.prettify(posttest.score) : ''}
                                </Typography>
                            </Grid>
                            {/* <Grid item={true} xs={6} style={{ padding: `4px 12px` }}>
                                <Typography>
                                    {NumberUtil.prettify((posttest.score * posttest.score) || 0)}
                                </Typography>
                            </Grid> */}
                        </Grid>
                    </TableCell>
                    
                    <TableCell align="right" padding="none">
                        <Grid container={true} >
                            <Grid item={true} xs={12} style={{ padding: `4px 12px` }}>
                                <Typography className={className} >
                                    {hasPre ? NumberUtil.prettify(pretest.score) : ''}
                                </Typography>
                            </Grid>
                            {/* <Grid item={true} xs={6} style={{ padding: `4px 12px` }}>
                                <Typography>
                                    {NumberUtil.prettify((pretest.score * pretest.score) || 0)}
                                </Typography>
                            </Grid> */}
                        </Grid>
                    </TableCell>


                    {/* <TableCell colSpan={1} numeric padding="checkbox">
                        <Typography>
                            {NumberUtil.prettify(posttest.score)}
                        </Typography>
                    </TableCell>

                    <TableCell colSpan={1} numeric padding="checkbox">
                        <Typography>
                            {NumberUtil.prettify((posttest.score * posttest.score) || 0)}
                        </Typography>
                    </TableCell> */}
                </Fragment>
            }
        </TableRow>
    )
}

export default Comp