import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  CanActivateFn,
} from '@angular/router';
import { TokenService } from '../services/token.service'; // Thay thế bằng tên service thực tế
import { Observable } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { customerResponse } from '../response/customer.response';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  customerResponse?: customerResponse | null;
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private customerService: CustomerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isCustomerId = this.tokenService.getCustomerId() > 0;
    this.customerResponse =
      this.customerService.getCustomerResponseFromLocalStorage();
    const isAdmin = this.customerResponse?.role_id.name == 'ADMIN';
    if (!isTokenExpired && isCustomerId && isAdmin) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}

export const AuthGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(AuthGuard).canActivate(next, state);
};
