import flatten from './flatten';

function indexOf (arr, field, value)
{
	for (let i = 0; i < arr.length; i++)
	{
		if (arr[i][field] === value)
		{
			return i;
		}
	}

	return -1;
}

export default function (prev, curr)
{
	const befores = flatten(prev);
	const afters = flatten(curr);

	const changeds = [];

	for (const i in befores) 
	{
		const { path, type, data } = befores[i];
		const j = indexOf(afters, 'path', path);

		if (j < 0)
		{
			changeds.push({ path, status: 'delete', before: data, after: null });
		}
		else if (type !== afters[j].type)
		{
			changeds.push({ path, status: 'update', before: data, after: afters[j].data });
		}
		else if (type === 'image' || type === 'icon' || type === 'video')
		{
			if (data.name !== afters[j].data.name)
			{
				changeds.push({ path, status: 'update', before: data, after: afters[j].data });
			}
		}
		else if (data !== afters[j].data)
		{
			changeds.push({ path, status: 'update', before: data, after: afters[j].data });
		}
	}

	for (const i in afters) 
	{
		const { path, data } = afters[i];
		const j = indexOf(befores, 'path', path);

		if (j < 0)
		{
			changeds.push({ path, status: 'create', before: null, after: data });
		}
	}

	return changeds;
}