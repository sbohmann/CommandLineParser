import CommandLineParser from "../commandLineParser.js"
import assert from "assert"
import {assertThrows} from "./assertions.js"

describe("Single boolean", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.boolean("boolean")

    it("No arguments", () => {
        assertThrows(() => commandLineParser.parse([]), "Missing argument")
    })

    commonSingleBooleanTests(commandLineParser, key)
})

describe("Single optional boolean", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.optionalBoolean("boolean")

    it("No arguments", () => {
        assert.strictEqual(commandLineParser.parse([]).get(key), undefined)
    })

    commonSingleBooleanTests(commandLineParser, key)
})

function commonSingleBooleanTests(commandLineParser, key) {
    it("True value", () => {
        assert.strictEqual(commandLineParser.parse(["-boolean", "true"]).get(key) ,  true)
    })
    it("False value", () => {
        assert.strictEqual(commandLineParser.parse(["-boolean", "false"]).get(key) ,  false)
    })
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
