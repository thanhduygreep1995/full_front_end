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

const routes: Routes = [
  { path: '', component: AdminComponent,
  children:[
  { path: '', component: OrderTableComponent },
  { path: 'dashboard', component: MainContentComponent },
  { path: 'product-edition', component: ProductEditionComponent },
  { path: 'product-table', component: ProductTableComponent },
  { path: 'user-table', component: UserTableComponent },
  { path: 'category-table', component: CategoryTableComponent },
  { path: 'category-edition', component: CategoryEditionComponent },
  { path: 'category-edition/:id', component: CategoryEditionComponent },
  { path: 'specifications-edition', component: SpecificationsEditionComponent },
  { path: 'specifications-table', component: SpecificationsTableComponent },
  { path: 'orders-table', component: OrderTableComponent },
  { path: 'orders-detail-table', component: OrderDetailTableComponent },
  { path: 'product-edition/:id', component: ProductEditionComponent },
  { path: 'specifications-edition/:id', component: SpecificationsEditionComponent },
  { path: 'brand-edition/:id', component: BrandEditionComponent },
  { path: 'brand-edition', component: BrandEditionComponent },
  { path: 'brand-table', component: BrandTableComponent },
  { path: 'origin-edition/:id', component: OriginEditionComponent },
  { path: 'origin-edition', component: OriginEditionComponent },
  { path: 'origin-table', component: OriginTableComponent },
  { path: 'income-report', component:IncomeReportComponent },
  { path: 'customer-report', component:CustomerReportComponent },
  { path: 'image', component:ImageComponent },
]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
