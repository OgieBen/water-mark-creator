import express from 'express';
import validUrl from 'valid-url';
import sharp from 'sharp';
import request from 'request';
import {
    handleImageUpload, createBucket, getPublicUrl
} from '../lib/cloudStorage';
import Multer from 'multer';
import {
    getWaterMarkImagePath
} from '../util/imageUtils';
import fs from 'fs';
import path from 'path';


const router = express.Router();
const multer = Multer({
    storage: Multer.MemoryStorage
});





/**
 * This route return a 400 X 400 sized image from 
 * url passed to route
 * 
 * @method {GET}
 * 
 * @returns Image
 */
router.get('/resize', (req, res, next) => {

    const imageUrl = req.query.imageurl;
    // const imageUrl = 'http://www.google.com/images/srpr/logo11w.png';


    if (imageUrl.match(/\.(jpeg|jpg|gif|png)$/) === null) {
        res.sendStatus(400);
        return;
    }

    if (imageUrl === 'undefined' || 
        imageUrl === '' ||
        !validUrl.isWebUri(imageUrl)){

        res.sendStatus(400);
        return;
    }   

    res
        .type('image/png');

    request({ url: imageUrl, encoding: null })
    .pipe(
            sharp()
            .resize(400, 400, {'fit': 'fill'})
            .png()
            .composite([{
                input: getWaterMarkImagePath(),
                gravity: 'southeast',
                background: '#01ff6600', 
                
            }])
    )
    .pipe(res);    
});



/**
 * Accepts an image as input  then returns url 
 * to retrieve uploaded image
 * @method {POST}
 * 
 * @returns Url 
 */
router.post('/watermark', multer.single('image'), handleImageUpload, (req, res, next) => {
    if (req.file && 
        req.file.publicurl) {

        res.send(req.file.publicurl)
        return;
    }
    res.status(500);
});



/**
 * Allows users to test upload route
 * 
 * @method {GET}
 * 
 * @returns html
 */
router.get('/test', (req, res, next) => {
    res.sendFile(getTestPage());
});


/**
 * Fetches uploaded image file using 'imagename' parameter
 * 
 * @method {GET}
 * 
 * @returns Image
 */
router.get('/get/image/:imagename', (req, res, next) => {
    const imageUrl = getPublicUrl(req.params.imagename);

    request({ url: imageUrl, encoding: null })
    .pipe(
            sharp()
            .resize(400, 400, {'fit': 'fill'})
            .png()
            .composite([{
                input: getWaterMarkImagePath(),
                gravity: 'southeast'
            }])
    )
    .pipe(res); 
});

/**
 * Helper route used to create bucket
 * 
 * @method {GET}
 * 
 */
router.get('/create', (req, res, next) => {
    createBucket().then(_res=> {
        console.log(`Bucket was created.`);
        res.send("Bucket Created !!");
    }).catch(err => {
        console.log(`Bucket was not created.`, err);
        res.send("Bucket could not Created !!");
    })
});

function getTestPage(){
    return path.normalize(__dirname + "/../public/index.html");
}



export default router;