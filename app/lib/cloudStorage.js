import { GOOGLE_CRED_FILE, GOOGLE_PROJECT_ID, BUCKET_NAME, PATH_TO_WATER_MARK_LOGO, APP_ROOT_DIR } from '../util/constant';
import { Storage } from '@google-cloud/storage'
import path from 'path';

const cloudStorage = new Storage({
    projectId: GOOGLE_PROJECT_ID,
    keyFilename: GOOGLE_CRED_FILE,
});

const bucketName = BUCKET_NAME;

export async function createBucket() {
  await cloudStorage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
}


export function getPublicUrl(fileName){
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
};

export const handleImageUpload = (req, res, next) => {

  if(!req.file){
    next();
  }


  const requestFile = req.file;
  const oldFileName = requestFile.originalname;
  const bucket = cloudStorage.bucket(bucketName);
  const newFileName = `${oldFileName}-${new Date().now().trim().substring(4)}` 
  const uploadedFile = bucket.file(newFileName);

  uploadedFile
    .createFileStream({
        metadata: {
          contentType: requestFile.mimetype,
        }
      })
      .on('error', () => {
          requestFile.clouduploaderror = err;
          next(err);
      })
      .on('finish', () => {
          requestFile.cloudfilename = newFileName;

          return uploadedFile
                    .makePublic()
                    .then(() => {
                        requestFile.publicurl = getPublicUrl();
                        next();
                      });
      }).end(createOverlay(requestFile.buffer));

}



function createOverlay(readStream) {
  return gm(readStream)
    .autoOrient()
    .resize(200, 200)
    .gravity('SouthEast')
    .draw('image Over 10,10 0,0 ' + path.resolve(APP_ROOT_DIR, PATH_TO_WATER_MARK_LOGO))
    .stream('PNG')
    // .pipe(writeStream);
}