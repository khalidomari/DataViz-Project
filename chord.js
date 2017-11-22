let margin = {
  top: 50,
  left: 50,
  bottom: 10,
  right: 10
}

let width = 1200 - margin.left - margin.right;
let height = 900 - margin.top - margin.bottom;
let innerRadius = Math.min(width, height) * .25;
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

  let chordgroups = chord(matrix).groups.map(function(d) {
    d.angle = (d.startAngle + d.endAngle) / 2;
    return d;
  });

  let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  let ribbon = d3.ribbon().radius(innerRadius);

  //let fill = d3.schemeCategory20b;
  //let fill = d3.scaleLinear().domain([30, 38]).range(['#FFC300', '#581845']);

  let fill = d3.schemeCategory10


  let g = svg.append("g").attr('id', 'circle').datum(chord(matrix));

  let group = g.append("g").attr("class", "groups").selectAll("g").data(function(chords) {
    return chords.groups;
  }).enter().append("g");

  group.append("path").style("fill", function(d, i) {
    return (d.index) >= fo.length
      ? fill[d.index-fo.length]
      : "#ccc";
  }).attr("d", arc);

  g.append("g").attr("class", "ribbons").selectAll("path").data(function(chords) {
    return chords;
  }).enter().append("path").attr("d", ribbon).style("fill", function(d) {
    return fill[d.target.index-fo.length];
  });


  svg.selectAll(".text")
            .data(chordgroups)
            .enter()
            .append("text")
            .attr("class", "text")
            .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .attr("transform", function(d){

                //rotate each label around the circle
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                       "translate(" + (outerRadius + 10) + ")" +
                       (d.angle > Math.PI ? "rotate(180)" : "");

            })
            .text(function(d,i){
                //set the text content
                if (fc[i] == 'Vehicle (not to include vehicle-borne explosives, i.e., car or truck bombs)') {
                  return 'Vehicle';
                }else {
                return fc[i];
              }
            })
            .style({
                "font-family":"sans-serif",
                "font-size"  :"12px"
            })

}
