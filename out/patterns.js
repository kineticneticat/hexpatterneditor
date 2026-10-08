"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedSpecialPatterns = exports.NamedPatterns = void 0;
exports.initMaps = initMaps;
const hex_1 = require("./hex");
function initMaps() {
    exports.NamedPatterns = new Map([
        ["Mind's Reflection", "<ne,qaq>"],
        ["Compass' Purification", "<e,aa>"],
        ["Compass' Purification II", "<ne,dd>"],
        ["Alidade's Purification", "<ne,wa>"],
        ["Archer's Distillation", "<e,wqaawdd>"],
        ["Architect's Distillation", "<e,weddwaa>"],
        ["Scout's Distillation", "<e,weaqa>"],
        ["Reveal", "<ne,de>"],
        ["Stadiometer's Purification", "<ne,awq>"],
        ["Pace Purification", "<e,wq>"],
        ["Media Reflection", "<w,dde>"],
        ["Additive Distillation", "<ne,waaw>"],
        ["Subtractive Distillation", "<nw,wddw>"],
        ["Multiplicative Distillation", "<se,waqaw>"],
        ["Division Distillation", "<ne,wdedw>"],
        ["Length Purification", "<ne,wqaqw>"],
        ["Power Distillation", "<nw,wedew>"],
        ["Floor Purification", "<e,ewq>"],
        ["Ceiling Purification", "<e,qwe>"],
        ["Vector Exaltation", "<e,eqqqqq>"],
        ["Vector Disintegration", "<e,qeeeee>"],
        ["Modulus Distillation", "<ne,addwaad>"],
        ["Axial Purification", "<nw,qqqqqaww>"],
        ["Entropy Reflection", "<nw,eqqq>"],
        ["True Reflection", "<se,aqae>"],
        ["False Reflection", "<ne,dedq>"],
        ["Nullary Reflection", "<e,d>"],
        ["Vector Reflection Zero", "<nw,qqqqq>"],
        ["Vector Reflection +X", "<nw,qqqqqea>"],
        ["Vector Reflection -X", "<ne,eeeeeqa>"],
        ["Vector Reflection +X", "<nw,qqqqqew>"],
        ["Vector Reflection -X", "<ne,eeeeeqw>"],
        ["Vector Reflection +X", "<nw,qqqqqed>"],
        ["Vector Reflection -X", "<ne,eeeeeqd>"],
        ["Circle's Reflection", "<nw,eawae>"],
        ["Arc's Reflection", "<ne,qdwdq>"],
        ["Euler's Reflection", "<e,aaq>"],
        ["Harmony Reflection", "<ne,wdded>"],
        ["Jester's Gambit", "<e,aawdd>"],
        ["Rotation Gambit", "<e,aaeaa>"],
        ["Rotation Gambit II", "<ne,ddqdd>"],
        ["Gemini Decomposition", "<e,aadaa>"],
        ["Prospector's Gambit", "<e,aaedd>"],
        ["Undertaker's Gambit", "<e,ddqaa>"],
        ["Gemini Gambit", "<e,aadaadaa>"],
        ["Dioscuri Gambit", "<e,aadadaaw>"],
        ["Flock's Reflection", "<nw,qwaeawqaeaqa>"],
        ["Fisherman's Gambit", "<w,ddad>"],
        ["Fisherman's Gambit II", "<e,aada>"],
        ["Swindler's Gambit", "<se,qaawdde>"],
        ["Augur's Purification", "<ne,aw>"],
        ["Negation Purification", "<nw,dw>"],
        ["Disjunction Distillation", "<se,waw>"],
        ["Conjunction Distillation", "<ne,wdw>"],
        ["Exclusion Distillation", "<nw,dwa>"],
        ["Augur's Exaltation", "<se,awdd>"],
        ["Equality Distillation", "<e,ad>"],
        ["Inequality Distillation", "<e,da>"],
        ["Maximus Distillation", "<se,e>"],
        ["Minumus Distillation", "<sw,q>"],
        ["Maximus Distillation II", "<se,ee>"],
        ["Minimus Distillation II", "<sw,qq>"],
        ["Similarity Distillation", "<e,wawdw>"],
        ["Dissimilarity Distillation", "<e,wdwaw>"],
        ["Sorter's Distillation", "<nw,qaeaqeqedqde>"],
        ["Stacking Distillation", "<nw,qaeaqewqedqde>"],
        ["Taxonomers Distillation", "<nw,aqaeqded>"],
        ["Surveyor's Distillation", "<nw,qqqqqeqeeeee>"],
        ["Inspector's Distillation", "<nw,qwawqwadadwewdwew>"],
        ["Entity Purification", "<se,qqqqqdaqa>"],
        ["Entity Purification: Animal", "<se,qqqqqdaqaawa>"],
        ["Entity Purification: Monster", "<se,qqqqqdaqaawq>"],
        ["Entity Purification: Item", "<se,qqqqqdaqaaww>"],
        ["Entity Purification: Player", "<se,qqqqqdaqaawe>"],
        ["Entity Purification: Living", "<se,qqqqqdaqaawd>"],
        ["Zone Distillation: Animal", "<se,qqqqqwdeddwa>"],
        ["Zone Distillation: Non-Animal", "<se,eeeeewaqaawa>"],
        ["Zone Distillation: Monster", "<se,qqqqqwdeddwq>"],
        ["Zone Distillation: Non-Monster", "<se,eeeeewaqaawq>"],
        ["Zone Distillation: Item", "<se,qqqqqwdeddww>"],
        ["Zone Distillation: Non-Item", "<se,eeeeewaqaaww>"],
        ["Zone Distillation: Player", "<se,qqqqqwdeddwe>"],
        ["Zone Distillation: Non-Player", "<se,eeeeewaqaawe>"],
        ["Zone Distillation: Living", "<se,qqqqqwdeddwd>"],
        ["Zone Distillation: Non-Living", "<se,eeeeewaqaawd>"],
        ["Zone Distillation: Any", "<se,qqqqqwded>"],
        ["Selection Distillation", "<nw,deeed>"],
        ["Seclection Exaltation", "<nw,qaeaqwded>"],
        ["Integration Distillation", "<sw,edqde>"],
        ["Derivation Decomposition", "<nw,qaeaq>"],
        ["Vacant Reflection", "<ne,qqaeaae>"],
        ["Single's Purification", "<e,adeeed>"],
        ["Retrograde Purification", "<e,qqqaede>"],
        ["Locator's Distillation", "<e,dedqde>"],
        ["Excisor's Distillation", "<sw,edqdewaqa>"],
        ["Surgeon's Exaltation", "<nw,wqaeaqw>"],
        ["Flock's Gambit", "<sw,ewdqdwe>"],
        ["Flock's Disintegration", "<nw,qwaeawq>"],
        ["Speaker's Distillation", "<se,ddewedd>"],
        ["Speaker's Decomposition", "<sw,aaqwqaa>"],
        ["Contemplation", "<se,wdeee>"],
        ["Introspection", "<w,qqq>"],
        ["{", "<w,qqq>"],
        ["Retrospection", "<e,eee>"],
        ["}", "<e,eee>"],
        ["Evanition", "<e,eeedw>"],
        ["Consideration", "<w,qqqaw>"],
        ["Interjection", "<e,aqqqqqwded>"],
        ["Meditation", "<w,qwdedwq>"],
        ["Recollection", "<e,ewaqawe>"],
        ["Scribe's Reflection", "<e,aqqqqq>"],
        ["Scribe's Gambit", "<e,deeeee>"],
        ["Chronicler's Purification", "<e,wawqwqwqwqwqw>"],
        ["Chronicler's Gambit", "<e,wdwewewewewew>"],
        ["Auditor's Reflection", "<e,aqqqqqe>"],
        ["Auditor's Purification", "<e,wawqwqwqwqwew>"],
        ["Assessor's Reflection", "<e,deeeeeq>"],
        ["Assessor's Purification", "<e,wdwewewewewewqw>"],
        ["Huginn's Gambit", "<nw,eqqwawqaaw>"],
        ["Muninn's Reflection", "<ne,qeewdweddw>"],
        ["Sine Purification", "<se,qqqqqaa>"],
        ["Cosine Purification", "<se,qqqqqad>"],
        ["Tangent Purification", "<sw,wqqqqqadq>"],
        ["Inverse Sine Purification", "<se,ddeeeee>"],
        ["Inverse Cosine Purification", "<ne,adeeeee>"],
        ["Inverse Tangent Purification", "<ne,eadeeeeew>"],
        ["Inverse Tangent Distillation", "<w,deadeeeeewd>"],
        ["Logarithmic Distillation", "<nw,eqaqe>"],
        ["Uniqueness Purification", "<ne,aweaqa>"],
        ["Hermes' Gambit", "<se,deaqq>"],
        ["Iris' Gambit", "<nw,qwaqde>"],
        ["Thoth's Gambit", "<ne,dadad>"],
        ["Charon's Gambit", "<sw,aqdee>"],
        ["Thanatos' Reflection", "<se,qqaed>"],
        ["Waystone Reflection", "<sw,eaqwqae>"],
        ["Lodestone Reflection", "<sw,eaqwqaewede>"],
        ["Lesser Fold Reflection", "<sw,eaqwqaewdd>"],
        ["Greater Fold Reflection", "<w,aqwqawaaqa>"],
        ["Akasha's Distillation", "<w,qqqwqqqqqaq>"],
        ["Akasha's Gambit", "<e,eeeweeeeede>"],
        ["Explosion", "<e,aawaawaa>"],
        ["Fireball", "<e,ddwddwdd>"],
        ["Impulse", "<sw,awqqqwaqw>"],
        ["Blink", "<sw,awqqqwaq>"],
        ["Make Note", "<w,adaa>"],
        ["Place Block", "<sw,eeeeede>"],
        ["Break Block", "<e,qaqqqqq>"],
        ["Create Water", "<se,aqawqadaq>"],
        ["Destroy Liquid", "<sw,dedwedade>"],
        ["Conjure Block", "<nw,qqa>"],
        ["Conjure Light", "<nw,qqd>"],
        ["Overgrowth", "<nw,wqaqwawqaqw>"],
        ["Edify", "<nw,wqaqwd>"],
        ["Ignite", "<se,aaqawawa>"],
        ["Extingish Area", "<sw,ddedwdwd>"],
        ["White Sun's Nadir", "<nw,qqqqqaqwawaw>"],
        ["Blue Sun's Nadir", "<w,qqqqqawwawawd>"],
        ["Black Sun's Nadir", "<sw,qqqqqawwdwdww>"],
        ["Red Sun's Nadir", "<se,qqqqqadwawaww>"],
        ["Green Sun's Nadir", "<se,qqqqqadwawaw>"],
        ["Craft Trinket", "<e,waqqqqq>"],
        ["Craft Cypher", "<e,wwaqqqqqeaqeaeqqqeaeq>"],
        ["Craft Artifact", "<e,wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq>"],
        ["Recharge Item", "<nw,qqqqqwaeaeaeaea>"],
        ["Erase Item", "<e,qdqawwaww>"],
        ["Summon Sentinel", "<e,waeawae>"],
        ["Banish Sentinel", "ne,qdwdqdw"],
        ["Locate Sentinel", "<e,waeawaede>"],
        ["Wayfind Sentinel", "<e,waeawaedwa>"],
        ["Internalise Pigment", "<e,awddwqawqwawq>"],
        ["Caster's Glamour", "<w,dwaawedwewdwe>"],
        ["Anchorite's Flight", "<sw,awawaawq>"],
        ["Wayfarer's Flight", "<ne,dwdwdewq>"],
        ["Aviator's Purification", "<ne,dwdwdewqded>"],
    ]);
    exports.NamedSpecialPatterns = new Map([
        ["Numerical Reflection", (name) => {
                let val = parseFloat(name.slice("Numerical Reflection: ".length));
                // only handle ints for now, cant be bothered setting up the proper maths
                const negative = val < 0;
                val = negative ? -val : val;
                let sig = [];
                while (val != 0) {
                    if (Math.trunc(val / 2) == val / 2) {
                        sig.push(hex_1.Angle.SHARP_LEFT);
                        val /= 2;
                    }
                    else {
                        sig.push(hex_1.Angle.FORWARDS);
                        val -= 1;
                    }
                }
                const start = negative ? hex_1.StartDir.NE : hex_1.StartDir.SE;
                sig = (negative ? [hex_1.Angle.SHARP_RIGHT, hex_1.Angle.SLIGHT_RIGHT, hex_1.Angle.SHARP_RIGHT, hex_1.Angle.SHARP_RIGHT] : [hex_1.Angle.SHARP_LEFT, hex_1.Angle.SLIGHT_LEFT, hex_1.Angle.SHARP_LEFT, hex_1.Angle.SHARP_LEFT]).concat(sig.reverse());
                return { startDir: start, angleSig: sig };
            }],
        ["Bookkeeper's Gambit", name => {
                const str = name.slice("Bookkeeper's Gambit: ".length);
                if (str.length == 0) {
                    throw new Error("Cant handle Bookkeper's with no mask!");
                }
                if (!str.split("").every(x => x == "v" || x == "-")) {
                    throw new Error("");
                }
                let ptr = 0;
                const startdir = str[ptr] == "v" ? hex_1.StartDir.SE : hex_1.StartDir.E;
                const sig = str[ptr] == "v" ? [hex_1.Angle.SHARP_LEFT] : [];
                let prev = str[ptr];
                ptr++;
                for (; ptr < str.length; ptr++) {
                    if (prev == "v") {
                        if (str[ptr] == "v") {
                            sig.push(hex_1.Angle.SHARP_RIGHT, hex_1.Angle.SHARP_LEFT);
                        }
                        else {
                            sig.push(hex_1.Angle.SLIGHT_RIGHT);
                        }
                    }
                    else {
                        if (str[ptr] == "v") {
                            sig.push(hex_1.Angle.SLIGHT_RIGHT, hex_1.Angle.SHARP_LEFT);
                        }
                        else {
                            sig.push(hex_1.Angle.FORWARDS);
                        }
                    }
                    prev = str[ptr];
                }
                return { startDir: startdir, angleSig: sig };
            }]
    ]);
}
//# sourceMappingURL=patterns.js.map