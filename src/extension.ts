import * as vscode from 'vscode';
import { HexpatternEditorProvider } from './BackendEditor';
import { initMaps } from './patterns';

export function activate(context: vscode.ExtensionContext) {
	// Register our custom editor providers
	initMaps();
	context.subscriptions.push(HexpatternEditorProvider.register(context));
}
