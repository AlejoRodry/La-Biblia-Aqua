import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svgPath = path.resolve(process.cwd(), 'public/icon.svg');
const svg = fs.readFileSync(svgPath, 'utf8');

function renderPNG(size: number, outPath: string) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: size,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Generated ${outPath} (${size}x${size}, ${pngBuffer.length} bytes)`);
}

renderPNG(192, path.resolve(process.cwd(), 'public/icon-192.png'));
renderPNG(512, path.resolve(process.cwd(), 'public/icon-512.png'));
