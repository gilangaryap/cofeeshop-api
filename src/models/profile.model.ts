export interface IProfileBody {
    full_name: string;
    phone_number: string;
    address: string;
}

export interface IDataProfile extends IProfileBody {
    error?: string;
}