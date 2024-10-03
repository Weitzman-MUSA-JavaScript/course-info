import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
window.d3 = d3;

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

  // Set the dimensions and margins of the graph
  const margin = {top: 30, right: 30, bottom: 10, left: 150},
      width = el.clientWidth - margin.left - margin.right,
      height = hoods.length * 10 - margin.top - margin.bottom;

  // The actual chart will be drawn inside an SVG element.
  // Append the svg object to the chart element
  const svg = d3.select(el)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(hoodDensities)])
    .range([ 2, width]);
  svg.append("g")
    .call(d3.axisTop(x));

  // Y axis
  const y = d3.scaleBand()
    .domain(hoodNames)
    .range([ 0, height ])
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(d3.zip(hoodNames, hoodDensities))
    .join("rect")
    .attr("x", x(0) )
    .attr("y", ([name, density]) => y(name))
    .attr("width", ([name, density]) => x(density))
    .attr("height", y.bandwidth())
    .attr("fill", "#0af")
    .attr("fill-opacity", 0.4)
    .attr("stroke", "#0af")
    .attr("stroke-width", 1);

  return svg;
}

export { initChart };
