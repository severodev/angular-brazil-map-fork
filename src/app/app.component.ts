import { Component } from "@angular/core";
import * as Chart from "chart.js";
import * as ChartGeo from "chartjs-chart-geo";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  ngOnInit(): void {
    this.generateMap();
  }

  generateMap() {
    fetch(
      "https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/bra.topo.json"
    )
      .then(r => r.json())
      .then(br => {
        var geoData = ChartGeo.topojson.feature(br, br.objects.bra).features;

        for (let i in geoData) {
          geoData[i].properties.confirmed = Math.random();
          geoData[i].properties.deaths = Math.random();
        }

        let dts = {
          labels: geoData.map(i => i.properties.name),
          datasets: [
            {
              outline: geoData,
              data: geoData.map(i => ({
                feature: i,
                value: i.properties.confirmed
              }))
            }
          ]
        };

        let configOptions = {
          maintainAspectRatio: true,
          responsive: true,
          showOutline: false,
          showGraticule: false,
          legend: {
            display: false
          },
          scale: {
            projection: "mercator"
          } as any,
          geo: {
            colorScale: {
              display: true,
              interpolate: "reds",
              missing: "white",
              legend: {
                display: "true",
                position: "bottom-right"
              }
            }
          }
        };

        new Chart(
          <HTMLCanvasElement>document.getElementById("confirmedGeoCanvas"),
          {
            type: "choropleth",
            data: dts,
            options: configOptions
          }
        );
      });
  }
}
