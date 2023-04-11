const expect = require("chai").expect
const { describe } = require('mocha')
const multiply = require('../app')

describe('Lommeregneren skal kunne gange', () => {

    it('2 x 3, should not be 27', ()=> {
        let result = multiply(5.5, 4)
        expect(result).to.be.not.equal(27)
    })

    it('4 x 5, skal returnere 20', () => {
        
        let result = multiply(4, 5)
        expect(result).to.be.equal(20);

    })

    it('5.5 x 4, should be 22', ()=> {
        let result = multiply(5.5, 4)
        expect(result).to.be.equal(22)
    })

    // it('hej x 4, should throw invalid argument error', ()=> {
    //     let result = multiply(5.5, 4)
    //     expect(result).to.be.equal(22)
    // })
})