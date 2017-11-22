let margin = {
  top: 50,
  left: 50,
  bottom: 10,
  right: 10
}

let width = 960 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;
let innerRadius = Math.min(width, height) * .35;
let outerRadius = innerRadius * 1.1;

let svg = d3.select('body').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).attr("transform", "translate(" + margin.left + "," + margin.top + ")").append("g").attr("class", "chordDiagram").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv('./data/adj_gname_weapon.csv', createChordDiagram);

function createChordDiagram(data) {

  let firstColumn = 'gname';

  let fc = data.map(function(d) {
      return d[firstColumn];
    }),
    fo = fc.slice(0),
    matrix_size = (Object.keys(data[0]).length - 1) + fc.length,
    matrix = [];

  //Create an empty square matrix of zero placeholders, the size of the ata
  for (let i = 0; i < matrix_size; i++) {
    matrix.push(new Array(matrix_size + 1).join('0').split('').map(parseFloat));
  }

  //go through the data and convert all to numbers except "first_column"
  for (let i = 0; i < data.length; i++) {

    let j = data.length; //counter

    for (let prop in data[i]) {
      if (prop != firstColumn) {
        fc.push(prop);
        matrix[i][j] = +data[i][prop];
        matrix[j][i] = +data[i][prop];
        j++;
      }
    }
  }

  let chord = d3.chord().padAngle(0.1).sortSubgroups(d3.descending);

  console.log(chord)

  let chordgroups = chord(matrix).groups.map(function(d) {
    d.angle = (d.startAngle + d.endAngle) / 2;
    return d;
  });

  let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  let ribbon = d3.ribbon()
    .radius(innerRadius);

  let fill = d3.schemeCategory10;

  svg.selectAll("path").data(chord(matrix).groups).enter().append("path").style("fill", function(d, i) {
    return (d.index + 1) > fo.length
      ? fill[d.index]
      : "#ccc";
  }).style("stroke", function(d, i) {
    return "#000";
  }).style("cursor", "pointer").attr("d", arc);
  //.on("mouseover", function(d, i){
  //    chords.classed("fade", function(d){
  //        return d.source.index != i && d.target.index != i;
  //      })
  //  });

  let g = svg.append("g")
    .datum(chord(matrix));

let group = g.append("g")
    .attr("class", "groups")
  .selectAll("g")
  .data(function(chords) { return chords.groups; })
  .enter().append("g");

group.append("path")
    .style("fill", function(d) { return fill[d.index]; })
    .style("stroke", function(d) { return d3.rgb(fill[d.index]).darker(); })
    .attr("d", arc);

    g.append("g")
        .attr("class", "ribbons")
      .selectAll("path")
      .data(function(chords) { return chords; })
      .enter().append("path")
        .attr("d", ribbon)
        .style("fill", function(d) { return fill[d.target.index]; })
        .style("stroke", function(d) { return d3.rgb(fill[d.target.index]).darker(); });


}
