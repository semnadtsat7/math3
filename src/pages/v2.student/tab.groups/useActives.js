import { useState, useEffect } from 'react'
import Firebase from '../../../utils/Firebase'

function Comp (space, filters)
{
    const [ fetching, setFetching ] = useState (true)
    const [ map, setMap ] = useState ({})

    function listen ()
    {
        const student = filters.student

        if (!!space && student !== 'none')
        {
            setFetching (true)

            const teacher = space

            const cfs = Firebase.firestore ()
            const ref = cfs.collection (`teachers/${teacher}/students/${student}/groups`).where('isActive', '==', true)

            return ref.onSnapshot (
                snapshot =>
                {
                    const dst = {}

                    snapshot.docs.forEach (doc =>
                    {
                        dst[doc.id] = !!doc.get ('isActive')
                    })

                    setMap (dst)
                    setFetching (false)
                }
            )
        }
        else
        {
            setFetching (false)
        }
    }

    useEffect (listen, [ space, filters ])

    return { fetching, map }
}

export default Comp