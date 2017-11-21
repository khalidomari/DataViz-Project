const chartDiv = document.getElementById("chart-container");

const margin = {
    top: 10,
    right: 40,
    bottom: 150,
    left: 60
  },
  width = chartDiv.clientWidth * 0.95,
  height = chartDiv.clientHeight * 0.5,
  contextHeight = 50;
  contextWidth = width;

const svg = d3.select("#chart-container").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", (height + margin.top + margin.bottom));


d3.csv('./data/filtered_gtd.csv', createTimeSeries);

function createTimeSeries(data) {

    let numel = data.length;
    let minDate = new Date(data[0].iyear,11,28);
    let maxDate = new Date(data[numel-1].iyear, 11, 31);

    console.log(data)
    let timeScale = d3.scaleTime()
      .range([margin.left, width+margin.left])
      .domain([minDate, maxDate]);

    let yScale = d3.scaleLinear()
      .range([100, margin.top])
      .domain([d3.min(data, (d)=> d.nkill), d3.max(data, (d)=> d.nkill)]);


    let timeAxis = d3.axisBottom(timeScale);

    let yAxis = d3.axisLeft(yScale);

    let chartContainer = svg.append("g")
      .attr('class', 'timeseries')
      .attr("transform", "translate(" + 0 + "," + 0 + ")");

    // let rects = chartContainer.append('g')
    //   .attr('id', 'rects')
    //   .selectAll("rect")
    //   .data(data).enter()
    //   .append("rect");
    //
    // rects
    // .attr('x', (d) => timeScale(get_date(d)))
    // .attr('y', (d) => 100-yScale(d.latitude))
    // .attr('width', width/numel)
    // .attr('height', (d)=> yScale(d.latitude))
    // .attr('fill', 'red');

    // 'curveBasis', 'curveCardinal', 'curveStepBefore'
  let area = d3.area().x((d) => timeScale(get_date(d)))
                        .y0(100)
                        .y1((d) => yScale(d.nkill))
                        .curve(d3.curveStepBefore)

  chartContainer.append("path")
        .data([data])
        .attr("class", "chart")
        .attr("clip-path", "url(#clip-timeseries)")
        .attr("d", area);

    chartContainer.append('g')
    .attr('class', 'timeseries timeAxis')
    .attr('transform', 'translate('+ 0 + ','+ 100 +')')
    .call(timeAxis)

    chartContainer.append('g')
    .attr('class', 'timeseries yAxis')
    .attr('transform', 'translate('+ margin.left + ','+ 0 +')')
    .call(yAxis)
}


function get_date(drow) {
  let y=drow.iyear;
  let m=drow.imonth-1;
  let d=drow.iday;

  let dt= new Date(y,m,d);

  if(m==-1 && d==0) {
    dt= new Date(y);
  } else if (m > -1 && d==0) {
    dt= new Date(y,m);
  }
  else {
    dt= new Date(y,m,d)
  }
  return dt;
}
