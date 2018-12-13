export class SaleSearch {
    documentoNumberSearch : string;
    productNameSearch : string;
    
    constructor() {}

    public setDocumentoNumberSearch(value: string): SaleSearch {
        this.documentoNumberSearch = value;
        return this;
    }
    public setProductNameSearch(value: string): SaleSearch {
        this.productNameSearch = value;
        return this;
    }

}
