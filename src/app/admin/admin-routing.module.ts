import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { MainContentComponent } from './main-content/main-content.component';
import { ProductEditionComponent } from './product-edition/product-edition.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { UserTableComponent } from './user-table/user-table.component';
import { CategoryTableComponent } from './category-table/category-table.component';
import { CategoryEditionComponent } from './category-edition/category-edition.component';
import { SpecificationsEditionComponent } from './specifications-edition/specifications-edition.component';
import { SpecificationsTableComponent } from './specifications-table/specifications-table.component';
import { OrderTableComponent } from './order-table/order-table.component';
import { OrderDetailTableComponent } from './order-detail-table/order-detail-table.component';
import { BrandTableComponent } from './brand-table/brand-table.component';
import { BrandEditionComponent } from './brand-edition/brand-edition.component';
import { OriginEditionComponent } from './origin-edition/origin-edition.component';
import { OriginTableComponent } from './origin-table/origin-table.component';
import { IncomeReportComponent } from './income-report/income-report.component';
import { CustomerReportComponent } from './customer-report/customer-report.component';
import { ImageComponent } from './image/image.component';
import { TopSoldReportComponent } from './top-sold-report/top-sold-report.component';
import { CategoryComponent } from './category/category.component';
import { VoucherEditionComponent } from './voucher-edition/voucher-edition.component';
import { VoucherTableComponent } from './voucher-table/voucher-table.component';
import { AuthGuard } from '../components/guards/auth.guard';

const routes: Routes = [
  { path: '', component: AdminComponent,
  children:[
  { path: '', component: OrderTableComponent,canActivate: [AuthGuard]  },
  { path: 'dashboard', component: MainContentComponent,canActivate: [AuthGuard] },
  { path: 'product-edition', component: ProductEditionComponent ,canActivate: [AuthGuard]},
  { path: 'product-table', component: ProductTableComponent ,canActivate: [AuthGuard]},
  { path: 'user-table', component: UserTableComponent ,canActivate: [AuthGuard]},
  { path: 'category-table', component: CategoryTableComponent,canActivate: [AuthGuard] },
  { path: 'category-edition', component: CategoryEditionComponent ,canActivate: [AuthGuard]},
  { path: 'category-edition/:id', component: CategoryEditionComponent ,canActivate: [AuthGuard]},
  { path: 'specifications-edition', component: SpecificationsEditionComponent,canActivate: [AuthGuard] },
  { path: 'specifications-table', component: SpecificationsTableComponent,canActivate: [AuthGuard] },
  { path: 'orders-table', component: OrderTableComponent ,canActivate: [AuthGuard]},
  { path: 'orders-detail-table', component: OrderDetailTableComponent ,canActivate: [AuthGuard]},
  { path: 'product-edition/:id', component: ProductEditionComponent ,canActivate: [AuthGuard]},
  { path: 'specifications-edition/:id', component: SpecificationsEditionComponent,canActivate: [AuthGuard] },
  { path: 'brand-edition/:id', component: BrandEditionComponent,canActivate: [AuthGuard] },
  { path: 'brand-edition', component: BrandEditionComponent ,canActivate: [AuthGuard]},
  { path: 'brand-table', component: BrandTableComponent,canActivate: [AuthGuard] },
  { path: 'origin-edition/:id', component: OriginEditionComponent,canActivate: [AuthGuard] },
  { path: 'origin-edition', component: OriginEditionComponent ,canActivate: [AuthGuard]},
  { path: 'origin-table', component: OriginTableComponent,canActivate: [AuthGuard] },
  { path: 'income-report', component:IncomeReportComponent ,canActivate: [AuthGuard]},
  { path: 'customer-report', component:CustomerReportComponent ,canActivate: [AuthGuard]},
  { path: 'image', component:ImageComponent ,canActivate: [AuthGuard]},
  { path: 'top-sold-report', component:TopSoldReportComponent,canActivate: [AuthGuard] },
  { path: 'category', component:CategoryComponent ,canActivate: [AuthGuard]},
  { path: 'voucher-edition', component:VoucherEditionComponent ,canActivate: [AuthGuard]},
  { path: 'voucher-edition/:id', component:VoucherEditionComponent ,canActivate: [AuthGuard]},
  { path: 'voucher-table', component:VoucherTableComponent ,canActivate: [AuthGuard]},
]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
