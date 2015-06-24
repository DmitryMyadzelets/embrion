
var Matrix = (function () {

    function create(rows) {
        var m = [];
        while (rows--) {
            m[rows] = [];
        }
        return m;
    }

    function constructor(rows, cols) {
        rows = rows || 1;
        cols = cols || 1;
        this.data = create(rows, cols);
        this.rows = function () {
            return rows;
        };
        this.cols = function () {
            return cols;
        };
    }

    function methods() {

        this.size = function () {
            return [this.rows(), this.cols()];
        };

        this.set = function (row, col, val) {
            if (row < this.rows() && col < this.cols() && row >= 0 && col >= 0) {
                this.data[row][col] = val;
            }
        };

        this.get = function (row, col) {
            if (row >= 0 && row < this.rows()) {
                return this.data[row][col];
            }
        };

        this.each = function (fun) {
            if (typeof fun === 'function') {
                var i = this.rows(), j;
                var val;
                while (i--) {
                    j = this.cols();
                    while (j--) {
                        val = fun.call(this, i, j);
                        if (val !== 'undefined') {
                            this.set(i, j, val);
                        }
                    }
                }
            }
        };

        function zeros() {
            return 0;
        }

        this.zeros = function () {
            this.each(zeros);
        };
    }

    methods.apply(constructor.prototype);
    return constructor;
}());
