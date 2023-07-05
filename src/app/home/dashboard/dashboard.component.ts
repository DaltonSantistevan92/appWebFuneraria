import { Component, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];

  afiliadosActivosInactivos! : AfiliadosInactivosAndActivos;
  dataTotalCV! : CompraVentaTotales;

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
    this.chartBarCompra();
    this.kpiEstadoPedido();
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

  chartBarCompra() {
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

  kpiEstadoPedido() {
    this._ds.getkpiTotalesPedidosEstados().subscribe({
      next: (resp) => {
        if (resp.status) {
          const chart = new JSC.Chart('myChartPedidos', {
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
  
}
