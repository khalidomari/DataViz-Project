let margin = {
  top: 30,
  left: 30,
  bottom: 10,
  right: 10
}

let width = 1100 - margin.left - margin.right;
let height = 1100 - margin.top - margin.bottom;
let innerRadius = Math.min(width, height) * .25;
let outerRadius = innerRadius * 1.1;

let svg = d3.select('body #chartContainer').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .append("g")
            .attr("id", "chordDiagram")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


//************************************************************
// CHANGE THE CSV FILE AND THE CHART IS COMPUTED AUTOMATICALLY
//************************************************************
d3.csv('./data/adjacency/adj_gname_targtype.csv', createChordDiagram);

function createChordDiagram(data) {
  console.log(data)

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

  let newfill=[];
  console.log(categories.length)
  if (categories.length ==2) {
    newfill.push(fill[12]);
    newfill.push(fill[4]);
    fill = newfill
  }else if (categories.length <=10) {
    newfill.push(fill[1]);
    newfill.push(fill[5]);
    newfill.push(fill[8]);
    newfill.push(fill[11]);
    newfill.push(fill[12]);
    newfill.push(fill[13]);
    newfill.push(fill[14]);
    newfill.push(fill[16]);
    newfill.push(fill[17]);
    newfill.push(fill[18]);
    fill = newfill;
  }else if (categories.length <=12) {
    newfill.push(fill[1]);
    newfill.push(fill[2]);
    newfill.push(fill[3]);
    newfill.push(fill[4]);
    newfill.push(fill[5]);
    newfill.push(fill[8]);
    newfill.push(fill[9]);
    newfill.push(fill[11]);
    newfill.push(fill[12]);
    newfill.push(fill[13]);
    newfill.push(fill[16]);
    newfill.push(fill[18]);

    fill = newfill;

  }

  let g = svg.append("g").attr('class', 'circle').datum(chord(matrix));

  let group = g.selectAll(".groups").data(function(chords) {
    return chords.groups;
  }).enter().append('g').attr("class", "groups").on('mouseover', fade(0.1)).on('mouseout', fade(0.9));

  group.append("path").style("fill", function(d, i) {
    return (d.index) >= gnames.length
      ? fill[d.index - gnames.length]
      : "#ccc";
  }).attr("d", arc)
  .style("opacity", 0.9);

  g.selectAll('.ribbons').data(function(chords) {
    return chords;
  }).enter().append("path").attr("class", "ribbons").attr("d", ribbon)
  .style("fill", function(d) {
    return fill[d.target.index - gnames.length];
  })
  .style("opacity", 0.9);


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
    if (fc[i].slice(0,7) == 'Vehicle') {
      return fc[i].slice(0,7);
    }
    if (fc[i] == '0') {
      return 'No';
    }else if (fc[i] == '1'){
      return 'Yes';
    }
    // take parenthesis away that is present for the group names (abbreviations)
    let parenthesis = fc[i].indexOf('(');
    if (parenthesis == -1 || i >= gnames.length) {
      return fc[i];
    } else {
      return fc[i].slice(0, parenthesis);
    }


  }).attr("font-family", "Arial Black").attr("font-size", "11px").attr("fill", function(d, i) {
    return (d.index) >= gnames.length
      ? fill[d.index - gnames.length]
      : "#ccc";
  });

  svg.selectAll('.text').on('mouseover', fade(0.1)).on('mouseout', fade(0.9));

  function fade(opacity) {
    return function(g, i) {
      svg.selectAll("path.ribbons").filter(function(d) {
        return d.source.index != i && d.target.index != i;
      }).transition().style("opacity", opacity);
    };
  }


}


function dropdown_callback() {
  let skillsSelect = document.getElementById("drop");
  let selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
  console.log(selectedText)

  let diagram = document.getElementById('chordDiagram');
  diagram.innerHTML = '';
  if (selectedText== 'Weapon type') {
    d3.csv('./data/adjacency/adj_gname_weapon.csv', createChordDiagram);
  } else if (selectedText== 'Attack type') {
    d3.csv('./data/adjacency/adj_gname_attacktype.csv', createChordDiagram);
  } else if (selectedText== 'Target type') {
    d3.csv('./data/adjacency/adj_gname_targtype.csv', createChordDiagram);
  } else if (selectedText== 'Attack region') {
    d3.csv('./data/adjacency/adj_gname_region.csv', createChordDiagram);
  } else if (selectedText== 'Suicide attacks') {
    d3.csv('./data/adjacency/adj_gname_suicide.csv', createChordDiagram);
  } else if (selectedText== 'Successfull attacks') {
    d3.csv('./data/adjacency/adj_gname_success.csv', createChordDiagram);
  }


}
