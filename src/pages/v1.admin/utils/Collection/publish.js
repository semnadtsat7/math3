import firebase from 'firebase'

async function get (collection, onFilter)
{
    const cfs = firebase.app('hkg').firestore ()
    const ref = cfs.collection (collection).orderBy ('index', 'asc')

    const snapshot = await ref.get ()
    const items = []

    snapshot.docs.forEach (doc =>
    {
        items.push (
            {
                uuid: doc.id,
                data: doc.data (),
            }
        )
    })

    if (typeof onFilter === 'function')
    {
        return items.filter (onFilter)
    }

    return items
}

async function set (collection, docs, version)
{
    const cfs = firebase.firestore ()
    const ref = cfs.collection (collection)

    let batch = cfs.batch ()
    let batchCount = 0

    for (let i = 0; i < docs.length; i++)
    {
        const doc = docs[i]
        const data = { ...doc.data, version }

        delete data.createdAt
        delete data.updatedAt
        delete data.lock

        batch.set (ref.doc (doc.uuid), data)
        batchCount ++

        if (batchCount > 300)
        {
            await batch.commit ()

            batch = cfs.batch ()
            batchCount = 0
        }
    }

    if (batchCount > 0)
    {
        await batch.commit ()
    }
}

async function del (collection, version)
{
    const cfs = firebase.firestore ()
    const ref = cfs.collection (collection)

    const snapshot = await ref.where ('version', '<', version).get ()
    const docs = snapshot.docs

    let batch = cfs.batch ()
    let batchCount = 0

    for (let i = 0; i < docs.length; i++)
    {
        const doc = docs[i]

        batch.delete (ref.doc (doc.id))
        batchCount ++

        if (batchCount > 300)
        {
            await batch.commit ()

            batch = cfs.batch ()
            batchCount = 0
        }
    }

    if (batchCount > 0)
    {
        await batch.commit ()
    }
}

async function publish ({ src, dst, onFilter })
{
    const version = new Date ().getTime ()
    const docs = await get (src, onFilter)

    await set (dst, docs, version)
    await del (dst, version)
}

export default publish