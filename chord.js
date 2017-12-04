let margin = {
  top: 50,
  left: 50,
  bottom: 10,
  right: 10
}

let width = 1100 - margin.left - margin.right;
let height = 1100 - margin.top - margin.bottom;
let innerRadius = Math.min(width, height) * .25;
let outerRadius = innerRadius * 1.1;

let svg = d3.select('body').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).attr("transform", "translate(" + margin.left + "," + margin.top + ")").append("g").attr("class", "chordDiagram").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
let button = d3.select('body').append('div').attr('width', 50).attr('height', height + margin.top + margin.bottom).attr("transform", "translate(" + margin.left+width + margin.left + margin.right + "," + margin.top + ")");
//************************************************************
// CHANGE THE CSV FILE AND THE CHART IS COMPUTED AUTOMATICALLY
//************************************************************
d3.csv('./data/adjacency/adj_gname_targtype.csv', createChordDiagram);

function createChordDiagram(data) {

  let firstColumn = 'gname';

  let categories = Object.keys(data[0]);
  categories = categories.slice(1, categories.length); // category names, i.e regions, etc

  let fc = data.map(function(d) {
      return d[firstColumn];
    }),
    gnames = fc.slice(0), // terrorist groups
    matrix_size = (Object.keys(data[0]).length - 1) + fc.length,
    matrix = [];

  //Create an empty square matrix of zero placeholders, the size of the data
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

  let paddingFunction = function(data) {
    if (data.index==categories.length || data.index == 0){
      return 0.1;
    }else {
      return 0.01;
    }
  }

  let chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);

  let chordgroups = chord(matrix).groups.map(function(d) {
    console.log(d)
    d.angle = (d.startAngle + d.endAngle) / 2;
    return d;
  });

  let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  let ribbon = d3.ribbon().radius(innerRadius);

  let fill = d3.schemeCategory20b;

  // if there are more categories than 20, we extend the color scheme by repeating it from the start
  if (categories.length > 20) {
    let diff = categories.length - 20;
    for (let i = 0; i < diff; i++) {
      fill.push(fill[i]);
    }
  }

  let g = svg.append("g").attr('class', 'circle').datum(chord(matrix));
  let gg = button.append('g').attr('class', 'button');

  let group = g.selectAll(".groups").data(function(chords) {
    return chords.groups;
  }).enter().append('g').attr("class", "groups").on('mouseover', fade(0.05)).on('mouseout', fade(1));

  group.append("path").style("fill", function(d, i) {
    return (d.index) >= gnames.length
      ? fill[d.index - gnames.length]
      : "#000";
  }).attr("d", arc);

  g.selectAll('.ribbons').data(function(chords) {
    return chords;
  }).enter().append("path").attr("class", "ribbons").attr("d", ribbon).style("fill", function(d) {
    return fill[d.target.index - gnames.length];
  }).style('opacity', 1);


  svg.selectAll(".text").data(chordgroups).enter().append("text").attr("class", "text").attr("text-anchor", function(d) {
    return d.angle > Math.PI
      ? "end"
      : null;
  }).attr("transform", function(d) {

    //rotate each label around the circle
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (outerRadius + 10) + ")" + (d.angle > Math.PI
      ? "rotate(180)"
      : "");

  }).text(function(d, i) {

    // take parenthesis away that is present for the group names (abbreviations)
    let parenthesis = fc[i].indexOf('(');
    if (parenthesis == -1 || i >= gnames.length) {
      return fc[i];
    } else {
      return fc[i].slice(0, parenthesis);
    }

  }).attr("font-family", "Courier New, bold").attr("font-size", "11px").attr("fill", function(d, i) {
    return (d.index) >= gnames.length
      ? fill[d.index - gnames.length]
      : "#000";
  });

  svg.selectAll('.text').on('mouseover', fade(0.05)).on('mouseout', fade(1));

  function fade(opacity) {
    return function(g, i) {
      svg.selectAll("path.ribbons").filter(function(d) {
        return d.source.index != i && d.target.index != i;
      }).transition().style("opacity", opacity);
    };
  }


}
