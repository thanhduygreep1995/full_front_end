import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpUtilService } from "./http.util.service";
import { Observable } from "rxjs";
import { LoginDTO } from "../dtos/login.dto";
import { customerResponse } from "../response/customer.response";

@Injectable({
    providedIn: 'root'
})
export class CustomerService{
    private apiUrl = 'http://localhost:8080/api/v0/customers'; 
    
    private apiConfig = {  
        headers: this.httpUtilService.createHeaders(),  
    }
    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService) {}

    // createCustomer(customer: any) {
    //     return this.http.post(`${this.apiUrl}/customers/list`, customer);
    // }

    // getCustomers() {
    //     return this.http.get(`${this.apiUrl}/customers/list`);
    // }
    login(loginDTO: LoginDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`,loginDTO, this.apiConfig);
    } 

    getCustomerDetail(token: string){
        return this.http.post(`${this.apiUrl}/details`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            })
        })   
    }
    saveCustomerResponseToLocalStorage( customerResponse?: customerResponse){
        try {
            const customerResponseJSON = JSON.stringify(customerResponse);
            localStorage.setItem('customer', customerResponseJSON);
            console.log('saved customerResponse to localStorage');
        } catch (error) {
            console.log('error saving customerResponse to localStorage', error);
        }
    }
    getCustomerResponseFromLocalStorage(): customerResponse | null {
        try {
            const customerResponseJSON = localStorage.getItem('customer');
            if(customerResponseJSON == null || customerResponseJSON == undefined){
                return null;
            }
            console. log('got customerResponse from localStorage');
            const customerResponse = JSON.parse(customerResponseJSON!);
            return customerResponse;
           
        } catch (error) {
            console.log('error getting customerResponse from localStorage', error);
            return null;
        }
    }
    removeCustomerResponseFromLocalStorage(): void{
        try {
            localStorage.removeItem('customer');
            console.log('removed customerResponse from localStorage');
        } catch (error) {
            console.log('error removing customerResponse from localStorage', error);
        }
    }
}