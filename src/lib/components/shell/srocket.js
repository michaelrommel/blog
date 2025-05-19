/**
 * @file Internal library for sshx, providing real-time communication.
 *
 * The contents of this file are technically general, not sshx-specific, but it
 * is not open-sourced as its own library because it's not ready for that.
 */

import { encode, decode } from 'cbor-x';

/** How long to wait between reconnections (in milliseconds). */
const RECONNECT_DELAY = 500;

/** Number of messages to queue while disconnected. */
const BUFFER_SIZE = 64;

/** A reconnecting WebSocket client for real-time communication. */
export class Srocket {
	#url;
	#options;

	#ws;
	#connected;
	#buffer;
	#disposed;

	constructor(url, options) {
		this.#url = url;
		if (this.#url.startsWith('/')) {
			// Get WebSocket URL relative to the current origin.
			this.#url =
				(window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
				window.location.host +
				this.#url;
		}
		this.#options = options;

		this.#ws = null;
		this.#connected = false;
		this.#buffer = [];
		this.#disposed = false;
		this.#reconnect();
	}

	get connected() {
		return this.#connected;
	}

	/** Queue a message to send to the server, with "at-most-once" semantics. */
	send(message) {
		// Types in cbor-x are incorrect here, so cast to fix the error.
		// See: https://github.com/kriszyp/cbor-x/issues/120
		const data = encode(message);

		if (this.#connected && this.#ws) {
			this.#ws.send(data);
		} else {
			if (this.#buffer.length < BUFFER_SIZE) {
				this.#buffer.push(data);
			}
		}
	}

	/** Dispose of this WebSocket permanently. */
	dispose() {
		this.#stateChange(false);
		this.#disposed = true;
		this.#ws?.close();
	}

	#reconnect() {
		if (this.#disposed) return;
		if (this.#ws !== null) {
			throw new Error('invariant violation: reconnecting while connected');
		}
		this.#ws = new WebSocket(this.#url);
		this.#ws.binaryType = 'arraybuffer';
		this.#ws.onopen = () => {
			this.#stateChange(true);
		};
		this.#ws.onclose = (event) => {
			this.#options.onClose?.(event);
			this.#ws = null;
			this.#stateChange(false);
			setTimeout(() => this.#reconnect(), RECONNECT_DELAY);
		};
		this.#ws.onmessage = (event) => {
			if (event.data instanceof ArrayBuffer) {
				const message = decode(new Uint8Array(event.data));
				this.#options.onMessage(message);
			} else {
				console.warn('unexpected non-buffer message, ignoring');
			}
		};
	}

	#stateChange(connected) {
		if (!this.#disposed && connected !== this.#connected) {
			this.#connected = connected;
			if (connected) {
				this.#options.onConnect?.();

				if (!this.#ws) {
					throw new Error('invariant violation: connected but ws is null');
				}
				// Send any queued messages.
				for (const message of this.#buffer) {
					this.#ws.send(message);
				}
				this.#buffer = [];
			} else {
				this.#options.onDisconnect?.();
			}
		}
	}
}
