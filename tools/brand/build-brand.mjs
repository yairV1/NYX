/** NYX identity reconstructed as native SVG from docs/references/nyx-identity.png.
 * Original sheet is preserved. Generates separate, reusable assets and icon sizes.
 * Run: node tools/brand/build-brand.mjs
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const defs = `<defs>
 <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b084ff"/><stop offset=".5" stop-color="#7c3aed"/><stop offset="1" stop-color="#5657d9"/></linearGradient>
 <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#aaa2ad"/><stop offset="1" stop-color="#665d70"/></linearGradient>
 <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a0edf2"/><stop offset=".45" stop-color="#c7c2ff"/><stop offset="1" stop-color="#a385ed"/></linearGradient>
 <linearGradient id="eye" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d8d599"/><stop offset="1" stop-color="#7fb76a"/></linearGradient>
</defs>`;

const face = `<g stroke="#171627" stroke-linecap="round" stroke-linejoin="round">
 <path d="M30 83 27 23Q28 11 37 18L72 46Q100 36 128 46L163 18Q172 11 173 23L170 83 181 101 174 106 183 121 167 124 174 137 156 139Q145 166 100 170 56 166 43 139L26 137 33 124 17 121 26 106 19 101Z" fill="url(#fur)" stroke-width="5"/>
 <path d="m39 64-2-33 26 25Zm98-8 26-25-2 33Z" fill="#bb8caa" stroke-width="3"/>
 <path d="m40 58 2-17 14 15m88 0 14-15 2 17" fill="none" stroke="#e0b5ce" stroke-width="3"/>
 <path d="m35 74 12-10-8 24m122-14-12-10 8 24" fill="#d1c5cf" stroke-width="2"/>
 <g fill="#292435" stroke="none">
  <path d="m72 47 12-3 5 30-11-8Zm20-6h16l-3 35h-10Zm24 3 12 3-6 19-11 8Z"/>
  <path d="m46 68 23 7 8 12-25-7Zm108 0-23 7-8 12 25-7Z"/>
  <path d="m28 99 23 5 7 9-27-4Zm144 0-23 5-7 9 27-4Z"/>
  <path d="m32 118 25 6 7 11-23-4Zm136 0-25 6-7 11 23-4Z"/>
  <path d="m53 140 23 5 8 13-20-7Zm94 0-23 5-8 13 20-7Z"/>
 </g>
 <path d="M44 93Q57 78 79 88 88 95 84 111 76 123 60 119 45 115 44 93Z" fill="url(#eye)" stroke-width="4"/>
 <path d="M156 93Q143 78 121 88 112 95 116 111 124 123 140 119 155 115 156 93Z" fill="url(#eye)" stroke-width="4"/>
 <ellipse cx="68" cy="102" rx="10" ry="15" fill="#10131c" stroke="none"/><ellipse cx="132" cy="102" rx="10" ry="15" fill="#10131c" stroke="none"/>
 <g fill="#f6f4ed" stroke="none"><circle cx="64" cy="95" r="5"/><circle cx="128" cy="95" r="5"/><circle cx="73" cy="110" r="2"/><circle cx="137" cy="110" r="2"/></g>
 <path d="M100 125Q81 116 71 132 64 145 83 151 92 155 100 150 108 155 117 151 136 145 129 132 119 116 100 125Z" fill="#d2c7ce" stroke-width="2"/>
 <path d="M90 126Q100 121 110 126L100 136Z" fill="#d49aa8" stroke-width="2.5"/>
 <path d="M100 136v7m0 0q-8 8-15 0m15 0q8 8 15 0" fill="none" stroke-width="2.5"/>
 <g fill="#5c5262" stroke="none"><circle cx="81" cy="135" r="1.5"/><circle cx="77" cy="140" r="1.5"/><circle cx="119" cy="135" r="1.5"/><circle cx="123" cy="140" r="1.5"/></g>
 <g fill="none" stroke="#d9cfdf" stroke-width="1.8"><path d="M76 136 27 130m49 11-48 6m96-11 49-6m-49 11 48 6"/></g>
 <path d="m80 162 8 9 12-4 12 4 8-9" fill="#2b243a" stroke-width="2"/>
</g>`;

// Original vector lettering: angled Nyx, rounded y, and paw above the x.
const wordmark = `<g fill="url(#ink)">
 <path d="M5 87 24 10 41 13 65 57 80 4 98 7 74 88 58 84 35 43 24 91Z"/>
 <path d="M102 34Q116 27 122 35L116 60Q114 69 122 68 132 63 143 30L161 35Q148 79 124 101 113 112 93 111L97 94Q115 95 125 82 99 91 98 68Z"/>
 <path d="m168 36 18-5 13 18 20-21 15 12-25 23 16 22-20 7-12-19-20 23-18-11 27-29Z"/>
 <ellipse cx="217" cy="12" rx="5" ry="7" transform="rotate(-20 217 12)"/><ellipse cx="232" cy="6" rx="5" ry="7" transform="rotate(10 232 6)"/><ellipse cx="245" cy="16" rx="5" ry="6" transform="rotate(35 245 16)"/>
 <path d="M225 24q4-10 10-7 5 3 7 10 1 5-5 5l-6-2q-11 4-6-6Z"/>
</g>`;

const lineFace = `<g fill="none" stroke="#17142f" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
 <path d="M45 83 47 35 76 60Q100 51 124 60L153 35 155 83Q172 105 159 133 143 159 100 160 57 159 41 133 28 105 45 83Z"/>
 <path d="m53 67 2-16 13 14m64 0 13-14 2 16M91 62l4 15m14-15-4 15"/>
 <ellipse cx="72" cy="104" rx="18" ry="21"/><ellipse cx="128" cy="104" rx="18" ry="21"/>
 <path d="M100 132v8m0 0q-9 8-17 0m17 0q9 8 17 0M57 131l-22-5m22 13-21 5m107-13 22-5m-22 13 21 5"/>
</g><g fill="#17142f"><ellipse cx="75" cy="106" rx="6" ry="10"/><ellipse cx="125" cy="106" rx="6" ry="10"/><path d="M93 127q7-5 14 0l-7 7Z"/></g><g fill="#ded0ff"><circle cx="72" cy="101" r="3"/><circle cx="122" cy="101" r="3"/></g>`;

const svg = (viewBox, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title"><title id="title">${title}</title>${defs}${body}</svg>\n`;
const root = "public/assets/nyx/logos/";
await writeFile(
  root + "nyx-emblem.svg",
  svg(
    "0 0 200 200",
    `<circle cx="100" cy="100" r="91" fill="url(#violet)"/>${face}`,
    "Rostro atigrado de NYX",
  ),
);
await writeFile(root + "nyx-wordmark.svg", svg("0 0 255 116", wordmark, "Nyx"));
await writeFile(
  root + "nyx-logo.svg",
  svg(
    "0 0 450 200",
    `<circle cx="100" cy="100" r="91" fill="url(#violet)"/>${face}<g transform="translate(205 44) scale(.94)">${wordmark}</g>`,
    "NYX — tu compañero en el código y en la vida",
  ),
);
await writeFile(
  root + "nyx-logo-stacked.svg",
  svg(
    "0 0 220 275",
    `<g transform="translate(10 0)"><circle cx="100" cy="100" r="91" fill="url(#violet)"/>${face}</g><g transform="translate(5 169) scale(.84)">${wordmark}</g>`,
    "Logo principal NYX",
  ),
);
await writeFile(
  root + "nyx-isotype.svg",
  svg(
    "0 0 200 200",
    lineFace.replaceAll("#17142f", "#c6a5fa"),
    "Isotipo de NYX",
  ),
);
const icon = svg(
  "0 0 200 200",
  `<rect x="5" y="5" width="190" height="190" rx="44" fill="url(#violet)"/><rect x="7" y="7" width="186" height="186" rx="42" fill="none" stroke="#cfb2ff" stroke-opacity=".6" stroke-width="2"/>${lineFace}`,
  "NYX",
);
await writeFile(root + "nyx-app-icon.svg", icon);
await writeFile("src/app/icon.svg", icon);
await sharp(Buffer.from(icon))
  .resize(180, 180)
  .png()
  .toFile("src/app/apple-icon.png");
// ICO container with a PNG-compressed 256px entry, plus small DIB entries.
const sizes = [16, 32, 48, 64, 256];
const payloads = [];
for (const size of sizes) {
  if (size === 256) {
    payloads.push(
      await sharp(Buffer.from(icon)).resize(size, size).png().toBuffer(),
    );
    continue;
  }
  const rgba = await sharp(Buffer.from(icon))
    .resize(size, size)
    .ensureAlpha()
    .raw()
    .toBuffer();
  const maskStride = Math.ceil(size / 32) * 4,
    pixelSize = size * size * 4;
  const dib = Buffer.alloc(40 + pixelSize + maskStride * size);
  dib.writeUInt32LE(40, 0);
  dib.writeInt32LE(size, 4);
  dib.writeInt32LE(size * 2, 8);
  dib.writeUInt16LE(1, 12);
  dib.writeUInt16LE(32, 14);
  dib.writeUInt32LE(pixelSize, 20);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4,
        dst = 40 + ((size - 1 - y) * size + x) * 4;
      dib[dst] = rgba[src + 2];
      dib[dst + 1] = rgba[src + 1];
      dib[dst + 2] = rgba[src];
      dib[dst + 3] = rgba[src + 3];
      if (rgba[src + 3] < 128)
        dib[40 + pixelSize + (size - 1 - y) * maskStride + (x >> 3)] |=
          0x80 >> (x % 8);
    }
  payloads.push(dib);
}
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const p = 6 + i * 16;
  header[p] = size === 256 ? 0 : size;
  header[p + 1] = size === 256 ? 0 : size;
  header.writeUInt16LE(1, p + 4);
  header.writeUInt16LE(32, p + 6);
  header.writeUInt32LE(payloads[i].length, p + 8);
  header.writeUInt32LE(offset, p + 12);
  offset += payloads[i].length;
});
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...payloads]));
console.log("Created NYX logo, emblem, wordmark, isotype and web/app icons.");
