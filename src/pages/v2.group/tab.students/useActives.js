import { useState, useEffect } from 'react'
import Firebase from '../../../utils/Firebase'

function Comp (space, filters)
{
    const [ fetching, setFetching ] = useState (true)
    const [ map, setMap ] = useState ({})
    const [ count, setCount ] = useState(0);

    function listen ()
    {
        if (!!space)
        {
            const teacher = space
            const group = filters.group || 'null'

            const cfs = Firebase.firestore ()
            const ref = cfs.collection (`teachers/${teacher}/groups/${group}/students`).where('isActive', '==', true)

            return ref.onSnapshot (
                snapshot =>
                {
                    const dst = {}
                    let count = 0;

                    snapshot.docs.forEach (doc =>
                    {
                        dst[doc.id] = !!doc.get ('isActive')
                        
                        if (!!doc.get ('isActive'))
                        {
                            count += 1;
                        }
                    })

                    setMap (dst)
                    setCount (count);
                    setFetching (false)
                }
            )
        }
    }

    useEffect (listen, [ space, filters ])

    return { fetching, map, count }
}

export default Comp