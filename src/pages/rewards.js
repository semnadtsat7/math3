import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import Firebase from '../utils/Firebase';
import DateTime from '../utils/DateTime'

import GetRewards from '../services/getRewards'

import
{
  Button,
} from 'antd';

import { 
    Avatar,

    Dialog,
    DialogTitle, 
    DialogContent, 
    DialogActions,

    FormControl,
    InputLabel,

    Typography,
    Paper,

    Modal,
    //Button,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    // TableFooter,
    // TablePagination,

    Select,
    MenuItem,

    ListItem,
    ListItemText,
    // FormGroup,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core'

import Parent from '../components/Parent';
import ActionBar from '../components/ActionBar';
import MenuButton from '../components/MenuButton';
import Flexbox from '../components/Flexbox';
import Progress from '../components/Progress';
import TextField from '../components/TextField';

import TableColumnName from '../components/Table.Column.Name'

const CustomName = styled.span`
    outline: none;
    text-decoration: underline;

    color: cornflowerblue;
    cursor: pointer;

    line-height: 1.5;
`

function TabContainer({ children, dir }) {
    return (
      <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
        {children}
      </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};


function sort (items, order, orderBy)
{
    let result = []

    if (orderBy === 'name')
    {
        if (order === 'asc')
        {
            result = items.sort((a, b) => (a[orderBy] || '').localeCompare(b[orderBy] || ''))
        }
        else
        {
            result = items.sort((a, b) => (b[orderBy] || '').localeCompare(a[orderBy] || ''))
        }
    }
    else if (orderBy === 'price')
    {
        if (order === 'asc')
        {
            result = items.sort((a, b) => (a[orderBy] || '').toString().localeCompare((b[orderBy] || '').toString()))
        }
        else
        {
            result = items.sort((a, b) => (b[orderBy] || '').toString().localeCompare((a[orderBy] || '').toString()))
        }
    }
    else
    {
        if (order === 'asc')
        {
            result = items.sort((a, b) => (a[orderBy] ? a[orderBy].toDate() : 0) - (b[orderBy] ? b[orderBy].toDate() : 0))
        }
        else
        {
            result = items.sort((a, b) => (b[orderBy] ? b[orderBy].toDate() : 0) - (a[orderBy] ? a[orderBy].toDate() : 0))
        }
    }

    return result
}

class Page extends React.Component
{

    constructor (props)
    {
        super (props);

        this.state = 
        {
            fetching: true,

            templates: [],
            rewards: [],

            page: 0,
            rowsPerPage: 50,
            
            order: 'asc',
            orderBy: 'createdAt',

            createDialog: 0,
            editDialog: 0,

            dialogEdit: '',
            
            dialogTemplateIndex: -1,
            dialogName: '',
            dialogDescription: '',
            dialogPrice: 5,
            dialogNotForSale: false,
            dialogStarReward: 0,
            dialogAutoApprove: false,

            deleteDialog: 0,
            deleteRewardId: '',
        }

        this.unsubscribes = [];
        
        this.fetch = this.fetch.bind(this)

        this.handleCreate = this.handleCreate.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSelect = this.handleSelect.bind(this)

        this.handleDelete = this.handleDelete.bind(this)
        
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        
        this.handleSort = this.handleSort.bind(this)
    }

    componentDidMount ()
    {
        const { history } = this.props;
        const auth = Firebase.auth();

        this.unsubscribes[0] = auth.onAuthStateChanged(user =>
        {
            if(user)
            {
                this.fetch ();
            }
            else
            {
                history.replace(`/sign-in?redirect=${encodeURIComponent(history.location.pathname + history.location.search)}`);
            }
        });
    }

    componentWillUnmount ()
    {
        this.unsubscribes.filter(fn => !!fn).forEach(fn => fn());
    }

    async fetch ()
    {
        this.setState({ 
            fetching: true, 
            rewards: [],
        });

        const templates = await GetRewards.get()

        this.setState({ templates })

        const space = window.localStorage.getItem ('space')
        const teacherId = space || Firebase.auth().currentUser.uid;

        this.unsubscribes.push(
            Firebase
            .firestore()
            .collection('teachers')
            .doc(teacherId)
            .collection('rewards')
            .where('isActive', '==', true)
            .onSnapshot(snapshot =>
            {
                const rewards = [];

                snapshot.forEach(doc => 
                {
                    const reward = 
                    {
                        id: doc.id,
                        ...doc.data(),
                    };

                    rewards.push(reward)
                });

                this.setState({ 
                    fetching: false,
                    rewards: rewards.sort((a, b) => a.name.localeCompare(b.name)),
                });
            })
        )
    }

    async handleCreate ()
    {
        const { 
            templates, 
            dialogTemplateIndex, 
            dialogName, 
            dialogDescription, 
            dialogPrice, 
            dialogNotForSale,
            dialogStarReward,
            dialogAutoApprove,
        } = this.state

        if (!dialogNotForSale && dialogPrice < 1)
        {
            alert (`กรุณาระบุราคาอย่างน้อย 1 ดาว หรือกำหนดเป็น "ไม่สามารถซื้อได้"`)
            return;
        }

        if (dialogTemplateIndex >= 0)
        {
            this.setState({ createDialog: 2 });

            const template = templates[dialogTemplateIndex]
            const name = !!dialogName ? dialogName : template.name;
            const image = template.image;
            const description = !!dialogDescription ? dialogDescription : '-'//template.description
            const price = !!dialogNotForSale ? 'none' : Math.max(parseInt (dialogPrice || 1, 10), 1)
            const starReward = !!dialogNotForSale && !!dialogStarReward ? parseInt (dialogStarReward).toString (10) : 0
            const autoApprove = !!dialogAutoApprove

            const space = window.localStorage.getItem ('space')
            const teacher = space || Firebase.auth().currentUser.uid;
            // const docRef = Firebase.firestore().collection('teachers').doc(teacherId).collection('rewards').doc();
            // const docId = docRef.id;

            // await docRef.set({ name, image, requirement });
            
            await Firebase
            .functions()
            .httpsCallable('teacher-reward-create')({ teacher, name, image, description, price, starReward, autoApprove })

            this.setState({ 
                createDialog: 0,
                editDialog: 0,

                dialogEdit: '',
                dialogTemplateIndex: -1,
                dialogName: '', 
                dialogDescription: '',
                dialogPrice: 5,
                dialogNotForSale: false,
                dialogStarReward: 0,
                dialogAutoApprove: false,
            });
        }
    }

    async handleDelete ()
    {
        const { deleteRewardId } = this.state

        if (!!deleteRewardId)
        {
            this.setState({ deleteDialog: 2 })

            const space = window.localStorage.getItem ('space')
            const teacher = space || Firebase.auth().currentUser.uid;

            await Firebase.functions().httpsCallable('teacher-reward-delete')({ teacher, reward: deleteRewardId })
            // const teacherId = Firebase.auth().currentUser.uid;
            // const docRef = Firebase.firestore().collection('teachers').doc(teacherId).collection('rewards').doc(deleteRewardId)

            // await docRef.delete()

            this.setState({ deleteDialog: 0, deleteRewardId: '' })
        }
    }

    handleCancel ()
    {
        this.setState({ 
            createDialog: 0,
            editDialog: 0,

            dialogEdit: '',
            dialogTemplateIndex: -1,
            dialogName: '', 
            dialogDescription: '',
            dialogPrice: 5,
            dialogNotForSale: false,
            dialogStarReward: 0,
            dialogAutoApprove: false,
        })
    }

    handleSelect (e)
    {
        this.setState({ dialogTemplateIndex: e.target.value })

        const template = this.state.templates[e.target.value]

        this.setState (
            {
                dialogName: template.name, 
                dialogDescription: template.description,
                dialogPrice: template.price || 0,
                dialogNotForSale: (template.price || 0) <= 0,
                dialogStarReward: 0,
                dialogAutoApprove: !!template.autoApprove,
            }
        )

        setTimeout(() => document.getElementById('dialog-reward-title').focus(), 400)
        // if (this.state.dialogName)
        // {
        //     this.setState({ dialogTemplateIndex: e.target.value })
        // }
        // else
        // {
        //     this.setState({
        //         dialogTemplateIndex: e.target.value,
        //         // dialogName: this.state.templates[e.target.value].name
        //     })
        // }
    }
    
    handleChangePage (event, page)
    {
        this.setState({ page });
    }
    
    handleChangeRowsPerPage (event)
    {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleSort (orderBy, order)
    {
        this.setState({ order, orderBy })
    }

    toggleEditReward = ({ id, name, description, price, starReward, autoApprove }) =>
    {
        this.setState (
            {
                editDialog: 1, 
                dialogEdit: id,
                dialogName: name,
                dialogDescription: description,
                dialogPrice: `${price}`,
                dialogNotForSale: price === 'none',
                dialogStarReward: `${starReward}`,
                dialogAutoApprove: !!autoApprove,
            }
        )
    }

    handleUpdate = async () =>
    {
        const { 
            dialogEdit,
            dialogName, 
            dialogDescription, 
            dialogPrice, 
            dialogNotForSale,
            dialogStarReward,
            dialogAutoApprove,
        } = this.state

        if (!dialogNotForSale && dialogPrice < 1)
        {
            alert (`กรุณาระบุราคาอย่างน้อย 1 ดาว หรือกำหนดเป็น "ไม่สามารถซื้อได้"`)
            return;
        }

        this.setState({ editDialog: 2 });

        const space = window.localStorage.getItem ('space')
        const teacher = space || Firebase.auth().currentUser.uid;

        const id = dialogEdit
        const name = dialogName
        const description = dialogDescription
        const price = !!dialogNotForSale ? 'none' : Math.max(parseInt (dialogPrice || 1, 10), 1)
        const starReward = !!dialogNotForSale && !!dialogStarReward ? parseInt (dialogStarReward).toString (10) : 0
        const autoApprove = !!dialogAutoApprove

        await Firebase
        .functions()
        .httpsCallable('teacher-reward-update')({ teacher, id, name, description, price, starReward, autoApprove })

        this.setState({ 
            createDialog: 0,
            editDialog: 0,

            dialogEdit: '',
            dialogTemplateIndex: -1,
            dialogName: '', 
            dialogDescription: '',
            dialogPrice: 5,
            dialogNotForSale: false,
            dialogStarReward: 0,
            dialogAutoApprove: false,
        })
    }

    render ()
    {
        const { 
            fetching, templates, rewards,
            
            order,
            orderBy,

            createDialog, 
            deleteDialog,
            editDialog,
            
            // dialogEdit,
            dialogName, 
            dialogDescription, 
            dialogPrice, 
            dialogNotForSale, 
            dialogStarReward, 
            dialogAutoApprove,

            dialogTemplateIndex,

        } = this.state;

        const empty = rewards.length === 0;
        const orderDirection = order === 'asc' ? 'desc' : 'asc'
        const sorteds = sort (rewards, order, orderBy)

        return (
            <Parent ref="parent" >
                <ActionBar >
                    <MenuButton onClick={e => this.refs.parent.toggleMenu()} />
                    <Typography variant="subtitle2" color="inherit" noWrap style={{ flex: 1, paddingBottom: 2, lineHeight: 2 }} >
                        รางวัลทั้งหมด
                    </Typography>
                    <Button type="primary" onClick={e => this.setState({ createDialog: 1 })} style={{ marginRight: 10 }} >สร้างรางวัล</Button>
                </ActionBar>
                {
                    fetching ? <Progress /> :
                    empty ? <Flexbox><p style={{ opacity: 0.5 }} >ไม่มีรางวัล</p></Flexbox> :
                    <React.Fragment>
                        <ScrollView fitParent={!empty} >
                            <Paper elevation={0}>
                                <Table className="custom-table" >
                                    <TableHead>
                                        <TableRow selected={true} >
                                            <TableCell padding="dense" width="40" >รูป</TableCell>
                                            <TableCell padding="default">
                                                <TableColumnName
                                                    name="name"
                                                    label="รางวัล"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
                                                />
                                            </TableCell>
                                            <TableCell padding="default" width="80" >
                                                <TableColumnName
                                                    name="createdAt"
                                                    label="วันที่สร้าง"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
                                                />
                                            </TableCell>
                                            <TableCell padding="default" width="60" >
                                                <TableColumnName
                                                    name="price"
                                                    label="ราคา"
                                                    orderBy={orderBy}
                                                    order={orderDirection}
                                                    onSort={this.handleSort}
                                                />
                                            </TableCell>
                                            <TableCell padding="checkbox" width="60"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            sorteds
                                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((reward, i) =>
                                            {
                                                return (
                                                    <TableRow 
                                                        key={reward.id} 
                                                        // hover={true}
                                                        // style={{ cursor: 'pointer' }}
                                                        // onClick={e => this.props.history.push(`/rewards/${reward.id}`)}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <AvatarShadow>
                                                                <Avatar src={reward.image} />
                                                            </AvatarShadow>
                                                        </TableCell>
                                                        <TableCell padding="default">
                                                            {/* {reward.name} */}
                                                            <CustomName 
                                                                onClick={() => this.toggleEditReward (reward)} 
                                                            >
                                                                {reward.name}
                                                            </CustomName>
                                                            <Description>
                                                                {reward.price === 'none' ? `เงื่อนไข ${reward.description} และ ` : ''}
                                                                จำนวนดาวที่ได้รับ {reward.starReward || 0} ดวง
                                                            </Description>
                                                        </TableCell>
                                                        <TableCell padding="default">
                                                            {
                                                                reward.createdAt ? 
                                                                <React.Fragment>
                                                                    <Typography variant="caption" noWrap>
                                                                        {DateTime.formatDate(reward.createdAt, { monthType: 'short' })}
                                                                        <Typography component="small" variant="caption" noWrap>
                                                                            {DateTime.formatTime(reward.createdAt)}
                                                                        </Typography>
                                                                    </Typography>
                                                                </React.Fragment> 
                                                                : 
                                                                '-'
                                                            }
                                                        </TableCell>
                                                        <TableCell padding="default">
                                                            {reward.price === 'none' ? '-' : reward.price}
                                                        </TableCell>
                                                        <TableCell padding="checkbox">
                                                            <Button 
                                                                type="secondary"
                                                                onClick={e => {
                                                                    this.setState({
                                                                        deleteDialog: 1,
                                                                        deleteRewardId: reward.id,
                                                                    })
                                                                }}
                                                            >
                                                                ลบ
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                            .filter(item => item)
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </ScrollView>
                        {/* <Paper elevation={0} style={{ borderTop: '1px solid #ddd' }} >
                            <HorizontalScrollView>
                                <Table className="custom-table" >
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                colSpan={4}
                                                count={rewards.length}
                                                rowsPerPage={rowsPerPage}
                                                rowsPerPageOptions={[  ]}
                                                // rowsPerPageOptions={[ 5, 10, 25, 50 ]}
                                                page={page}
                                                backIconButtonProps={{
                                                    'aria-label': 'Previous Page',
                                                }}
                                                nextIconButtonProps={{
                                                    'aria-label': 'Next Page',
                                                }}
                                                onChangePage={this.handleChangePage}
                                                // onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </HorizontalScrollView>
                        </Paper> */}
                    </React.Fragment>
                }
                <ModalRoot
                    open={createDialog > 0}
                    // onClose={this.handleCancel} 
                >
                    <ModalPanel>
                        <DialogTitle>สร้างรางวัล</DialogTitle>
                        <DialogContent>
                            {
                                createDialog === 1 ? 
                                <React.Fragment>
                                    <FormControl fullWidth >
                                        <InputLabel>เทมเพลต</InputLabel>
                                        <Select 
                                            autoFocus
                                            name="template"
                                            value={dialogTemplateIndex}
                                            onChange={this.handleSelect}
                                            renderValue={value => {
                                                return value >= 0 ?
                                                <ListItem>
                                                    <AvatarShadow>
                                                        <Avatar src={templates[value].image} />
                                                    </AvatarShadow>
                                                    <ListItemText 
                                                        primary={templates[value].name} 
                                                        secondary={
                                                            templates[value].price > 0 ?
                                                            `ราคา ${templates[value].price} ดาว`
                                                            :
                                                            !!templates[value].description && templates[value].description.length > 0 ?
                                                            `เงื่อนไข ${templates[value].description}`
                                                            :
                                                            '-'
                                                        } 
                                                    />
                                                </ListItem>
                                                :
                                                'กรุณาเลือกเทมเพลต'
                                            }}
                                            fullWidth
                                        >
                                            {
                                                templates.map((template, i) =>
                                                {
                                                    return (
                                                        <MenuItem
                                                            key={template.id}
                                                            value={i}
                                                        >
                                                            <AvatarShadow>
                                                                <Avatar src={template.image} />
                                                            </AvatarShadow>
                                                            <ListItemText 
                                                                primary={template.name} 
                                                                secondary={
                                                                    template.price > 0 ?
                                                                    `ราคา ${template.price} ดาว`
                                                                    :
                                                                    !!template.description && template.description.length > 0 ?
                                                                    `เงื่อนไข ${template.description}`
                                                                    :
                                                                    '-'
                                                                } 
                                                                // secondary={template.description} 
                                                            />
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        margin="normal"
                                        label="ชื่อรางวัล"
                                        type="text"
                                        fullWidth
                                        disabled={createDialog === 2}
                                        inputProps={{ id: "dialog-reward-title" }}

                                        placeholder={dialogTemplateIndex >= 0 ? templates[dialogTemplateIndex].name : ''}
                                        value={dialogName}
                                        onChange={e => this.setState({ dialogName: e.target.value })}
                                    />

                                    {
                                        !!dialogNotForSale &&
                                        <TextField
                                            margin="dense"
                                            label="เงื่อนไข"
                                            type="text"
                                            multiline
                                            fullWidth
                                            rowsMax={3} 
                                            
                                            disabled={createDialog === 2}

                                            placeholder={dialogTemplateIndex >= 0 ? templates[dialogTemplateIndex].description : ''}
                                            value={dialogDescription}
                                            onChange={e => this.setState({ dialogDescription: e.target.value })}
                                        />
                                    }

                                    {/* <div style={{ height: 16 }} /> */}

                                    {
                                        !dialogNotForSale &&
                                        <TextField
                                            margin="dense"
                                            label="ราคา"
                                            type="number"
                                            fullWidth
                                            disabled={createDialog === 2}

                                            placeholder="อย่างน้อย 1 ดาว"
                                            
                                            value={dialogPrice}
                                            onChange={e => this.setState(
                                                { 
                                                    dialogPrice: Math.min(Math.max(parseInt (e.target.value), 1), 10000) 
                                                }
                                            )}
                                        />
                                    }
                                    
                                    <FormControlLabel 
                                        label="ไม่สามารถซื้อได้"
                                        control={
                                            <Checkbox 
                                                checked={dialogNotForSale}
                                                onChange={e => this.setState({ dialogNotForSale: e.target.checked })}
                                            />
                                        }
                                    />

                                    {
                                        !!dialogNotForSale &&
                                        <TextField
                                            margin="dense"
                                            label="ดาวที่นักเรียนจะได้รับ"
                                            type="number"
                                            fullWidth
                                            disabled={createDialog === 2}

                                            placeholder="0"
                                            
                                            value={dialogStarReward}
                                            onChange={e => this.setState(
                                                { 
                                                    dialogStarReward: Math.min(Math.max(parseInt (e.target.value), 0), 10000).toString (10)
                                                }
                                            )}
                                        />
                                    }

                                    <FormControlLabel 
                                        label="ใช้งานโดยไม่ต้องรออนุมัติ"
                                        control={
                                            <Checkbox 
                                                checked={dialogAutoApprove}
                                                onChange={e => this.setState({ dialogAutoApprove: e.target.checked })}
                                            />
                                        }
                                    />
                                </React.Fragment>
                                :
                                <Progress />
                            }
                        </DialogContent>
                        {
                            createDialog === 1 ?
                            <DialogActions>
                                <Button onClick={this.handleCancel} >ปิด</Button>
                                <Button type="primary" onClick={this.handleCreate} disabled={dialogTemplateIndex < 0} >บันทึก</Button>
                            </DialogActions>
                            :
                            null
                        }
                    </ModalPanel>
                </ModalRoot>

                <Dialog
                    open={deleteDialog > 0}
                    onClose={e => this.setState({ deleteDialog: 0 })} 
                    aria-labelledby="form-dialog-title"
                    fullWidth
                >
                    <DialogTitle id="form-dialog-title">ต้องการลบรางวัล ?</DialogTitle>
                    {
                        deleteDialog === 2 ? 
                        <DialogActions>
                            <Button type="secondary" disabled>
                            กำลังลบ . . .
                            </Button>
                        </DialogActions>
                        :
                        <DialogActions>
                            <Button onClick={e => this.setState({ deleteDialog: 0 })} type="default">
                            ยกเลิก
                            </Button>
                            <Button onClick={this.handleDelete} type="secondary">
                            บันทึก
                            </Button>
                        </DialogActions>
                    }
                </Dialog>

                <ModalRoot
                    open={editDialog > 0}
                >
                    <ModalPanel>
                        <DialogTitle>แก้ไขรางวัล</DialogTitle>
                        <DialogContent>
                            {
                                editDialog === 1 ? 
                                <React.Fragment>
                                    <TextField
                                        margin="normal"
                                        label="ชื่อรางวัล"
                                        type="text"
                                        fullWidth
                                        disabled={editDialog === 2}
                                        inputProps={{ id: "dialog-reward-title" }}

                                        placeholder={dialogTemplateIndex >= 0 ? templates[dialogTemplateIndex].name : ''}
                                        value={dialogName}
                                        onChange={e => this.setState({ dialogName: e.target.value })}
                                    />

                                    {
                                        !!dialogNotForSale &&
                                        <TextField
                                            margin="dense"
                                            label="เงื่อนไข"
                                            type="text"
                                            multiline
                                            fullWidth
                                            rowsMax={3} 
                                            
                                            disabled={editDialog === 2}

                                            placeholder={dialogTemplateIndex >= 0 ? templates[dialogTemplateIndex].description : ''}
                                            value={dialogDescription}
                                            onChange={e => this.setState({ dialogDescription: e.target.value })}
                                        />
                                    }

                                    {/* <div style={{ height: 16 }} /> */}

                                    {
                                        !dialogNotForSale &&
                                        <TextField
                                            margin="dense"
                                            label="ราคา"
                                            type="number"
                                            fullWidth
                                            disabled={editDialog === 2}

                                            placeholder="อย่างน้อย 1 ดาว"
                                            
                                            value={dialogPrice}
                                            onChange={e => this.setState(
                                                { 
                                                    dialogPrice: Math.min(Math.max(parseInt (e.target.value), 1), 10000) 
                                                }
                                            )}
                                        />
                                    }
                                    
                                    <FormControlLabel 
                                        label="ไม่สามารถซื้อได้"
                                        control={
                                            <Checkbox 
                                                checked={dialogNotForSale}
                                                onChange={e => this.setState({ dialogNotForSale: e.target.checked })}
                                            />
                                        }
                                    />

                                    {
                                        !!dialogNotForSale &&
                                        <TextField
                                            margin="dense"
                                            label="ดาวที่นักเรียนจะได้รับ"
                                            type="number"
                                            fullWidth
                                            disabled={editDialog === 2}

                                            placeholder="0"
                                            
                                            value={dialogStarReward}
                                            onChange={e => this.setState(
                                                { 
                                                    dialogStarReward: Math.min(Math.max(parseInt (e.target.value), 0), 10000).toString (10)
                                                }
                                            )}
                                        />
                                    }

                                    <FormControlLabel 
                                        label="ใช้งานโดยไม่ต้องรออนุมัติ"
                                        control={
                                            <Checkbox 
                                                checked={dialogAutoApprove}
                                                onChange={e => this.setState({ dialogAutoApprove: e.target.checked })}
                                            />
                                        }
                                    />
                                </React.Fragment>
                                :
                                <Progress />
                            }
                        </DialogContent>
                        {
                            editDialog === 1 ?
                            <DialogActions>
                                <Button onClick={this.handleCancel} >ปิด</Button>
                                <Button type="primary" onClick={this.handleUpdate}>บันทึก</Button>
                            </DialogActions>
                            :
                            null
                        }
                    </ModalPanel>
                </ModalRoot>
            </Parent>
        )
    }
}

const ScrollView = styled.div`
    overflow: auto;

    ${props => props.fitParent && `
        height: 100%;
    `}
    
    table
    {
        background: white;
    }
`

// const HorizontalScrollView = styled.div`
//     overflow-x: auto;

//     table
//     {
//         overflow-x: auto;
//     }
// `

const ModalRoot = styled(Modal)`
    display: flex;
`

const ModalPanel = styled.div`
    margin: auto;

    display: flex;

    flex-direction: column;
    flex-grow: 1;

    background-color: white;
    border-radius: 8px;

    height: fit-content;

    max-height: calc(100% - 48px);
    max-width: calc(100% - 48px);

    box-shadow: 0 3px 6px rgba(0,0,0,0.2),   0 3px 6px rgba(0,0,0,0.3);

    @media (min-width: 528px)
    {
        max-width: 480px;
    }
`

const AvatarShadow = styled.div`
    filter: drop-shadow(0 0 1px rgba(0,0,0, 0.5));
`

const Description = styled.p`
    margin: 2px 0 0 0;
    padding: 0;

    opacity: 0.75;
`

export default Page