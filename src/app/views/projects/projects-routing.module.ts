import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryAssignComponent } from './category-assign/category-assign.component';

const routes: Routes = [
  {
    path: 'category-assign',
    component: CategoryAssignComponent,
    data: {
      title: 'ASignar categoría'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
