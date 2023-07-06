import { useState, useEffect } from 'react'
import Firebase from '../../utils/Firebase'

function Comp ()
{
    const arr = JSON.parse (window.localStorage.getItem ('spaces') || '[]')

    const [ items, setItems ] = useState (arr || [])
    const [ fetching, setFetching ] = useState (!arr || arr.length === 0)

    function listen ()
    {
        const owner = Firebase.auth ().currentUser.uid

        const cfs = Firebase.firestore ()
        const ref = cfs.collection (`teachers`)
                        .where ('owner', '==', owner)
                        .where ('isActive', '==', true)
                        .orderBy ('name', 'asc')

        return ref.onSnapshot (
            snapshot =>
            {
                const items = snapshot.docs.map (doc => 
                {
                    const id = doc.id
                    const { name, slug } = doc.data ()

                    return { id, name, slug }
                })

                setItems (items)
                setFetching (false)

                window.localStorage.setItem ('spaces', JSON.stringify (items))
            }
        )
    }

    useEffect (listen, [ ])

    return { fetching, items }
}

export default Comp