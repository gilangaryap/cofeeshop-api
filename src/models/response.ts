interface IPaginationMeta {
    totalData?: number;
    totalPage?: number;
    page: number;
    prevLink: string | null;
    nextLink: string | null;
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
    }>;
}