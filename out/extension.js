"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const BackendEditor_1 = require("./BackendEditor");
const patterns_1 = require("./patterns");
function activate(context) {
    // Register our custom editor providers
    (0, patterns_1.initMaps)();
    context.subscriptions.push(BackendEditor_1.HexpatternEditorProvider.register(context));
}
//# sourceMappingURL=extension.js.map