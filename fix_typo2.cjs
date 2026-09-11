const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

// I replaced `</div>\s*<div className={\`grid grid-cols-1` with `</span></div>\n      <div className={\`grid grid-cols-1`
// And I replaced `<span className="text-[11px] font-medium text-white/50 uppercase tracking-widest">` with the new span.

// Let's first undo the `</span></div>` mess
code = code.replace(/<\/span><\/div>\n      <div className=\{`grid grid-cols-1/g, "</div>\n      <div className={`grid grid-cols-1");

// Now we have `<div ...><span ...>Espaciado entre Líneas\n</div>`
// Let's just do:
code = code.replace(/Espaciado entre Líneas\n\s*<\/div>/g, "Espaciado entre Líneas</span>\n        </div>");
code = code.replace(/Números de Capítulo\n\s*<\/div>/g, "Números de Capítulo</span>\n        </div>");
code = code.replace(/Fuente de Lectura\n\s*<\/div>/g, "Fuente de Lectura</span>\n        </div>");
code = code.replace(/Tamaño de Letra\n\s*<\/span><\/span>/g, "Tamaño de Letra</span></div>");

// Wait, looking at the esbuild error:
// 148|        <div className={`text-[11px] uppercase tracking-widest inline-block px-2 py-0.5 mb-2 ${uiStyle === 'dynamic' ? 'bg-[#81e6e6] text-black font-black italic skew-x-[-10deg]' : 'font-medium text-white/50'}`}><span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>
// 149|          Espaciado entre Líneas
// 150|        </div>

code = code.replace(/Espaciado entre Líneas\n\s*<\/div>/, "Espaciado entre Líneas\n        </span></div>");
code = code.replace(/Números de Capítulo\n\s*<\/div>/, "Números de Capítulo\n        </span></div>");
code = code.replace(/Fuente de Lectura\n\s*<\/div>/, "Fuente de Lectura\n        </span></div>");

fs.writeFileSync('src/components/TypographyControl.tsx', code);
