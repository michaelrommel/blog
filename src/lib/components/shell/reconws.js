import { encode, decode } from 'cbor-x';

/** How long to wait between reconnections (in milliseconds). */
const RECONNECT_DELAY = 500;

/** Number of messages to queue while disconnected. */
const BUFFER_SIZE = 64;

/** A reconnecting WebSocket client for real-time communication. */
export class ReconWS {
	_url;
	_options;

	_ws;
	_connected;
	_buffer;
	_disposed;

	constructor(url, options) {
		this._url = url;
		if (this._url.startsWith('/')) {
			// Get WebSocket URL relative to the current origin.
			this._url =
				(window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
				window.location.host +
				this._url;
		}
		this._options = options;

		this._ws = null;
		this._connected = false;
		this._buffer = [];
		this._disposed = false;
		this._reconnect();
	}

	get connected() {
		return this._connected;
	}

	/** Queue a message to send to the server, with "at-most-once" semantics. */
	send(message) {
		const data = encode(message);

		if (this._connected && this._ws) {
			this._ws.send(data);
		} else {
			if (this._buffer.length < BUFFER_SIZE) {
				this._buffer.push(data);
			}
		}
	}

	/** Dispose of this WebSocket permanently. */
	dispose() {
		this._stateChange(false);
		this._disposed = true;
		this._ws?.close();
	}

	_reconnect() {
		if (this._disposed) return;
		if (this._ws !== null) {
			throw new Error('invariant violation: reconnecting while connected');
		}
		this._ws = new WebSocket(this._url);
		this._ws.binaryType = 'arraybuffer';
		this._ws.onopen = () => {
			this._stateChange(true);
		};
		this._ws.onclose = (event) => {
			this._options.onClose?.(event);
			this._ws = null;
			this._stateChange(false);
			setTimeout(() => this._reconnect(), RECONNECT_DELAY);
		};
		this._ws.onmessage = (event) => {
			if (event.data instanceof ArrayBuffer) {
				const message = decode(new Uint8Array(event.data));
				this._options.onMessage(message);
			} else {
				console.warn('unexpected non-buffer message, ignoring');
			}
		};
	}

	_stateChange(connected) {
		if (!this._disposed && connected !== this._connected) {
			this._connected = connected;
			if (connected) {
				this._options.onConnect?.();

				if (!this._ws) {
					throw new Error('invariant violation: connected but ws is null');
				}
				// Send any queued messages.
				for (const message of this._buffer) {
					this._ws.send(message);
				}
				this._buffer = [];
			} else {
				this._options.onDisconnect?.();
			}
		}
	}
}
