/*jslint bitwise : true*/
/*global d3, Neuron, Spinner*/


var neuron = new Neuron();


// Helper methods

// convert an linear index into the matrix indexes [row, col]
function decode2D(i, rows, cols) {
    return [i / cols | 0, i % rows];
}


// embrionView object

var embrionView = (function () {

    // var config = {
    //     showBooleans : true,
    // };

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
            updateCell : function () { return; },
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
    };

}());


// ===========================================================================
// The application

var rows, cols;

var neuron = new Neuron();
// Set real values
rows = neuron.SM.rows();
cols = neuron.SM.cols();

function init_neuron() {
    function zero() {
        return 0;
    }
    neuron.SM.each(zero);
    neuron.U.each(function () {
        return 1 + Math.random() * 10 | 0;
    });
    neuron.P.each(zero);
}

init_neuron();


// Show matrices

var w = 30; // Width of the matrix cell
var h = 30; // Heigth of the matrix cell

var svg = d3.select('body').append('svg')
    .attr('width', 500)
    .attr('height', 300)
    .classed('unselectable', true);

var neuro, sensor, attent;
var x = 1;
var y = 1;
neuro = embrionView.svgMatrix(svg, neuron.P.data, x, y, w, h, 'neuro');
y += 1.5 * h;
sensor = embrionView.svgMatrix(svg, neuron.SM.data, x, y, w, h, 'sensor');
x = w * cols + w / 2;
attent = embrionView.svgMatrix(svg, neuron.U.data, x, y, w, h, 'hypo');



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
neuro.updateCell = updateBooleanCell;
attent.updateCell = updateNumberCell;

function update() {
    sensor.update();
    neuro.update();
    attent.update();
}


// Hook user input events

// Sensor matrix
sensor.cell.on('mousedown', function (d, col, row) {
    neuron.SM.set(row, col, !d);
    sensor.update();
});

// Neuro matrix
neuro.cell.on('mousedown', function (d, col, row) {
    neuron.P.set(row, col, !d);
    neuro.update();
});

update();

// Neuron's cycle

var tid, delay = 100;
var row;
function step() {
    if (neuron.run()) {
    } else {
        clearInterval(tid);
    }
    row = neuron.row;
    update();
}


function start() {
    clearInterval(tid);
    tid = setInterval(step, delay);
}


var spinner_ns = new Spinner('input#NS',
    {
        min : 1,
        max : 100,
        value : neuron.NS
    }, function (value) {
        neuron.NS = value;
    });

var spinner_delay = new Spinner('input#delay', {
        min : 0,
        max : 1000,
        step : 100,
        value : 50
    }, function (value) {
        if (value < delay) {
            if (this.value <= 10) {
                this.set_step(1);
            } else if (this.value <= 100) {
                this.set_step(10);
            }
        } else {
            if (this.value >= 100) {
                this.set_step(100);
            } else if (this.value >= 10) {
                this.set_step(10);
            }
        }
        delay = value;
    });

d3.select('input#start').on('click', start);