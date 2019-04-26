import express from 'express';
import validUrl from 'valid-url';
import sharp from 'sharp';
import request from 'request';
import { handleImageUpload } from '../lib/cloudStorage';
import Multer from 'multer';
import _gm from 'gm';
import { getWaterMarkImagePath } from '../util/imageUtils';
import fs from 'fs';

const gm = _gm.subClass({ imageMagick: true });
const router = express.Router();
const multer = Multer({ storage: Multer.MemoryStorage });





/**
 * This route return a 50X50 sized image from 
 * url passed to route
 * 
 * @method {GET}
 * 
 * @returns Image
*/
router.get('/resize', (req, res) => {

    const imageUrl = req.query.imageUrl;


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
     

    //  request
    //     .get(imageUrl)
    //     .pipe(sharp().resize(200, 200, {'fit': 'fill'})
    //     .png().overlayWith())
    //     .pipe(res);

    gm(request(imageUrl))
        .autoOrient()
        .resize(200, 200)
        .gravity('SouthEast')
        .draw('image Over 10,10 0,0 ' + 'snowball_logo.png')
        .stream('PNG', (err, stdout) => {

            if(err){
                next(err);
                return;
            }
            res.setHeader('Content-Type', 'image/png');
            stdout.pipe(res);
        });
        // .pipe(res);
});


router.post('/watermark', multer.single('image'), handleImageUpload, (req, res, next) => {
    if(req.file && req.file.publicurl){
        res.json({
            imageUrl: req.file.publicurl,
        });
    }

    res.sendStatus(500);
});




export default router;