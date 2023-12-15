import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader,TranslateModule} from '@ngx-translate/core' ;
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { OderCompleteComponent } from './components/oder-complete/oder-complete.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NewProductComponent } from './components/new-product/new-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
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
import { NavbarComponent } from './components/navbar-bo/navbar.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MyReviewComponent } from './components/my-review/my-review.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PersonalProfileComponent } from './components/personal-profile/personal-profile.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { OderFailureComponent } from './components/oder-failure/oder-failure.component';
import { TokenInterceptor } from './components/interceptors/token.interceptor';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TopProductComponent } from './components/top-product/top-product.component';
import { ContactComponent } from './components/contact/contact.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AboutComponent } from './components/about/about.component';


registerLocaleData(localeVi);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
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
    NavbarComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VoucherComponent,
    MyReviewComponent,
    ChangePasswordComponent,
    PersonalProfileComponent,
    OderFailureComponent,
    TopProductComponent,
    ContactComponent,
    TermsOfUseComponent,
    NotFoundComponent,
    AboutComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ClipboardModule,
    CarouselModule,
    TagModule,
    ButtonModule,
    ScrollTopModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'vi' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    DatePipe,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
