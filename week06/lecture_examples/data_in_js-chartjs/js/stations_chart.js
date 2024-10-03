import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/auto/+esm";

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

  const data = {
    labels: hoodNames,
    datasets: [
      {
        label: "Stations per square mile",
        data: hoodDensities,
        borderWidth: 1,
      },
    ],
  };
  const options = {
    indexAxis: "y",
    aspectRatio: 0.5,
    scales: {
      y: { beginAtZero: true, },
    },
  };
  const chart = new Chart(el, { type: "bar", data, options });

  return chart;
}

export { initChart };
