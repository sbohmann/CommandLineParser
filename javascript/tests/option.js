import CommandLineParser from "../commandLineParser.js"
import assert from "assert"
import {assertThrows} from "./assertions.js"

describe("Single option", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.option("option")

    it("No arguments", () => {
        assert.equal(commandLineParser.parse([]).get(key), false)
    })
    it("Option argument", () => {
        assert.equal(commandLineParser.parse(["-option"]).get(key), true)
    })
    it("Missing dash", () => {
        assertThrows(() => commandLineParser.parse(["option"]), "Illegal argument")
    })
    it("Dangling value", () => {
        assertThrows(() => commandLineParser.parse(["1"]), "Illegal argument")
    })
})
