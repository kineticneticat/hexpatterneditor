import * as vscode from 'vscode';
import { CatScratchEditorProvider } from './catScratchEditor';
import { initMaps } from './patterns';

export function activate(context: vscode.ExtensionContext) {
	// Register our custom editor providers
	initMaps();
	context.subscriptions.push(CatScratchEditorProvider.register(context));
}
