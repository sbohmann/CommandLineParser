import CommandLineParser from "./commandLineParser.js"
import assert from "assert"

function assertThrows(code, expectedTextPart) {
    try {
        code()
    } catch (error) {
        if (expectedTextPart) {
            assert(error.message.includes(expectedTextPart),
                "Call did throw but error message [" + error.message +
                "] does not contain the expected text part [" + expectedTextPart + "]")
        }
        return
    }
    throw new Error("Call did not throw.")
}

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

describe("Single boolean", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.boolean("boolean")

    it("No arguments", () => {
        assertThrows(() => commandLineParser.parse([]), "Missing argument")
    })
    it("True value", () => {
        commandLineParser.parse(["-boolean", "true"])
    })
    it("True value", () => {
        commandLineParser.parse(["-boolean", "false"])
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
})

describe("Single optional boolean", () => {
    let commandLineParser = CommandLineParser()
    let key = commandLineParser.optionalBoolean("boolean")

    it("No arguments", () => {
        assert.equal(commandLineParser.parse([]).get(key), null)
    })
    it("True value", () => {
        commandLineParser.parse(["-boolean", "true"])
    })
    it("True value", () => {
        commandLineParser.parse(["-boolean", "false"])
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
})
