import flatten from './flatten';
import changeds from './changeds';

function copy (src)
{
	if (!src)
	{
		return null;
	}

	return JSON.parse(JSON.stringify(src));
}

export default
	{
		flatten,
		changeds,
		copy,
	}