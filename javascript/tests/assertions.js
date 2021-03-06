import assert from "assert"

export function assertThrows(code, expectedTextPart) {
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
