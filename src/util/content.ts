declare global {
  const state: any;
}

export const colors = [
  "#f1c40f",
  "#3498db",
  "#e91e63",
  "#e74c3c",
  "#e67e22",
  "#1abc9c",
  "#9b59b6",
  "#2ecc71",
];

export function parseMxc(mxc: string, thumbW?: number, thumbH?: number): string {
  if (!mxc) return null;
  let replacer = `${state.api.baseUrl}/_matrix/media/r0/${thumbW ? "thumbnail" : "download"}/$1/$2`;
  if (thumbH) {
    replacer += `?height=${thumbH}&width=${thumbW}`;
  } else if (thumbW) {
    replacer += `?height=${thumbW}&width=${thumbW}`;
  }
  return mxc.replace(/mxc:\/\/([^/]+)\/(.+)/, replacer);
}

export function calculateHash(str: string): number {
  if (!str?.length) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateAvatar(userId: string): string {
  const size = 72;
  const squares = 4;
  const margin = 14;
  
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  
  const hash = calculateHash(userId);
  const rnd = makeRandom();
  ctx.fillStyle = colors[hash % 8];
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  
  for(let i = 0; i < squares; i++) {
    for (let j = 0; j < squares / 2; j++) {
      if (rnd()) {
        square(j, i);
        square(squares - j - 1, i);
      }
    }
  }
  
  return canvas.toDataURL();
  
  function square(x: number, y: number) {
    const s = (size - margin * 2) / squares;
    ctx.fillRect(x * s + margin, y * s + margin, s, s);
  }
  
  function makeRandom() {
    let bit = 0;
    return () => hash & (2 ** (++bit));
  }
}
