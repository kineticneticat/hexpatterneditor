"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angle = exports.StartDir = void 0;
exports.patternFromString = patternFromString;
exports.patternFromRep = patternFromRep;
exports.patternFromName = patternFromName;
const patterns_1 = require("./patterns");
var StartDir;
(function (StartDir) {
    StartDir[StartDir["E"] = 0] = "E";
    StartDir[StartDir["SE"] = 1] = "SE";
    StartDir[StartDir["SW"] = 2] = "SW";
    StartDir[StartDir["W"] = 3] = "W";
    StartDir[StartDir["NW"] = 4] = "NW";
    StartDir[StartDir["NE"] = 5] = "NE";
})(StartDir || (exports.StartDir = StartDir = {}));
var Angle;
(function (Angle) {
    Angle[Angle["SHARP_LEFT"] = -2] = "SHARP_LEFT";
    Angle[Angle["SLIGHT_LEFT"] = -1] = "SLIGHT_LEFT";
    Angle[Angle["FORWARDS"] = 0] = "FORWARDS";
    Angle[Angle["SLIGHT_RIGHT"] = 1] = "SLIGHT_RIGHT";
    Angle[Angle["SHARP_RIGHT"] = 2] = "SHARP_RIGHT";
    Angle[Angle["BACKWARDS"] = 3] = "BACKWARDS";
})(Angle || (exports.Angle = Angle = {}));
function patternFromString(text) {
    return patternFromRep(text) ?? patternFromName(text);
}
function patternFromRep(text) {
    const patternmatch = /<([ns]?[ew]),([qweasd]*)>/;
    const found = text.trim().match(patternmatch);
    if (found == null) {
        return undefined;
    }
    const startDir = ["e", "se", "sw", "w", "nw", "ne"].indexOf(found[1]);
    const angleSig = found[2].split("").map(x => ["a", "q", "w", "e", "d", "s"].indexOf(x) - 2);
    return { startDir: startDir, angleSig: angleSig };
}
function patternFromName(text) {
    text = text.trim();
    if (patterns_1.NamedPatterns.has(text)) {
        return patternFromRep(patterns_1.NamedPatterns.get(text));
    }
    for (const key of patterns_1.NamedSpecialPatterns.keys()) {
        if (!text.startsWith(key)) {
            continue;
        }
        const handler = patterns_1.NamedSpecialPatterns.get(key);
        return handler(text);
    }
    return undefined;
}
//# sourceMappingURL=hex.js.map