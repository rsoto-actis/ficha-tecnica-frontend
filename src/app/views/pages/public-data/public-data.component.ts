import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { ItemsService } from 'src/app/core/services/items.service';
import { ProyectosService } from 'src/app/core/services/proyectos.service';

@Component({
  selector: 'app-public-data',
  standalone: false,
  templateUrl: './public-data.component.html',
  styleUrl: './public-data.component.scss'
})
export class PublicDataComponent {

  @ViewChildren('checkbox') checkboxes! : QueryList<ElementRef>;
  @ViewChild('initPeriod')  initPeriod! : ElementRef;
  @ViewChild('endPeriod')   endPeriod!  : ElementRef;


  public collapses : any[] = [false, false, false, false];

  // Data principal

  public projects        : any[] = [];
  public selectedProject : any   = {};
  public filteredData    : any[] = [];
  public projectsForm    : FormGroup;


  /* Filtros */

  // Categorias
  public category   : any   = { id : 0, name : ''};
  public categories : any[] = [];

  // Subcategorias
  public subCategories       : any[] = [];
  public selectedSubCategory : any   = {id : 0, name : ''};

  // Comunas
  public townsList    : any[] = [];
  public selectedTown : any   = {id : 0, name : ''};

  // Otros filtros

  public startYear : string = "2016";
  public endYear   : string = "2024";

  public allUrban  : boolean = false;
  public provUrban : boolean = false;
  public townUrban : boolean = false;
  public allRural  : boolean = false;
  public provRural : boolean = false;
  public townRural : boolean = false;
  public piramidal : boolean = false;

  public showMenu    : string = '';
  public showSubMenu : string = '';

  constructor(
    private proyectoService : ProyectosService,
    private itemsService    : ItemsService
  ) { 

    this.proyectoService
      .getProyectsWithFilters('','','','','',0,0)
      .pipe(first())
      .subscribe(
        ( result: any ) => {
          this.projects     = result;
          this.filteredData = result;
        },
        ( error : any) => {
          console.log(error)
        }
      );


    this.projectsForm = new FormGroup({
      name         : new FormControl(''), 
      costo_total  : new FormControl(''),
      created      : new FormControl(''),
      descripcion  : new FormControl(''),
      alcance_code : new FormControl(''),

    });


    // Filtros
    this.changeFilters('None',null);
    this.getAllTowns();
    this.getAllItems();

    
  }

  ngOnInit(): void {

    this.proyectoService.filters.subscribe( ( data : any ) =>{
      this.projects     = data.data;
      this.filteredData = data.data;

      this.filterTable();
    })
  }

  

  public formatearAPesoChileno( numero : number ): string {
    try{
      return numero.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }
    catch(e){
      return "";
    }
  }

  public filterTable() {
    try{
      let data: any = {
        name         : this.projectsForm.get('name')?.value,
        costo_total  : this.projectsForm.get('costo_total')?.value,
        created      : this.projectsForm.get('created')?.value,
        descripcion  : this.projectsForm.get('descripcion')?.value,
        alcance_code : this.projectsForm.get('alcance_code')?.value,
        
      };
      this.filteredData = this.filterData(data);
    }
    catch(e){
      console.log("filter table: " + e)
    }
  }

  private filterData( params : any ) {
    let aux: any[] = [];
    try{ 
      aux = this.projects;   

      if ( (params.name+"") != '') {
        aux = aux.filter((el) => {
          return (el.name+"").toUpperCase().includes( (params.name+"").toUpperCase() );
        });
      }
      if ( (params.costo_total+"") != '') {
        aux = aux.filter((el) => {
          return (el.costo_total+"").includes(params.costo_total);
        });
      }
      if ( params.town != '' ) {
        aux = aux.filter((el) => {
          return (el.town_name+"").toUpperCase().includes(params.town.toUpperCase());
        });
      }

      if ( params.alcance_code != '') {
        aux = aux.filter((el) => {
          return (el.alcance_code+"").toUpperCase().includes(params.alcance_code.toUpperCase());
        });
      }
      
    }
    catch(e){
      //console.log(e)
    }
    return aux;
      
  }
 

  public formatDate( date : string ){
    return date[8] + date[9] + "/" + date[5] + date[6] + "/" + date[0] + date[1] + date[2] + date[3];
  }

  public filterBy( type : string, event : any ){
    let alcance : string = "";
    let name    : string = "";
    let ammount : string = "";
    let town    : string = "";

    if ( type == "alcance" ){
      alcance = event?.target.value || '';
    }
    if ( type == "name" ){
      name = event?.target.value || '';
    }
    if ( type == "ammount" ){
      ammount = event?.target.value || '';
    }
    if ( type == "town" ){
      town = event?.target.value || '';
    }

    let data: any = {
        name         : name,
        costo_total  : ammount,
        town         : town,
        alcance_code : alcance,
        
      };
      this.filteredData = this.filterData(data);


  }

  public sendProyect( event : any ){

    this.proyectoService.proyectToView.emit({
      data : event
    })
  }


  // Filtros

  public allUrbanClick(){
    this.allRural  = false;
    this.provUrban = true;
    this.townUrban = true;
    this.provRural = false;
    this.townRural = false;
  }

  public allRuralClick(){
    this.allUrban  = false;
    this.provUrban = false;
    this.townUrban = false;
    this.provRural = true;
    this.townRural = true;
  }

  public findCategoryByName( name : string ){
    for ( let i = 0 ; i < this.categories.length ; i ++ ){
      if ( this.categories[i].name == name ){
        return this.categories[i];
      }
    }
  }

  public changeFilters( type : string, event : any ){

    if ( type == 'town' ){
      this.selectedTown.id = parseInt(event?.target.value + "");
    }

    if ( type == 'category' ){
      this.category.name = event?.target.value || "";
      this.getSubCategories(this.findCategoryByName(this.category.name).id)
    }

    if ( type == 'subcategory' ){
      this.selectedSubCategory.name = event?.target.value || "";
    }

    if ( type == 'sp' ){
      this.startYear = event?.target.value || "";
    }

    if ( type == 'ep' ){
      this.endYear = event?.target.value || "";
    }

    this.changeCategory();

    let prov  : number = 0;
    let type_ : string = "";

    //** verficamos que sea urbana

    if ( this.allUrban == true || this.provUrban == true || this.townUrban == true ){
      type_ = "Urbana"

      if ( this.provUrban == true ){
        prov = 1;
      } 
      else if ( this.townUrban == true ){
        prov = 0;
      }
    }

    if ( this.allRural == true || this.provRural == true || this.townRural == true ){
      type_ = "Rural"

      if ( this.provRural == true ){
        prov = 1;
      } 
      else if ( this.townUrban == true ){
        prov = 0;
      }
    }

    this.getFilteredProjects(this.category.name, this.selectedSubCategory.name, this.startYear, this.endYear, type_, this.selectedTown.id, prov);
  }

  private getAllProjects(){
    this.proyectoService
      .getAllProyects()
      .pipe(first())
      .subscribe(
        ( result: any ) => {
          
        },
        ( error : any) => {
        }
      );
  }

  private getAllItems(){
    this.itemsService
      .getAllItems()
      .pipe(first())
      .subscribe(
        ( result: any ) => {
          for ( let i = 0 ; i < result.length ; i ++ ){
            this.categories.push({
              id   : result[i].id,
              name : result[i].name.slice(4),
            })
          }

          this.categories.sort((a, b) => {
              if (a.name < b.name) {
                  return -1;
              }
              if (a.name > b.name) {
                  return 1;
              }
              return 0;
          });
        },
        ( error : any) => {
        }
      );
  }

  private getSubCategories( area_id : number ){
    this.subCategories = [];
    this.itemsService
      .getSubCategories( area_id )
      .pipe(first())
      .subscribe(
        ( result: any ) => {
          for ( let i = 0 ; i < result.length ; i ++ ){
            this.subCategories.push({
              id   : result[i].id,
              name : result[i].name.replace(/[0-9.]/g, '').trim(),
            })
          }

          this.subCategories.sort((a, b) => {
              if (a.name < b.name) {
                  return -1;
              }
              if (a.name > b.name) {
                  return 1;
              }
              return 0;
          });
        },
        ( error : any) => {
        }
      );
  }

  private getAllTowns(){
    this.proyectoService
      .getAllTowns()
      .pipe(first())
      .subscribe(
        ( result: any ) => {
          this.townsList = result;
        },
        ( error : any) => {
        }
      );
  }

  public piramidalClick(){}

  public cleanFilters(){

    this.initPeriod.nativeElement.value = '2015';
    this.endPeriod.nativeElement.value  = '2024';

    this.getAllTowns();
    this.getAllItems();

    this.checkboxes.forEach((checkbox: ElementRef) => {
      checkbox.nativeElement.checked = false;
    });

    this.changeFilters('None', null);


  }

  public changeCategory(){
    if ( this.selectedTown == null ){
      this.selectedTown = { id : 0, name : ''};
    }
    if ( this.category == null ){
      this.category = { id : 0, name : 'Seleccione una categoría'};
    }


  }

  private getFilteredProjects( 
    category    : string,
    subcategory : string,
    initDate    : string,
    endDate     : string, 
    type        : string,
    town        : number,
    prov        : number ){

    this.proyectoService
      .getProyectsWithFilters(category, subcategory, initDate, endDate, type, town, prov)
      .pipe(first())
      .subscribe(
        ( result: any ) => {
          this.proyectoService.filters.emit({
            data : result
          })
        },
        ( error : any) => {
        }
      );
  }

  toggleCollapse(id: number): void {
    // @ts-ignore
    this.collapses[id] = !this.collapses[id];
  }

}
