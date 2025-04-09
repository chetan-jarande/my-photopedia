import { G_DRIVE_CLIENT_EMAIL, G_DRIVE_PRIVATE_KEY } from '@/common/config';
import { drivePhotographyFolderId } from '@/data/data';
import { google } from 'googleapis';


// const serviceAccount = require('../../../google-drive-credentials.json');
// const serviceAccount = require('../../../Gdrive_service_account_key.json');

const serviceAccount = {
    clientEmail: G_DRIVE_CLIENT_EMAIL,
    privateKey: G_DRIVE_PRIVATE_KEY,
 }; 

export const getDriveClient = async () => {
    const driveClient = await google.drive({
        version: 'v3',
        auth: new google.auth.JWT({
            email: serviceAccount.clientEmail,
            key: serviceAccount.privateKey,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        }),
    });
    return driveClient
}


export const fetchDataFromDrive = async (driveParams, customFolderId = null, customDriveClient = null) => {
    const folderId = customFolderId || drivePhotographyFolderId;
    const driveClient = customDriveClient ? customDriveClient : getDriveClient();
    const response = await driveClient.files.list(driveParams);
    return response;
};