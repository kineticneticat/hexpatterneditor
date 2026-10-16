const edgeLength = 30
const padding = 5
const strokeStyle = "white"
const curvePercent = 0.2
const markWidth = 5

interface Pattern {
	startDir: number,
	angleSig: number[]
}
interface Iota {
	text: string,
	tabs: number,
	pattern?: Pattern
}
type Modifiers = {ctrl:boolean, shift: boolean, alt: boolean}
function patternCount() { return document.getElementById("patterns")!.getElementsByClassName("pattern")!.length}

interface SelCtx {
	state: SelectState, 
	handle<T extends any[]>(statemethod: (...args: T) => SelectState, ...args: T): void
	onEnter(modifiers: Modifiers): void
	onEscape(modifiers: Modifiers): void
	onLeftArrow(modifiers: Modifiers): void
	onRightArrow(modifiers: Modifiers): void
	onUpArrow(modifiers: Modifiers): void
	onDownArrow(modifiers: Modifiers): void
	onClickPattern(pos: number, modifiers: Modifiers): void
	onClickGap(pos: number, modifiers: Modifiers): void
}

abstract class SelectState {
	onEnter(modifiers: Modifiers): SelectState { return this }
	onEscape(modifiers: Modifiers): SelectState { return new NoSel() }
	onLeftArrow(modifiers: Modifiers): SelectState { return this }
	onRightArrow(modifiers: Modifiers): SelectState { return this }
	onUpArrow(modifiers: Modifiers): SelectState { return this }
	onDownArrow(modifiers: Modifiers): SelectState { return this }
	onClickPattern(pos: number, modifiers: Modifiers): SelectState { return new RangeSel(pos, pos) }
	onClickGap(pos: number, modifiers: Modifiers): SelectState { return new CaretSel(pos) }
	enter() {}
	exit() {}
	render(container: HTMLDivElement) {}
	anchorElement(container: HTMLDivElement): HTMLElement { return container}
}
class NoSel extends SelectState {}
class CaretSel extends SelectState {
	static left(caretPos: number) {return caretPos}
	static right(caretPos: number) {return caretPos+1}
	constructor(public pos: number) {super()}
	onEnter(modifiers: Modifiers): SelectState {
		return new Editing(this)
	}
	onLeftArrow(modifiers: Modifiers): SelectState {
		if (modifiers.shift && modifiers.ctrl && this.pos != -1) return new RangeSel(this.pos, -1)
		if (modifiers.shift && this.pos != -1) return new RangeSel(this.pos, this.pos-1)
		if (modifiers.ctrl) return new CaretSel(-1)
		return new CaretSel(Math.max(this.pos-1, -1))
	}
	onRightArrow(modifiers: Modifiers): SelectState {
		let count = patternCount()
		if(modifiers.shift && modifiers.ctrl && this.pos != count-1) return new RangeSel(this.pos, count-1)
		if(modifiers.shift && this.pos != count-1) return new RangeSel(this.pos, this.pos +1)
		if (modifiers.ctrl) return new CaretSel(count-1)
		return new CaretSel(Math.min(this.pos+1, count-1))
	}
	onClickGap(pos: number, modifiers: Modifiers): SelectState {
		if (!modifiers.shift) return new CaretSel(pos)
		return new RangeSel(this.pos, pos)
	}
	onClickPattern(pos: number, modifiers: Modifiers): SelectState {
		if (!modifiers.shift) return new RangeSel(pos-1, pos)
		return new RangeSel(this.pos, pos >= CaretSel.right(this.pos) ? pos : pos-1)
	}
	render(container: HTMLDivElement) {
		let gutters = container.getElementsByClassName("gutter")
		Array.prototype.forEach.call(gutters, x => x.classList.remove("caret"))
		console.log(gutters)
		gutters[this.pos+1].classList.add("caret")
	}
	exit() {
		let container = document.getElementById("patterns")!
		Array.prototype.forEach.call(container.getElementsByClassName("gutter"), (x: HTMLDivElement) => {
			x.classList.remove("caret")
		})
	}
}
class RangeSel extends SelectState {
	constructor(public anchor: number, public hook: number) {super()}
	get start() {return Math.min(CaretSel.right(this.anchor), CaretSel.right(this.hook))}
	get end() {return Math.max(CaretSel.left(this.anchor), CaretSel.left(this.hook))}
	onEnter(modifiers: Modifiers): SelectState {
		return new Editing(this)
	}
	onLeftArrow(modifiers: Modifiers): SelectState {
		if (modifiers.shift && modifiers.ctrl) return new RangeSel(this.anchor, -1)
		if (modifiers.shift) {
			if (Math.max(this.hook-1, -1) == this.anchor) return new CaretSel(this.anchor)
			return new RangeSel(this.anchor, Math.max(this.hook-1, -1))
		}
		if (modifiers.ctrl) return new CaretSel(-1)
		return new CaretSel(this.start-1)
	}
	onRightArrow(modifiers: Modifiers): SelectState {
		let count = patternCount()
		if (modifiers.shift && modifiers.ctrl) return new RangeSel(this.anchor, count-1)
		if (modifiers.shift) {
			if (Math.min(this.hook+1, count-1) == this.anchor) return new CaretSel(this.anchor)
			return new RangeSel(this.anchor, Math.min(this.hook+1, count-1))
		}
		if (modifiers.ctrl) return new CaretSel(count-1)
		return new CaretSel(this.end)
	}
	onClickPattern(pos: number, modifiers: Modifiers): SelectState {
		if (!modifiers.shift) return new RangeSel(pos-1, pos)
		return new RangeSel(this.anchor, pos >= CaretSel.right(this.anchor) ? pos : pos-1)
	}
	onClickGap(pos: number, modifiers: Modifiers): SelectState {
		if (!modifiers.shift) return new CaretSel(pos)
		return new RangeSel(this.anchor, pos)
	}
	exit() {
		let container = document.getElementById("patterns")!
		Array.prototype.forEach.call(container.getElementsByClassName("pattern"), (x: HTMLDivElement) => x.classList.remove("highlight"))
		Array.prototype.forEach.call(container.getElementsByClassName("gutter"), (x: HTMLDivElement) => x.classList.remove("caret"))
	}
	render(container: HTMLDivElement) {
		let divs = container.getElementsByClassName("pattern") as HTMLCollectionOf<HTMLDivElement>
		Array.prototype.forEach.call(divs, (x: HTMLDivElement) => {x.classList.remove("highlight")})
		for (let i = this.start; i <= this.end; i++) {
			divs.item(i)?.classList.add("highlight")
		}
		let gutters = container.getElementsByClassName("gutter") as HTMLCollectionOf<HTMLDivElement>
		gutters[this.hook+1].classList.add("caret")
	}
}

class Editing extends SelectState {
	constructor(public target: SelectState) {super()}
	onEscape(modifiers: Modifiers): SelectState {
		return this.target
	}
	render(container: HTMLDivElement) {
		let anchor = this.target.anchorElement(container)
		let box = document.createElement
	} 
}

const selCtx = {
	state: new NoSel(),
	handle<T extends any[]>(statemethod: (...args: T) => SelectState, ...args: T) {
		let newState = statemethod.call(this.state, ...args)
		if (newState !== this.state) {
			this.state.exit()
			this.state = newState
			this.state.enter()
		}
		console.log(this.state)
		this.state.render(document.getElementById('patterns')! as HTMLDivElement)
	},
	onEnter(modifiers: Modifiers) { this.handle(this.state.onEscape, modifiers) },
	onEscape(modifiers: Modifiers) { this.handle(this.state.onEscape, modifiers) },
	onLeftArrow(modifiers: Modifiers) { this.handle(this.state.onLeftArrow, modifiers) },
	onRightArrow(modifiers: Modifiers) { this.handle(this.state.onRightArrow,modifiers) },
	onUpArrow(modifiers: Modifiers) { this.handle(this.state.onUpArrow,modifiers) },
	onDownArrow(modifiers: Modifiers) { this.handle(this.state.onDownArrow, modifiers) },
	onClickPattern(pos: number, modifiers: Modifiers) { this.handle(this.state.onClickPattern, pos, modifiers) },
	onClickGap(pos: number, modifiers: Modifiers) { this.handle(this.state.onClickGap, pos, modifiers) },
} as SelCtx


class Vec {

	static zero() {return new Vec(0,0)}

	constructor(public x: number, public y: number) {}
	add(that: Vec) {return new Vec(this.x + that.x, this.y + that.y)}
	sub(that: Vec) {return new Vec(this.x - that.x, this.y - that.y)}
	mul(that: number) {return new Vec(this.x * that, this.y*that)}
	div(that: number) {return new Vec(this.x / that, this.y/that)}

	get mag() {return (this.x**2 + this.y**2)**0.5}
	unit() {return this.div(this.mag)}

	get xy(): [number, number] {return [this.x, this.y]}
	static Tolerance = 0.001

	tolerates(that: Vec) { return Math.abs(this.x-that.x) < Vec.Tolerance && Math.abs(this.y-that.y) < Vec.Tolerance}

}


// function patternString(pattern: Pattern) {
// 	const dir = ["e", "se", "sw", "w", "nw", "ne"][pattern.startDir]
// 	const angles = pattern.angleSig.map(x => "aqweds"[x+2]).join("")
// 	return `<${dir},${angles}>`
// }

function coerce(facing: number) {
	if (facing < 0) {return coerce(facing + 6)}
	else if (facing > 5) {return coerce(facing - 6)}
	else {return facing}
}


function expandAABB(pos: Vec, aabb: {minx:number,miny:number,maxx:number,maxy:number}) {
	if (pos.x < aabb.minx) { aabb.minx = pos.x }
	if (pos.y < aabb.miny) { aabb.miny = pos.y }
	if (pos.x > aabb.maxx) { aabb.maxx = pos.x }
	if (pos.y > aabb.maxy) { aabb.maxy = pos.y }
	return aabb
}

const stringify = (vec: Vec) =>  `${Math.round(vec.x*1000)/1000}|${Math.round(vec.y*1000)/1000}`

function findTouchies(pattern: Pattern) {
	const count = new Map<string, number>()
	
	let facing = pattern.startDir
	let pos = Vec.zero()
	count.set(stringify(pos), 1)
	const delta = new Vec(
		Math.cos(facing * Math.PI/3)*edgeLength, 
		Math.sin(facing * Math.PI/3)*edgeLength
	)
	pos = pos.add(delta)
	count.set(stringify(pos), 1)
	
	for (const angle of pattern.angleSig) {
		facing = coerce(facing + angle)
		const delta = new Vec(
			Math.cos(facing * Math.PI/3)*edgeLength, 
			Math.sin(facing * Math.PI/3)*edgeLength
		)
		pos = pos.add(delta)
		count.set(stringify(pos), (count.get(stringify(pos)) ?? 0) + 1)
	}

	return count
}

function findPatternSize(pattern: Pattern) {
	let aabb = {minx:0,miny:0,maxx:0,maxy:0}

	let facing = pattern.startDir
	let pos = Vec.zero()
	const delta = new Vec(
		Math.cos(facing * Math.PI/3)*edgeLength, 
		Math.sin(facing * Math.PI/3)*edgeLength
	)
	pos = pos.add(delta)

	aabb = expandAABB(pos, aabb)
	
	for (const angle of pattern.angleSig) {
		facing = coerce(facing + angle)
		const delta = new Vec(
			Math.cos(facing * Math.PI/3)*edgeLength, 
			Math.sin(facing * Math.PI/3)*edgeLength
		)
		pos = pos.add(delta)
		aabb = expandAABB(pos, aabb)
	}

	return aabb
}

function drawPattern(ctx: CanvasRenderingContext2D, pattern: Pattern) {
	const aabb = findPatternSize(pattern)
	aabb.minx -= padding
	aabb.miny -= padding
	aabb.maxx += padding
	aabb.maxy += padding
	ctx.canvas.width = Math.abs(aabb.maxx - aabb.minx)
	ctx.canvas.height = Math.abs(aabb.maxy - aabb.miny)

	const count = findTouchies(pattern)

	let facing = pattern.startDir
	const offset = new Vec(-aabb.minx, -aabb.miny)
	let pos = new Vec(-aabb.minx, -aabb.miny)
	ctx.beginPath()
	let forwards = new Vec(
		Math.cos(facing * Math.PI/3), 
		Math.sin(facing * Math.PI/3)
	)
	let left = new Vec(-forwards.y, forwards.x)
	const curveDist = curvePercent * edgeLength 

	ctx.moveTo(...pos.add(forwards.mul(curveDist)).add(left.mul(markWidth/2)).xy)
	ctx.lineTo(...pos.add(forwards.mul(curveDist)).sub(left.mul(markWidth/2)).xy)

	ctx.moveTo(...pos.add(forwards.mul(curveDist)).xy)
	pos = pos.add(forwards.mul(edgeLength))
	ctx.lineTo(...pos.sub(forwards.mul(curveDist)).xy)

	for (const angle of pattern.angleSig) {
		facing = coerce(facing + angle)
		forwards = new Vec(
			Math.cos(facing * Math.PI/3), 
			Math.sin(facing * Math.PI/3)
		)
		left = new Vec(-forwards.y, forwards.x)
		ctx.quadraticCurveTo(...pos.xy, ...pos.add(forwards.mul(curveDist)).xy)

		// todo: only draw mark if this line is the only one passing through this vertex
		if (angle == 0 && count.get(stringify(pos.sub(offset))) ==1 ) {
			ctx.moveTo(...pos.add(left.mul(markWidth/2)).xy)
			ctx.lineTo(...pos.sub(left.mul(markWidth/2)).xy)
			ctx.moveTo(...pos.add(forwards.mul(curveDist)).xy)
		}

		pos = pos.add(forwards.mul(edgeLength))
		ctx.lineTo(...pos.sub(forwards.mul(curveDist)).xy)
	}

	ctx.lineTo(...pos.sub(forwards.mul(curveDist*2).add(left.mul(markWidth/2))).xy)
	ctx.moveTo(...pos.sub(forwards.mul(curveDist*2).sub(left.mul(markWidth/2))).xy)
	ctx.lineTo(...pos.sub(forwards.mul(curveDist)).xy)

	ctx.strokeStyle = strokeStyle
	ctx.stroke()
	
}

function makePatternDiv(iota: Iota, idx: number) {
	const div = document.createElement("div")
	div.classList.add("pattern")
	div.setAttribute("name", iota.text)
	div.setAttribute("idx", idx.toString())
	let canvas = document.createElement("canvas")
	let ctx = canvas.getContext("2d")
	if (ctx == null) {throw new Error(`null ctx`)}
	if (iota.pattern == undefined) {
		ctx.font = "24px Arial"
		const metrics = ctx.measureText(iota.text)
		canvas.width = metrics.width
		canvas.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
		ctx.fillStyle = "red"
		ctx.fillText(iota.text, 0, 0)
	} else {
		drawPattern(ctx, iota.pattern)
	}
	div.appendChild(canvas)
	let gutter = document.createElement("div")
	gutter.classList.add("gutter")
	gutter.setAttribute("idx", idx.toString())
	div.appendChild(gutter)
	gutter.append(document.createElement("div"))
	
	return div

}

// Script run within the webview itself.
(function () {

	// Get a reference to the VS Code webview api.
	// We use this API to post messages back to our extension.

	const vscode = acquireVsCodeApi()

	const patternContainer = document.getElementById('patterns')! as HTMLDivElement
	patternContainer.addEventListener("click", e => {
		let target = e.target! as HTMLElement
		// console.log(target)
		let modifiers = {ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey} as Modifiers
		if (target.tagName == "CANVAS") {
			selCtx.onClickPattern(parseInt(target.parentElement!.getAttribute("idx") ?? "0"), modifiers)
		} else if (target.classList.contains("gutter") || target.parentElement?.classList?.contains("gutter")) {
			selCtx.onClickGap(parseInt(target.getAttribute("idx") ?? target.parentElement?.getAttribute("idx") ?? "0"), modifiers)
		}
	})
	patternContainer.addEventListener("keydown", e => {
		let modifiers = {ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey} as Modifiers
		switch (e.code) {
			case "Escape":
				selCtx.onEscape(modifiers)
				e.preventDefault()
				break
			case "ArrowLeft":
				selCtx.onLeftArrow(modifiers)
				e.preventDefault()
				break
			case "ArrowRight":
				selCtx.onRightArrow(modifiers)
				e.preventDefault()
				break
			
		}
	})

	/**
	 * Render the document in the webview.
	 */
	function updateContent(iotas: Iota[]) {
		// patternContainer.style.display = ''
		// patternContainer.textContent = patterns[0]
		patternContainer.innerHTML = ""
		let firstGutter = document.createElement("div")
		firstGutter.classList.add("gutter")
		firstGutter.setAttribute("idx", "-1")
		firstGutter.appendChild(document.createElement("div"))
		patternContainer.appendChild(firstGutter)
		for (const idx in iotas) {
			const pattern = iotas[idx]
			patternContainer.appendChild(makePatternDiv(pattern, parseInt(idx)))
		}
		patternContainer.focus()
		// selCtx.state.render(patternContainer)
	}

	// Handle messages sent from the extension to the webview
	window.addEventListener('message', event => {
		const message = event.data // The json data that the extension sent
		switch (message.type) {
			case 'update':
				const iotas = message.iotas

				// Update our webview's content
				updateContent(iotas)

				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState(iotas)

				return
		}
	})

	// Webviews are normally torn down when not visible and re-created when they become visible again.
	// State lets us save information across these re-loads
	
	const state = vscode.getState() as Iota[] | undefined
	if (typeof state == "object") {
		console.log(state)
		updateContent(state)
	}
}())

