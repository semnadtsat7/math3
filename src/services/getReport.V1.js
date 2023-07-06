
import Firebase from 'firebase/app'
import DateUtil from '../utils/DateTime'

// import GetMaps from './getMaps.V1'
// import GetSheets from './getQuizzes.V1'

async function statistics (teacher, student, map, sheet)
{
    const cfs = Firebase.firestore ()
    const path = `teachers/${teacher}/students/${student}/maps/${map}/sheets/${sheet}/statistics`

    const queryRef = cfs.collection (path).orderBy (`createdAt`, `asc`)
    const snapshot = await queryRef.get ()

    const docs = snapshot.docs
    const items = []

    for (let i = 0; i < docs.length; i++)
    {
        const doc = docs[i]
        const number = i + 1

        let { score = 0, usage, createdAt } = doc.data ()

        usage = Math.round (usage / 1000)
        score = !!createdAt ? score : '-'
        createdAt = !!createdAt ? DateUtil.format (createdAt, { delimiter: ' ', monthType: 'short' }) : '-'

        items.push (
            {
                number,
                score,
                usage,
                createdAt,
            }
        )
    }

    return items
}

// async function sheets (teacher, student, map)
// {
//     if (map !== 'boss-fight')
//     {
//         const sheets = await GetSheets.get (map, true, true)

//         const cfs = Firebase.firestore ()
//         const path = `teachers/${teacher}/students/${student}/maps/${map}/sheets`

//         const queryRef = cfs.collection (path)
//         const snapshot = await queryRef.get ()

//         const data = {}
//         const items = []

//         snapshot.docs.forEach (doc =>
//         {
//             data[doc.id] = doc.data ()
//         })

//         for (let i = 0; i < sheets.length; i++)
//         {
//             let { id, title } = sheets[i]
//             let { score = 0, updatedAt } = data[id] || {}

//             let sheet = id

//             updatedAt = !!updatedAt ? DateUtil.format (updatedAt, { delimiter: ' ', monthType: 'short' }) : '-'
//             score = !!updatedAt ? score : '-'

//             items.push (
//                 {
//                     map,
//                     sheet,
//                     title,
//                     score,
//                     updatedAt,
//                 }
//             )
//         }

//         return items
//     }
//     else
//     {
//         const maps = await GetMaps.get (true)
//         const sheets = await Promise.all (maps.map (map => GetSheets.getBossFight (map)))

//         const cfs = Firebase.firestore ()

//         const data = {}
//         const items = []

//         await Promise.all (
//             maps.map (map =>
//             {
//                 return new Promise (
//                     async resolve =>
//                     {
//                         const mapId = map.id
//                         const path = `teachers/${teacher}/students/${student}/maps/${mapId}/sheets`

//                         const queryRef = cfs.collection (path)
//                         const snapshot = await queryRef.get ()

//                         snapshot.docs.forEach (doc =>
//                         {
//                             data[doc.id] = doc.data ()
//                         })

//                         resolve ()
//                     }
//                 )
//             })
//         )
            
//         for (let i = 0; i < sheets.length; i++)
//         {
//             let { id, title, map } = sheets[i]
//             let { score = 0, updatedAt } = data[id] || {}

//             let sheet = id

//             updatedAt = !!updatedAt ? DateUtil.format (updatedAt, { delimiter: ' ', monthType: 'short' }) : '-'
//             score = !!updatedAt ? score : '-'

//             items.push (
//                 {
//                     map,
//                     sheet,
//                     title,
//                     score,
//                     updatedAt,
//                 }
//             )
//         }

//         return items
//     }
// }

const fields = 
{
    statistic: 
    [
        {
            label: 'ครั้งที่',
            value: 'number',
        },
        {
            label: 'คะแนน',
            value: 'score',
        },
        {
            label: 'เวลาที่ใช้',
            value: 'usage',
        },
        {
            label: 'วันที่บันทึก',
            value: 'createdAt',
        },
    ],

    sheet: 
    [
        {
            label: 'ชุดข้อสอบ',
            value: 'title',
        },
        {
            label: 'คะแนน',
            value: 'score',
        },
        {
            label: 'วันที่บันทึก',
            value: 'updatedAt',
        },
    ],
}

export default
{
    statistics,
    // sheets,

    fields,
}