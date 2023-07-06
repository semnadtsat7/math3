
function isValid (form)
{
    if(form.checkValidity())
    {
        const inputs = form.getElementsByTagName('input');

        for(let i = 0; i < inputs.length; i++)
        {
            inputs[i].blur();
        }

        return true;
    }

    form.reportValidity();
    return false;
}

export default {
    isValid,
}