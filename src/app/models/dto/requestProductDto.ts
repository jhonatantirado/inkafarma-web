export class RequestProductDto {
    id: number;
    name: string;
    price: number;
    currency : string;
    stock : number;
    categoryId : number;
    lotNumber: string;
    sanitaryRegistrationNumber : string;
    registrationDate : string;
    expirationDate : string;
    status : number;
    stockStatus : number;

    constructor() {}

    public setId(value: number): RequestProductDto {
        this.id = value;
        return this;
    }
    public setName(value: string): RequestProductDto {
        this.name = value;
        return this;
    }
    public setPrice(value: number): RequestProductDto {
        this.price = value;
        return this;
    }
    public setCurrency(value: string): RequestProductDto {
        this.currency = value;
        return this;
    }
    public setStock(value: number): RequestProductDto {
        this.stock = value;
        return this;
    }
    public setCategoryId(value: number): RequestProductDto {
        this.categoryId = value;
        return this;
    }
    public setLotNumber(value: string): RequestProductDto {
        this.lotNumber = value;
        return this;
    }
    public setRegistrationDate(value: string): RequestProductDto {
        this.registrationDate = value;
        return this;
    }
    public setExpirationDate(value: string): RequestProductDto {
        this.expirationDate = value;
        return this;
    }
    public setStatus(value: number): RequestProductDto {
        this.status = value;
        return this;
    }
    public setStockStatus(value: number): RequestProductDto {
        this.stockStatus = value;
        return this;
    }
}
