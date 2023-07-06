import { useState, useEffect } from 'react'
import Firebase from '../../utils/Firebase'

function useVersion (space, filters)
{
    const [ version, setVersion ] = useState (null)
    const [ v1, setV1 ] = useState (null)
    const [ v2, setV2 ] = useState (null)

    function handleV1 ()
    {
        const rdb = Firebase.database ()
        const ref = rdb.ref (`version/data`)

        return ref.on ('value', snapshot =>
        {
            if (!!snapshot && snapshot.exists ())
            {
                setV1 (snapshot.val () || 1)
            }
        })
    }

    function handleV2 ()
    {
        if (!!space)
        {
            const teacher = space

            const cfs = Firebase.firestore ()
            const ref = cfs.doc (`teachers/${teacher}`)

            return ref.onSnapshot (doc =>
            {
                const { data = 1 } = doc.get ('version') || {}
                setV2 (data)
            })
        }
    }

    function handleVersion ()
    {
        if (!!v1 && !!v2)
        {
            // Delay 'n' Seconds
            const t = setTimeout (() => setVersion ({ q: v1, t: v2 }), 5000);

            return function ()
            {
                clearTimeout (t);
            }
        }
        else
        {
            setVersion (null)
        }
    }

    useEffect (handleV1, [ filters ])
    useEffect (handleV2, [ space, filters ])

    useEffect (handleVersion, [ v1, v2 ])

    return version
}

export default useVersion