interface IPaginationMeta {
    totalData?: number;
    totalPage?: number;
    page: number;
    prevLink: string | null;
    nextLink: string | null;
}

interface IErrorResponse {
    code: number; 
    message: string; 
    details?: string; 
}

export interface IBasicResponse1 {
    status:string;
    msg: string; 
    data?: any[];
    error?: IErrorResponse;
    meta?: IPaginationMeta;
}

export interface IBasicResponse {
    msg: string; 
    data?: any[];
    err?: string;
    meta?: IPaginationMeta;
}


export interface IAuthResponse extends IBasicResponse {
    data?: Array<{
        token: string;
        uuid: string;
        id: string;
        role:string;
    }>;
}