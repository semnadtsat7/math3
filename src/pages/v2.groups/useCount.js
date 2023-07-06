import { useState, useEffect } from 'react'
import Firebase from '../../utils/Firebase'

function Comp (space, group)
{
    const [ fetching, setFetching ] = useState (true)
    const [ count, setCount ] = useState (0)

    function listen ()
    {
        if (!!space && group !== 'none')
        {
            const teacher = space

            const cfs = Firebase.firestore ()
            const ref = cfs.collection (`teachers/${teacher}/groups/${group.id}/students`).where ('isActive', '==', true)

            return ref.onSnapshot (
                snapshot =>
                {
                    setCount (snapshot.docs.length)
                    setFetching (false)
                }
            )
        }
    }

    useEffect (listen, [ space, group ])

    return { fetching, count }
}

export default Comp