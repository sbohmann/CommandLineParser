import Parser from './commandLineParser.js'

let parser = Parser()

parser.int("a")
parser.parse(process.argv.slice(2))
