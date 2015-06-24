describe "Martrix", ->

    it "is a function", ->
        expect(typeof Matrix).toBe('function')

    describe "new Matrix()", ->
        matrix = new Matrix()

        it "returns an matrix object of default size [1, 1]", ->
            expect(typeof matrix).toBe('object')

        it "matrix.rows() returns '1'", ->
            expect(matrix.rows()).toBe(1)

        it "matrix.cols() returns '1'", ->
            expect(matrix.cols()).toBe(1)

        it "matrix.set(0, 0, 8) and matrix.get(0, 0) allow to set and get value 8", ->
            matrix.set(0, 0, 8);
            expect(matrix.get(0, 0)).toBe(8)

        it "outrange access matrix.get(1, 0) returns undefined", ->
            expect(matrix.get(1, 0)).toBe(undefined)

    describe "new Matrix(5, 3)", ->
        matrix = new Matrix(5, 3)

        it "matrix.size returns array [5, 3]", ->
            size = matrix.size()
            expect(size[0]).toBe(5)
            expect(size[1]).toBe(3)

        it "matrix.rows() returns 5", ->
            expect(matrix.rows()).toBe(5)

        it "matrix.cols() returns 3", ->
            expect(matrix.cols()).toBe(3)

    it "matrix.each(function foo) invokes the function (rows * cols) times", ->
        matrix = new Matrix(2, 3)
        cells = 0
        matrix.each((row, col)->
            cells += 1
            )
        expect(cells).toBe(6)

    it "matrix.zeros() fills the matrix with 0", ->
        matrix = new Matrix(2, 3)
        matrix.zeros()
        ok = true
        v = null
        matrix.each((row, col)->
            v = this.get(row, col);
            ok &&= (v == 0)
            )
        expect(ok).toBe(true)


    it "with matrix.each() we can fill the matrix with 1", ->
        matrix = new Matrix(2, 3)
        matrix.each(() -> 1)
        ok = true
        v = null
        matrix.each((row, col) ->
            v = this.get(row, col);
            ok &&= (v == 1)
            )
        expect(ok).toBe(true)


    it "... or even with objects", ->
        matrix = new Matrix(2, 3)
        matrix.each((row, col) -> { row:row, col:col })
        ok = true
        v = null
        matrix.each((row, col) ->
            v = this.get(row, col)
            ok &&= (typeof v == 'object' && v.row == row && v.col == col)
            )
        expect(ok).toBe(true)
