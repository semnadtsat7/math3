import firebase from 'firebase'

async function update ({ collection, docs, index })
{
    const editor = window.localStorage.getItem ('_editorID')
    const data = 
    {
        lock: 
        {
            editor,
            time: new Date ().getTime (),
        }
    }

    const uuid = docs[index].uuid

    const cfs = firebase.app('hkg').firestore ()
    const ref = cfs.collection (collection).doc (uuid)

    await cfs.runTransaction (transaction =>
    {
        return transaction.get (ref).then(doc =>
        {
            const lock = doc.get ('lock')
            const now = new Date ().getTime ()

            if (!lock || lock.editor === editor || now - lock.time >= 10000)
            {
                if (doc.exists)
                {
                    transaction.update (ref, data)
                }
                else
                {
                    transaction.set (ref, data, { merge: true })
                }
            }
            else
            {
                throw new Error ("เอกสารกำลังแก้ไขโดยผู้ใช้อื่น")
            }
        })
    })
}

export default update