import CommandLineParser from "../commandLineParser.js"
import assert from "assert"
import {assertThrows} from "./assertions.js"

describe("Single boolean", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.boolean("boolean")

    it("No arguments", () => {
        assertThrows(() => commandLineParser.parse([]), "Missing argument")
    })
    it("True value", () => {
        assert(commandLineParser.parse(["-boolean", "true"]).get(key) === true)
    })
    it("False value", () => {
        assert(commandLineParser.parse(["-boolean", "false"]).get(key) === false)
    })
    commonSingleBooleanTests(commandLineParser)
})

describe("Single optional boolean", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.optionalBoolean("boolean")

    it("No arguments", () => {
        assert.equal(commandLineParser.parse([]).get(key), null)
    })
    it("True value", () => {
        assert(commandLineParser.parse(["-boolean", "true"]).get(key) === true)
    })
    it("True value", () => {
        assert(commandLineParser.parse(["-boolean", "false"]).get(key) === false)
    })
    commonSingleBooleanTests(commandLineParser)
})

function commonSingleBooleanTests(commandLineParser) {
    it("Illegal value", () => {
        assertThrows(() => commandLineParser.parse(["-boolean", "123"]), "Illegal value")
    })
    it("Missing value", () => {
        assertThrows(() => commandLineParser.parse(["-boolean"]), "No value given")
    })
    it("Missing dash", () => {
        assertThrows(() => commandLineParser.parse(["boolean", "true"]), "Illegal argument")
    })
    it("Dangling value", () => {
        assertThrows(() => commandLineParser.parse(["1", "true"]), "Illegal argument")
    })
}
