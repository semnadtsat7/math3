import { useState, useEffect } from 'react'
import Firebase from '../../utils/Firebase'

function Comp (space)
{
    const [ fetching, setFetching ] = useState (true)
    const [ items, setItems ] = useState ([])

    function listen ()
    {
        if (!!space)
        {
            setFetching (true)
            
            const teacher = space

            const cfs = Firebase.firestore ()
            const ref = cfs.collection (`teachers/${teacher}/groups`).where('isActive', '==', true)

            return ref.onSnapshot (
                snapshot =>
                {
                    const items = snapshot.docs
                    .map (doc =>
                    {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        }
                    })
                    .sort ((a, b) => a.name.localeCompare (b.name))

                    setItems (items)
                    setFetching (false)
                }
            )
        }
    }

    useEffect (listen, [ space ])

    return { fetching, items }
}

export default Comp