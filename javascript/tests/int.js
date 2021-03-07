import CommandLineParser from "../commandLineParser.js"
import assert from "assert"
import {assertThrows} from "./assertions.js"

describe("Single int", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.int("int")

    it("No arguments", () => {
        assertThrows(() => commandLineParser.parse([]), "Missing argument")
    })

    commonSingleIntTests(commandLineParser, key)
})

describe("Single optional int", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.optionalInt("int")

    it("No arguments", () => {
        assert.equal(commandLineParser.parse([]).get(key), undefined)
    })

    commonSingleIntTests(commandLineParser, key)
})

function commonSingleIntTests(commandLineParser, key) {
    it("125 value", () => {
        assert(commandLineParser.parse(["-int", "125"]).get(key) === 125)
    })
    it("0 value", () => {
        assert(commandLineParser.parse(["-int", "0"]).get(key) === 0)
    })
    it("-0 value", () => {
        assert(commandLineParser.parse(["-int", "-0"]).get(key) === 0)
    })
    it("-125 value", () => {
        assert(commandLineParser.parse(["-int", "-125"]).get(key) === -125)
    })
    it("Illegal value", () => {
        assertThrows(() => commandLineParser.parse(["-int", "12.5"]), "Illegal value")
    })
    it("Missing value", () => {
        assertThrows(() => commandLineParser.parse(["-int"]), "No value given")
    })
    it("Missing dash", () => {
        assertThrows(() => commandLineParser.parse(["int", "12"]), "Illegal argument")
    })
    it("Dangling value", () => {
        assertThrows(() => commandLineParser.parse(["1", "12"]), "Illegal argument")
    })
}
