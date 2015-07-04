/*jslint */
/*global d3*/

var Spinner = (function () {

    function dummy() {
        return;
    }

    function input() {
        var o = d3.select(this).datum();
        o.value = +this.value;
        o.callback(o.value);
    }

    function zoomed() {
        var o = d3.select(this).datum();

        this.value = +this.value + (o.scale < d3.event.scale ? o.step : -o.step);
        this.value = Math.min(this.value, o.max);
        this.value = Math.max(this.value, o.min);

        o.scale = d3.event.scale;

        input.apply(this, arguments);
    }

    function constructor(name, min, max, step, value, callback) {
        this.min = min !== undefined ? min : 0;
        this.max = max !== undefined ? max : Math.max(min + 10, 100);
        this.step = step !== undefined ? step : 1;
        this.value = value !== undefined ? value : this.min;
        this.scale = 1;
        this.callback = typeof callback === 'function' ? callback : dummy;

        var sel = d3.select(name);
        this.selection = sel;

        sel.datum(this);
        sel.attr('min', this.min);
        sel.attr('max', this.max);
        sel.attr('step', this.step);
        sel.attr('value', this.value);

        sel.on('input', input);

        var zoom = d3.behavior.zoom();
        zoom(sel);
        zoom.on('zoom', zoomed);
    }

    constructor.prototype.set_step = function (step) {
        this.step = step;
        this.selection.attr('step', step);
    };

    return constructor;
}());
