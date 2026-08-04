//brainrot lang v1.0.0 by Jake Hagler

// Install and config libraries
const fs = require("fs");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const { type } = require("os");

// Returns error for invalid usage
if (process.argv.length < 3) {
    console.error("Error: Invalid usage. Use -h for help.");
    process.exit(1);
}

// Returns version or help if requested
if (process.argv[2].startsWith("-")) {
    switch (process.argv[2]) {
        case "-v":
            console.log("brainrot v1.0.0");
            process.exit(0);
            break;
        case "-h":
            console.log("Usage: brainrot <file>\nOr: brainrot <cmd>\nCommands consist of -v (version), -h (help), and -p <file> (parse)\nDocumentation at https://sites.google.com/view/brainrotlang");
            process.exit(0);
            break;
        case "-p":
            if (!process.argv[3].endsWith(".tung")) {
                console.error("Error: File must end in .tung");
            } else if (!fs.existsSync(process.argv[3])) {
                console.error("Error: File does not exist");
            } else {
                console.log("Parsed tokens: " + JSON.stringify(parse(fs.readFileSync(process.argv[3], "utf8"))).slice(1, -1));
            }
            process.exit(0);
            break;
        default:
            console.error("Error: Unknown command. Use -h for help.");
            process.exit(0);
            break;
    }
}

if (!process.argv[2].endsWith(".tung")) {
    console.error("Error: File must end in .tung");
} else if (!fs.existsSync(process.argv[2])) {
    console.error("Error: File does not exist");
}

// Reads the program file
const file = fs.readFileSync(process.argv[2], "utf8");

// Parses and interprets the program
interpret(parse(file), {}, {});

// Parses the input into tokens
function parse(prgm) {
    const tokens = [];
    const words = prgm.toLowerCase().split(/\s+/); // Splits the prgm into words based on whitespace

    for (let index = 0; index < words.length; index++) {
        if (words[index].startsWith("tung")) {
            if (!words[index].endsWith("sahur")) {
                console.error("Error: Invalid tung syntax - must end in 'sahur' @word " + index);
                process.exit(1);
            }
            tokens.push({ type: "int", "value": words[index].split("tung").length - 1 });
        } else if (words[index].startsWith("6")) {
            let str = ""
            if (words[index].endsWith("7")) {
                str = words[index].slice(1, -1);
            } else {
                str += words[index].slice(1);
                for (index++; index < words.length && !words[index].endsWith("7"); index++) {
                    str += (" " + words[index]);
                }
                str += " " + words[index].slice(0, -1);
            }
            tokens.push({ type: "str", value: str });
        } else if (words[index] === "alpha") {
            tokens.push({ type: "bool", value: true });
        } else if (words[index] === "beta") {
            tokens.push({ type: "bool", value: false });
        } else if (words[index] === "fanumtax") {
            tokens.push({ type: "op", value: "sub" });
        } else if (words[index] === "rizz") {
            tokens.push({ type: "op", "value": "add" });
        } else if (words[index] === "skibidifanumtax") {
            tokens.push({ type: "op", "value": "div" });
        } else if (words[index] === "skibidirizz") {
            tokens.push({ type: "op", "value": "mul" });
        } else if (words[index] === "skibiditoiletrizz") {
            tokens.push({ type: "op", value: "exp" })
        } else if (words[index] === "skibiditoiletfanumtax") {
            tokens.push({ type: "op", value: "nrt" })
        } else if (words[index] === "tralalero") {
            tokens.push({ type: "op", value: "equ" });
        } else if (words[index] === "tralala") {
            tokens.push({ type: "op", value: "not" });
        } else if (words[index].startsWith("sybau")) {
            // Ignores words starting with sybau, effectively making them comments
        } else {
            tokens.push({ type: "cmd", "value": words[index] });
        }
    }

    //console.log("tokens: " + JSON.stringify(tokens)); // Debugging
    return tokens;
}

// Executes the script using an interpreter
async function interpret(tokens, args, global = {}) {
    let local = Object.assign({}, args); // Stores local variables and functions
    for (let i = 0; i < tokens.length; i++) {
        //console.log("(interpret)" + "[token#" + i + "]" + " token: " + JSON.stringify(tokens[i])); // Debugging
        if (tokens[i].type !== "cmd") {
            console.error("Error: Invalid syntax - statements must begin with a command:" + tokens[i].value + " @token " + i);
            process.exit(1);
        } else {
            switch (tokens[i].value) {
                case "mew":
                    i++;
                    //console.log("Printing using mew syntax"); // Debugging
                    console.log(await arg());
                    break;
                case "edge":
                    i++;
                    const varName = tokens[i].value;
                    i++;
                    local[varName] = await arg();
                    //console.log("Variable " + varName + " set to " + local[varName]); // Debugging
                    break;
                case "sigma":
                    i++;
                    const funcName = tokens[i].value;
                    let funcValue = { args: [], content: [] };
                    for (i++; tokens[i].value.startsWith("uwu"); i++) {
                        funcValue.args.push(tokens[i].value.slice(3));
                    }
                    for (let n = 0; n > 0 || tokens[i].value !== "putthefriesinthebag"; i++) {
                        if (tokens[i].value === "ballerina" || tokens[i].value === "sigma") {
                            n++;
                        } else if (tokens[i].value === "putthefriesinthebag") {
                            n--;
                        }
                        funcValue.content.push(tokens[i]);
                    }
                    local[funcName] = funcValue;
                    //console.log("Funcion created: " + funcName + ": " + JSON.stringify(funcValue)); // Debugging
                    break;
                case "gyatt":
                    i++;
                    const titleIndex = i + 1;
                    const funcToCall = tokens[i].value;
                    //console.log("calling function: " + funcToCall); // Debugging
                    let passingArgs = {};
                    for (i++; i < tokens.length && tokens[i].type !== "cmd"; i++) {
                        passingArgs[local[funcToCall].args[i - titleIndex]] = tokens[i].value;
                        //console.log(`passing the argument ${local[funcToCall].args[i - titleIndex]} as ${tokens[i].value}`)
                    }
                    await interpret(local[funcToCall].content, Object.assign({}, passingArgs, local), local);
                    i--;
                    break;
                case "ballerina":
                    i++;
                    if (await arg(true)) {
                        let block = [];
                        for (let n = 0; n > 0 || tokens[i].value !== "putthefriesinthebag"; i++) {
                            if (tokens[i].value === "ballerina" || tokens[i].value === "sigma") {
                                n++;
                            } else if (tokens[i].value === "putthefriesinthebag") {
                                n--;
                            }
                            block.push(tokens[i]);
                        }
                        await interpret(block, local, local);
                    } else {
                        for (let n = 0; n > 0 || tokens[i].value !== "putthefriesinthebag"; i++) {
                            if (tokens[i].value === "ballerina" || tokens[i].value === "sigma") {
                                n++;
                            } else if (tokens[i].value === "putthefriesinthebag") {
                                n--;
                            }
                        }
                    }
                    break;
                case "noscreentime":
                    process.exit(0);
                    break;
                default:
                    console.error("Error: Unknown command: " + tokens[i].value + " @token " + i);
                    process.exit(1);
            }
        }

        Object.assign(global, local);

        // evaluates expressions and calls variables
        async function arg(forConditional = false) {
            let final = 0;
            for (; i < tokens.length; i++) {
                //console.log("(arg)" + "[token#" + i + "]" + " token: " + JSON.stringify(tokens[i])); // Debugging
                if (forConditional && tokens[i].value === "cappuccina") {
                    i++;
                    return final;
                } else if (tokens[i].value === "ohio") {
                    i++;
                    final = local[tokens[i].value];
                    //console.log("final set to " + local[tokens[i].value] + "(arg)"); // Debugging
                } else if (tokens[i].value === "delulu") {
                    const rl = readline.createInterface({ input, output });
                    const ans = await rl.question(">");
                    if (!Number.isNaN(Number(ans))) {
                        final = Number(ans);
                    } else {
                        final = ans;
                    }
                    rl.close();
                } else if (tokens[i].type === "int" || tokens[i].type === "bool" || tokens[i].type == "str") {
                    final = tokens[i].value;
                } else if (tokens[i].type === "op") {
                    const left = final;
                    const op = tokens[i].value;
                    i++;
                    let right = 0;
                    if (tokens[i].value !== "ohio") {
                        right = tokens[i].value;
                        //console.log("right val in op: (constant)" + right); // Debugging
                    } else {
                        i++;
                        right = local[tokens[i].value];
                        //console.log("right val in op: (var) " + right); // Debugging
                    }

                    //console.log(`Computing operation: ${left} ${op} ${right}`);

                    switch (op) {
                        case "add":
                            final = left + right;
                            break;
                        case "sub":
                            final = left - right;
                            break;
                        case "mul":
                            final = left * right;
                            break;
                        case "div":
                            final = left / right;
                            break;
                        case "equ":
                            final = (left === right);
                            break;
                        case "not":
                            final = (left !== right);
                            break;
                        case "exp":
                            final = left ** right;
                            break;
                        case "nrt":
                            final = left ** (1 / right);
                            break;
                    }
                } else {
                    //console.log("Next token: " + JSON.stringify(tokens[i])); // Debugging
                    i--;
                    return final;
                }
            }
            // If the loop ends without returning (only posible when i overflows outside of token array), it returns the final value
            //console.log("out of for loop (arg)") // Debugging
            return final;
        }
    }
}