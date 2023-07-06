import CSV from '../utils/CSV'
import Flip from './util.filp'

const IMAGE_URL = `https://storage.googleapis.com/clevermath-official.appspot.com/quizzes/`

function flipAnswers (text = '')
{
    if (text.startsWith('flip'))
    {
        return Flip (text.replace('flip', ''))
    }

    return text
}

function replaceImageURL (text = '')
{
    return text.replace(/[^\|\s]+/gi, (a, b) =>
    {
        if (!!a.match(/jpg|png/gi) && !a.match(/http/gi))
        {
            return IMAGE_URL + a
        }

        return a
    })
}

function parse (csv)
{
    let quizzes = []
    let quiz = null
    let type = null

    for (let i = 1; i < csv.length; i++)
    {
        const row = csv[i]
        const boss = row[`type`] === 'boss'

        if ((!!row[`type`] || !!boss) && !!row[`map`] && !!row[`level`] && row[`limit`])
        {
            if (!!quiz)
            {
                quizzes.push (quiz)
                quiz = null
                type = null
            }

            type = row[`type`] || 'drag-drop'

            let _type = type

            if (_type === 'group')
            {
                _type = 'pair'
            }

            quiz = 
            {
                id: parseInt (row[`quiz`], 10).toString(10).padStart(6, '0'),
                map: parseInt (row[`map`] || 0, 10),
                order: parseInt (row[`quiz`] || 1, 10),

                level: row[`level`] || 'normal',
                type: boss ? 'boss' : _type,

                questions: [],

                // คำอธิบายด่าน (Deprecated @2019-07-05)
                description: row[`description`] || '',

                limit: parseInt (row[`limit`] || 100, 10),

                // ชื่อด่าน (Deprecated @2019-07-05)
                title: row[`command`] || '',

                // มาตราฐาน
                scale: row[`image`] || '',

                // ตัวชี้วัด
                indicator: row[`answer`] || '',

                // จุดประสงค์การเรียนรู้
                purpose: row[`description`] || '',

                // บทเรียนย่อย
                subLesson: row[`command`] || '',
            }
        }
        else
        {
            let cellPerRow = parseInt (row[`cellPerRow`] || 2, 10)
            let cellHeight = parseInt (row[`cellHeight`] || 0, 10)
            let cellType = 'text'
            let cellImageType = 'a'

            if (!!row[`choiceLayout`])
            {
                const choiceLayout = row[`choiceLayout`]

                if (choiceLayout.indexOf('แถวละ') >= 0)
                {
                    let layout = choiceLayout.split (' ')

                    cellPerRow = Math.max (
                        Math.min (
                            parseInt (layout[1], 10), 4
                        ), 1
                    )
                    
                    if (layout[2] === 'ตัวเลือกรูปภาพ')
                    {
                        cellType = 'image'
                        cellHeight = 1
                    }
                    else
                    {
                        if (cellPerRow === 4)
                        {
                            cellHeight = 1
                        }
                        else if (cellPerRow === 2)
                        {
                            cellHeight = 0.5
                        }
                        else if (cellPerRow === 1)
                        {
                            cellHeight = 0.25
                        }
                        else
                        {
                            //cellPerRow = 2
                            cellHeight = 0.5
                        }
                    }
                }
                else
                {
                    const layout = choiceLayout.charAt (0).toLocaleLowerCase ()

                    cellPerRow = Math.max (
                        Math.min(
                            parseInt (choiceLayout.slice (1, 2), 10), 4
                        ), 1
                    )

                    if (layout === 'i')
                    {
                        cellType = 'image'
                        cellHeight = 1

                        // a b c
                        cellImageType = choiceLayout.slice (2)
                    }
                    else
                    {
                        if (cellPerRow === 4)
                        {
                            cellHeight = 1
                        }
                        else if (cellPerRow === 2)
                        {
                            cellHeight = 0.5
                        }
                        else if (cellPerRow === 1)
                        {
                            cellHeight = 0.25
                        }
                        else
                        {
                            //cellPerRow = 2
                            cellHeight = 0.5
                        }
                    }
                }
            }

            let qType = row[`type`] || type || 'drag-drop'
            let answerLimit = 0

            if (qType === 'group')
            {
                qType = 'pair'
                answerLimit = 3
            }
            else if (qType === 'pair')
            {
                answerLimit = 3
                // answerLimit = 2
            }

            let answer = ''
            let choices = ''
            let order = 'Random'

            if (!!row['answer'])
            {
                answer = row['answer']

                if (qType === 'placeholder')
                {
                    answer = flipAnswers (answer)
                }
                
                answer = replaceImageURL (answer)
            }

            if (!!row[`choices`])
            {
                choices = row[`choices`]

                if (qType === 'placeholder')
                {
                    // choices = validatePlacholderChoices(choices)
                }

                choices = replaceImageURL (choices)
            }

            if (row[`order`] !== 'Random')
            {
                order = parseInt (row[`order`], 10)
            }

            const question = 
            {
                type: qType,

                title: row[`command`] || '',
                description: row[`description`] || '',
          
                image: replaceImageURL (row[`image`] || ''),
                
                answerLimit,
                answer,

                hint: row[`hintText`] || '',
                hintImage: replaceImageURL (row[`hintImage`] || ''),

                limit: parseInt (row[`choiceLimit`] || 100, 10),

                choices,
                order,

                cellPerRow,
                cellHeight,
                cellType,
                cellImageType,

                why: row[`why`] || '',
            }

            quiz.questions.push (question)
        }
    }

    if (!!quiz)
    {
        quizzes.push (quiz)
        quiz = null
        type = null
    }

    quizzes.forEach (quiz =>
    {
        if (!quiz.type)
        {
            const counts = {}

            for (let i = 0; i < quiz.questions.length; i++)
            {
                const t = quiz.questions[i].type
                counts[t] = (counts[t] || 0) + 1
            }

            const sorteds = Object.keys (counts).sort ((a, b) => counts[b] - counts[a])

            if (sorteds.length > 0)
            {
                quiz.type = sorteds[0]
            }
        }
    })

    return quizzes
            .sort ((a, b) => a.map - b.map)
            .sort ((a, b) => a.order - b.order)
}

async function toJSON (file)
{
    const csv = await CSV.fromFile (file)
    return parse (csv)
}

export default 
{
    toJSON,
}