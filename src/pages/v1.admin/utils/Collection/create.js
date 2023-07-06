import firebase from 'firebase'

async function create ({ collection, docs = [], uuid = null, data = {} })
{
    data.index = docs.length
    data.createdAt = new Date ().getTime ()
    data.updatedAt = new Date ().getTime ()

    const cfs = firebase.app('hkg').firestore ()
    const col = cfs.collection (collection)
    const ref = !!uuid ? col.doc (uuid) : col.doc ()

    await ref.set (data)
}

export default create