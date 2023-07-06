import { useState, useEffect } from 'react'

function Component(
    {
        delay = 500,
        value,

        onChange,
        onFocus,
        onBlur,

        onTypingStart,
        onTypingEnd,

        children,
    }
)
{
    const [ temp, setTemp ] = useState('')
    const [ focus, setFocus ] = useState(false)
    const [ typing, setTyping ] = useState(false)
    const [ timeoutId, setTimeoutId ] = useState(undefined)

    function handleInit ()
    {
        if (!!focus)
        {
            if (value !== temp)
            {
                onChange (temp, false)
            }
        }
        else
        {
            setTemp (value)
        }

        return function ()
        {
            if (!!timeoutId)
            {
                clearTimeout (timeoutId)
            }
        }
    }

    function handleChange (changedValue)
    {
        setTemp (changedValue)
        
        if (!!timeoutId)
        {
            clearTimeout (timeoutId)
        }

        if (!typing)
        {
            setTyping (true)
            
            if (typeof onTypingStart === 'function')
            {
                onTypingStart ()
            }
        }

        const t = setTimeout(() =>
        {
            onChange (changedValue, true)    
            setTyping (false)

            if (typeof onTypingEnd === 'function')
            {
                onTypingEnd ()
            }
        }, delay)

        setTimeoutId (t)
    }

    function handleFocus ()
    {
        setFocus (true)
        
        if (typeof onFocus === 'function')
        {
            onFocus ()
        }
    }

    function handleBlur ()
    {
        setFocus (false)
        
        if (typeof onBlur === 'function')
        {
            onBlur ()
        }
    }

    useEffect (handleInit, [ value ])

    return children(
        {  
            value: temp,

            onChange: handleChange,
            onFocus: handleFocus,
            onBlur: handleBlur,
        }
    )
}

export default Component