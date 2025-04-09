import { MongoClient } from 'mongodb';
import { MONGO_DB_URL, DB_NAME } from '@/common/config';


export const fetchDataFromMongo = async (collectionName, query) => {
    // const { DB_NAME } = DB_NAME; // process.env;
    const client = new MongoClient(MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const result = {};
    try {

        await client.connect()

        const db = client.db(DB_NAME);
        const collection = db.collection(collectionName);

        const data = await collection.find(query || {}).toArray();
        result['data'] = data;
    } catch (error) {
        console.error('Error fetching data:', error);
        result['error'] = error;
    } finally {
        client.close();
        return result;
    }

}

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    const { collectionName, query } = req.body;
    const result = await fetchDataFromMongo(collectionName, query);
    if (result.data) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json({ message: 'Internal Server Error', error: result.error.message });
    }


}

