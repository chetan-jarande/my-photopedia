import { google } from 'googleapis';
import { MongoClient } from 'mongodb';
import { MONGO_DB_URL, DB_NAME, COLLECTION_NAME } from '@/common/config';
import { updateImagesInMongo } from './updateImagesFromDriveInMongo';
import { fetchDataFromDrive } from './driveUtility';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // MongoDB Atlas connection string
        const mongoUri = MONGO_DB_URL;   // 'your-mongodb-atlas-connection-string';
        const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const db = client.db(DB_NAME);
            const mongoPhotoSectionCollectionObj = db.collection(COLLECTION_NAME.sections);
            const mongoPhotoCollectionObj = db.collection(COLLECTION_NAME.photos);

            // The data you want to insert (replace this with your actual data)
            const folderId = req.query.folderId;

            const response = fetchDataFromDrive(
                {
                    q: `'${folderId}' in parents `, // query to return info about all the objects/items present in drive folder.
                    // this query will return below fields(as applicable to items) for all the items present in given folderId.
                    fields: 'files(id, name, createdTime, thumbnailLink, mimeType)',
                    orderBy: 'createdTime desc', // Sort by upload time in descending order
                },
                folderId
            );


            const DriveFilesData = response.data.files;

            // @TODO: Add mongo DB get call to fetch section data. and to do filtration.
            const mongoData = await mongoPhotoSectionCollectionObj.find({}).toArray();
            const latestData = new Map();

            // group folder and respective image data together.
            await DriveFilesData.forEach((item) => {
                if (item.mimeType === "application/vnd.google-apps.folder") {
                    // This is a folder item.
                    const folderInfo = {
                        _id: item.id,
                        folderId: item.id,
                        folderName: item.name,
                        folderCreatedTime: item.createdTime,
                        folderMimeType: item.mimeType,
                    };

                    // Find the matching image by name.
                    const matchingImage = DriveFilesData.find((img) => (
                        img.mimeType.startsWith('image/')
                        &&
                        img.name.split(".")[0].trim().toLocaleLowerCase() === item.name.trim().toLocaleLowerCase())
                    );

                    if (matchingImage) {
                        folderInfo.imgId = matchingImage.id;
                        folderInfo.imgThumbnailLink = matchingImage.thumbnailLink;
                        folderInfo.imgOriginalLink = `https://drive.google.com/uc?export=view&id=${matchingImage.id}`;
                        folderInfo.imgCreatedTime = matchingImage.createdTime;
                        folderInfo.imgMimeType = matchingImage.mimeType;
                    }

                    latestData.set(item.id, folderInfo);
                }
            });

            if (latestData.size > 0) {
                console.log(`Found folders: ${latestData.size}`);
                let updateFolderData = [];
                let responseMap = {};

                // Insert/Update the data into the MongoDB collection       
                for (const [folderId, folderInfo] of latestData) {
                    // Update the document based on the folder ID
                    await mongoPhotoSectionCollectionObj.updateOne(
                        { folderId: folderId },
                        { $set: folderInfo },
                        { upsert: true } // Insert if the document doesn't exist
                    );
                    updateFolderData.push([folderInfo.folderId, folderInfo.folderName]);
                }
                responseMap["folderCount"] = updateFolderData.length;
                responseMap["sectionsData"] = updateFolderData;
                console.log("updated the section data in DB: ", responseMap);


                // updateFolderData = [[folder_id, folder_name], ...]
                const resUpdateImagesInMongo = await updateImagesInMongo(updateFolderData, drive, mongoPhotoCollectionObj);

                // // // // Call the updateImagesFromDriveInMongo API with a PUT request & url need to be prepended with `${process.env.NEXT_PUBLIC_BASE_URL}/api/updateImagesFromDrive` 
                // // const subFolderResponse = await fetch('/api/updateImagesFromDrive', { 
                // //     method: 'PUT',
                // //     headers: {
                // //         'Content-Type': 'application/json',
                // //     },
                // //     body: JSON.stringify({ folderIds: Array.from(latestData.keys()) }),
                // // });

                responseMap["imagesData"] = resUpdateImagesInMongo;

                console.log("SyncDrive operation completed responseMap: ", responseMap);
                res.status(200).json({ message: 'Data inserted successfully', details: responseMap });
            } else {
                res.status(404).json({ message: 'Data inserted Unsuccessful as no data found in drive' });
            }

        } catch (error) {
            console.log("error: ", error);
            res.status(500).json({ message: 'Error inserting data', error: error.message });
        } finally {
            client.close();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}


