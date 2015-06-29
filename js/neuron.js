/*jslint bitwise : true*/
/*global Matrix*/

var Neuron = (function () {

    function automaton() {

        var ns, row, col, u, sm, p;

        // The state machine
        var state, states = {
            init : function () {
                ns = this.NS;
                state = states.check_ns;
            },
            check_ns : function () {
                if (ns > 0) {
                    row = 0;
                    ns -= 1;
                    state = states.check_row;
                } else {
                    state = states.init;
                }
            },
            check_row : function () {
                if (row < this.U.rows()) {
                    u = +this.U.get(row, 0);
                    state = states.select_u;
                } else {
                    row += 1;
                    state = states.check_ns;
                }
            },
            select_u : function () {
                if (u > 0) {
                    u -= 1;
                    col = Math.random() * this.SM.cols() | 0;
                    sm = +this.SM.get(row, col);
                    state = states.select_sm;
                } else {
                    row += 1;
                    state = states.check_row;
                }
            },
            select_sm : function () {
                p = +this.P.get(0, col);
                state = states.select_p;
            },
            select_p : function () {
                if (sm !== p) {
                    this.event('p');
                }
                state = states.select_u;
            }
        };
        state = states.init;

        // // Give names to the states-functions for debugging
        // var key;
        // for (key in states) {
        //     if (states.hasOwnProperty(key)) {
        //         if (!states[key]._name) {
        //             states[key]._name = key;
        //         }
        //     }
        // }

        // var ost = state;
        // var i = 0;
        return function loop() {
            state.apply(this, arguments);
            loop.done = state === states.init;
            // // Debug transitions
            // if (ost !== state) {
            //     console.log(i++, ost._name, '->', state._name);
            //     ost = state;
            // }
            return loop;
        };
    }


    function constructor(config) {
        config = config || {};

        // Dimension (we use more readable rows and cols instead of m and n)
        var rows = config.rows || 2;
        var cols = config.cols || 3;

        // Sensor matrix
        this.SM = new Matrix(rows, cols);
        // Initial memory matrix
        this.P0 = new Matrix(1, cols);
        // Memory matrix
        this.P = new Matrix(1, cols);
        // Attention matrix
        this.U = new Matrix(rows, 1);
        // Life time
        this.NS = config.NS || 1;

        this.run = automaton();
    }

    function methods() {
        this.event = function () {
            return;
        };
    }
    methods.apply(constructor.prototype);

    return constructor;
}());