import Firebase from '../utils/Firebase'
import Axios from 'axios'

async function query ()
{
    // const ref = Firebase.database ().ref (`version/data`)
    // const snap = await ref.once ('value')
    // const version = snap.val () || 0

    const url = `https://clevermath.imgix.net/maps.json`;

    try
    {
        const result = await Axios.get (url, { headers: { 'Cache-Control': 'no-cache' } })
        return result.data
    }
    catch (err)
    {
        console.log (err)
    }

    return []
}

async function get (options = { teacher: null, lastBoss: false })
{
    // const fn = Firebase.functions ().httpsCallable ('teacherGetMaps')
    // const result = await fn ({  })

    // let maps = result.data || []
    let maps = await query ()

    maps = maps.sort ((a, b) => a.order - b.order)

    if (!options.lastBoss)
    {
        maps = maps.filter (m => !m.hidden)
    }

    // 2019.12.07
    maps = maps.filter (m => m.type !== 'tutorial')
    //

    if (!!options.teacher)
    {
        const ref = Firebase.database ().ref (`teachers/${options.teacher}/maps`)
        const snap = await ref.once ('value')
        const actives = snap.exists () ? snap.val () || {} : {}

        maps = maps.filter (e => !!actives[e._docId])
    }

    return maps
}

export default
{
    get,
}