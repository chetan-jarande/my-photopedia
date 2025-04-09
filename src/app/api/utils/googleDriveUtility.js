// googleDriveUtility.js


const { google } = require('googleapis');

const credentials = require('../../google-drive-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const auth = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);

async function getLatestImagesFromFolder(folderId, count = 12) {
  try {
    const drive = google.drive({ version: 'v3', auth });

    const filesResponse = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      orderBy: 'createdTime desc',
      fields: 'files(id, name, createdTime, mimeType, thumbnailLink)',
      pageSize: count,
    });

    const images = filesResponse.data.files;
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

module.exports = {
  getLatestImagesFromFolder,
};
