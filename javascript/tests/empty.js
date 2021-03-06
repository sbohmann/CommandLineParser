import CommandLineParser from "../commandLineParser.js"
import {assertThrows} from "./assertions.js"

describe("No parameters", () => {
    let commandLineParser = CommandLineParser()

    it("No arguments", () => {
        commandLineParser.parse([])
    })
    it("Undefined argument", () => {
        assertThrows(() => commandLineParser.parse(["-a"]), "Undefined argument")
    })
    it("Missing dash", () => {
        assertThrows(() => commandLineParser.parse(["a"]), "Illegal argument")
    })
    it("Dangling value", () => {
        assertThrows(() => commandLineParser.parse(["1"]), "Illegal argument")
    })
})
