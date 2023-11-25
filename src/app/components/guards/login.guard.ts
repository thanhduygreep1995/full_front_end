import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service'; // Thay thế bằng tên service thực tế
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoginGuard {
    constructor(private router: Router, private tokenService: TokenService) { }

    canActivate(
        route: ActivatedRouteSnapshot, state: RouterStateSnapshot
    ): boolean {
        const isTokenExpired = this.tokenService.isTokenExpired();
        const isCustomerId = this.tokenService.getCustomerId() > 0;
        if (!isTokenExpired && isCustomerId) {
            this.router.navigate(['/login']);
            return true;
        } 
        return false;
    }
}

export const LoginGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  => {
    return inject(LoginGuard).canActivate(next, state);
}
