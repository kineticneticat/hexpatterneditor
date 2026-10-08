// import { Pattern } from "./hex";

import {Iota, patternFromString} from "./hex";
export function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

const tabmatcher = /^(\t*)/;
export function iotaFromString(text: string): Iota {
	const tabs = text.match(tabmatcher);
	if (tabs == null) {throw new Error("how");}
	const tabcount = tabs[1].length;
	
	return {text: text.trim(), tabs: tabcount, pattern: patternFromString(text)};
}

export function parsePatterns(text: string): (Iota)[] {
	return text.split("\n").filter(x => x.trim() != "").map(x => iotaFromString(x));
}

export function reconstructFile(iotas: Iota[]) {
	return iotas.map(x=>"\t".repeat(x.tabs) +  x.text).join("\n");
}