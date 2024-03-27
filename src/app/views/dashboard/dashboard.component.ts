import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

import { DashboardService } from 'src/app/core/services/dashboard.service';
import { ProyectosService } from 'src/app/core/services/proyectos.service';
import { first } from 'rxjs';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public favProjects     : any[] = [];
  public filteredFavProj : any[] = [];
  public pirProjects     : any[] = [];
  public selectedTown    : any = {
    idComuna     : 0,
    idProvincia  : 0 ,
    idRegion     : 0,
    nomProvincia : ' -- ',
    nomRegion    : ' -- ',
    nomComuna    : 'Todas',
  };

  constructor(
    private chartsData      : DashboardChartsData,
    private dsbService      : DashboardService,
    private proyectoService : ProyectosService, 
  ) {

    this.getFilteredProjects('', '', '', '', '', 0 , 0);
  }

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/img/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/img/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/img/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/img/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/img/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/img/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];
  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  ngOnInit(): void {
    this.initCharts();

    this.dsbService.selectedTown.subscribe( ( data : any )=>{
      this.selectedTown = data.data;
      //this.getFilteredProjects('', '', '', '', '', data.idComuna , 0);

      this.filteredFavProj = this.filterData(data.data);
    })
  }

  private getFilteredProjects( 
    category    : string,
    subcategory : string,
    initDate    : string,
    endDate     : string, 
    type        : string,
    town        : number,
    prov        : number ){
    this.favProjects = [];

    this.proyectoService
      .getProyectsWithFilters(category, subcategory, initDate, endDate, type, town, prov)
      .pipe(first())
      .subscribe(
        ( result: any ) => {
          for ( let i = 0 ; i < result.length ; i ++ ){
            if ( result[i].favoritos != 0 ){
              this.favProjects.push(result[i]);
              this.filteredFavProj.push(result[i]);
            }
          }

          this.dsbService.percents.emit({
            total      : result.length,
            emblematic : this.favProjects.length,
            piramidal  : this.pirProjects.length
          })
        },
        ( error : any) => {
        }
      );
  }

  initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.initCharts();
  }

  public formatDate( date : string ){
    return date[8] + date[9] + "/" + date[5] + date[6] + "/" + date[0] + date[1] + date[2] + date[3];
  }

  private filterData( params : any ) {
    let aux: any[] = [];
    try{ 
      aux = this.favProjects;   

      if ( params.nomComuna != '' && params.nomComuna != 'Todas') {
        aux = aux.filter((el) => {
          return (el.comunas+"").toUpperCase().includes(params.nomComuna.toUpperCase());
        });
      }
      
    }
    catch(e){
      //console.log(e)
    }
    return aux;
      
  }
}
