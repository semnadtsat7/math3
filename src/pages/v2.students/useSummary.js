import { useState, useEffect } from 'react'
import Firebase from '../../utils/Firebase'

import Hex from '../../utils/Hex'
import useVersion from './useVersion'

import ObjectUtil from '../../utils/Object';

function Comp (space, filters, quizzes)
{
    const [ fetching, setFetching ] = useState (true)
    const [ updating, setUpdating ] = useState (false)

    const [ map, setMap ] = useState ({})
    const [ updatedAt, setUpdatedAt ] = useState (null)

    const [ _filters, setFilters] = useState(filters);
    // const [ _quizzes, setQuizzes] = useState(quizzes);

    const version = useVersion (space, filters);

    function getQuizzes (title)
    {
        // console.log(title, quizzes);
        return quizzes.filter(quiz => quiz.title === title).map(quiz => quiz._docId);
    }

    function handleChanged ()
    {
        if (!!space)
        {
            setFetching (true)
            setUpdatedAt (null)

            const teacher = space

            const name = 'students/overview'
            const startAt = filters.startAt ? filters.startAt.clone ().startOf ('day').valueOf () : null
            const endAt = filters.endAt ? filters.endAt.clone ().endOf ('day').valueOf () : null
            const sheet = filters.sheet !== 'none' ? filters.sheet : null
            // const quizzes = sheet && Array.isArray (filters.quizzes) ? filters.quizzes : []
            const quizzes = sheet && filters.quizTitle ? getQuizzes(filters.quizTitle) : [];

            const _quizzes = quizzes.length > 0 ? quizzes.join ('|') : 'none'
    
            const uuid = Hex.fromArray ([ name, teacher, 'none', sheet, _quizzes, 'null', startAt, endAt ])
          
            const cfs = Firebase.firestore ()
            const ref = cfs.doc (`teachers/${teacher}/queries/${uuid}`)

            return ref.onSnapshot (
                doc =>
                {
                    if (doc.exists)
                    {
                        const updatedAt = doc.get ('updatedAt').toMillis ()

                        const src = doc.get ('items') || []
                        const dst = {}

                        src.forEach (({ student, ...fields }) =>
                        {
                            dst[student] = fields
                        })
                        
                        setMap (dst)
                        setUpdatedAt (updatedAt)
                        setFetching (false) 
                        setUpdating (false)
                    }
                }
            )
        }
    }

    function handleUpdate ()
    {
        if (!!version)
        {
            // Create if not exists
            // console.log ('update')

            const teacher = space

            const name = 'students/overview'
            const startAt = filters.startAt ? filters.startAt.clone ().startOf ('day').valueOf () : null
            const endAt = filters.endAt ? filters.endAt.clone ().endOf ('day').valueOf () : null
            const sheet = filters.sheet !== 'none' ? filters.sheet : null
            // const quizzes = sheet && Array.isArray (filters.quizzes) ? filters.quizzes : []
            const quizzes = sheet && filters.quizTitle ? getQuizzes(filters.quizTitle) : [];

            const _quizzes = quizzes.length > 0 ? quizzes.join ('|') : 'none'

            const uuid = Hex.fromArray ([ name, teacher, 'none', sheet, _quizzes, 'null', startAt, endAt ])
            const params = { sheet, quizzes, startAt, endAt }

            const cfs = Firebase.firestore ()
            const ref = cfs.doc (`teachers/${teacher}/queries/${uuid}`)
        
            const FieldValue = Firebase.firestore.FieldValue
            const data = { name, params, createdAt: FieldValue.serverTimestamp () }

            // let timeout = null

            ref
            .collection ('sessions')
            .doc (`${version.q}.${version.t}`)
            .set (data)
            .then (() =>
            {
                setUpdating (true)
            })
            .catch (err => {})
            // .catch (console.log)

            // .catch (err =>
            // {
            //     console.log (err)
                
            //     setUpdating (true)

            //     timeout = setTimeout (() =>
            //     {
            //         setUpdatedAt (new Date ())
            //         setUpdating (false)
            //     }, 500)
            // })

            // return function ()
            // {
            //     if (!!timeout)
            //     {
            //         clearTimeout (timeout)
            //     }
            // }
        }
    }

    function handleChange ()
    {
        const a = ObjectUtil.changeds(_filters, filters);
        // const b = ObjectUtil.changeds(_quizzes, quizzes);

        if (a.length > 0)
        {
            setFilters(filters);
        }

        // if (b.length > 0)
        // {
        //     setQuizzes(quizzes);
        // }
    }

    useEffect (handleChanged, [ space, _filters, quizzes.length ])
    useEffect (handleUpdate, [ version, space, _filters, quizzes.length ]);
    useEffect (handleChange, [ filters ]);

    return { fetching, updating, map, updatedAt }
}

export default Comp