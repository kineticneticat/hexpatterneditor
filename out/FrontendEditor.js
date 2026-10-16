"use strict";
const edgeLength = 30;
const padding = 5;
const strokeStyle = "white";
const curvePercent = 0.2;
const markWidth = 5;
function patternCount() { return document.getElementById("patterns").getElementsByClassName("pattern").length; }
class SelectState {
    onEnter(modifiers) { return this; }
    onEscape(modifiers) { return new NoSel(); }
    onLeftArrow(modifiers) { return this; }
    onRightArrow(modifiers) { return this; }
    onUpArrow(modifiers) { return this; }
    onDownArrow(modifiers) { return this; }
    onClickPattern(pos, modifiers) { return new RangeSel(pos, pos); }
    onClickGap(pos, modifiers) { return new CaretSel(pos); }
    enter() { }
    exit() { }
    render(container) { }
    anchor(container) { return container; }
}
class NoSel extends SelectState {
}
class CaretSel extends SelectState {
    pos;
    static left(caretPos) { return caretPos; }
    static right(caretPos) { return caretPos + 1; }
    constructor(pos) {
        super();
        this.pos = pos;
    }
    onEnter(modifiers) {
        return new Editing(this);
    }
    onLeftArrow(modifiers) {
        if (modifiers.shift && modifiers.ctrl && this.pos != -1)
            return new RangeSel(this.pos, -1);
        if (modifiers.shift && this.pos != -1)
            return new RangeSel(this.pos, this.pos - 1);
        if (modifiers.ctrl)
            return new CaretSel(-1);
        return new CaretSel(Math.max(this.pos - 1, -1));
    }
    onRightArrow(modifiers) {
        let count = patternCount();
        if (modifiers.shift && modifiers.ctrl && this.pos != count - 1)
            return new RangeSel(this.pos, count - 1);
        if (modifiers.shift && this.pos != count - 1)
            return new RangeSel(this.pos, this.pos + 1);
        if (modifiers.ctrl)
            return new CaretSel(count - 1);
        return new CaretSel(Math.min(this.pos + 1, count - 1));
    }
    onClickGap(pos, modifiers) {
        if (!modifiers.shift)
            return new CaretSel(pos);
        return new RangeSel(this.pos, pos);
    }
    onClickPattern(pos, modifiers) {
        if (!modifiers.shift)
            return new RangeSel(pos - 1, pos);
        return new RangeSel(this.pos, pos >= CaretSel.right(this.pos) ? pos : pos - 1);
    }
    render(container) {
        let gutters = container.getElementsByClassName("gutter");
        Array.prototype.forEach.call(gutters, x => x.classList.remove("caret"));
        console.log(gutters);
        gutters[this.pos + 1].classList.add("caret");
    }
    exit() {
        let container = document.getElementById("patterns");
        Array.prototype.forEach.call(container.getElementsByClassName("gutter"), (x) => {
            x.classList.remove("caret");
        });
    }
}
class RangeSel extends SelectState {
    A;
    B;
    constructor(A, B) {
        super();
        this.A = A;
        this.B = B;
    }
    get start() { return Math.min(CaretSel.right(this.A), CaretSel.right(this.B)); }
    get end() { return Math.max(CaretSel.left(this.A), CaretSel.left(this.B)); }
    onEnter(modifiers) {
        return new Editing(this);
    }
    onLeftArrow(modifiers) {
        if (modifiers.shift && modifiers.ctrl)
            return new RangeSel(this.A, -1);
        if (modifiers.shift) {
            if (Math.max(this.B - 1, -1) == this.A)
                return new CaretSel(this.A);
            return new RangeSel(this.A, Math.max(this.B - 1, -1));
        }
        if (modifiers.ctrl)
            return new CaretSel(-1);
        return new CaretSel(this.start - 1);
    }
    onRightArrow(modifiers) {
        let count = patternCount();
        if (modifiers.shift && modifiers.ctrl)
            return new RangeSel(this.A, count - 1);
        if (modifiers.shift) {
            if (Math.min(this.B + 1, count - 1) == this.A)
                return new CaretSel(this.A);
            return new RangeSel(this.A, Math.min(this.B + 1, count - 1));
        }
        if (modifiers.ctrl)
            return new CaretSel(count - 1);
        return new CaretSel(this.end);
    }
    onClickPattern(pos, modifiers) {
        if (!modifiers.shift)
            return new RangeSel(pos - 1, pos);
        return new RangeSel(this.A, pos >= CaretSel.right(this.A) ? pos : pos - 1);
    }
    onClickGap(pos, modifiers) {
        if (!modifiers.shift)
            return new CaretSel(pos);
        return new RangeSel(this.A, pos);
    }
    exit() {
        let container = document.getElementById("patterns");
        Array.prototype.forEach.call(container.getElementsByClassName("pattern"), (x) => x.classList.remove("highlight"));
        Array.prototype.forEach.call(container.getElementsByClassName("gutter"), (x) => x.classList.remove("caret"));
    }
    render(container) {
        let divs = container.getElementsByClassName("pattern");
        Array.prototype.forEach.call(divs, (x) => { x.classList.remove("highlight"); });
        for (let i = this.start; i <= this.end; i++) {
            divs.item(i)?.classList.add("highlight");
        }
        let gutters = container.getElementsByClassName("gutter");
        gutters[this.B + 1].classList.add("caret");
    }
}
class Editing extends SelectState {
    target;
    constructor(target) {
        super();
        this.target = target;
    }
    onEscape(modifiers) {
        return this.target;
    }
    render(container) {
        let anchor = this.target.anchor(container);
    }
}
const selCtx = {
    state: new NoSel(),
    handle(statemethod, ...args) {
        let newState = statemethod.call(this.state, ...args);
        if (newState !== this.state) {
            this.state.exit();
            this.state = newState;
            this.state.enter();
        }
        console.log(this.state);
        this.state.render(document.getElementById('patterns'));
    },
    onEnter(modifiers) { this.handle(this.state.onEscape, modifiers); },
    onEscape(modifiers) { this.handle(this.state.onEscape, modifiers); },
    onLeftArrow(modifiers) { this.handle(this.state.onLeftArrow, modifiers); },
    onRightArrow(modifiers) { this.handle(this.state.onRightArrow, modifiers); },
    onUpArrow(modifiers) { this.handle(this.state.onUpArrow, modifiers); },
    onDownArrow(modifiers) { this.handle(this.state.onDownArrow, modifiers); },
    onClickPattern(pos, modifiers) { this.handle(this.state.onClickPattern, pos, modifiers); },
    onClickGap(pos, modifiers) { this.handle(this.state.onClickGap, pos, modifiers); },
};
class Vec {
    x;
    y;
    static zero() { return new Vec(0, 0); }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(that) { return new Vec(this.x + that.x, this.y + that.y); }
    sub(that) { return new Vec(this.x - that.x, this.y - that.y); }
    mul(that) { return new Vec(this.x * that, this.y * that); }
    div(that) { return new Vec(this.x / that, this.y / that); }
    get mag() { return (this.x ** 2 + this.y ** 2) ** 0.5; }
    unit() { return this.div(this.mag); }
    get xy() { return [this.x, this.y]; }
    static Tolerance = 0.001;
    tolerates(that) { return Math.abs(this.x - that.x) < Vec.Tolerance && Math.abs(this.y - that.y) < Vec.Tolerance; }
}
// function patternString(pattern: Pattern) {
// 	const dir = ["e", "se", "sw", "w", "nw", "ne"][pattern.startDir]
// 	const angles = pattern.angleSig.map(x => "aqweds"[x+2]).join("")
// 	return `<${dir},${angles}>`
// }
function coerce(facing) {
    if (facing < 0) {
        return coerce(facing + 6);
    }
    else if (facing > 5) {
        return coerce(facing - 6);
    }
    else {
        return facing;
    }
}
function expandAABB(pos, aabb) {
    if (pos.x < aabb.minx) {
        aabb.minx = pos.x;
    }
    if (pos.y < aabb.miny) {
        aabb.miny = pos.y;
    }
    if (pos.x > aabb.maxx) {
        aabb.maxx = pos.x;
    }
    if (pos.y > aabb.maxy) {
        aabb.maxy = pos.y;
    }
    return aabb;
}
const stringify = (vec) => `${Math.round(vec.x * 1000) / 1000}|${Math.round(vec.y * 1000) / 1000}`;
function findTouchies(pattern) {
    const count = new Map();
    let facing = pattern.startDir;
    let pos = Vec.zero();
    count.set(stringify(pos), 1);
    const delta = new Vec(Math.cos(facing * Math.PI / 3) * edgeLength, Math.sin(facing * Math.PI / 3) * edgeLength);
    pos = pos.add(delta);
    count.set(stringify(pos), 1);
    for (const angle of pattern.angleSig) {
        facing = coerce(facing + angle);
        const delta = new Vec(Math.cos(facing * Math.PI / 3) * edgeLength, Math.sin(facing * Math.PI / 3) * edgeLength);
        pos = pos.add(delta);
        count.set(stringify(pos), (count.get(stringify(pos)) ?? 0) + 1);
    }
    return count;
}
function findPatternSize(pattern) {
    let aabb = { minx: 0, miny: 0, maxx: 0, maxy: 0 };
    let facing = pattern.startDir;
    let pos = Vec.zero();
    const delta = new Vec(Math.cos(facing * Math.PI / 3) * edgeLength, Math.sin(facing * Math.PI / 3) * edgeLength);
    pos = pos.add(delta);
    aabb = expandAABB(pos, aabb);
    for (const angle of pattern.angleSig) {
        facing = coerce(facing + angle);
        const delta = new Vec(Math.cos(facing * Math.PI / 3) * edgeLength, Math.sin(facing * Math.PI / 3) * edgeLength);
        pos = pos.add(delta);
        aabb = expandAABB(pos, aabb);
    }
    return aabb;
}
function drawPattern(ctx, pattern) {
    const aabb = findPatternSize(pattern);
    aabb.minx -= padding;
    aabb.miny -= padding;
    aabb.maxx += padding;
    aabb.maxy += padding;
    ctx.canvas.width = Math.abs(aabb.maxx - aabb.minx);
    ctx.canvas.height = Math.abs(aabb.maxy - aabb.miny);
    const count = findTouchies(pattern);
    let facing = pattern.startDir;
    const offset = new Vec(-aabb.minx, -aabb.miny);
    let pos = new Vec(-aabb.minx, -aabb.miny);
    ctx.beginPath();
    let forwards = new Vec(Math.cos(facing * Math.PI / 3), Math.sin(facing * Math.PI / 3));
    let left = new Vec(-forwards.y, forwards.x);
    const curveDist = curvePercent * edgeLength;
    ctx.moveTo(...pos.add(forwards.mul(curveDist)).add(left.mul(markWidth / 2)).xy);
    ctx.lineTo(...pos.add(forwards.mul(curveDist)).sub(left.mul(markWidth / 2)).xy);
    ctx.moveTo(...pos.add(forwards.mul(curveDist)).xy);
    pos = pos.add(forwards.mul(edgeLength));
    ctx.lineTo(...pos.sub(forwards.mul(curveDist)).xy);
    for (const angle of pattern.angleSig) {
        facing = coerce(facing + angle);
        forwards = new Vec(Math.cos(facing * Math.PI / 3), Math.sin(facing * Math.PI / 3));
        left = new Vec(-forwards.y, forwards.x);
        ctx.quadraticCurveTo(...pos.xy, ...pos.add(forwards.mul(curveDist)).xy);
        // todo: only draw mark if this line is the only one passing through this vertex
        if (angle == 0 && count.get(stringify(pos.sub(offset))) == 1) {
            ctx.moveTo(...pos.add(left.mul(markWidth / 2)).xy);
            ctx.lineTo(...pos.sub(left.mul(markWidth / 2)).xy);
            ctx.moveTo(...pos.add(forwards.mul(curveDist)).xy);
        }
        pos = pos.add(forwards.mul(edgeLength));
        ctx.lineTo(...pos.sub(forwards.mul(curveDist)).xy);
    }
    ctx.lineTo(...pos.sub(forwards.mul(curveDist * 2).add(left.mul(markWidth / 2))).xy);
    ctx.moveTo(...pos.sub(forwards.mul(curveDist * 2).sub(left.mul(markWidth / 2))).xy);
    ctx.lineTo(...pos.sub(forwards.mul(curveDist)).xy);
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
}
function makePatternDiv(iota, idx) {
    const div = document.createElement("div");
    div.classList.add("pattern");
    div.setAttribute("name", iota.text);
    div.setAttribute("idx", idx.toString());
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    if (ctx == null) {
        throw new Error(`null ctx`);
    }
    if (iota.pattern == undefined) {
        ctx.font = "24px Arial";
        const metrics = ctx.measureText(iota.text);
        canvas.width = metrics.width;
        canvas.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        ctx.fillStyle = "red";
        ctx.fillText(iota.text, 0, 0);
    }
    else {
        drawPattern(ctx, iota.pattern);
    }
    div.appendChild(canvas);
    let gutter = document.createElement("div");
    gutter.classList.add("gutter");
    gutter.setAttribute("idx", idx.toString());
    div.appendChild(gutter);
    gutter.append(document.createElement("div"));
    return div;
}
// Script run within the webview itself.
(function () {
    // Get a reference to the VS Code webview api.
    // We use this API to post messages back to our extension.
    const vscode = acquireVsCodeApi();
    const patternContainer = document.getElementById('patterns');
    patternContainer.addEventListener("click", e => {
        let target = e.target;
        // console.log(target)
        let modifiers = { ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey };
        if (target.tagName == "CANVAS") {
            selCtx.onClickPattern(parseInt(target.parentElement.getAttribute("idx") ?? "0"), modifiers);
        }
        else if (target.classList.contains("gutter") || target.parentElement?.classList?.contains("gutter")) {
            selCtx.onClickGap(parseInt(target.getAttribute("idx") ?? target.parentElement?.getAttribute("idx") ?? "0"), modifiers);
        }
    });
    patternContainer.addEventListener("keydown", e => {
        let modifiers = { ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey };
        switch (e.code) {
            case "Escape":
                selCtx.onEscape(modifiers);
                e.preventDefault();
                break;
            case "ArrowLeft":
                selCtx.onLeftArrow(modifiers);
                e.preventDefault();
                break;
            case "ArrowRight":
                selCtx.onRightArrow(modifiers);
                e.preventDefault();
                break;
        }
    });
    /**
     * Render the document in the webview.
     */
    function updateContent(iotas) {
        // patternContainer.style.display = ''
        // patternContainer.textContent = patterns[0]
        patternContainer.innerHTML = "";
        let firstGutter = document.createElement("div");
        firstGutter.classList.add("gutter");
        firstGutter.setAttribute("idx", "-1");
        firstGutter.appendChild(document.createElement("div"));
        patternContainer.appendChild(firstGutter);
        for (const idx in iotas) {
            const pattern = iotas[idx];
            patternContainer.appendChild(makePatternDiv(pattern, parseInt(idx)));
        }
        patternContainer.focus();
        // selCtx.state.render(patternContainer)
    }
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'update':
                const iotas = message.iotas;
                // Update our webview's content
                updateContent(iotas);
                // Then persist state information.
                // This state is returned in the call to `vscode.getState` below when a webview is reloaded.
                vscode.setState(iotas);
                return;
        }
    });
    // Webviews are normally torn down when not visible and re-created when they become visible again.
    // State lets us save information across these re-loads
    const state = vscode.getState();
    if (typeof state == "object") {
        console.log(state);
        updateContent(state);
    }
}());
//# sourceMappingURL=FrontendEditor.js.map