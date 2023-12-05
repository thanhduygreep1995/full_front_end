import { IProduct } from "./iproduct";

export interface IWish extends IProduct {
    id: number;
    name: string;
    price: number;
    soluong: number;
    hinh: string;
    images: string;

    solanxem: number;
    hot: number;
    mota: string;
    updateDate: string;
    categoryId: number;
}
