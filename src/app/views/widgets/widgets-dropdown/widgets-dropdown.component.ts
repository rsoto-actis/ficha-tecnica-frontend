import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { first } from 'rxjs';
import { ProyectosService } from 'src/app/core/services/proyectos.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
})

export class WidgetsDropdownComponent implements OnInit, AfterContentInit {

  public townsList  : any[] = [];
  public projects   : any[] = [];
  public embPercent : any   = "";
  public pirPercent : any   = "";

  public embChartData : any = {};


  constructor(
    private changeDetectorRef : ChangeDetectorRef,
    private proyectoService   : ProyectosService,
    private dsbService        : DashboardService
  ) {

    this.getAllTowns();
  }

  public changeFilters( event : any ){
    for ( let i = 0 ; i < this.townsList.length ; i ++ ){
      if ( this.townsList[i].idComuna == parseInt(event?.target.value + "") ){
        this.dsbService.selectedTown.emit( {
          data : this.townsList[i]
        })
        break;
      }
    }
  }

  public cleanFilters(){
    this.dsbService.selectedTown.emit( {
      data : {
        idComuna     : 0,
        idProvincia  : 0 ,
        idRegion     : 0,
        nomProvincia : ' -- ',
        nomRegion    : ' -- ',
        nomComuna    : 'Todas',
      }
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
    this.projects = [];

    this.proyectoService
      .getProyectsWithFilters(category, subcategory, initDate, endDate, type, town, prov)
      .pipe(first())
      .subscribe(
        ( result: any ) => {
          this.projects = result;
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

  data    : any[] = [];
  options : any[] = [];
  labels = [
    'Total',
    'Emblemático',
  ];
  
  datasets = [
    {
      label: 'Total',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-primary'),
      pointHoverBorderColor: getStyle('--cui-primary'),
      data: [100],
      fill: true
    },
    {
      label: 'Emblemáticos',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-warning'),
      pointHoverBorderColor: getStyle('--cui-warning'),
      data: [100],
      fill: true
    },
    {
      label: 'Piramidales',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-warning'),
      pointHoverBorderColor: getStyle('--cui-warning'),
      data: [100],
      fill: true
    }
  ];
  optionsDefault = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 0,
        max: 100,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: true
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };

  ngOnInit(): void {
    
  }

  ngAfterContentInit(): void {

    this.dsbService.percents.subscribe( ( data : any ) => {
      let emb = parseInt( ((data.emblematic * 100)/data.total)  + "");
      let pir = parseInt( ((data.piramidal  * 100)/data.total ) + "");
      
      this.embPercent = emb.toFixed(2) + "%";
      this.pirPercent = pir.toFixed(2) + "%";

      this.setData();
      
      this.datasets[0].data = [data.total];
      this.datasets[1].data = [data.emblematic];
      this.datasets[2].data = [data.piramidal];
      console.log(this.datasets)
      this.changeDetectorRef.detectChanges();
    })

    this.changeDetectorRef.detectChanges();

  }

  setData() {

    this.data[0] = {
      labels : ['Total', 'Emblemáticos'],
      datasets: [this.datasets[0],this.datasets[1]]
    }
    this.data[1] = {
      labels : ['Total', 'Piramidales'],
      datasets: [this.datasets[0], this.datasets[2]]
    }
    this.setOptions();
  }

  setOptions() {
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false };
          options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }
}

@Component({
  selector: 'app-chart-sample',
  template: '<c-chart type="line" [data]="data" [options]="options" width="300" #chart></c-chart>'
})
export class ChartSample implements AfterViewInit {

  constructor() {}

  @ViewChild('chart') chartComponent!: ChartjsComponent;

  colors = {
    label: 'My dataset',
    backgroundColor: 'rgba(77,189,116,.2)',
    borderColor: '#4dbd74',
    pointHoverBackgroundColor: '#fff'
  };

  labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  data = {
    labels: this.labels,
    datasets: [{
      data: [65, 59, 84, 84, 51, 55, 40],
      ...this.colors,
      fill: { value: 65 }
    }]
  };

  options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      const data = () => {
        return {
          ...this.data,
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            ...this.data.datasets[0],
            data: [42, 88, 42, 66, 77],
            fill: { value: 55 }
          }, { ...this.data.datasets[0], borderColor: '#ffbd47', data: [88, 42, 66, 77, 42] }]
        };
      };
      const newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const newData = [42, 88, 42, 66, 77];
      let { datasets, labels } = { ...this.data };
      // @ts-ignore
      const before = this.chartComponent?.chart?.data.datasets.length;
      console.log('before', before);
      // console.log('datasets, labels', datasets, labels)
      // @ts-ignore
      // this.data = data()
      this.data = {
        ...this.data,
        datasets: [{ ...this.data.datasets[0], data: newData }, {
          ...this.data.datasets[0],
          borderColor: '#ffbd47',
          data: [88, 42, 66, 77, 42]
        }],
        labels: newLabels
      };
      // console.log('datasets, labels', { datasets, labels } = {...this.data})
      // @ts-ignore
      setTimeout(() => {
        const after = this.chartComponent?.chart?.data.datasets.length;
        console.log('after', after);
      });
    }, 5000);
  }
}
