export interface IStatusTransactionBody {
    status: string
}

export interface IDataStatusTransaction extends IStatusTransactionBody {
    id: number
}