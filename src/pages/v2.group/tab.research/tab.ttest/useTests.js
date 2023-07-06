import { useState, useEffect } from 'react'
import Firebase from '../../../../utils/Firebase'

function Comp (space, type, filters)
{
    const [ fetching, setFetching ] = useState (true)
    const [ map, setMap ] = useState ({})

    function listen ()
    {
        const sheet = filters.sheet;

        if (!!space && sheet !== 'none' && [ 'pretest', 'posttest' ].indexOf (type) >= 0)
        {
            setFetching (true)

            const teacher = space
            const map = sheet

            const cfs = Firebase.firestore ()
            const ref = cfs.doc (`teachers/${teacher}/maps/${map}/${type}/v001`)

            return ref.onSnapshot (
                doc =>
                {
                    setMap (doc.exists ? doc.data () : {})
                    setFetching (false)
                }
            )
        }
    }

    useEffect (listen, [ space, type, filters ])

    return { fetching, map }
}

export default Comp