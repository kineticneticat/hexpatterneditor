"use strict";
// import { Pattern } from "./hex";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = getNonce;
exports.iotaFromString = iotaFromString;
exports.parsePatterns = parsePatterns;
exports.reconstructFile = reconstructFile;
const hex_1 = require("./hex");
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
const tabmatcher = /^(\t*)/;
function iotaFromString(text) {
    const tabs = text.match(tabmatcher);
    if (tabs == null) {
        throw new Error("how");
    }
    const tabcount = tabs[1].length;
    return { text: text.trim(), tabs: tabcount, pattern: (0, hex_1.patternFromString)(text) };
}
function parsePatterns(text) {
    return text.split("\n").filter(x => x.trim() != "").map(x => iotaFromString(x));
}
function reconstructFile(iotas) {
    return iotas.map(x => "\t".repeat(x.tabs) + x.text).join("\n");
}
//# sourceMappingURL=util.js.map