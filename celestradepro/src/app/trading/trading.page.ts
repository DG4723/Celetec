import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StockService } from '../services/stock.service';
import * as Plotly from 'plotly.js/dist/plotly.js';
import moment from 'moment';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.page.html',
  styleUrls: ['./trading.page.scss'],
})
export class TradingPage implements OnInit  {
  @ViewChild('chart') chartElement: ElementRef;
  chart: any;

  constructor(private stockService: StockService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.stockService.getAllStocks().subscribe((response: any) => {
      const fxname = 'AMZN';
      const forex = response.find(entry => entry.symbol === fxname);
      if (forex) {
        const ohlcData = forex.stock;
        console.log(ohlcData);
        this.createCandlestickChart(ohlcData, fxname);
      }
    });
  }

  createCandlestickChart(ohlcData: any[], fxname: string) {
    // Process OHLC data for candlestick chart
    const dates = [];
    const opens = [];
    const highs = [];
    const lows = [];
    const closes = [];
    const volumes = [];

    ohlcData.forEach((doc) => {
      dates.push(moment(doc.Date).format('YYYY-MM-DD'));
      opens.push(doc.Open);
      highs.push(doc.High);
      lows.push(doc.Low);
      closes.push(doc.Close);
      volumes.push(doc.Volume);
    });

    // Create candlestick chart
    const data = [{
      type: 'candlestick',
      x: dates,
      open: opens,
      high: highs,
      low: lows,
      close: closes,
      yaxis: 'y2',
      name: fxname,
      increasing: { line: { color: '#00C805' } },
      decreasing: { line: { color: '#FF3319' } },
    }, {
      type: 'bar',
      x: dates,
      y: volumes,
      yaxis: 'y',
      name: 'Volume',
      marker: { color: '#F97B22' }
    }];

    const layout = {
      dragmode: 'zoom',
      xaxis: {
        rangeslider: {
          visible: false
        }
      },
      yaxis: { domain: [0, 0.2], title: 'Volume' },
      yaxis2: { domain: [0.2, 1], title: fxname }
    };

    const config = {
      responsive: true
    };

    // Remove existing chart (if any)
    if (this.chart) {
      Plotly.purge(this.chartElement.nativeElement);
    }

    // Create new chart
    this.chart = Plotly.newPlot(this.chartElement.nativeElement, data, layout, config);
  }
}
