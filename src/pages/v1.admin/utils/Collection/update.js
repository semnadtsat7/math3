import firebase from 'firebase'

async function update ({ collection, docs, index, data })
{
    data.updatedAt = new Date ().getTime ()

    const uuid = docs[index].uuid

    const cfs = firebase.app('hkg').firestore ()
    const ref = cfs.collection (collection).doc (uuid)

    await ref.update (data)
}

export default update