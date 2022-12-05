// bezier code from https://gist.github.com/pushkine/fbc7cf18e0a40ffb02b3b3a20b74f4f1
// when will svelte add a builtin `bezier()` easing function ;-;
export function bezier(x1: number, y1: number, x2: number, y2: number): (time: number) => number {
	if (!(x1 >= 0 && x1 <= 1 && x2 >= 0 && x2 <= 1))
		throw new Error(`CubicBezier x1 & x2 values must be { 0 < x < 1 }, got { x1 : ${x1}, x2: ${x2} }`);
	const ax = 1.0 - (x2 = 3.0 * (x2 - x1) - (x1 *= 3.0)) - x1,
		ay = 1.0 - (y2 = 3.0 * (y2 - y1) - (y1 *= 3.0)) - y1;
	let i = 0, r = 0.0, s = 0.0, d = 0.0, x = 0.0;
	return (time): number => {
		for (r = time, i = 0; 32 > i; i++)
			if (1e-5 > Math.abs((x = r * (r * (r * ax + x2) + x1) - time))) return r * (r * (r * ay + y2) + y1);
			else if (1e-5 > Math.abs((d = r * (r * ax * 3.0 + x2 * 2.0) + x1))) break;
			else r -= x / d;
		if ((s = 0.0) > (r = time)) return 0;
		else if ((d = 1.0) < r) return 1;
		while (d > s)
			if (1e-5 > Math.abs((x = r * (r * (r * ax + x2) + x1)) - time)) break;
			else time > x ? (s = r) : (d = r), (r = 0.5 * (d - s) + s);
		return r * (r * (r * ay + y2) + y1);
	};
}
