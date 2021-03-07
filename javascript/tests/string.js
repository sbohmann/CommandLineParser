import CommandLineParser from "../commandLineParser.js"
import assert from "assert"
import {assertThrows} from "./assertions.js"

describe("Single string", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.string("string")

    it("No arguments", () => {
        assertThrows(() => commandLineParser.parse([]), "Missing argument")
    })

    commonSingleStringTests(commandLineParser, key)
})

describe("Single optional string", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.optionalString("string")

    it("No arguments", () => {
        assert.equal(commandLineParser.parse([]).get(key), undefined)
    })

    commonSingleStringTests(commandLineParser, key)
})

function commonSingleStringTests(commandLineParser, key) {
    it("text value", () => {
        assert(commandLineParser.parse(["-string", "text"]).get(key) === "text")
    })
    it("x value", () => {
        assert(commandLineParser.parse(["-string", "x"]).get(key) === "x")
    })
    it("empty value", () => {
        assert(commandLineParser.parse(["-string", ""]).get(key) === "")
    })
    it("blank value", () => {
        assert(commandLineParser.parse(["-string", "   "]).get(key) === "   ")
    })
    it("multi word value", () => {
        assert(commandLineParser.parse(["-string", "first second"]).get(key) === "first second")
    })
    it("emoji value", () => {
        assert(commandLineParser.parse(["-string", "😎"]).get(key) === "😎")
    })
    it("Missing value", () => {
        assertThrows(() => commandLineParser.parse(["-string"]), "No value given")
    })
    it("Missing dash", () => {
        assertThrows(() => commandLineParser.parse(["string", "x"]), "Illegal argument")
    })
    it("Dangling value", () => {
        assertThrows(() => commandLineParser.parse(["1", "true"]), "Illegal argument")
    })
}
