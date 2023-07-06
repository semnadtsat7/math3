import firebase from 'firebase'

async function update ({ collection, docs, index })
{
    const editor = window.localStorage.getItem ('_editorID')
    const uuid = docs[index].uuid

    const cfs = firebase.app('hkg').firestore ()
    const ref = cfs.collection (collection).doc (uuid)

    await cfs.runTransaction (transaction =>
    {
        return transaction.get (ref).then(doc =>
        {
            const lock = doc.get ('lock')
            const now = new Date ().getTime ()

            if (!lock)
            {
                throw new Error ("เอกสารไม่มีผู้ใดกำลังใช้งาน")
            }
            else if (lock.editor !== editor && now - lock.time < 10000)
            {
                throw new Error ("เอกสารกำลังแก้ไขโดยผู้ใช้อื่น")
            }
            else if (doc.exists)
            {
                transaction.update (ref, { lock: null })
            }
        })
    })
}

export default update