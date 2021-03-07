export default function CommandLineParser() {
    let keyForName = new Map()

    function addKey(argumentName, optional, expectsValue, conversion, defaultValue) {
        if (!argumentName.match(/\w+/)) {
            throw new RangeError("Illegal argument name [" + argumentName + "]")
        }
        if (keyForName.has(argumentName)) {
            throw new Error("Double argument name [" + argumentName + "]")
        }
        let key = {
            mapInstance: keyForName,
            argumentName,
            optional,
            expectsValue,
            defaultValue,
            parseValue(text) {
                if (conversion) {
                    return conversion(text, argumentName)
                } else {
                    return text
                }
            }
        }
        keyForName.set(argumentName, key)
        return key
    }

    function parse(args) {
        let valueForArgumentName = new Map()
        let argumentNamesEncountered = new Set()
        let expectingValueForKey = null

        args.forEach(argument => {
            if (expectingValueForKey) {
                let key = expectingValueForKey
                valueForArgumentName.set(key.argumentName, key.parseValue(argument))
                expectingValueForKey = null
            } else {
                let match = argument.match(/-(\w+)/)
                if (!match) {
                    throw new Error("Illegal argument: [" + argument + "]")
                }
                let argumentName = match[1]
                if (argumentNamesEncountered.has(argumentName)) {
                    throw new Error("Double argument: [" + argument + "]")
                }
                argumentNamesEncountered.add(argumentName)
                let key = keyForName.get(argumentName)
                if (!key) {
                    throw new Error("Undefined argument: [" + argument + "]")
                }
                if (key.expectsValue) {
                    expectingValueForKey = key
                } else {
                    valueForArgumentName.set(key.argumentName, true)
                }
            }
        })

        if (expectingValueForKey) {
            throw new Error("No value given for argument [-" + expectingValueForKey.name + "]")
        }

        keyForName.forEach(key => {
            if (!key.optional && !argumentNamesEncountered.has(key.argumentName)) {
                throw new Error("Missing argument [-" + key.argumentName + "]")
            }
        })

        return {
            get(key) {
                if (key.mapInstance !== keyForName) {
                    throw new Error("Attempt to use key created by another parser instance. " +
                        "Key argument name: [" + key.argumentName + "]")
                }
                let value = valueForArgumentName.get(key.argumentName)
                if (value !== undefined) {
                    return value
                } else if (key.defaultValue !== undefined) {
                    return key.defaultValue
                } else {
                    return undefined
                }
            }
        }
    }

    return {
        option(argumentName) {
            return addKey(argumentName, true, false, null, false)
        },
        string(argumentName) {
            return addKey(argumentName, false, true)
        },
        optionalString(argumentName) {
            return addKey(argumentName, true, true)
        },
        int(argumentName) {
            return addKey(argumentName, false, true, parseIntValue)
        },
        optionalInt(argumentName) {
            return addKey(argumentName, true, true, parseIntValue)
        },
        number(argumentName) {
            return addKey(argumentName, false, true, parseNumberValue)
        },
        optionalNumber(argumentName) {
            return addKey(argumentName, true, true, parseNumberValue)
        },
        boolean(argumentName) {
            return addKey(argumentName, false, true, parseBooleanValue)
        },
        optionalBoolean(argumentName) {
            return addKey(argumentName, true, true, parseBooleanValue)
        },
        parse
    }
}

function parseIntValue(text, argumentName) {
    let result = parseNumberValue(text, argumentName)
    if (result !== Math.floor(result)) {
        illegalValueError("Not an integer number: [" + text + "]")
    }
    return result
}

function parseNumberValue(text, argumentName) {
    let result = Number(text)
    if (Number.isNaN(result)) {
        illegalValueError(argumentName, "not a number: [" + text + "]")
    }
    return result
}

function parseBooleanValue(text, argumentName) {
    switch (text) {
        case "true":
            return true
        case "false":
            return false
        default:
            illegalValueError(argumentName, "Not a boolean expression: [" + text + "], " +
                "expected values: true or false")
    }
}

function illegalValueError(argumentName, errorMessage) {
    throw new Error("Illegal value for argument -" + argumentName + ": " + errorMessage)
}
