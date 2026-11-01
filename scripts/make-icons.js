import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rawRows = [];

  // Create an attractive gradient background with a glowing center mark
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter type 0: None
    const ny = y / height;

    for (let x = 0; x < width; x++) {
      const nx = x / width;
      // Distance from center
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base gradient: Indigo #4f46e5 to Violet #8b5cf6
      let r = Math.round(79 + (139 - 79) * nx);
      let g = Math.round(70 + (92 - 70) * ny);
      let b = Math.round(229 + (246 - 229) * (nx + ny) / 2);
      let a = 255;

      // Rounded squircle corner mask if not maskable
      if (!isMaskable) {
        const cornerR = 0.22;
        const qx = Math.max(0, Math.abs(dx) - (0.5 - cornerR));
        const qy = Math.max(0, Math.abs(dy) - (0.5 - cornerR));
        const qDist = Math.sqrt(qx * qx + qy * qy);
        if (qDist > cornerR) {
          a = 0;
        }
      }

      // Stylized central emblem (glowing white/cyan ring & check)
      if (a > 0) {
        if (dist > 0.18 && dist < 0.28) {
          // Circular ring
          r = Math.min(255, r + 120);
          g = Math.min(255, g + 140);
          b = 255;
        }
        // Check mark or center spark
        if (Math.abs(dx + dy * 0.5) < 0.05 && nx > 0.35 && nx < 0.65 && ny > 0.35 && ny < 0.65) {
          r = 255;
          g = 255;
          b = 255;
        }
      }

      const offset = 1 + x * 4;
      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }
    rawRows.push(row);
  }

  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData);

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/pwa-192x192.png', createPng(192));
fs.writeFileSync('public/pwa-512x512.png', createPng(512));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPng(512, true));
fs.writeFileSync('public/apple-touch-icon.png', createPng(180));
console.log('PNG icons created successfully!');
