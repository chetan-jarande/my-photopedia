import { google } from 'googleapis';
import { MongoClient } from 'mongodb';
import { MONGO_DB_URL, DB_NAME, COLLECTION_NAME } from '@/common/config';
import { getDriveClient } from './driveUtility';
// Load your service account credentials from the JSON key file
// const serviceAccount = require('../../../google-drive-credentials.json');
// const serviceAccount = require('../../../Gdrive_service_account_key.json');



export const updateImagesInMongo = async (folderIdsInfo, driveAuthObj, mongoCollectionObj) => {
  // folderIdsInfo = [[folder_id, folder_name], ...]

  const updateStatusData = {}
  let totalInsertions = 0;
  let totalUpdates = 0;

  for (const [folderId, folderName] of folderIdsInfo) {
    // fetch data from drive (driveAuthObj)
    const response = await driveAuthObj.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      // and mimeType contains 'image/'  // fetch images only from this folder
      // and mimeType='application/vnd.google-apps.folder'`,  // only folder from given folder
      fields: 'files(id, name, createdTime, thumbnailLink, mimeType)',
      orderBy: 'createdTime desc', // Sort by upload time in descending order
      // pageSize: count,   // count of image that you want to fetch
    });
    const DriveImagesData = response.data.files;
    const dataLength = DriveImagesData.length;
    try {
      if (dataLength > 0) {
        // update/insert data into mongoDB
        const bulkWriteOps = DriveImagesData.map((item) => {
          return {
            updateOne: {
              filter: { _id: item.id }, // The filter condition for updating
              update: {
                $set: {
                  _id: item.id,
                  originalLink: `https://drive.google.com/uc?export=view&id=${item.id}`,
                  folderId: folderId,
                  folderName: folderName,
                  // ...item,
                  name: item.name,
                  createdTime: item.createdTime,
                  thumbnailLink: item.thumbnailLink,
                  mimeType: item.mimeType,
                }
              }, // The update operation
              upsert: true // Insert if the document doesn't exist
            }
          };
        });
        const result = await mongoCollectionObj.bulkWrite(bulkWriteOps);
        updateStatusData[`${folderName}_${folderId}`] = {
          status: 200,
          totalDocuments: dataLength,
          updated: result.modifiedCount,
          inserted: result.upsertedCount,
        }
        totalInsertions = totalInsertions + result.upsertedCount;
        totalUpdates = totalUpdates + result.modifiedCount;
        console.log(`For ${folderName}_${folderId} -> Updated ${result.modifiedCount} documents, inserted ${result.upsertedCount} new documents`);
      } else {
        updateStatusData[`${folderName}_${folderId}`] = { status: 404 }
        console.log(`For ${folderName}_${folderId} -> no documents found.`);
      }
    } catch (error) {
      console.log(`For ${folderName}_${folderId} -> Error occurred.`);
      updateStatusData[`${folderName}_${folderId}`] = { status: 500, error: error.message }
    }

  }

  return { "totalInsertions": totalInsertions, "totalUpdates": totalUpdates, ...updateStatusData };
}



const updateImagesFromDriveInMongo = async (req, res) => {
  if (req.method === 'PUT') {
    const mongoUri = MONGO_DB_URL;   // 'your-mongodb-atlas-connection-string';
    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();
      const db = client.db(DB_NAME);
      const mongoPhotoCollectionObj = db.collection(COLLECTION_NAME.photos);

      const drive = getDriveClient();

      // one/multiple folder id's and its info [ [folder_id, folder_name], ... ] 
      const { folderIdsInfo } = req.body;

      const resUpdateImagesInMongo = await updateImagesInMongo(folderIdsInfo, drive, mongoPhotoCollectionObj);

      res.status(200).json(resUpdateImagesInMongo);

    } catch (error) {
      // console.error("error", error);
      res.status(500).json({ message: 'Error inserting data', error: error.message });
    } finally {
      client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }

};

export default  updateImagesFromDriveInMongo