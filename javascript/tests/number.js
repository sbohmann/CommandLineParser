import CommandLineParser from "../commandLineParser.js"
import assert from "assert"
import {assertThrows} from "./assertions.js"

describe("Single number", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.number("number")

    it("No arguments", () => {
        assertThrows(() => commandLineParser.parse([]), "Missing argument")
    })

    commonSingleNumberTests(commandLineParser, key)
})

describe("Single optional number", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.optionalNumber("number")

    it("No arguments", () => {
        assert.equal(commandLineParser.parse([]).get(key), undefined)
    })

    commonSingleNumberTests(commandLineParser, key)
})

function commonSingleNumberTests(commandLineParser, key) {
    it("125.34 value", () => {
        assert(commandLineParser.parse(["-number", "125.34"]).get(key) === 125.34)
    })
    it("0 value", () => {
        assert(commandLineParser.parse(["-number", "0"]).get(key) === 0)
    })
    it("-0 value", () => {
        assert(commandLineParser.parse(["-number", "-0"]).get(key) === 0)
    })
    it("-125.34 value", () => {
        assert(commandLineParser.parse(["-number", "-125.34"]).get(key) === -125.34)
    })
    it("Illegal value", () => {
        assertThrows(() => commandLineParser.parse(["-number", "x"]), "Illegal value")
    })
    it("Missing value", () => {
        assertThrows(() => commandLineParser.parse(["-number"]), "No value given")
    })
    it("Missing dash", () => {
        assertThrows(() => commandLineParser.parse(["number", "12.5"]), "Illegal argument")
    })
    it("Dangling value", () => {
        assertThrows(() => commandLineParser.parse(["1", "12.5"]), "Illegal argument")
    })
}
