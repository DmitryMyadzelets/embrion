

describe "Neuron", ->

    it "is a function", ->
        expect(typeof Neuron).toBe('function')

    it "new Neuron() returns an object", ->
        neuron = new Neuron()
        expect(typeof neuron).toBe('object')

