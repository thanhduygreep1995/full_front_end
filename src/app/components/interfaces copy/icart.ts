import { IProduct } from "./iproduct";

export interface Icart extends IProduct {
    id: number;
    name: string;
    price: number;
    soluong: number;
    hinh: string;
    images: string;
    tongTien: number;
    solanxem: number;
    hot: number;
    mota: string;
    updateDate: string;
    categoryId: number;

}
