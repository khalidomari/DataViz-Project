let margin = {
  top: 30,
  left: 100,
  bottom: 10,
  right: 10
}

let width = 1000 - margin.left - margin.right;
let height = 1000 - margin.top - margin.bottom;
let innerRadius = Math.min(width, height) * .23;
let outerRadius = innerRadius * 1.1;

let svg = d3.select('body #chartContainer').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).attr("transform", "translate(" + margin.left + "," + margin.top + ")").append("g").attr("id", "chordDiagram").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//************************************************************
// CHANGE THE CSV FILE AND THE CHART IS COMPUTED AUTOMATICALLY
//************************************************************
d3.csv('./data/adjacency/adj_gname_targtype.csv', createChordDiagram);

function createChordDiagram(data) {

  let firstColumn = 'gname';

  // category names of the selected parameter, i.e regions, etc
  let categories = Object.keys(data[0]);
  categories = categories.slice(1, categories.length);

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

  // create chord diagram
  let chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);

  let chordgroups = chord(matrix).groups.map(function(d) {
    d.angle = (d.startAngle + d.endAngle) / 2;
    return d;
  });

  // arcs and ribbons
  let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  let ribbon = d3.ribbon().radius(innerRadius);

  // define the colormap for the categories
  let fill = d3.schemeCategory20b;
  // if there are more categories than 20, we extend the color scheme by repeating it from the start
  if (categories.length > 20) {
    let diff = categories.length - 20;
    for (let i = 0; i < diff; i++) {
      fill.push(fill[i]);
    }
  }
  // if there are few categories we carefully choose which colors to use
  let newfill = [];
  if (categories.length == 2) {
    newfill.push(fill[12]);
    newfill.push(fill[4]);
    fill = newfill
  } else if (categories.length <= 10) {
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
  } else if (categories.length <= 12) {
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

  // the elements of the chord diagram
  let g = svg.append("g").attr('class', 'circle').datum(chord(matrix));
  let group = g.selectAll(".groups").data(function(chords) {
    return chords.groups;
  }).enter().append('g').attr("class", "groups");

  group.append("path").style("fill", function(d, i) { // use color map
    return (d.index) >= gnames.length
      ? fill[d.index - gnames.length]
      : "#ccc";
  }).attr("d", arc).style("opacity", 0.9);

  g.selectAll('.ribbons').data(function(chords) {
    return chords;
  }).enter().append("path").attr("class", "ribbons").attr("d", ribbon).style("fill", function(d) {
    return fill[d.target.index - gnames.length]; // the first 30 eleemnts of d are the group names => need start indexing at 0
  }).style("opacity", 0.9);

  // label the arcs
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
    return clean_text(fc,i);

  }).attr("font-family", "Arial Black").attr("font-size", "11px").attr("fill", function(d, i) {
    return (d.index) >= gnames.length
      ? fill[d.index - gnames.length]
      : "#ccc";
  });

  svg.selectAll('.text').on('mouseover', function(d, i) {
    f_mouseover(d,i);
  })
  .on('mouseout', function(d,i) {
    f_mouseout(d,i);
  });

  svg.selectAll('.groups').on('mouseover', function(d, i) {
    f_mouseover(d,i);
  })
  .on('mouseout', function(d,i) {
    f_mouseout(d,i);
  });



  function f_mouseover(d,i) {
    /*
    show percentages of categories from target to source as tooltip
    and fade the unrelevant chords out
    */

    let names, values;
    // get the adjacency values from the matrix
    // and the names for the corresponding values
    if (0 <= i && i< gnames.length) {
      values = matrix[i].slice(gnames.length, matrix[i].length);
      names = fc.slice(gnames.length, matrix[i].length);
    }else {
    // all the values the ith element is connected to
      values = matrix[i].slice(0, gnames.length);
      names = fc.slice(0, gnames.length);
    }

    // obtain the 3 largest values
    let idx = getmax(values);
    let percentage1 = values[idx[0]]/d.value;
    let percentage2 = values[idx[1]]/d.value;

    let format = d3.format('.1f');
    // heading for the tooltip
    d3.select('#tt_heading').text(clean_text(fc, i));
    // insert the statistics for showing in the tooltip
    d3.select("#tooltip").select("#value1")
      .text(clean_text(names, idx[0]) + ': ' + format(percentage1*100));
    d3.select("#tooltip").select("#value2")
      .text(clean_text(names, idx[1])  + ': ' + format(percentage2*100));

    // if we have more than two sources we show the top 3, else only the top 2
    if (categories.length > 2 || i >=gnames.length) {
      let percentage3 = values[idx[2]]/d.value;
      document.getElementById('opt_value')
      .innerHTML = "<span>"+ clean_text(names, idx[2])  + ': ' + format(percentage3*100)+"</span>%";
    } else {
      document.getElementById('opt_value').innerHTML= '';
    }
    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
    fade(d, i, 0.1);
  }

  function f_mouseout(d,i) {
    /*
      make tooltip disappear and chords reappear
    */
    d3.select('#tooltip').classed('hidden', true);
    fade(d, i, 0.9);
  }


  function fade(d, i, opacity) {
    /*
    fade function used when hovering over text or arc
    */
      svg.selectAll("path.ribbons").filter(function(d) {
        return d.source.index != i && d.target.index != i;
      }).transition().style("opacity", opacity);
  }

  function getmax(values) {
    /*
      get the indices of the 3 max values
    */
    let sorted = values.slice();
    sorted.sort((a,b) => b-a);
    let max3 = sorted.slice(0,3);
    let idx = [];
    idx.push(values.indexOf(max3[0]));
    idx.push(values.indexOf(max3[1]));
    idx.push(values.indexOf(max3[2]));
    return idx;
  }

  function clean_text(name_list, i) {
    /*
      truncate category names when necessary, make names more readable etc
    */
    let name = name_list[i];
    // very long parenthesis for this particular category name
    if (name.slice(0, 7) == 'Vehicle') {
      return name.slice(0, 7);
    }
    // for suicide and success paramters
    if (name == '0') {
      return 'No';
    } else if (name == '1') {
      return 'Yes';
    }
    // take parenthesis away that is present for the group names (abbreviations)
    let parenthesis = name.indexOf('(');
    if (parenthesis == -1 || i >= gnames.length) {
      return name;
    } else {
      return name.slice(0, parenthesis);
    }
  }
}


function dropdown_callback() {
  /*
  function handling the callback of the dropdown menu, responsible for creating new charts
  */
  let infoSelect = document.getElementById("drop");
  let selectedText = infoSelect.options[infoSelect.selectedIndex].text;

  let diagram = document.getElementById('chordDiagram');
  diagram.innerHTML = '';
  if (selectedText == 'Weapon type') {
    d3.csv('./data/adjacency/adj_gname_weapon.csv', createChordDiagram);
  } else if (selectedText == 'Attack type') {
    d3.csv('./data/adjacency/adj_gname_attacktype.csv', createChordDiagram);
  } else if (selectedText == 'Target type') {
    d3.csv('./data/adjacency/adj_gname_targtype.csv', createChordDiagram);
  } else if (selectedText == 'Attack region') {
    d3.csv('./data/adjacency/adj_gname_region.csv', createChordDiagram);
  } else if (selectedText == 'Suicide attacks') {
    d3.csv('./data/adjacency/adj_gname_suicide.csv', createChordDiagram);
  } else if (selectedText == 'Successfull attacks') {
    d3.csv('./data/adjacency/adj_gname_success.csv', createChordDiagram);
  }

}
