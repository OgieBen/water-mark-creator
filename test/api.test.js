import request from 'supertest';
import chai from 'chai';
import { getWaterMarkImagePath } from '../app/util/imageUtils';
import chaiUrl from 'chai-url';

chai.use(chaiUrl);
const assert = chai.assert;

describe('API', () => {
    describe('GET /api/v1/watermark', function() {
        describe('respond with link', function() {
            it("should return link to water marked file", function(done) {
                // increase test timeout heroku dyno might be asleep
                this.timeout(6000);
                request('http://localhost:3000')
                    .post('/api/v1/watermark')
                    .field('name', 'image')
                    .attach('image', getWaterMarkImagePath())
                    .expect(200)
                    .end(function(err, res) {
                        if (err) return done(err);
                        assert.isString(res.text, 'url');
                        chai.expect(res.text).to.have.protocol('http');
                        done();
                    });
            });
        })
    });
});