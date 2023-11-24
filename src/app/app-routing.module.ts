import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AddressComponent } from './components/address/address.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OderCompleteComponent } from './components/oder-complete/oder-complete.component';
import { ViewComponent } from './components/view/view.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { TypeProductComponent } from './components/type-product/type-product.component';
import { CheckCartComponent } from './components/check-cart/check-cart.component';
import { ProByTypeComponent } from './components/pro-by-type/pro-by-type.component';
import { AccountSidebarComponent } from './components/account-sidebar/account-sidebar.component';
import { UserComponent } from './components/user/user.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';



import { MyReviewComponent } from './components/my-review/my-review.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PersonalProfileComponent } from './components/personal-profile/personal-profile.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { OderFailureComponent } from './components/oder-failure/oder-failure.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'view/:id', component: ViewComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'shop/category/:id', component: ShopComponent },
      { path: 'account', component: AccountComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'cart', component: CartComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'address', component: AddressComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'oder-complete', component: OderCompleteComponent },
      { path: 'newproduct', component: NewProductComponent },
      { path: 'typeproduct', component: TypeProductComponent },
      { path: 'checkcart', component: CheckCartComponent },
      { path: 'account/order-history', component: OrderHistoryComponent },
      { path: 'listproduct', component: ProductListComponent },
      { path: 'account/personal-profile', component: PersonalProfileComponent },
      { path: 'account/change-password', component: ChangePasswordComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'account/vouchers', component: VoucherComponent },
      { path: 'account/myreview', component: MyReviewComponent },
      { path: 'oder-failure', component: OderFailureComponent },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
