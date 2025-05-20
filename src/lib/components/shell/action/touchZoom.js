/**
 * @file Handles pan and zoom events to create an infinite canvas.
 *
 * This file is modified from Dispict <https://github.com/ekzhang/dispict>,
 * which itself is loosely based on tldraw.
 */

import { Gesture } from '@use-gesture/vanilla';
import Vec from '@tldraw/vec';

// Credits: from excalidraw
// https://github.com/excalidraw/excalidraw/blob/07ebd7c68ce6ff92ddbc22d1c3d215f2b21328d6/src/utils.ts_L542-L563
// const getNearestScrollableContainer = (element) => {
// 	let parent = element.parentElement;
// 	while (parent) {
// 		if (parent === document.body) {
// 			return document;
// 		}
// 		const { overflowY } = window.getComputedStyle(parent);
// 		const hasScrollableContent = parent.scrollHeight > parent.clientHeight;
// 		if (
// 			hasScrollableContent &&
// 			(overflowY === 'auto' ||
// 				overflowY === 'scroll' ||
// 				overflowY === 'overlay')
// 		) {
// 			return parent;
// 		}
// 		parent = parent.parentElement;
// 	}
// 	return document;
// };

// function isDarwin() {
// 	return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
// }

function debounce(fn, ms = 0) {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(args), ms);
	};
}

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 2;
export const INITIAL_ZOOM = 1.0;

export class TouchZoom {
	_node;
	_gesture;
	// _scrollingAnchor;
	// _resizeObserver;

	_bounds = {
		minX: 0,
		maxX: 0,
		minY: 0,
		maxY: 0,
		width: 0,
		height: 0
	};
	_originPoint = undefined;
	_delta = [0, 0];
	_lastMovement = 1;
	_wheelLastTimeStamp = 0;

	_callbacks = new Set();

	isPinching = false;
	center = [0, 0];
	zoom = INITIAL_ZOOM;

	_preventGesture = (event) => event.preventDefault();

	constructor(node) {
		this._node = node;
		// this._scrollingAnchor = getNearestScrollableContainer(node);
		// // @ts-ignore
		// document.addEventListener('gesturestart', this._preventGesture);
		// // @ts-ignore
		// document.addEventListener('gesturechange', this._preventGesture);

		// this._updateBounds();
		// window.addEventListener('resize', this._updateBoundsD);
		// this._scrollingAnchor.addEventListener('scroll', this._updateBoundsD);

		// this._resizeObserver = new ResizeObserver((entries) => {
		// 	if (this.isPinching) return;
		// 	if (entries[0].contentRect) this._updateBounds();
		// });
		// this._resizeObserver.observe(node);

		this._gesture = new Gesture(
			node,
			{
				// onWheel: this._handleWheel,
				// onPinchStart: this._handlePinchStart,
				// onPinch: this._handlePinch,
				// onPinchEnd: this._handlePinchEnd,
				onDrag: this._handleDrag
			}
			// {
			// 	target: node,
			// 	eventOptions: { passive: false },
			// 	pinch: {
			// 		from: [this.zoom, 0],
			// 		scaleBounds: () => {
			// 			return { from: this.zoom, max: MAX_ZOOM, min: MIN_ZOOM };
			// 		}
			// 	},
			// 	drag: {
			// 		filterTaps: true,
			// 		pointer: { keys: false }
			// 	}
			// }
		);
	}

	_getPoint(e) {
		return [
			+e.clientX.toFixed(2) - this._bounds.minX,
			+e.clientY.toFixed(2) - this._bounds.minY
		];
	}

	_updateBounds = () => {
		const rect = this._node.getBoundingClientRect();
		this._bounds = {
			minX: rect.left,
			maxX: rect.left + rect.width,
			minY: rect.top,
			maxY: rect.top + rect.height,
			width: rect.width,
			height: rect.height
		};
	};

	_updateBoundsD = debounce(this._updateBounds, 100);

	onMove(callback) {
		this._callbacks.add(callback);
		return () => this._callbacks.delete(callback);
	}

	// async moveTo(pos, zoom) {
	// 	// Cubic bezier easing
	// 	const smoothstep = (z) => {
	// 		const x = Math.max(0, Math.min(1, z));
	// 		return x * x * (3 - 2 * x);
	// 	};

	// 	const beginTime = Date.now();
	// 	const totalTime = 350; // milliseconds

	// 	const start = this.center;
	// 	const startZ = 1 / this.zoom;
	// 	const finishZ = 1 / zoom;
	// 	while (true) {
	// 		const t = Date.now() - beginTime;
	// 		if (t > totalTime) break;
	// 		const k = smoothstep(t / totalTime);

	// 		this.center = Vec.lrp(start, pos, k);
	// 		this.zoom = 1 / (startZ * (1 - k) + finishZ * k);
	// 		this._moved(false);
	// 		await new Promise((resolve) => requestAnimationFrame(resolve));
	// 	}
	// 	this.center = pos;
	// 	this.zoom = zoom;
	// 	this._moved(false);
	// }

	_moved(manual = true) {
		for (const callback of this._callbacks) {
			callback(manual);
		}
	}

	// _handleWheel = ({ event: e }) => {
	// 	e.preventDefault();
	// 	if (this.isPinching || e.timeStamp <= this._wheelLastTimeStamp) return;

	// 	this._wheelLastTimeStamp = e.timeStamp;

	// 	const [x, y, z] = normalizeWheel(e);

	// 	// alt+scroll or ctrl+scroll = zoom (when not clicking)
	// 	if ((e.altKey || e.ctrlKey || e.metaKey) && e.buttons === 0) {
	// 		const point =
	// 			e.clientX && e.clientY
	// 				? this._getPoint(e)
	// 				: [this._bounds.width / 2, this._bounds.height / 2];
	// 		const delta = z * 0.618;

	// 		let newZoom = (1 - delta / 320) * this.zoom;
	// 		newZoom = Vec.clamp(newZoom, MIN_ZOOM, MAX_ZOOM);

	// 		const offset = Vec.sub(point, [0, 0]);
	// 		const movement = Vec.mul(offset, 1 / this.zoom - 1 / newZoom);
	// 		this.center = Vec.add(this.center, movement);
	// 		this.zoom = newZoom;

	// 		this._moved();
	// 		return;
	// 	}

	// 	// otherwise pan
	// 	const delta = Vec.mul(
	// 		e.shiftKey && !isDarwin()
	// 			? // shift+scroll = pan horizontally
	// 				[y, 0]
	// 			: // scroll = pan vertically (or in any direction on a trackpad)
	// 				[x, y],
	// 		0.5
	// 	);

	// 	if (Vec.isEqual(delta, [0, 0])) return;

	// 	this.center = Vec.add(this.center, Vec.div(delta, this.zoom));
	// 	this._moved();
	// };

	// _handlePinchStart = ({ origin, event }) => {
	// 	if (event instanceof WheelEvent) return;

	// 	this.isPinching = true;
	// 	this._originPoint = origin;
	// 	this._delta = [0, 0];
	// 	this._lastMovement = 1;
	// 	this._moved();
	// };

	// _handlePinch = ({ origin, movement, event }) => {
	// 	if (event instanceof WheelEvent) return;

	// 	if (!this._originPoint) return;
	// 	const delta = Vec.sub(this._originPoint, origin);
	// 	const trueDelta = Vec.sub(delta, this._delta);
	// 	this._delta = delta;

	// 	const zoomLevel = movement[0] / this._lastMovement;
	// 	this._lastMovement = movement[0];

	// 	this.center = Vec.add(this.center, Vec.div(trueDelta, this.zoom * 2));
	// 	this.zoom = Vec.clamp(this.zoom * zoomLevel, MIN_ZOOM, MAX_ZOOM);
	// 	this._moved();
	// };

	// _handlePinchEnd = () => {
	// 	this.isPinching = false;
	// 	this._originPoint = undefined;
	// 	this._delta = [0, 0];
	// 	this._lastMovement = 1;
	// 	this._moved();
	// };

	_handleDrag = ({ delta, elapsedTime }) => {
		if (delta[0] === 0 && delta[1] === 0 && elapsedTime < 200) return;
		this.center = Vec.sub(this.center, Vec.div(delta, this.zoom));
		this._moved();
	};

	destroy() {
		if (this._node) {
			// // @ts-ignore
			// document.addEventListener('gesturestart', this._preventGesture);
			// // @ts-ignore
			// document.addEventListener('gesturechange', this._preventGesture);

			// window.removeEventListener('resize', this._updateBoundsD);
			// this._scrollingAnchor.removeEventListener('scroll', this._updateBoundsD);

			// this._resizeObserver.disconnect();

			this._gesture.destroy();
			this._node = null;
		}
	}
}

// // Reasonable defaults
// const MAX_ZOOM_STEP = 10;

// // Adapted from https://stackoverflow.com/a/13650579
// function normalizeWheel(event) {
// 	const { deltaY, deltaX } = event;

// 	let deltaZ = 0;

// 	if (event.ctrlKey || event.metaKey) {
// 		const signY = Math.sign(event.deltaY);
// 		const absDeltaY = Math.abs(event.deltaY);

// 		let dy = deltaY;

// 		if (absDeltaY > MAX_ZOOM_STEP) {
// 			dy = MAX_ZOOM_STEP * signY;
// 		}

// 		deltaZ = dy;
// 	}

// 	return [deltaX, deltaY, deltaZ];
// }
