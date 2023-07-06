import React, { Fragment } from 'react'
import styled from 'styled-components'

import
{
  Drawer,
  ListItem,
  ListItemText,
  IconButton,
  List,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  Typography,
  ExpansionPanelSummary,
} from '@material-ui/core'

import
{
  Close as CloseIcon,
} from '@material-ui/icons'

import { Icon } from 'antd';

import TEXAnswer from '../../../../components/TEXAnswer'
import TEXDraw from '../../../../components/TEXDraw'

import listenQuiz from './listenQuiz';

// const Toggler = styled.button`
//     background-color: transparent;
//     border: none;

//     outline: none;
//     text-decoration: underline;

//     color: cornflowerblue;
//     cursor: pointer;

//     padding: 5px 0 0 0;
//     transition: filter 0.15s;

//     &:hover
//     {
//         filter: brightness(0.8);
//     }
// `

const SideSheet = styled.div`
    min-width: 90vw;
    max-width: 90vw;

    @media (min-width: 600px)
    {
        min-width: 576px;
        max-width: 576px;
    }
`

const PrimaryText = styled.div`
    flex-grow: 1;
    display: flex;
`

const ExpansionData = styled.div`
    width: 100%;
    text-align: left;

    img
    {
        display: flex;

        max-width: 100%;
        margin: 24px auto;
    }

`

const HeadingData = styled.div`
    width: 100%;
    padding: 0 24px 16px 24px;
`

interface Props
{
  quizID: string;
  onClose(): void;
}

const Comp: React.FC<Props> = (
  {
    quizID,
    onClose,
  }
) =>
{
  const { view } = listenQuiz({ quizID });
  const quiz = view.quiz;

  const {
    questions = [],
    indicator = null,
    purpose = null,
    scale = null,
    order = 0,
  } = quiz;

  return (
    <Drawer
      variant="temporary"
      open={!!quizID}
      anchor="right"
      onClose={() => onClose()}
      ModalProps={{ keepMounted: false }}
    >
      {
        view.fetching === 'full' ?
        <SideSheet>
          <div style={{ padding: 24 }} >
            <Typography>
              <Icon type="loading" />
              <span style={{ marginLeft: 16 }} >
                กำลังโหลด . . .
              </span>
            </Typography>
          </div>
        </SideSheet>
        :
        <SideSheet>
          <ListItem
            component="div"
            disableGutters={true}
            style={{ paddingLeft: 24, paddingRight: 8 }}
          >
            <ListItemText
              primaryTypographyProps={{ variant: "h6", noWrap: true }}
              primary={`คำถามชุดที่ ${order}`}
            />
            <IconButton onClick={() => onClose()} >
              <CloseIcon />
            </IconButton>
          </ListItem>

          <List>
            <HeadingData>
              {
                !!purpose &&
                <React.Fragment>
                  <Typography
                    gutterBottom={true}
                  >
                    <b>จุดประสงค์การเรียนรู้</b>
                  </Typography>
                  <Typography
                    gutterBottom={true}
                  >
                    {purpose}
                  </Typography>
                </React.Fragment>
              }
            </HeadingData>
            <HeadingData>
              {
                !!indicator &&
                <React.Fragment>
                  <Typography
                    gutterBottom={true}
                  >
                    <b>ตัวชี้วัด</b>
                  </Typography>
                  <Typography
                    gutterBottom={true}
                  >
                    {indicator}
                  </Typography>
                </React.Fragment>
              }
            </HeadingData>
            <HeadingData>
              {
                !!scale &&
                <React.Fragment>
                  <Typography
                    gutterBottom={true}
                  >
                    <b>มาตราฐาน</b>
                  </Typography>
                  <Typography
                    gutterBottom={true}
                  >
                    {scale}
                  </Typography>
                </React.Fragment>
              }
            </HeadingData>
            <Divider />
            {
              !!questions &&
              questions.map((question, i) =>
              {
                const {
                  type,
                  title,
                  description,
                  image,
                  answer,
                  choices,
                  
                  cellPerRow,
                  cellType,

                  hintText,
                  hintImage,
                } = question;

                return (
                  <Fragment key={`sheet-question-${i}`} >
                    <ExpansionPanel elevation={0} defaultExpanded={true} >
                      <ExpansionPanelSummary>
                        <PrimaryText>
                          <Typography >
                            ข้อที่ {i + 1}
                          </Typography>
                        </PrimaryText>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <ExpansionData>
                          {
                            !!title &&
                            <Typography
                              gutterBottom={true}
                            >
                              <b>
                                <TEXDraw text={title} />
                              </b>
                            </Typography>
                          }
                          {
                            !!description &&
                            <Typography
                              gutterBottom={true}
                            >
                              <TEXDraw text={description} />
                            </Typography>
                          }
                          {!!image && <img src={image} alt="quiz-description" />}

                          <Typography gutterBottom={false} ><b>คำตอบ</b></Typography>

                          <Typography
                            gutterBottom={true}
                            component="div"
                          >
                            <TEXAnswer type={type} text={answer || choices} />
                          </Typography>

                          {
                            [
                              'drag-drop',
                              'placeholder'
                            ].indexOf(type) >= 0 &&
                            <React.Fragment>
                              <Typography gutterBottom={false} ><b>ตัวเลือก</b></Typography>
                              <Typography
                                gutterBottom={true}
                                component="div"
                              >
                                <TEXAnswer
                                  type={type}
                                  text={choices}
                                  isChoice={true}
                                  cellType={cellType}
                                  cellPerRow={cellPerRow}
                                />
                              </Typography>
                            </React.Fragment>
                          }


                          <Typography style={{ marginTop: 16 }} gutterBottom={false} ><b>Hint</b></Typography>
                          <Typography gutterBottom={true} >{hintText || '-'}</Typography>
                          {!!hintImage && <img src={hintImage} style={{ margin: `8px 0` }} alt="quiz-hint" />}
                        </ExpansionData>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Divider />
                  </Fragment>
                )
              })
            }
          </List>
        </SideSheet>
      }
    </Drawer>
  )
}

export default Comp