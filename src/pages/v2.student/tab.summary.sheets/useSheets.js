import { useState, useEffect } from 'react'
import Firebase from '../../../utils/Firebase'
import GetMaps from '../../../services/getMaps.V1'

function useMaps (space)
{
    const [ fetching, setFetching ] = useState (true)
    const [ items, setItems ] = useState ([])

    const [ version, setVersion ] = useState (0)

    function handleMount ()
    {
        if (!!space)
        {
            setFetching (true)

            const teacher = space
          
            GetMaps
            .get({ teacher })
            .then (items =>
            {
                setItems (items)
                setFetching (false)
            })
        }
    }

    function handleUpdate ()
    {
        if (version > 0)
        {
            const teacher = space
            GetMaps.get({ teacher }).then (setItems)
        }
    }

    function handleVersion ()
    {
        const rdb = Firebase.database ()
        const ref = rdb.ref (`version/data`)

        return ref.on ('value', snapshot =>
        {
            if (!!snapshot && snapshot.exists ())
            {
                setVersion (snapshot.val () || 1)
            }
        })
    }

    useEffect (handleMount, [ space ])
    useEffect (handleVersion, [ ])
    useEffect (handleUpdate, [ version, space ])

    return { fetching, items }
}

export default useMaps