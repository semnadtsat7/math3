import Axios from 'axios';

const URL = 'https://clevermath.imgix.net';

// async function all ()
// {
//     const result = await Axios.get (`${URL}/quizzes.json`);
//     return result.data;
// }

async function get (target)
{
    if (!target)
    {
        return [];
    }

    const { id } = target;
    const map = parseInt (id);
    const mapId = map.toString (10).padStart(4, '0');

    const result = await Axios.get (`${URL}/quizzes/M-${mapId}.json`);
    return result.data;
}

export default
{
    // all,
    get,
}