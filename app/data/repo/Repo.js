export class Repo {
    constructor() {

    }

    /**
     * Return table name (for sql) or document name (for nosql)
     */
    getDocumentName() {
        return '';
    }

    /**
     * Handles type resolution on ObjectInterface 
     * @param {Object} source 
     */
    handleTypeResolver(source) {
        
    }
}