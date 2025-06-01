import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const slugFromPath = (path) =>
	path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

export const categoryFromPath = (path) =>
	path.match(/\.\/(.*)\/[\w-]+\.(svelte\.md|md|svx)/i)?.[1] ?? null;

export const chartcolours = {
	gruvred: 'hsl(0, 100%, 27%)',
	gruvgreen: 'hsl(60, 71%, 35%)',
	gruvyellow: 'hsl(40, 73%, 49%)',
	gruvblue: 'hsl(183, 33%, 40%)',
	gruvpurple: 'hsl(333, 34%, 54%)',
	gruvaqua: 'hsl(122, 21%, 51%)',
	gruvorange: 'hsl(24, 88%, 45%)',
	gruvgray: 'hsl(30, 12%, 51%)',
	gruvdgray: 'hsl(35, 17%, 59%)',
	gruvdemphred: 'hsl(6, 96%, 59%)',
	gruvdemphgreen: 'hsl(61, 66%, 44%)',
	gruvdemphyellow: 'hsl(42, 95%, 58%)',
	gruvdemphblue: 'hsl(157, 16%, 58%)',
	gruvdemphpurple: 'hsl(344, 47%, 68%)',
	gruvdemphaqua: 'hsl(104, 35%, 62%)',
	gruvdemphorange: 'hsl(27, 99%, 55%)',
	gruvlgray: 'hsl(28, 11%, 44%)',
	gruvlemphred: 'hsl(358, 100%, 31%)',
	gruvlemphgreen: 'hsl(57, 79%, 26%)',
	gruvlemphyellow: 'hsl(37, 80%, 39%)',
	gruvlemphblue: 'hsl(190, 89%, 25%)',
	gruvlemphpurple: 'hsl(323, 39%, 40%)',
	gruvlemphaqua: 'hsl(143, 30%, 37%)',
	gruvlemphorange: 'hsl(19, 97%, 35%)'
};

export const decorate = (title) => {
	return `${title} | Michael Rommel`;
};

export const serializeStructuredData = (sd) => {
	return `<script type="application/ld+json">${JSON.stringify(sd)}</script>`;
};

export const integerMedian = (values) => {
	if (values.length === 0) {
		return null;
	}
	const sorted = values.toSorted();
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 !== 0
		? sorted[mid]
		: Math.round((sorted[mid - 1] + sorted[mid]) / 2);
};

export const _debounce = (func, timeout = 200) => {
	// export const debounce = (func, timeout = 300) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};

// used by shadcn ui elements
export const cn = (...inputs) => {
	return twMerge(clsx(inputs));
};

function _isObject(value) {
	var type = typeof value;
	return value != null && (type == 'object' || type == 'function');
}

/**
 * This is adapted from lodash's function, simplified and stripped of
 * safety checks of invoking parameters, which I do not need.
 *
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * Note: If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * For throttling just invoke this function with wait and maxWait set to the
 * same value
 */

export const debounce = (func, wait = 200, options) => {
	let lastArgs;
	let lastThis;
	let maxWait;
	let result;
	let timerId;
	let lastCallTime;
	let lastInvokeTime = 0;
	let leading = false;
	let maxing = false;
	let trailing = true;

	if (_isObject(options)) {
		leading = !!options.leading;
		maxing = 'maxWait' in options;
		maxWait = maxing ? Math.max(options.maxWait || 0, wait) : maxWait;
		trailing = 'trailing' in options ? !!options.trailing : trailing;
	}

	function invokeFunc(time) {
		var args = lastArgs,
			thisArg = lastThis;

		lastArgs = lastThis = undefined;
		lastInvokeTime = time;
		result = func.apply(thisArg, args);
		return result;
	}

	function leadingEdge(time) {
		// Reset any `maxWait` timer.
		lastInvokeTime = time;
		// Start the timer for the trailing edge.
		timerId = setTimeout(timerExpired, wait);
		// Invoke the leading edge.
		return leading ? invokeFunc(time) : result;
	}

	function remainingWait(time) {
		var timeSinceLastCall = time - lastCallTime,
			timeSinceLastInvoke = time - lastInvokeTime,
			timeWaiting = wait - timeSinceLastCall;

		return maxing
			? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
			: timeWaiting;
	}

	function shouldInvoke(time) {
		var timeSinceLastCall = time - lastCallTime,
			timeSinceLastInvoke = time - lastInvokeTime;

		// Either this is the first call, activity has stopped and we're at the
		// trailing edge, the system time has gone backwards and we're treating
		// it as the trailing edge, or we've hit the `maxWait` limit.
		return (
			lastCallTime === undefined ||
			timeSinceLastCall >= wait ||
			timeSinceLastCall < 0 ||
			(maxing && timeSinceLastInvoke >= maxWait)
		);
	}

	function timerExpired() {
		var time = Date.now();
		if (shouldInvoke(time)) {
			return trailingEdge(time);
		}
		// Restart the timer.
		timerId = setTimeout(timerExpired, remainingWait(time));
	}

	function trailingEdge(time) {
		timerId = undefined;

		// Only invoke if we have `lastArgs` which means `func` has been
		// debounced at least once.
		if (trailing && lastArgs) {
			return invokeFunc(time);
		}
		lastArgs = lastThis = undefined;
		return result;
	}

	function cancel() {
		if (timerId !== undefined) {
			clearTimeout(timerId);
		}
		lastInvokeTime = 0;
		lastArgs = lastCallTime = lastThis = timerId = undefined;
	}

	function flush() {
		return timerId === undefined ? result : trailingEdge(Date.now());
	}

	function debounced() {
		let time = Date.now();
		let isInvoking = shouldInvoke(time);

		lastArgs = arguments;
		lastThis = this;
		lastCallTime = time;

		if (isInvoking) {
			if (timerId === undefined) {
				return leadingEdge(lastCallTime);
			}
			if (maxing) {
				// Handle invocations in a tight loop.
				clearTimeout(timerId);
				timerId = setTimeout(timerExpired, wait);
				return invokeFunc(lastCallTime);
			}
		}
		if (timerId === undefined) {
			timerId = setTimeout(timerExpired, wait);
		}
		return result;
	}
	debounced.cancel = cancel;
	debounced.flush = flush;
	return debounced;
};

export const throttle = (func, wait, options) => {
	var leading = true,
		trailing = true;

	if (_isObject(options)) {
		leading = 'leading' in options ? !!options.leading : leading;
		trailing = 'trailing' in options ? !!options.trailing : trailing;
	}
	return debounce(func, wait, {
		leading: leading,
		maxWait: wait,
		trailing: trailing
	});
};
