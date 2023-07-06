import { useState, useEffect } from 'react'
import Firebase from '../../utils/Firebase'

function Comp (space)
{
    const [ fetching, setFetching ] = useState (true)

    const [ id, setId ] = useState ('')
    const [ name, setName ] = useState ('')
    const [ slug, setSlug ] = useState ('')
    const [ grade, setGrade ] = useState ('')
    const [ classroom, setClassroom ] = useState ('')

    function listen ()
    {
        setFetching (true)

        if (!!space)
        {
            const teacher = space

            const cfs = Firebase.firestore ()
            const ref = cfs.doc (`teachers/${teacher}`)

            return ref.onSnapshot (
                async doc =>
                {
                    if (doc.exists)
                    {
                        await new Promise (r => setTimeout (r, 1000))

                        setId (doc.id)
                        setName (doc.get ('name'))
                        setSlug (doc.get ('slug'))
                        setGrade (doc.get ('grade'))
                        setClassroom (doc.get ('class'))
                        setFetching (false)
                    }
                }
            )
        }
    }

    useEffect (listen, [ space ])

    return { fetching, id, name, slug, grade, classroom }
}

export default Comp