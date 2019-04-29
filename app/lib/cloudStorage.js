import { GOOGLE_CRED_FILE, GOOGLE_PROJECT_ID, BUCKET_NAME, PATH_TO_WATER_MARK_LOGO, APP_ROOT_DIR } from '../util/constant';
import { Storage } from '@google-cloud/storage'
import path from 'path';
import { getWaterMarkImagePath } from '../util/imageUtils';
import sharp from 'sharp';

const cloudStorage = new Storage({
    projectId: GOOGLE_PROJECT_ID,
    keyFilename: GOOGLE_CRED_FILE,
});

console.log("pId: ",GOOGLE_PROJECT_ID);

const bucketName = BUCKET_NAME;
const baseUrl = 'http://localhost:3000'

export function createBucket() {
  return cloudStorage.createBucket(bucketName);
}


export function getPublicUrl(fileName){
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
};

export const getWaterMarkedImageUrl = (fileName) => { return `${baseUrl}/api/v1/get/image/${fileName}`; }


export const handleImageUpload = (req, res, next) => {

  if(!req.file){
    next();
    return;
  }

  const requestFile = req.file;
  console.log("1:", requestFile.originalname);

  const oldFileName = requestFile.originalname;
  const bucket = cloudStorage.bucket(bucketName);
  const newFileName = `${Date.now().toString().substring(5)}-${oldFileName}`; 
  const uploadedFile = bucket.file(newFileName);

  let stream = uploadedFile
        .createWriteStream({
            metadata: {
              contentType: requestFile.mimetype,
            }
          });

    stream.on('error', (err) => {
        requestFile.clouduploaderror = err;
        console.log("2:", requestFile.clouduploaderror);
        next(err);
    });

    stream.on('finish', () => {
        requestFile.cloudfilename = newFileName;

        console.log("3:", requestFile.cloudfilename);

        return uploadedFile
                  .makePublic()
                  .then(() => {
                      requestFile.publicurl = getWaterMarkedImageUrl(requestFile.cloudfilename);
                      next();
                    });
    });
 
    stream.end(requestFile.buffer);

}

