// @ts-check

const edgeLength = 30
const padding = 5
const strokeStyle = "white"
const curvePercent = 0.2
const markWidth = 5

class Vec {

	static zero() {return new Vec(0,0)}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y ) {
		this.x = x
		this.y = y
	}
	/** @param {Vec} that */
	add(that) {return new Vec(this.x + that.x, this.y + that.y)}
	/** @param {Vec} that */
	sub(that) {return new Vec(this.x - that.x, this.y - that.y)}
	/** @param {number} that */
	mul(that) {return new Vec(this.x * that, this.y*that)}
	/** @param {number} that */
	div(that) {return new Vec(this.x / that, this.y/that)}

	get mag() {return (this.x**2 + this.y**2)**0.5}
	unit() {return this.div(this.mag)}

	/**@returns {[number, number]} */
	get xy() {return [this.x, this.y]}
	static Tolerance = 0.001
	/**
	 * @param {Vec} that
	 */
	tolerates(that) { return Math.abs(this.x-that.x) < Vec.Tolerance && Math.abs(this.y-that.y) < Vec.Tolerance}

}


function patternString(/** @type {{startDir: Number, angleSig: number[]}} */ pattern) {
	const dir = ["e", "se", "sw", "w", "nw", "ne"][pattern.startDir];
	const angles = pattern.angleSig.map(x => "aqweds"[x+2]).join("");
	return `<${dir},${angles}>`;
}

/**
 * @param {number} facing
 */
function coerce(facing) {
	if (facing < 0) {return coerce(facing + 6)}
	else if (facing > 5) {return coerce(facing - 6)}
	else return facing
}

/**
 * @param {Vec} pos
 * @param {{ minx: number; miny: number; maxx: number; maxy: number; }} aabb
 */
function expandAABB(pos, aabb) {
	if (pos.x < aabb.minx) { aabb.minx = pos.x }
	if (pos.y < aabb.miny) { aabb.miny = pos.y }
	if (pos.x > aabb.maxx) { aabb.maxx = pos.x }
	if (pos.y > aabb.maxy) { aabb.maxy = pos.y }
	return aabb
}

let stringify = (/** @type {Vec} */ vec) =>  `${Math.round(vec.x*1000)/1000}|${Math.round(vec.y*1000)/1000}`
/**
 * @param {{startDir: Number, angleSig: number[]}} pattern
 */
function findTouchies(pattern) {
	let count = /**@type {Map<string, number>} */ (new Map())
	

	let facing = pattern.startDir
	let pos = Vec.zero()
	count.set(stringify(pos), 1)
	let delta = new Vec(
		Math.cos(facing * Math.PI/3)*edgeLength, 
		Math.sin(facing * Math.PI/3)*edgeLength
	)
	pos = pos.add(delta)
	count.set(stringify(pos), 1)
	
	for (let angle of pattern.angleSig) {
		facing = coerce(facing + angle)
		let delta = new Vec(
			Math.cos(facing * Math.PI/3)*edgeLength, 
			Math.sin(facing * Math.PI/3)*edgeLength
		)
		pos = pos.add(delta)
		count.set(stringify(pos), (count.get(stringify(pos)) ?? 0) + 1)
	}

	return count
}

/**
 * 
 * @param {{startDir: Number, angleSig: number[]}} pattern
 */
function findPatternSize(pattern) {
	let aabb = {minx:0,miny:0,maxx:0,maxy:0}

	let facing = pattern.startDir
	let pos = Vec.zero()
	let delta = new Vec(
		Math.cos(facing * Math.PI/3)*edgeLength, 
		Math.sin(facing * Math.PI/3)*edgeLength
	)
	pos = pos.add(delta)

	aabb = expandAABB(pos, aabb)
	
	for (let angle of pattern.angleSig) {
		facing = coerce(facing + angle)
		let delta = new Vec(
			Math.cos(facing * Math.PI/3)*edgeLength, 
			Math.sin(facing * Math.PI/3)*edgeLength
		)
		pos = pos.add(delta)
		aabb = expandAABB(pos, aabb)
	}

	return aabb
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{startDir: Number, angleSig: number[]}} pattern 
 */
function drawPattern(ctx, pattern) {
	let aabb = findPatternSize(pattern)
	aabb.minx -= padding
	aabb.miny -= padding
	aabb.maxx += padding
	aabb.maxy += padding
	ctx.canvas.width = Math.abs(aabb.maxx - aabb.minx)
	ctx.canvas.height = Math.abs(aabb.maxy - aabb.miny)

	let count = findTouchies(pattern)
	console.log(count)

	let facing = pattern.startDir
	let offset = new Vec(-aabb.minx, -aabb.miny)
	let pos = new Vec(-aabb.minx, -aabb.miny)
	ctx.beginPath()
	let forwards = new Vec(
		Math.cos(facing * Math.PI/3), 
		Math.sin(facing * Math.PI/3)
	)
	let left = new Vec(-forwards.y, forwards.x)
	let curveDist = curvePercent * edgeLength 

	ctx.moveTo(...pos.add(forwards.mul(curveDist)).add(left.mul(markWidth/2)).xy)
	ctx.lineTo(...pos.add(forwards.mul(curveDist)).sub(left.mul(markWidth/2)).xy)

	ctx.moveTo(...pos.add(forwards.mul(curveDist)).xy)
	pos = pos.add(forwards.mul(edgeLength))
	ctx.lineTo(...pos.sub(forwards.mul(curveDist)).xy)

	for (let angle of pattern.angleSig) {
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

/**
 * 
 * @param {{text: string, tabs: number, pattern: {startDir: Number, angleSig: number[]}}} iota 
 * @param {number} idx 
 * @returns {HTMLDivElement}
 */
function makePatternDiv(iota, idx) {
	let div = document.createElement("div")
	div.classList.add("pattern")
	div.setAttribute("name", iota.text)
	div.setAttribute("idx", idx.toString())
	let canvas = /** @type {HTMLCanvasElement} */ document.createElement("canvas")
	let ctx = canvas.getContext("2d")
	if (ctx == null) throw new Error(`null ctx`)
	if (iota.pattern == undefined) {
		ctx.font = "24px Arial"
		let metrics = ctx.measureText(iota.text)
		canvas.width = metrics.width
		canvas.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
		ctx.fillStyle = "red"
		ctx.fillText(iota.text, 0, 0)
	} else {
		drawPattern(ctx, iota.pattern)
	}
	div.appendChild(canvas)
	
	return div

}



// Script run within the webview itself.
(function () {

	// Get a reference to the VS Code webview api.
	// We use this API to post messages back to our extension.

	// @ts-ignore
	const vscode = acquireVsCodeApi();

	/**
	 * @param {HTMLElement} div
	 */
	function startEditing(div) {
		let text = div.getAttribute("name") ?? ""
		let canvas = /** @type {HTMLCanvasElement} */ (div.firstChild)
		canvas.style.display = "none"
		let input = document.createElement("input")
		input.type = "text"
		input.value = text
		div.appendChild(input)
		input.focus()
		input.select()

		let done = false
		let finish = (/** @type {boolean} */ commit) => {
			if (done) return
			done = true
			if (commit && input.value != text) {
				vscode.postMessage({type: "edit", idx: parseInt(div.getAttribute("idx") ?? ""), text: input.value})
			}
			input.remove()
			canvas.style.display = ""
		}
		input.addEventListener("keydown", e => {
			if (e.key == "Enter") finish(true)
			else if (e.key == "Escape") finish(false)
		})
		input.addEventListener("blur", _ => finish(false))

	}

	const patternContainer = /** @type {HTMLDivElement} */ (document.querySelector('.patterns'));
	patternContainer.addEventListener("click", e => {
		// @ts-ignore
		if (e.target.tagName == "CANVAS") {
			// @ts-ignore
			startEditing(e.target.parentElement)
		}
	})

	/**
	 * Render the document in the webview.
	 */
	function updateContent(/** @type {{text: string, tabs: number, pattern: {startDir: Number, angleSig: number[]}}[]} */ patterns) {
		// patternContainer.style.display = '';
		// patternContainer.textContent = patterns[0]
		patternContainer.innerHTML = "";
		for (const idx in patterns) {
			let pattern = patterns[idx]
			patternContainer.appendChild(makePatternDiv(pattern, parseInt(idx)))
		}
	}

	// Handle messages sent from the extension to the webview
	window.addEventListener('message', event => {
		const message = event.data; // The json data that the extension sent
		switch (message.type) {
			case 'update':
				const patterns = message.patterns;

				// Update our webview's content
				updateContent(patterns);

				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState(patterns);

				return;
		}
	});

	// Webviews are normally torn down when not visible and re-created when they become visible again.
	// State lets us save information across these re-loads
	
	const state = vscode.getState();
	if (typeof state == "object") {
		console.log(state)
		updateContent(state);
	}
}());
