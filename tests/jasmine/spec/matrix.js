// Generated by CoffeeScript 1.9.2
describe("Martrix", function() {
  it("is a function", function() {
    return expect(typeof Matrix).toBe('function');
  });
  describe("new Matrix()", function() {
    var matrix;
    matrix = new Matrix();
    it("returns an matrix object of default size [1, 1]", function() {
      return expect(typeof matrix).toBe('object');
    });
    it("matrix.rows() returns '1'", function() {
      return expect(matrix.rows()).toBe(1);
    });
    it("matrix.cols() returns '1'", function() {
      return expect(matrix.cols()).toBe(1);
    });
    it("matrix.set(0, 0, 8) and matrix.get(0, 0) allow to set and get value 8", function() {
      matrix.set(0, 0, 8);
      return expect(matrix.get(0, 0)).toBe(8);
    });
    return it("outrange access matrix.get(1, 0) returns undefined", function() {
      return expect(matrix.get(1, 0)).toBe(void 0);
    });
  });
  describe("new Matrix(5, 3)", function() {
    var matrix;
    matrix = new Matrix(5, 3);
    it("matrix.size returns array [5, 3]", function() {
      var size;
      size = matrix.size();
      expect(size[0]).toBe(5);
      return expect(size[1]).toBe(3);
    });
    it("matrix.rows() returns 5", function() {
      return expect(matrix.rows()).toBe(5);
    });
    return it("matrix.cols() returns 3", function() {
      return expect(matrix.cols()).toBe(3);
    });
  });
  it("matrix.each(function foo) invokes the function (rows * cols) times", function() {
    var cells, matrix;
    matrix = new Matrix(2, 3);
    cells = 0;
    matrix.each(function(row, col) {
      return cells += 1;
    });
    return expect(cells).toBe(6);
  });
  it("matrix.zeros() fills the matrix with 0", function() {
    var matrix, ok, v;
    matrix = new Matrix(2, 3);
    matrix.zeros();
    ok = true;
    v = null;
    matrix.each(function(row, col) {
      v = this.get(row, col);
      return ok && (ok = v === 0);
    });
    return expect(ok).toBe(true);
  });
  it("with matrix.each() we can fill the matrix with 1", function() {
    var matrix, ok, v;
    matrix = new Matrix(2, 3);
    matrix.each(function() {
      return 1;
    });
    ok = true;
    v = null;
    matrix.each(function(row, col) {
      v = this.get(row, col);
      return ok && (ok = v === 1);
    });
    return expect(ok).toBe(true);
  });
  return it("... or even with objects", function() {
    var matrix, ok, v;
    matrix = new Matrix(2, 3);
    matrix.each(function(row, col) {
      return {
        row: row,
        col: col
      };
    });
    ok = true;
    v = null;
    matrix.each(function(row, col) {
      v = this.get(row, col);
      return ok && (ok = typeof v === 'object' && v.row === row && v.col === col);
    });
    return expect(ok).toBe(true);
  });
});
