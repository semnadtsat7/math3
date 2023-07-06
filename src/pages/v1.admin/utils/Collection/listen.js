import firebase from 'firebase'

function listen ({ collection, callback })
{
    const cfs = firebase.app('hkg').firestore ()
    const ref = cfs.collection (collection).orderBy ('index', 'asc')

    return ref.onSnapshot (snapshot =>
    {
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

        callback (items)
    })
}

export default listen