import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AddressComponent } from './components/address/address.component';
import { ViewComponent } from './components/view/view.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { OderCompleteComponent } from './components/oder-complete/oder-complete.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HttpClientModule } from '@angular/common/http';
import { NewProductComponent } from './components/new-product/new-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { TypeProductComponent } from './components/type-product/type-product.component';
import { CheckCartComponent } from './components/check-cart/check-cart.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProByTypeComponent } from './components/pro-by-type/pro-by-type.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { UserComponent } from './components/user/user.component';
import { CommonModule } from '@angular/common';
import { AccountSidebarComponent } from './components/account-sidebar/account-sidebar.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { FilterPipe } from './components/pipes/filter.pipe';
import { ProductListComponent } from './components/product-list/product-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
registerLocaleData(localeVi);


@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    HomeComponent,
    AccountComponent,
    LoginComponent,
    RegisterComponent,
    CartComponent,
    WishlistComponent,
    AddressComponent,
    ViewComponent,
    ChangepasswordComponent,
    OderCompleteComponent,
    CheckoutComponent,
    NewProductComponent,
    TypeProductComponent,
    CheckCartComponent,
    HeaderComponent,
    FooterComponent,
    ProByTypeComponent,
    CategoriesComponent,
    AccountSidebarComponent,
    OrderHistoryComponent,
    UserComponent,
    FilterPipe,
    ProductListComponent,
    NavbarComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'vi' },],

  bootstrap:
    [AppComponent]

})


export class AppModule { }
