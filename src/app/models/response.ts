import { User } from "./user";

export class Response {
    httpStatus: string;
    message: string;
    content: User;
    errors: Error[];
}

export class Error {
    message : string;
    cause : string;
}
