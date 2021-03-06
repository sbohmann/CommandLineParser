import CommandLineParser from "../commandLineParser.js"
import assert from "assert"
import {assertThrows} from "./assertions.js"

describe("Single number", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.number("number")

    it("No arguments", () => {
        assertThrows(() => commandLineParser.parse([]), "Missing argument")
    })
    it("True value", () => {
        assert(commandLineParser.parse(["-number", "true"]).get(key) === true)
    })
    it("False value", () => {
        assert(commandLineParser.parse(["-number", "false"]).get(key) === false)
    })
    commonSingleBooleanTests(commandLineParser)
})

describe("Single optional number", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.optionalBoolean("number")

    it("No arguments", () => {
        assert.equal(commandLineParser.parse([]).get(key), null)
    })
    it("True value", () => {
        assert(commandLineParser.parse(["-number", "true"]).get(key) === true)
    })
    it("True value", () => {
        assert(commandLineParser.parse(["-number", "false"]).get(key) === false)
    })
    commonSingleBooleanTests(commandLineParser)
})

function commonSingleBooleanTests(commandLineParser) {
    it("Illegal value", () => {
        assertThrows(() => commandLineParser.parse(["-number", "123"]), "Illegal value")
    })
    it("Missing value", () => {
        assertThrows(() => commandLineParser.parse(["-number"]), "No value given")
    })
    it("Missing dash", () => {
        assertThrows(() => commandLineParser.parse(["number", "true"]), "Illegal argument")
    })
    it("Dangling value", () => {
        assertThrows(() => commandLineParser.parse(["1", "true"]), "Illegal argument")
    })
}
