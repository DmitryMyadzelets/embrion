

describe "Neuron", ->
    beforeEach ->
        neuron = null

    neuron = new Neuron()

    it "is a function", ->
        expect(typeof Neuron).toBe('function')

    it "new Neuron() returns an object", ->
        expect(typeof neuron).toBe('object')

    it "neuron.SM  - sensor matrix of type Matrix", ->
        expect(neuron.SM instanceof Matrix).toBe(true)

    it "neuron.P0 - initial memory matrix of type Matrix", ->
        expect(neuron.P0 instanceof Matrix).toBe(true)

    it "neuron.P - memory matrix of type Matrix", ->
        expect(neuron.P instanceof Matrix).toBe(true)

    it "neuron.U - attention matrix of type Matrix", ->
        expect(neuron.U instanceof Matrix).toBe(true)


    describe "Life time neuron.NS:", ->

        neuron = new Neuron()
    
        it "is equal to 1 by default", ->
            expect(neuron.NS).toBe(1)

        it "can be set by constructor e.g. Neuron({ NS : 8 })", ->
            neuron = new Neuron({ NS : 8 }) 
            expect(neuron.NS).toBe(8)

        it "or directly neuron.NS = 25", ->
            neuron.NS = 25;
            expect(neuron.NS).toBe(25)

    describe "Size of neuron", ->

        describe "by default", ->

            rows = 2
            cols = 3

            neuron = new Neuron()

            it "neuron.SM has size [2, 3]", ->
                expect(neuron.SM.rows()).toBe(rows)
                expect(neuron.SM.cols()).toBe(cols)

            it "neuron.P has size [1, 3]", ->
                expect(neuron.P.rows()).toBe(1)
                expect(neuron.P.cols()).toBe(cols)

            it "neuron.P0 has size [1, 3]", ->
                expect(neuron.P0.rows()).toBe(1)
                expect(neuron.P0.cols()).toBe(cols)

            it "neuron.U has size [3, 1]", ->
                expect(neuron.U.rows()).toBe(rows)
                expect(neuron.U.cols()).toBe(1)

        describe "if the size is provided in the config e.g. Neuron({rows : 8, cols : 5})", ->

            rows = 8
            cols = 5
            
            config = {
                rows : rows
                cols : cols                
            }

            beforeEach ->
                neuron = new Neuron(config)

            it "neuron.SM has size [8, 5]", ->
                expect(neuron.SM.rows()).toBe(rows)
                expect(neuron.SM.cols()).toBe(cols)

            it "neuron.P has size [1, 5]", ->
                expect(neuron.P.rows()).toBe(1)
                expect(neuron.P.cols()).toBe(cols)

            it "neuron.P0 has size [1, 5]", ->
                expect(neuron.P0.rows()).toBe(1)
                expect(neuron.P0.cols()).toBe(cols)

            it "neuron.U has size [8, 1]", ->
                expect(neuron.U.rows()).toBe(rows)
                expect(neuron.U.cols()).toBe(1)

    describe "neuron.run", ->

            neuron = new Neuron()

            it "is a function", ->
                expect(typeof neuron.run == 'function').toBe(true)

            it "run.done is false after the first run", ->
                expect(neuron.run().done).toBe(false)

            it "terminates, i.e. neuron.run.done == true after few runs", ->
                done = false
                while done == false
                    done = neuron.run().done
                expect(done).toBe(true);

            it "invokes neuron.event 0 times when U matrix is not set up", ->
                i = 0
                neuron.event = -> i += 1
                while not neuron.run().done
                    null
                expect(i).toBe(0)

            it "invokes neuron.event 2 times when U matrix is set to 1'ns", ->
                neuron = new Neuron()
                i = 0
                neuron.U.each(-> 1)
                neuron.event = -> i += 1
                while not neuron.run().done
                    null
                expect(i).toBe(2)

            it "invokes neuron.event 50 times when U = [2, 3], NS = 10", ->
                neuron = new Neuron()
                neuron.NS = 10
                i = 0
                neuron.U.set(0, 0, 2)
                neuron.U.set(1, 0, 3)
                neuron.event = -> i += 1
                while not neuron.run().done
                    null
                expect(i).toBe(50)
