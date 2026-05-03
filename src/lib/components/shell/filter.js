/* eslint-disable no-control-regex */
/**
 * Filters terminal query escape sequences from shell output.
 *
 * Applications inside the shared shell sometimes send query requests to the
 * terminal (ANSI escape sequences). If broadcast to all web clients, each
 * client would respond via `triggerDataEvent`, creating a feedback loop that
 * corrupts the display.
 *
 * This module strips those query sequences so only normal terminal output
 * reaches the xterm.js terminal instance.
 *
 * The patterns are derived from the xterm.js source code:
 * - https://github.com/xtermjs/xterm.js/blob/main/src/common/InputHandler.ts
 * - https://github.com/xtermjs/xterm.js/blob/main/src/browser/CoreBrowserTerminal.ts
 */

// Regex that matches terminal query escape sequences to be filtered.
//
// Every alternative is a specific escape sequence that xterm.js generates
// via `triggerDataEvent` in response to an application query.
const QUERY_PATTERN = new RegExp(
	[
		// ── OSC color query responses ──────────────────────────────────
		// CoreBrowserTerminal.ts: ESC]4;index;rgb:RR/GG/BB + ST
		// ESC]10;rgb:RR/GG/BB + ST  (foreground)
		// ESC]11;rgb:RR/GG/BB + ST  (background)
		// ESC]12;rgb:RR/GG/BB + ST  (cursor)
		/\x1b\]10;[^\x07\x1b]*(?:\x07|\x1b\\)/,
		/\x1b\]11;[^\x07\x1b]*(?:\x07|\x1b\\)/,
		/\x1b\]12;[^\x07\x1b]*(?:\x07|\x1b\\)/,
		/\x1b\]4;[^\x07\x1b]*(?:\x07|\x1b\\)/,

		// ── Focus events ───────────────────────────────────────────────
		// CoreBrowserTerminal.ts: ESC[I (focus in) and ESC[O (focus out)
		/\x1b\[I/,
		/\x1b\[O/,

		// ── Device status reports ──────────────────────────────────────
		// InputHandler.ts: ESC[?1;2c (xterm/rxvt/screen) or ESC[?6c (linux)
		// Also matches double-bracket variant: ESC[[?1;2c (some terminals)
		/\x1b\[\?1;2c/,
		// /\x1b\[\[\?1;2c/,
		/\x1b\[\?6c/,

		// ── Device attribute reports ───────────────────────────────────
		// InputHandler.ts: ESC[>0;276;0c (xterm), ESC[>85;95;0c (rxvt),
		//                  ESC[>83;40003;0c (screen)
		/\x1b\[>[0-9]+;[0-9]+;[0-9]+c/,
		/\x1b\[>c/,
		/\x1b\[c/,
		/\x1b\[0c/,
		/\x1b\[>q/,

		// DECRQM DEC Request Mode
		/\x1b\[\?[0-9]+\$p/,

		// ── DECSET / DECSGR Mode Reports ───────────────────────────────
		// InputHandler.ts line 2349: ESC[?m;v$y or ESC[m;v$y
		// where m is the parameter number, v is SET/RESET/PERMANENTLY_SET/etc.
		/\x1b\[\?[0-9]+;[A-Z_]+\$y/,
		/\x1b\[[0-9]+;[A-Z_]+\$y/,

		// ── Device Status Report (0n) ──────────────────────────────────
		// InputHandler.ts: ESC[0n
		/\x1b\[0n/,
		/\x1b\[5n/,

		// ── Cursor Position Report (CPR) ───────────────────────────────
		// InputHandler.ts: ESC[y;xR and ESC[?y;xR
		/\x1b\[[0-9]+;[0-9]+R/,
		/\x1b\[\?[0-9]+;[0-9]+R/,

		// ── Window Size Report ─────────────────────────────────────────
		// InputHandler.ts: ESC[8;rows;cols t (lowercase t)
		/\x1b\[8;[0-9]+;[0-9]+t/,
		/\x1b\[16t/,

		// ── Request Status String (DECSET/DECSGR) ──────────────────────
		// InputHandler.ts: ESC[P0$r+ST, ESC[P1$r0m+ST, etc.
		// Format: ESC[P<0|1>$<params><cmd>+ST
		/\x1bP0\$r\x1b\\/,
		/\x1bP1\$r[0-9a-zA-Z ;]+\x1b\\/,

		// ── Kitty Keyboard Query ───────────────────────────────────────
		// InputHandler.ts: ESC[?flags u
		/\x1b\[\?[0-9]+u/,
		/\x1b\[\?u/,

		// ── XTVERSION ──────────────────────────────────────────────────
		// InputHandler.ts: ESC P>|xterm.js(version)+ST
		/\x1bP\|>[^\x07\x1b]+\x1b\\/,
		/\x1bP>\|[^\x07\x1b]+\x1b\\/
	]
		.map((r) => r.source)
		.join('|'),
	'g'
);

/**
 * Filter terminal query escape sequences from the given string.
 *
 * Returns the filtered string, or undefined if no query sequences were found
 * (i.e., the input is unchanged).
 */
export function filterQuerySequences(data) {
	const filtered = data.replace(QUERY_PATTERN, '');
	return filtered === data ? undefined : filtered;
}
