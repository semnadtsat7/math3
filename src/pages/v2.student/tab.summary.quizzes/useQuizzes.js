import { useState, useEffect } from 'react'
import Firebase from '../../../utils/Firebase'
import GetMaps from '../../../services/getMaps.V1'
import GetSheets from '../../../services/getQuizzes.V1'

import ObjectUtil from '../../../utils/Object';

function useMaps (space, filters)
{
    const [ fetching, setFetching ] = useState (true)
    const [ sheet, setSheet ] = useState ({})
    const [ items, setItems ] = useState ([])
    
    const [ titles, setTitles ] = useState ([])
    const [ levels, setLevels ] = useState ([])
    const [ types, setTypes ] = useState ([])

    const [ version, setVersion ] = useState (0)
    const [_filters, setFilters] = useState(filters);

    function handleMount ()
    {
        if (!!space)
        {
            setFetching (true)

            const teacher = space
            const sheet = filters.sheet || 'null'

            GetMaps
            .get({ teacher })
            .then (sheets =>
            {
                const filtered = sheets.filter (m => m._docId === sheet)[0]
                const ids = sheets.map(m => m._docId);

                if (filtered)
                {
                    const { _docId, title, id, order } = filtered

                    GetSheets
                    .get ({ _docId, id, order }, true, true)
                    .then (quizzes =>
                    {
                        const titles = []
                        const levels = []
                        const types = []

                        quizzes.forEach (quiz =>
                        {
                            if (titles.indexOf (quiz.title) < 0)
                            {
                                titles.push (quiz.title)
                            }

                            if (levels.indexOf (quiz.level) < 0)
                            {
                                levels.push (quiz.level)
                            }

                            if (types.indexOf (quiz.type) < 0)
                            {
                                types.push (quiz.type)
                            }
                        })

                        setTitles (titles)
                        setLevels (levels)
                        setTypes (types)

                        setSheet ({ _docId, title, id, order })
                        setItems (quizzes)
                        setFetching (false)
                    })
                }
                else
                {
                    GetSheets
                    .all()
                    .then (quizzes =>
                    {
                        const titles = []
                        const levels = []
                        const types = []

                        const qs = quizzes.filter (quiz =>
                            {
                                const mapId = 'M-' + (quiz.map.toString(10).padStart(4, '0'));
                                return ids.indexOf(mapId) >= 0;
                            });

                        qs.forEach (quiz =>
                        {
                            if (titles.indexOf (quiz.title) < 0)
                            {
                                titles.push (quiz.title)
                            }

                            if (levels.indexOf (quiz.level) < 0)
                            {
                                levels.push (quiz.level)
                            }

                            if (types.indexOf (quiz.type) < 0)
                            {
                                types.push (quiz.type)
                            }
                        })

                        setTitles (titles)
                        setLevels (levels)
                        setTypes (types)
                        setItems (qs)
                        setFetching (false)
                    })
                }
                // else
                // {
                //     setTitles ([])
                //     setLevels ([])

                //     setSheet ({})
                //     setItems ([])
                //     setFetching (false)
                // }
            })
        }
    }

    function handleUpdate ()
    {
        if (version > 0)
        {
            const teacher = space
            const sheet = filters.sheet || 'null'

            GetMaps
            .get({ teacher })
            .then (sheets =>
            {
                const filtered = sheets.filter (m => m._docId === sheet)[0]
                const ids = sheets.map(m => m._docId);
                
                if (filtered)
                {
                    const { _docId, title, id, order } = filtered;
                    
                    GetSheets
                    .get ({ _docId, id, order }, true, true)
                    .then (quizzes =>
                    {
                        const titles = []
                        const levels = []
                        const types = []

                        quizzes.forEach (quiz =>
                        {
                            if (titles.indexOf (quiz.title) < 0)
                            {
                                titles.push (quiz.title)
                            }

                            if (levels.indexOf (quiz.level) < 0)
                            {
                                levels.push (quiz.level)
                            }

                            if (types.indexOf (quiz.type) < 0)
                            {
                                types.push (quiz.type)
                            }
                        })
                        
                        setTitles (titles)
                        setLevels (levels)
                        setTypes (types)

                        setSheet ({ _docId, title, id, order })
                        setItems (quizzes)
                    })
                }
                else
                {
                    GetSheets
                    .all()
                    .then (quizzes =>
                    {
                        const titles = []
                        const levels = []
                        const types = []

                        const qs = quizzes.filter (quiz =>
                            {
                                const mapId = 'M-' + (quiz.map.toString(10).padStart(4, '0'));
                                return ids.indexOf(mapId) >= 0;
                            });

                        qs.forEach (quiz =>
                        {
                            if (titles.indexOf (quiz.title) < 0)
                            {
                                titles.push (quiz.title)
                            }

                            if (levels.indexOf (quiz.level) < 0)
                            {
                                levels.push (quiz.level)
                            }

                            if (types.indexOf (quiz.type) < 0)
                            {
                                types.push (quiz.type)
                            }
                        })
                        
                        setTitles (titles)
                        setLevels (levels)
                        setTypes (types)
                        setItems (qs)
                    })
                }
            })
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

    function handleChange ()
    {
        const a = ObjectUtil.changeds(_filters, filters);

        if (a.length > 0)
        {
            setFilters(filters);
        }
    }

    useEffect (handleMount, [ space, _filters ])
    useEffect (handleVersion, [ ])
    useEffect (handleUpdate, [ version, space, _filters ])

    useEffect (handleChange, [ filters ]);

    return { fetching, sheet, items, titles, levels, types }
}

export default useMaps