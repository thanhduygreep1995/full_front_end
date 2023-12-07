import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    private jwtHelperService = new JwtHelperService();
    constructor(){}

    getToken():string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }
    getCustomerId(): number {

        // let customerObject = this.jwtHelperService.decodeToken(this.getToken() ?? '');
        // return 'id' in customerObject ? parseInt(customerObject['id']) : 0;
        const token = this.getToken() ?? '';
        const customerObject = this.jwtHelperService.decodeToken(token);
      
        if (customerObject && 'id' in customerObject) {
            const customerId = parseInt(customerObject['id']);
            return isNaN(customerId) ? 0 : customerId;
        }
      
        return 0;

    }
    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }
    isTokenExpired(): boolean {
        if(this.getToken() == null){
            return false;
        }
        return this.jwtHelperService.isTokenExpired(this.getToken()!);
    }
}
