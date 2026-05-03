/**
 * Hex dump utility for debugging.
 * Takes a Uint8Array and returns a formatted string with:
 *   - Hex bytes (16 per line, space-separated)
 *   - ASCII representation (dots for non-printable)
 *
 * Usage:
 *   console.log(hexDump(new Uint8Array([0x1b, 0x5b, 0x3f, 0x31, 0x3b, 0x32, 0x63])));
 *
 * Output:
 *   0000: 1b 5b 3f 31 3b 32 63                             [.?1;2c
 */
export function hexDump(data, width = 16) {
	const lines = [];
	const bytes = [...new Uint8Array(data)];

	for (let offset = 0; offset < bytes.length; offset += width) {
		const chunk = bytes.slice(offset, offset + width);
		const hex = chunk
			.map((b) => b.toString(16).padStart(2, "0"))
			.join(" ");
		const ascii = chunk
			.map((b) => (b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : "."))
			.join("");

		// Pad hex to align with width
		const paddedHex = hex.padEnd(width * 3 - 1);
		lines.push(`${offset.toString(16).padStart(8, "0")}: ${paddedHex} ${ascii}`);
	}

	return lines.join("\n");
}

/**
 * Format a string for safe console.log display (no extra arguments).
 * Returns a single string with hex values and ASCII representation.
 *
 * Usage:
 *   console.log(hexLog("raw chunk:", decoded));
 */
export function hexLog(...args) {
	const parts = args.map((a) => {
		if (typeof a === "string") return a;
		if (a instanceof Uint8Array) return hexDump(a);
		return String(a);
	});
	return parts.join(" ");
}
