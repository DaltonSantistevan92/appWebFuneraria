import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';
import { DashService } from './services/dash.service';

import Chart from 'chart.js/auto';
import * as JSC from 'jscharting';
import { AfiliadosInactivosAndActivos, CompraVentaTotales } from './interfaces/dashboard.interface';


export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit {
  listaUrl: IntUrlActivate[] = [];

  afiliadosActivosInactivos! : AfiliadosInactivosAndActivos;
  dataTotalCV! : CompraVentaTotales;

  @ViewChild('myChartAfiliadoEstados', { static: true }) myChartAfiliadoEstados! : ElementRef;
  @ViewChild('myChartPedidos', { static: true }) chartPedidos? : ElementRef;

  constructor(
    private activedRoute: ActivatedRoute,
    private _ds: DashService

  ) { }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;
    this.cantidadAfiliados();
    this.totalesGenerales();
    this.chartBarCompraVenta();
    this.chartBarPagos();
    
  }

  ngAfterContentInit(): void {
    if (!this.chartPedidos) return;
    this.kpiEstadoPedido();
    this.kpiAfiliadosEstados();
    
  }



  cantidadAfiliados(){
    this._ds.getCantidadAfiliados().subscribe({
      next: (resp) => {
        this.afiliadosActivosInactivos = resp.data;
      },
      error: (err) => {}
    });
  }

  totalesGenerales(){
    this._ds.getTotalCompraAndVenta().subscribe({
      next: (resp) => {
        //console.log(resp);
        this.dataTotalCV = resp.data;
      },
      error: (err) => {}
    });
  }

  chartBarCompraVenta() {
    this._ds.getDashCompra().subscribe({
      next: (resp) => {
        if (resp) {
          const ctx = document.getElementById('myChartCompraVenta') as HTMLCanvasElement;

          if (ctx !== null) {
            //grafico de compra y venta
            const labels = resp.compra.labels;

            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: `Compra - ${resp.compra.anio}`,
                    data: resp.compra.data,
                    backgroundColor: CHART_COLORS.red,
                    stack: 'Stack 0',
                  },
                  {
                    label: `Venta - ${resp.venta.anio}`,
                    data: resp.venta.data,
                    backgroundColor: CHART_COLORS.blue,
                    stack: 'Stack 0',
                  }
                ]
              },
              options: {
                plugins: {
                  title: {
                    display: true,
                    text: 'Totales de Compra & Venta '
                  },
                  legend: {
                    position: 'top',
                  },
                },
                responsive: true,
                interaction: {
                  intersect: false,
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    ticks: {
                      callback: function (value) {
                        return '$' + (value);
                      }
                    }
                  }
                }
              }
            });
          }

        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  chartBarPagos(){
    this._ds.getDashPagos().subscribe({
      next: (resp) => {
        console.log('dash pagos',resp);

        if (resp.pagos.data.length > 0) {
          const ctx = document.getElementById('myChartPagos') as HTMLCanvasElement;

          if (ctx !== null) {
            //grafico de pagos totales
            const labels = resp.pagos.labels;

            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: `Pagos - ${resp.pagos.anio}`,
                    data: resp.pagos.data,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 205, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(201, 203, 207, 0.2)',
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 205, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                      'rgb(255, 99, 132)',
                      'rgb(255, 159, 64)',
                      'rgb(255, 205, 86)',
                      'rgb(75, 192, 192)',
                      'rgb(54, 162, 235)',
                      'rgb(153, 102, 255)',
                      'rgb(201, 203, 207)',
                      'rgb(255, 99, 132)',
                      'rgb(255, 159, 64)',
                      'rgb(255, 205, 86)',
                      'rgb(75, 192, 192)',
                      'rgb(54, 162, 235)',
                    ],
                    borderWidth: 1,
                    stack: 'Stack 0',
                  },
                ]
              },options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              },
            })
          }
        }
      }
    })
  }

  kpiEstadoPedido() {
    this._ds.getkpiTotalesPedidosEstados().subscribe({
      next: (resp) => {
        if (resp.status) {
          const chart = new JSC.Chart(this.chartPedidos?.nativeElement, {
            debug: false,
            legend: {
              position: 'inside left bottom',
              template: '%value {%percentOfTotal:n1}% %icon %name'
            },
            title_position: 'center',
            defaultSeries_type: 'pieDonut',
            defaultPoint_label_text: '<b>%name</b>',
            title_label_text: 'Totales De Pedidos Por Estados',
            yAxis: { label_text: 'Total', formatString: 'n' },
            series: resp.series
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  kpiAfiliadosEstados(){
    this._ds.getkpiAfilicionesEstados().subscribe({
      next : (resp) => {
        if(resp.status){
          let series = this.armarSeries(resp.serie);
          this.graficarSeries(series);
        } 
      },
      error : (err) => {
        console.log(err);
      }
    });
  }

  graficarSeries(seriesData:any) {
    const chart = new JSC.Chart(this.myChartAfiliadoEstados.nativeElement, {
      debug: true,
      legend_visible: false,
      yAxis: {
        line_visible: false,
        defaultTick_enabled: false,
        scale: { range: [0, 100] }
      },
      defaultSeries_angle: {
        orientation: 90,
        sweep: 360,
        end: 360
      },
      defaultSeries: {
        type: 'gauge column roundcaps',
        /* angle: { sweep: 360, start: -90, end: 360 }, */
        defaultPoint_tooltip: '<b>%seriesName</b> %yValue% del total',
        shape: {
          innerSize: '70%',
          label: {
            text: '<b>%per %</b>',
            align: 'center',
            verticalAlign: 'middle'
          }
        }
      },
      title_position: 'center',
      title_label_text: 'Afiliciones por Estados',
      series: seriesData
    });
  }


  armarSeries(data :any) {
    let labels = data.labels;
    let porcentaje = data.porcentaje;
    let colors = data.colors;
    let midata = [];
    let p = 0;
    for (let i = 0; i < labels.length; i++) {
      p = porcentaje[i];
      midata.push(
        {
          color: colors[i],
          name: labels[i],
          attributes: {
            per: p
          },
          points: [['val', p]]
        },
      );
    }
    return midata;
  }
  
}
