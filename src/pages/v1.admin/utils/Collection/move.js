import firebase from 'firebase'

async function move ({ collection, docs, oldIndex, newIndex, onUpdate })
{
    const arrayMove = require ('array-move')
    
    const cfs = firebase.app('hkg').firestore ()
    const ref = cfs.collection (collection)
    
    const nDocs = arrayMove (docs, oldIndex, newIndex)

    onUpdate (nDocs)

    const minIndex = Math.min (oldIndex, newIndex)
    const maxIndex = Math.max (oldIndex, newIndex)

    let batch = cfs.batch ()
    let batchCount = 0

    for (let i = minIndex; i <= maxIndex; i++)
    {
        const uuid = nDocs[i].uuid
        const data = 
        { 
            index: i, 
        }

        batch.update (ref.doc (uuid), data)
        batchCount++

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

export default move