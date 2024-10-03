import ApexCharts from "https://cdn.jsdelivr.net/npm/apexcharts@3.54.0/+esm";

function initChart(el, hoods, stations) {
  const includedHoods = hoods
    .filter((hood) => hood.properties.stationCount > 0)
    .sort((a, b) => b.properties.stationDensity - a.properties.stationDensity);

  const hoodNames = includedHoods.map(
    (hood) => hood.properties["LISTNAME"]
  );
  const hoodDensities = includedHoods.map(
    (hood) => hood.properties.stationDensity
  );

  var options = {
    series: [{
      name: 'Density',
      data: hoodDensities,
      color: '#0af'
    }],
    chart: {
      type: 'bar',
      height: hoodNames.length * 25,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)}/sqkm`,
      },
    },
    xaxis: {
      categories: hoodNames,
    }
  };
  const chart = new ApexCharts(el, options);
  chart.render();

  return chart;
}

export { initChart };
