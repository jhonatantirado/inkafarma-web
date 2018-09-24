export class RequestCustomerDto {
    firstName: string;
    lastName: string;
    birthDate : string;
    documentNumber : string;
    isActive : string;
    cellphone: string;
    email : string;

    constructor() {}

    public setFirstName(value: string): RequestCustomerDto {
        this.firstName = value;
        return this;
    }
    public setLastName(value: string): RequestCustomerDto {
        this.lastName = value;
        return this;
    }
    public setBirthDate(value: string): RequestCustomerDto {
        this.birthDate = value;
        return this;
    }
    public setDocumentNumber(value: string): RequestCustomerDto {
        this.documentNumber = value;
        return this;
    }
    public setIsActive(value: string): RequestCustomerDto {
        this.isActive = value;
        return this;
    }
    public setCellphone(value: string): RequestCustomerDto {
        this.cellphone = value;
        return this;
    }
    public setEmail(value: string): RequestCustomerDto {
        this.email = value;
        return this;
    }
}
