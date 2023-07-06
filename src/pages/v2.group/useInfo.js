import { useState, useEffect } from 'react'
import Firebase from '../../utils/Firebase'

function Comp (space, group, history)
{
    const [ fetchingInfo, setFetchingInfo ] = useState (true)
    const [ fetchingCount, setFetchingCount ] = useState (true)

    const [ name, setName ] = useState ('-')
    const [ count, setCount ] = useState (0)
  
    function listenInfo ()
    {
        if (!!space && !!group)
        {
            const teacher = space

            const cfs = Firebase.firestore ()
            const ref = cfs.doc (`teachers/${teacher}/groups/${group}`)

            return ref.onSnapshot (
                doc =>
                {
                    if (doc.exists)
                    {
                        setName (doc.get ('name') || '')
                    }
                    else
                    {
                        history.replace (`/groups`)
                    }

                    setFetchingInfo (false)
                }
            )
        }
    }

    function listenCount ()
    {
        if (!!space && !!group)
        {
            const teacher = space

            const cfs = Firebase.firestore ()
            const ref = cfs.collection (`teachers/${teacher}/groups/${group}/students`).where ('isActive', '==', true)

            return ref.onSnapshot (
                snapshot =>
                {
                    setCount (snapshot.docs.length)
                    setFetchingCount (false)
                }
            )
        }
    }

    useEffect (listenInfo, [ space, group ])
    useEffect (listenCount, [ space, group ])

    const fetching = fetchingInfo || fetchingCount

    return { fetching, name, count }
}

export default Comp