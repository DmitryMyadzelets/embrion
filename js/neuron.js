/*jslint bitwise : true*/
/*global Matrix*/

var Neuron = (function () {

    function automaton() {

        var ns, u, sm, p, row, col;

        // The state machine
        var state, states = {
            init : function () {
                ns = +this.NS;
                if (this.U.rows() > 0 && this.P.cols() > 0) {
                    state = states.NS;
                }
            },
            NS : function () {
                if (ns > 0) {
                    ns -= 1;
                    row = 0;
                    u = +this.U.get(row, 0);
                    state = states.U;
                } else {
                    state = states.init;
                }
            },
            U : function () {
                if (u > 0) {
                    u -= 1;
                    state = states.SM;
                } else {
                    row += 1;
                    if (row < this.U.rows()) {
                        u = +this.U.get(row, 0);
                    } else {
                        state = states.NS;
                    }
                }
            },
            SM : function () {
                col = Math.random() * this.SM.cols() | 0;
                sm = +this.SM.get(row, col);
                state = states.P;
            },
            P : function () {
                p = this.P.get(0, col);
                if (sm !== p) {
                    this.P.set(0, col, sm);
                    this.event(sm !== p);
                }
                state = states.U;
            }
        };
        state = states.init;

        var debug = false;
        // Give names to the states-functions for debugging
        if (debug) {
            var key;
            for (key in states) {
                if (states.hasOwnProperty(key)) {
                    if (!states[key]._name) {
                        states[key]._name = key;
                    }
                }
            }
        }

        var ost = state;
        var i = 0;
        return function loop() {
            state.apply(this, arguments);
            loop.done = state === states.init;
            // Debug transitions
            if (debug) {
                if (ost !== state) {
                    console.log(i++, ost._name, '->', state._name);
                    ost = state;
                } else {
                    console.log(i++, state._name);
                }
            }
            return loop;
        };
    }

    function run() {
        var init = true;
        var ns, row, col, u, sm, p;
        var old_u;

        return function () {
            if (init) {
                init = false;
                ns = this.NS;
                row = 0;
                u = this.U.get(row, 0);
                old_u = u;
            }
            this.row = row;

            if (--u > 0) {
                col = Math.random() * this.P.cols() | 0;
                this.col = col;
                sm = !!this.SM.get(row, col);
                p = !!this.P.get(0, col);
                this.P.set(0, col, sm);
                this.U.set(row, 0, u);
                return true;
            }
            this.U.set(row, 0, old_u);

            if (++row < this.U.rows()) {
                u = this.U.get(row, 0);
                old_u = u;
                return true;
            }
            row = 0;
            u = this.U.get(row, 0);
            old_u = u;

            ns -= 1;
            if (ns > 0) {
                return true;
            }
            init = true;
            return false;
        };
    }


    function constructor(config) {
        config = config || {};

        // Dimension (we use more readable rows and cols instead of m and n)
        var rows = config.rows || 2;
        var cols = config.cols || 3;

        this.row = 0;
        this.col = 0;

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

        this.run = run();
    }

    function methods() {
        this.event = function () {
            return;
        };
    }
    methods.apply(constructor.prototype);

    return constructor;
}());