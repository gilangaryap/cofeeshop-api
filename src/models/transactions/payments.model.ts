export interface IPaymentMethodBody {
    payment_method: string;
}

export interface IDataPaymentMethod extends IPaymentMethodBody {
    id: number;
}