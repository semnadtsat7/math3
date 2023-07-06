
function filter (items, actives, filters)
{
    let _items = items

    if (filters.status === 'active')
    {
        _items = _items.filter (({ id }) => !!actives[id])
    }

    return _items
}

module.exports = filter
