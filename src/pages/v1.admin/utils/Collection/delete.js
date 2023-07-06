import firebase from 'firebase'

async function del ({ collection, docs = [], index })
{
    const decrement = firebase.app('hkg').firestore.FieldValue.increment (-1)

    const cfs = firebase.app('hkg').firestore ()
    const ref = cfs.collection (collection)
    
    let batch = cfs.batch ()
    let batchCount = 0

    batch.delete (ref.doc (docs[index].uuid))
    batchCount ++

    for (let i = index + 1; i < docs.length; i++)
    {
        const uuid = docs[i].uuid
        const data = 
        {
            index: decrement,
        }

        batch.update (ref.doc (uuid), data)
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

export default del