import fs from 'fs';
import zlib from 'zlib';

function createPNG(size: number, outPath: string) {
  // width and height: size x size
  // Create RGBA buffer: each scanline has 1 filter byte (0) + size * 4 bytes
  const scanlineLength = 1 + size * 4;
  const rawBuffer = Buffer.alloc(scanlineLength * size);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.44;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * scanlineLength;
    rawBuffer[rowOffset] = 0; // Filter: None

    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded square or circle with gradient
      const inRoundedSquare = Math.abs(dx) < size * 0.44 && Math.abs(dy) < size * 0.44;
      const cornerDist = Math.hypot(
        Math.max(0, Math.abs(dx) - size * 0.32),
        Math.max(0, Math.abs(dy) - size * 0.32)
      );

      if (cornerDist <= size * 0.12) {
        // Inside icon background
        // Gradient from cyan (#00d2ff) to deep navy (#0a192f)
        const t = (y / size);
        let rVal = Math.round(8 + t * 12);
        let gVal = Math.round(25 + t * 20);
        let bVal = Math.round(55 + t * 40);

        // Gold cross / open book stylized icon in center
        // Let's draw an open book shape
        const nx = (x - cx) / (size * 0.3); // -1 to 1
        const ny = (y - cy) / (size * 0.3); // -1 to 1

        // Book pages:
        const isLeftPage = nx >= -0.85 && nx <= -0.05 && ny >= -0.55 && ny <= 0.55;
        const isRightPage = nx >= 0.05 && nx <= 0.85 && ny >= -0.55 && ny <= 0.55;

        // Curves for pages:
        const pageArch = Math.sin((Math.abs(nx) - 0.05) * 3.14159 / 0.8) * 0.12;
        const inLeft = nx >= -0.85 && nx <= -0.06 && ny >= (-0.5 + pageArch) && ny <= (0.5 + pageArch);
        const inRight = nx >= 0.06 && nx <= 0.85 && ny >= (-0.5 + pageArch) && ny <= (0.5 + pageArch);

        if (inLeft || inRight) {
          // Page texture/gold/white
          const isBorder = (nx <= -0.8 || nx >= 0.8 || ny <= -0.45 + pageArch || ny >= 0.45 + pageArch);
          if (isBorder) {
            rVal = 245; gVal = 197; bVal = 66; // Gold #f5c542
          } else {
            rVal = 240; gVal = 248; bVal = 255; // White
          }

          // Small cross on right page or decorative lines
          if (inRight && Math.abs(nx - 0.45) < 0.04 && ny >= 0.0 && ny <= 0.35) {
            rVal = 220; gVal = 160; bVal = 40;
          }
          if (inRight && Math.abs(ny - 0.12) < 0.04 && nx >= 0.32 && nx <= 0.58) {
            rVal = 220; gVal = 160; bVal = 40;
          }
        } else if (Math.abs(nx) < 0.06 && ny >= -0.45 && ny <= 0.65) {
          // Spine / ribbon
          rVal = 230; gVal = 50; bVal = 60; // Red bookmark ribbon
        }

        rawBuffer[pxOffset] = rVal;
        rawBuffer[pxOffset + 1] = gVal;
        rawBuffer[pxOffset + 2] = bVal;
        rawBuffer[pxOffset + 3] = 255; // Full alpha
      } else {
        // Transparent outside rounded corner
        rawBuffer[pxOffset] = 0;
        rawBuffer[pxOffset + 1] = 0;
        rawBuffer[pxOffset + 2] = 0;
        rawBuffer[pxOffset + 3] = 0;
      }
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawBuffer);

  // Helper to write chunk
  function makeChunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const toCrc = Buffer.concat([typeBuf, data]);

    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // CRC32 implementation
  function crc32(buf: Buffer): number {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        const bit = (byte ^ crc) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xEDB88320 : 0);
        byte >>>= 1;
      }
    }
    return (crc ^ (-1)) >>> 0;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const pngFile = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outPath, pngFile);
  console.log(`Generated ${outPath} (${pngFile.length} bytes)`);
}

// Ensure public dir
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

createPNG(192, './public/icon-192.png');
createPNG(512, './public/icon-512.png');
