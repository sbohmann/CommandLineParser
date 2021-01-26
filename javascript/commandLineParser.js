export default function CommandLineParser() {
    let keyForName = new Map()

    function addKey(argumentName, optional, expectsValue, conversion) {
        if (keyForName.has(argumentName)) {
            throw new Error("Double argument name [" + argumentName + "]")
        }
        let key = {
            mapInstance: keyForName,
            argumentName,
            optional,
            expectsValue,
            parseValue(text) {
                if (conversion) {
                    return conversion(text)
                } else {
                    return text
                }
            }
        }
        keyForName.set(argumentName, key)
    }

    function parse(args) {
        let result = new Map()
        let argumentNamesEncountered = new Set()
        let expectingValueForKey = null
        args.forEach(argument => {
            if (expectingValueForKey) {
                let key = expectingValueForKey
                result.set(key.name, key.parseValue(argument))
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
                let key = keyForName.get(argumentName)
                if (key.expectsValue) {
                    expectingValueForKey = key
                } else {
                    result.set(key.name, true)
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
                return result.get(key.argumentName)
            }
        }
    }

    return {
        option(argumentName) {
            return addKey(argumentName, true, false)
        },
        string(argumentName) {
            return addKey(argumentName, false, true)
        },
        optionalString(argumentName) {
            return addKey(argumentName, true, true)
        },
        int(argumentName) {
            return addKey(argumentName, false, true, int)
        },
        optionalInt(argumentName) {
            return addKey(argumentName, true, true, int)
        },
        number(argumentName) {
            return addKey(argumentName, false, true, number)
        },
        optionalNumber(argumentName) {
            return addKey(argumentName, true, true, number)
        },
        boolean(argumentName) {
            return addKey(argumentName, false, true, boolean)
        },
        optionalBoolean(argumentName) {
            return addKey(argumentName, true, true, boolean)
        },
        parse
    }
}

function int(text) {
    let result = number(text)
    if (result !== Math.floor(result)) {
        valueError("Not an integer number: [" + text + "]")
    }
    return result
}

function number(text, argumentName) {
    let result = Number(text)
    if (Number.isNaN(result)) {
        valueError(argumentName, "not a number: [" + text + "]")
    }
    return result
}

function boolean(text, argumentName) {
    switch (text) {
        case "true":
            return true
        case "false:":
            return false
        default:
            valueError(argumentName, "Not a boolean expression: [" + text + "], " +
                "expected values: true or false")
    }
}

function valueError(argumentName, errorMessage) {
    throw new Error("Illegal value for argument -" + argumentName + "]: " + errorMessage)
}