export interface IPromoBody {
    discount_price: string,
    product_id:string,
    promo_name: string,
    promo_description: string, 
    promo_img: string,
}

export interface IDataPromo extends IPromoBody {
    id: string,
}