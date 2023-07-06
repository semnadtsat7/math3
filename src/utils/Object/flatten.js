
function flatten (src, path)
{
	const result = [];

	if (typeof src === 'undefined')
	{
		return result;
	}

	if (null === src)
	{
		result.push({ path, type: 'null', data: null });
	}
	else if (Array.isArray(src))
	{
		result.push({ path, type: 'array', data: src.length });

		for (const i in src)
		{
			const _path = [path, `${i}`].filter(e => e.length > 0).join('.');
			const _result = flatten(src[i], _path);

			_result.forEach(e => result.push(e));
		}
	}
	else
	{
		const type = typeof src;

		if (['boolean', 'number', 'string'].indexOf(type) >= 0)
		{
			result.push({ path, type, data: src });
		}
		else if (type === 'object')
		{
			if (['image/jpeg', 'image/png', 'image/gif'].indexOf(src.mime) >= 0)
			{
				result.push({ path, type: 'image', data: src });
			}
			else if (['image/svg+xml'].indexOf(src.mime) >= 0)
			{
				result.push({ path, type: 'icon', data: src });
			}
			else if (['video/mp4'].indexOf(src.mime) >= 0)
			{
				result.push({ path, type: 'video', data: src });
			}
			else if (typeof src.getTime === 'function')
			{
				result.push({ path, type: 'datetime', data: src.getTime() });
			}
			else if (typeof src.toDate === 'function')
			{
				result.push({ path, type: 'datetime', data: src.toDate().getTime() });
			}
			else if (typeof src.toMillis === 'function')
			{
				result.push({ path, type: 'datetime', data: src.toMillis() });
			}
			else
			{
				const keys = Object.keys(src).sort();

				for (const i in keys)
				{
					const _key = keys[i];
					const _path = [path, _key].filter(e => e.length > 0).join('.');
					const _result = flatten(src[_key], _path);

					_result.forEach(e => result.push(e));
				}
			}
		}
	}

	return result;
}

export default function (src)
{
	return flatten(src, '');
}