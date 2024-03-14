import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryAssignComponent } from './category-assign/category-assign.component';
import { FavouritesComponent } from './favourites/favourites.component';

const routes: Routes = [
  {
    path: 'category-assign',
    component: CategoryAssignComponent,
    data: {
      title: 'Asignar categoría'
    }
  },
  {
    path: 'favourites',
    component: FavouritesComponent,
    data: {
      title: 'Proyectos favoritos'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
