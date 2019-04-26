import { Repo }  from  '../app/data/repo/Repo';
let assert = require('assert');

describe('Repo', () => {
    describe('#getDocumentName', () => {
        let repo = new Repo();
        it("should return document name", ()=> {
            assert.equal(repo.getDocumentName(), "")
        });
    })
})