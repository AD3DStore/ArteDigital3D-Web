const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const stylesCssPath = path.join(__dirname, 'styles.css');
const appJsPath = path.join(__dirname, 'app.js');

try {
  console.log('Iniciando compilación de index.html sin cache (Smarter Compiler)...');

  // Read styles and app JS
  const stylesCss = fs.readFileSync(stylesCssPath, 'utf8');
  const appJs = fs.readFileSync(appJsPath, 'utf8');
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Define cache-control meta tags
  const cacheMetaTags = `
  <!-- Cache Control Meta Tags -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  `;

  // Insert cache-control meta tags inside <head>
  if (!indexHtml.includes('Cache-Control')) {
    indexHtml = indexHtml.replace('</head>', `${cacheMetaTags}\n</head>`);
  }

  // Compile CSS (Supports both template link and already-inlined style block)
  const cssMarker = '<!-- CSS -->';
  const linkCssRegex = /<link rel="stylesheet" href="styles\.css(\?v=[\d\.]+)?">/;
  
  if (indexHtml.includes(cssMarker)) {
    const startIndex = indexHtml.indexOf(cssMarker);
    const styleStart = indexHtml.indexOf('<style>', startIndex);
    const styleEnd = indexHtml.indexOf('</style>', styleStart);
    if (styleStart !== -1 && styleEnd !== -1 && styleStart < styleEnd) {
      console.log('Actualizando etiqueta <style> inline existente...');
      indexHtml = indexHtml.substring(0, styleStart) + `<style>\n${stylesCss}\n</style>` + indexHtml.substring(styleEnd + 8);
    } else if (linkCssRegex.test(indexHtml)) {
      console.log('Reemplazando link de CSS por etiqueta <style> inline...');
      indexHtml = indexHtml.replace(linkCssRegex, `<style>\n${stylesCss}\n</style>`);
    }
  } else if (linkCssRegex.test(indexHtml)) {
    console.log('Reemplazando link de CSS por etiqueta <style> inline (sin comentario marcador)...');
    indexHtml = indexHtml.replace(linkCssRegex, `<style>\n${stylesCss}\n</style>`);
  }

  // Compile JS (Supports both template script and already-inlined script block)
  const jsRegex = /<script src="app\.js(\?v=[\d\.]+)?"><\/script>/;
  const bodyCloseIndex = indexHtml.lastIndexOf('</body>');
  const lastScriptOpen = indexHtml.lastIndexOf('<script>', bodyCloseIndex);
  const lastScriptClose = indexHtml.lastIndexOf('</script>', bodyCloseIndex);

  if (lastScriptOpen !== -1 && lastScriptClose !== -1 && lastScriptOpen < lastScriptClose) {
    console.log('Actualizando etiqueta <script> inline existente...');
    indexHtml = indexHtml.substring(0, lastScriptOpen) + `<script>\n${appJs}\n</script>` + indexHtml.substring(lastScriptClose + 9);
  } else if (jsRegex.test(indexHtml)) {
    console.log('Reemplazando script de JS por etiqueta <script> inline...');
    indexHtml = indexHtml.replace(jsRegex, `<script>\n${appJs}\n</script>`);
  }

  // Save changes
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  console.log('¡Compilación completada con éxito!');
} catch (error) {
  console.error('Error durante la compilación:', error);
}
