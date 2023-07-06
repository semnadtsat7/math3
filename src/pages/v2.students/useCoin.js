import { useState, useEffect } from 'react'
import Firebase from '../../utils/Firebase'

function Comp (space, student)
{
    const [ fetching, setFetching ] = useState (true)
    const [ coin, setCoin ] = useState (0)

    function listen ()
    {
        if (!!space && !!student)
        {
            const teacher = space

            const rdb = Firebase.database ()
            const ref = rdb.ref (`teachers/${teacher}/students/${student}/info/coin`)

            return ref.on ('value',
                snapshot =>
                {
                    if (!!snapshot && snapshot.exists ())
                    {
                        setCoin (parseInt (snapshot.val () || 0, 10))
                    }

                    setFetching (false)
                }
            )
        }
    }

    useEffect (listen, [ space, student ])

    return { fetching, coin }
}

export default Comp