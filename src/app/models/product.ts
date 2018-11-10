export class Product {
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

    public setId(value: number): Product {
        this.id = value;
        return this;
    }
    public setName(value: string): Product {
        this.name = value;
        return this;
    }
    public setPrice(value: number): Product {
        this.price = value;
        return this;
    }
    public setCurrency(value: string): Product {
        this.currency = value;
        return this;
    }
    public setStock(value: number): Product {
        this.stock = value;
        return this;
    }
    public setCategoryId(value: number): Product {
        this.categoryId = value;
        return this;
    }
    public setLotNumber(value: string): Product {
        this.lotNumber = value;
        return this;
    }
    public setRegistrationDate(value: string): Product {
        this.registrationDate = value;
        return this;
    }
    public setExpirationDate(value: string): Product {
        this.expirationDate = value;
        return this;
    }
    public setStatus(value: number): Product {
        this.status = value;
        return this;
    }
    public setStockStatus(value: number): Product {
        this.stockStatus = value;
        return this;
    }
}
