import express from 'express';
import validUrl from 'valid-url';
import sharp from 'sharp';
import request from 'request';
import {
    handleImageUpload
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
 * This route return a 50X50 sized image from 
 * url passed to route
 * 
 * @method {GET}
 * 
 * @returns Image
 */
router.get('/resize', (req, res, next) => {

    // const imageUrl = req.query.imageurl;
    const imageUrl = 'http://www.google.com/images/srpr/logo11w.png';


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
            .resize(400, 400)
            .png()
            .composite([{
                input: getWaterMarkImagePath(),
                gravity: 'southeast'
            }])
    )
    .pipe(res);    
});

//  input:  path.normalize(__dirname + "/public/asset/images/snowball-logo.png".toString()),


router.post('/watermark', multer.single('image'), handleImageUpload, (req, res, next) => {
    if (req.file && 
        req.file.publicurl) {

        res.json({
            imageUrl: req.file.publicurl,
        });
        return;
    }

    res.sendStatus(500);
});

router.get('/test', (req, res, next) => {
    
});




export default router;