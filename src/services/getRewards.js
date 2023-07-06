import Firestore from '../utils/Firestore'

async function get ()
{
    const path = `production/school`
    const structuredQuery = 
    {
        from: 
        [
            {
                collectionId: "reward-templates"
            }
        ],
        orderBy:
        [
            {
                field: 
                {
                    fieldPath: 'index',
                },
                direction: 'ascending',
            }
        ]
    }

    const docs = await Firestore.query (path, { structuredQuery })
    return docs.map (({ id, data }) =>
    {
        const { bucket, path } = data.image

        const item = 
        {
            id,
            name: data.title,
            image: `https://res.cloudinary.com/${bucket}/image/upload/w_200,h_200,c_fit,q_auto:good,f_auto/${path}.png`,

            description: `${!!data.price ? data.price : ''}`,
            price: !!data.price ? parseInt (data.price, 10) : 0,

            autoApprove: !!data.autoApprove,
        }

        return item
    })
}

export default
{
    get,
}