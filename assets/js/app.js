// Name: Karl Ramsay
// Date: May 23, 2020
// Description: Scatter Plot diagram Solution

// set page width and height to be used in svg chart dimensions
var svgWidth = 700;
var svgHeight = 500;

// set margins to be used in the chart area calculation
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 140,
};

// Calculate chart width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Define the SVG container
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// Append SVG group
var chartGroup = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// set values for the X and Y axis
var chosenXaxis = 'poverty';
var chosenYaxis = 'healthcare';

// for setting x-axis scale
function xScale(srcData, axis) {
  // create scales
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(srcData, (d) => d[axis] * 0.8),
      d3.max(srcData, (d) => d[axis] * 1.2),
    ])
    .range([0, width]);
  return xLinearScale;
}
//for setting y-axis scale
function yScale(srcData, axis) {
  // create scales
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(srcData, (d) => d[axis]) * 0.8,
      d3.max(srcData, (d) => d[axis]) * 1.2,
    ])
    .range([height, 0]);
  return yLinearScale;
}

// Retrieve data from the CSV file and execute everything below

(async function () {
  var srcData = await d3.csv('assets/data/data.csv');

  // parse data to interger from string
  srcData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function after csv import
  var xLinearScale = xScale(srcData, chosenXaxis);

  // yLinearScale function after csv import
  var yLinearScale = yScale(srcData, chosenYaxis);

  // Create initial axis functions
  var horizontalAxis = d3.axisBottom(xLinearScale);
  var verticalAxis = d3.axisLeft(yLinearScale);

  // append X-axis
  var xAxis = chartGroup
    .append('g')
    .classed('x-axis', true)
    .attr('transform', `translate(0, ${height})`)
    .call(horizontalAxis);

  var yAxis = chartGroup.append('g').classed('y-axis', true).call(verticalAxis);

  var crlTxtGroup = chartGroup
    .selectAll('bubble')
    .data(srcData)
    .enter()
    .append('g');

  var circlesGroup = crlTxtGroup
    .append('circle')
    .attr('cx', (d) => xLinearScale(d[chosenXaxis]))
    .attr('cy', (d) => yLinearScale(d[chosenYaxis]))
    .classed('bubble', true)
    .attr('r', 8)
    .attr('opacity', '1');

  var txtGroup = crlTxtGroup
    .append('text')
    .text((d) => d.abbr)
    .attr('x', (d) => xLinearScale(d[chosenXaxis]))
    .attr('y', (d) => yLinearScale(d[chosenYaxis]) + 3)
    .classed('stateText', true)
    .style('font-size', '7px')
    .style('font-weight', '800');

  // Create group for  3 x- axis labels
  var xlabelsGroup = chartGroup
    .append('g')
    .classed('adj-loction', true)
    .attr('transform', `translate(${width / 2}, ${height + 20 + margin.top})`);

  // Create group for  3 y- axis labels
  var ylabelsGroup = chartGroup
    .append('g')
    .attr('transform', `translate(${0 - margin.left / 4}, ${height / 2})`);

  var povertyLabel = xlabelsGroup
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('value', 'poverty') // value to grab for event listener
    .classed('active', true)
    .classed('aText', true)
    .text('In Poverty (%)');

  var healthcareLabel = ylabelsGroup
    .append('text')
    .attr('y', 0 - 20)
    .attr('x', 0)
    .attr('transform', 'rotate(-90)')
    .attr('dy', '1em')
    .attr('value', 'healthcare')
    .classed('active', true)
    .classed('aText', true)
    .text('Lacks Healthcare (%)');
})();
