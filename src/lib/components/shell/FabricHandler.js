import { Gesture } from '@use-gesture/vanilla';
import Vec from '$lib/vec.ts';

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2.5;

function FabricHandler(opts) {
	// safeguard against being called without new
	if (!(this instanceof FabricHandler)) {
		return new FabricHandler(opts);
	}

	this.fabricEl = opts.fabricEl;
	// console.log(this.fabricEl.getBoundingClientRect());

	this.center = [0, 0];
	this.zoom = 1.0;
	this.fabricOffset = [
		this.fabricEl.getBoundingClientRect().x +
			(window.pageXOffset || window.scrollX),
		this.fabricEl.getBoundingClientRect().y +
			(window.pageYOffset || window.scrollY)
	];
	this._centerToPinchOrigin = undefined;
	this._zoomBeforePinch = 1.0;

	this._wheelLastTimeStamp = 0;

	this.consoleEl = opts.consoleEl;
	this._consolelines = [];

	this.callbacks = new Set();

	const that = this;

	this._handleDrag = (state) => {
		that.isPinching = false;
		if (state.delta[0] === 0 && state.delta[1] === 0 && state.elapsedTime < 200)
			return;
		that.center = Vec.add(Vec.div(state.delta, that.zoom), that.center);
		that._moved(state);
	};

	this._handleWheel = (state) => {
		let { event } = state;

		if (that.isPinching || event.timeStamp <= that._wheelLastTimeStamp) return;
		that._wheelLastTimeStamp = event.timeStamp;

		const { deltaY, clientX, clientY } = event;
		const _origin = [clientX, clientY];

		// alt+scroll or ctrl+scroll = zoom (when not clicking)
		if (
			(event.altKey || event.ctrlKey || event.metaKey) &&
			event.buttons === 0
		) {
			let _centerToWheelRelative = Vec.sub(_origin, that.fabricOffset);
			let _centerToWheelOrigin = Vec.div(
				Vec.sub(_centerToWheelRelative, Vec.mul(that.center, that.zoom)),
				that.zoom
			);
			that.zoom = Vec.clamp(
				that.zoom + Math.sign(deltaY) * 0.05,
				MIN_ZOOM,
				MAX_ZOOM
			);
			that.center = Vec.sub(
				Vec.div(_centerToWheelRelative, that.zoom),
				_centerToWheelOrigin
			);

			this._consolelog(
				`wheel: ${_centerToWheelOrigin} ${_origin} ${clientX} ${clientY} ${deltaY}`
			);

			that._moved();
		}
	};

	this._consolelog = (text) => {
		if (that._consolelines.length > 9) {
			that._consolelines = that._consolelines.slice(1);
		}
		that._consolelines.push(text);
		that.consoleEl.innerText = that._consolelines.join('\n');
	};

	this._handlePinchStart = ({ origin, event }) => {
		if (event instanceof WheelEvent) return;

		this._consolelog(`pinchstart: ${origin}`);
		that.isPinching = true;

		// origin of the pinch gesture is in screen pixels
		// we need to account for an offset of the fabric div element
		let _pinchRelative = Vec.sub(origin, that.fabricOffset);
		// center is in virtual coordinates, needs multiplication to
		// arrive at screen pixels
		that._centerToPinchOrigin = Vec.sub(
			_pinchRelative,
			Vec.mul(that.center, that.zoom)
		);
		// now we have _centerToPinchOrigin as a screen pixel vector between
		// the center of the fabric coordinate system (center is marked with
		// a purple dot) and the origin of the pinch gesture
		that._zoomBeforePinch = that.zoom;

		that._moved();
	};

	this._handlePinch = (state) => {
		let { origin, movement, event } = state;

		if (event instanceof WheelEvent) return;

		that.zoom = Vec.clamp(
			that._zoomBeforePinch * movement[0],
			MIN_ZOOM,
			MAX_ZOOM
		);

		let _pinchRelative = Vec.sub(origin, that.fabricOffset);
		// center is in virtual coordinates with zoom considered
		that.center = Vec.sub(
			// screen pixel vector of the pinch gesture origin divided by new zoom
			// gives new virtual coords
			Vec.div(_pinchRelative, that.zoom),
			// whereas the original displacement needs to be calculated with the
			// starting zoom value
			Vec.div(that._centerToPinchOrigin, that._zoomBeforePinch)
		);

		that._consolelog(`pinch:  ${that._centerToPinchOrigin} ${origin}`);

		that._moved();
	};

	this._handlePinchEnd = () => {
		that.isPinching = false;
		that._delta = [0, 0];
		that._lastMovement = 1;
		that._zoomBeforePinch = that.zoom;
		that._moved();
	};

	this._moved = (state) => {
		for (const callback of that.callbacks) {
			callback(state);
		}
	};

	this.onMove = (callback) => {
		that.callbacks.add(callback);
		return () => that.callbacks.delete(callback);
	};

	this.gest = new Gesture(
		opts.fabricEl,
		{
			onDrag: this._handleDrag,
			onWheel: this._handleWheel,
			onPinchStart: this._handlePinchStart,
			onPinch: this._handlePinch,
			onPinchEnd: this._handlePinchEnd
		},
		{
			pinch: {
				pinchOnWheel: true,
				scaleBounds: { min: MIN_ZOOM, max: MAX_ZOOM }
			}
		}
	);
}

export default FabricHandler;
