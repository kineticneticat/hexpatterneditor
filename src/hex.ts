import { NamedPatterns, NamedSpecialPatterns } from "./patterns";

export enum StartDir {
	E,
	SE,
	SW,
	W,
	NW,
	NE
}
export enum Angle {
	SHARP_LEFT = -2,
	SLIGHT_LEFT = -1,
	FORWARDS = 0,
	SLIGHT_RIGHT = 1,
	SHARP_RIGHT = 2,
	BACKWARDS = 3
}

export interface Pattern {
	startDir: StartDir,
	angleSig: Angle[]
}
export interface Iota {
	text: string
	tabs: number
	pattern?: Pattern
}

export function patternFromString(text: string): Pattern | undefined {
	return patternFromRep(text) ?? patternFromName(text);
}

export function patternFromRep(text: string): Pattern | undefined {
	const patternmatch = /<([ns]?[ew]),([qweasd]*)>/;
	const found = text.trim().match(patternmatch);
	if (found == null) {return undefined;}
	const startDir = ["e","se","sw","w","nw","ne"].indexOf(found[1]) as StartDir;
	const angleSig = found[2].split("").map(x => ["a", "q", "w", "e", "d", "s"].indexOf(x)-2) as Angle[];
	return {startDir: startDir, angleSig: angleSig};
}

export function patternFromName(text: string): Pattern | undefined {
	text = text.trim();
	if (NamedPatterns.has(text)) {
		return patternFromRep(NamedPatterns.get(text)!);
	}
	for (const key of NamedSpecialPatterns.keys()) {
		if (!text.startsWith(key)) {continue;}
		const handler = NamedSpecialPatterns.get(key)!;
		return handler(text);
	}
	return undefined;
}