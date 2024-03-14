import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule, CardModule, CollapseModule, DropdownComponent, DropdownModule, FormModule, GridModule, ModalModule, SpinnerModule, TableModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { 
  FormsModule, 
  ReactiveFormsModule 
} from '@angular/forms';
import { CategoryAssignComponent } from './category-assign/category-assign.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { FavouritesComponent } from './favourites/favourites.component';


@NgModule({
  declarations: [
    CategoryAssignComponent,
    FavouritesComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CollapseModule,
    ModalModule,
    ProjectsRoutingModule,
    DropdownModule,
    ModalModule,
    SpinnerModule
  ]
})
export class ProjectsModule {
}
