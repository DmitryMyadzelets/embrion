
// Helper methods

// convert an linear index into the matrix indexes [row, col]
function decode2D(i, rows, cols) {
    return [i / cols | 0, i % rows];
}


// Embrion object

var Embrion = (function () {

    var config = {
        showBooleans : true,
    };

    // Creates and returns a 2-dimentional array
    function arrayMatrix(rows, cols) {
        var v = new Array(rows);
        var i = v.length;
        while (i--) {
            v[i] = new Array(cols);
        }
        return v;
    }

    // Creates and returns an object: { 
    // cell : selection d3.js
    // update : function ()
    // }
    // Input:
    // parent : selection d3.js
    // data : matrix array
    // x, y : coordinates (optional)
    // w, h : size of matrix cell (optional, default is 10px)
    // className : string (optional)
    function svgMatrix(parent, data, x, y, w, h, className) {
        x = x === undefined ? 0 : x;
        y = y === undefined ? 0 : y;
        w = w | 10;
        h = h | 10;

        var g = parent.append('g')
            .classed('matrix', true)
            .attr('transform', function () {
            return 'translate(' + x + ',' + y + ')';
        });
        if (className) {
            g.classed(className, true);
        }

        var ret = {
            updateCell : function () {},
            update: function () {
                // Matrix rows represented by groups
                var row = g.selectAll('g.row').data(data);

                row.enter()
                    .append('g')
                    .attr('class', 'row')
                    .attr('transform', function (d, i) {
                    return 'translate(0, ' + i * h + ')';
                });

                // Each matrix cell is a group
                var cell = row.selectAll('g').data(function (d) {
                    return d;
                });

                var enter = cell.enter()
                    .append('g')
                    .attr('class', 'cell')
                    .attr('transform', function (d, i) {
                    return 'translate(' + i * w + ')';
                });

                // Each cell consists of a rectangle ...
                enter.append('rect')
                    .attr('width', w)
                    .attr('height', h);

                // ... and a text
                enter.append('text')
                    .attr('x', w / 2)
                    .attr('y', h / 2)
                    .attr('alignment-baseline', 'center');

                // Make matrix values visible
                cell.each(this.updateCell);

                this.cell = cell;
            }
        };

        ret.update();
        return ret;
    }

    return {
        svgMatrix : svgMatrix,
        arrayMatrix : arrayMatrix
    };

}());


// ===========================================================================
// The application

var w = 30; // Width of the matrix cell
var h = 30; // Heigth of the matrix cell

var rows = 2;
var cols = 3;

var sensorMatrix = Embrion.arrayMatrix(rows, cols);
var hypoMatrix = Embrion.arrayMatrix(rows, 1);
var neuroMatrix = Embrion.arrayMatrix(1, cols);

var svg = d3.select('body').append('svg')
    .attr('width', 500)
    .attr('height', 500)
    .classed('unselectable', true);;


sensorMatrix[0][1] = true;
sensorMatrix[1][0] = true;

// Show matrices

var neuro, sensor, hypo;
var x = 1;
var y = 1;
neuro = Embrion.svgMatrix(svg, neuroMatrix, x, y, w, h, 'neuro');
y += 1.5 * h;
sensor = Embrion.svgMatrix(svg, sensorMatrix, x, y, w, h, 'sensor');
x = w * cols + w / 2;
hypo = Embrion.svgMatrix(svg, hypoMatrix, x, y, w, h, 'hypo');


// Set update function for each matrix

function updateBooleanCell(d) {
    var parent = d3.select(this);
    parent.selectAll('rect').classed('is_true', !!d);
    parent.selectAll('text').text(d ? 1 : 0);
}

function updateNumberCell(d) {
    var parent = d3.select(this);
    parent.selectAll('text').text(+d);
}

sensor.updateCell = updateBooleanCell;
sensor.update();

neuro.updateCell = updateBooleanCell;
neuro.update();

hypo.updateCell = updateNumberCell;
hypo.update();


// Hook user input events

// Sensor matrix
sensor.cell.on('mousedown', function (d, col, row) {
    sensorMatrix[row][col] = !d;
    sensor.update();
});

// Neuro matrix
neuro.cell.on('mousedown', function (d, col, row) {
    neuroMatrix[row][col] = !d;
    neuro.update();
});
