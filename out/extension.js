"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const catScratchEditor_1 = require("./catScratchEditor");
const patterns_1 = require("./patterns");
function activate(context) {
    // Register our custom editor providers
    (0, patterns_1.initMaps)();
    context.subscriptions.push(catScratchEditor_1.CatScratchEditorProvider.register(context));
}
//# sourceMappingURL=extension.js.map