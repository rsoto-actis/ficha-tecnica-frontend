import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule, CardModule, CollapseModule, DropdownComponent, DropdownModule, FormModule, GridModule, ModalModule, TableModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { 
  FormsModule, 
  ReactiveFormsModule 
} from '@angular/forms';
import { CategoryAssignComponent } from './category-assign/category-assign.component';
import { ProjectsRoutingModule } from './projects-routing.module';


@NgModule({
  declarations: [
    CategoryAssignComponent
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
    ModalModule
  ]
})
export class ProjectsModule {
}
