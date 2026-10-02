import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const designDir = path.resolve('../design');
const desktopDir = path.join(designDir, 'desktop');
const tabletDir = path.join(designDir, 'tablet');
const mobileDir = path.join(designDir, 'mobile');

[designDir, desktopDir, tabletDir, mobileDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Clean up temporary test files
const testFiles = [
  'test_empleo_desktop.png',
  'test_empleo_desktop_full.png',
  'test_empleo_mobile_viewport.png',
  'test_empleo_mobile_full.png',
  'test_empleo_tablet.png'
];
testFiles.forEach(f => {
  const p = path.join(designDir, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

const screens = [
  { id: '01_login', name: 'Inicio de Sesión', param: 'login' },
  { id: '02_registro', name: 'Registro de Candidato', param: 'register' },
  { id: '03_empleo', name: 'Ofertas de Empleo', param: 'empleo' },
  { id: '04_empleo_publico', name: 'Empleo Público y Oposiciones', param: 'publico' },
  { id: '05_cursos', name: 'Cursos y Formación', param: 'cursos' },
  { id: '06_empresas', name: 'Directorio de Empresas e Insignias', param: 'empresas' },
  { id: '07_perfil', name: 'Perfil Profesional del Candidato', param: 'perfil' },
  { id: '08_insignias', name: 'Catálogo de Insignias Técnicas', param: 'insignias' },
];

const devices = [
  {
    name: 'desktop',
    folder: desktopDir,
    viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    isMobile: false,
    hasTouch: false,
  },
  {
    name: 'tablet',
    folder: tabletDir,
    viewport: { width: 768, height: 1024, deviceScaleFactor: 2 },
    isMobile: false,
    hasTouch: true,
  },
  {
    name: 'mobile',
    folder: mobileDir,
    viewport: { width: 390, height: 844, deviceScaleFactor: 2 },
    isMobile: true,
    hasTouch: true,
  },
];

async function captureAll() {
  console.log('Iniciando captura de pantallas...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const device of devices) {
    console.log(`\n=== Procesando dispositivo: ${device.name.toUpperCase()} ===`);
    await page.setViewport({
      ...device.viewport,
      isMobile: device.isMobile,
      hasTouch: device.hasTouch,
    });

    for (const screen of screens) {
      const url = `http://localhost:3000/?screen=${screen.param}`;
      process.stdout.write(`Capturando [${device.name}] ${screen.name}... `);

      await page.goto(url, { waitUntil: 'networkidle0' });
      // Allow animations and fonts to settle
      await new Promise(r => setTimeout(r, 1000));

      const fileName = `${screen.id}_${screen.param}_${device.name}.png`;
      const filePath = path.join(device.folder, fileName);

      await page.screenshot({
        path: filePath,
        fullPage: false,
      });

      console.log(`✓ Guardado: ${fileName}`);
    }
  }

  await browser.close();
  console.log('\nTodas las capturas se han generado con éxito en /design');

  // Generar un catálogo HTML interactivo en /design/index.html
  generateCatalog();
}

function generateCatalog() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GrowUp Job — Catálogo de Diseño (Desktop, Tablet, Mobile)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 32px 24px;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 40px auto;
      text-align: center;
      padding-bottom: 24px;
      border-bottom: 1px solid #334155;
    }
    .badge {
      display: inline-block;
      background: #2563eb;
      color: white;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    p.sub {
      color: #94a3b8;
      font-size: 15px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 60px;
    }
    .screen-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    }
    .screen-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .screen-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .screen-title span {
      background: #3b82f6;
      color: white;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .grid {
      display: grid;
      grid-template-columns: 2fr 1.2fr 0.8fr;
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 1024px) {
      .grid { grid-template-columns: 1fr; }
    }
    .device-preview {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .device-title {
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      justify-content: space-between;
    }
    .device-title a {
      color: #60a5fa;
      text-decoration: none;
    }
    .device-title a:hover {
      text-decoration: underline;
    }
    .device-img-wrapper {
      background: #020617;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #1e293b;
      cursor: pointer;
    }
    .device-img-wrapper img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.2s ease;
    }
    .device-img-wrapper:hover img {
      transform: scale(1.01);
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">UI / UX Design Showcase</div>
    <h1>GrowUp Job — Galería de Pantallas</h1>
    <p class="sub">Capturas en alta resolución para Desktop (1440×900), Tablet (768×1024) y Mobile (390×844)</p>
  </header>

  <div class="container">
    ${screens.map(screen => `
      <section class="screen-card" id="${screen.id}">
        <div class="screen-header">
          <h2 class="screen-title">
            <span>${screen.id.split('_')[0]}</span>
            ${screen.name}
          </h2>
          <span style="font-size: 13px; color: #64748b;">Ruta: /?screen=${screen.param}</span>
        </div>
        <div class="grid">
          <div class="device-preview">
            <div class="device-title">
              <span>🖥️ Desktop (1440×900)</span>
              <a href="desktop/${screen.id}_${screen.param}_desktop.png" target="_blank">Ver original ↗</a>
            </div>
            <div class="device-img-wrapper">
              <a href="desktop/${screen.id}_${screen.param}_desktop.png" target="_blank">
                <img src="desktop/${screen.id}_${screen.param}_desktop.png" alt="${screen.name} - Desktop" loading="lazy">
              </a>
            </div>
          </div>

          <div class="device-preview">
            <div class="device-title">
              <span>📱 Tablet (768×1024)</span>
              <a href="tablet/${screen.id}_${screen.param}_tablet.png" target="_blank">Ver original ↗</a>
            </div>
            <div class="device-img-wrapper">
              <a href="tablet/${screen.id}_${screen.param}_tablet.png" target="_blank">
                <img src="tablet/${screen.id}_${screen.param}_tablet.png" alt="${screen.name} - Tablet" loading="lazy">
              </a>
            </div>
          </div>

          <div class="device-preview">
            <div class="device-title">
              <span>📲 Mobile (390×844)</span>
              <a href="mobile/${screen.id}_${screen.param}_mobile.png" target="_blank">Ver original ↗</a>
            </div>
            <div class="device-img-wrapper">
              <a href="mobile/${screen.id}_${screen.param}_mobile.png" target="_blank">
                <img src="mobile/${screen.id}_${screen.param}_mobile.png" alt="${screen.name} - Mobile" loading="lazy">
              </a>
            </div>
          </div>
        </div>
      </section>
    `).join('\n')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(designDir, 'index.html'), html, 'utf-8');
  console.log('Catálogo HTML generado en design/index.html');
}

captureAll().catch(err => {
  console.error('Error al capturar:', err);
  process.exit(1);
});
