const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

// Fix unclosed spans inside `div` headers
code = code.replace(/Espaciado entre Líneas\s*<\/div>/g, "Espaciado entre Líneas\n        </span></div>");
code = code.replace(/Números de Capítulo\s*<\/div>/g, "Números de Capítulo\n        </span></div>");
code = code.replace(/<span className=\{uiStyle === 'dynamic' \? 'block skew-x-\[10deg\]' : ''\}>\s*Fuente de Lectura\s*<\/div>\s*<div className=\{`grid grid-cols-1/g, "<span className={uiStyle === 'dynamic' ? 'block skew-x-[10deg]' : ''}>\n          Fuente de Lectura\n        </span></div>\n      <div className={`grid grid-cols-1");

// Fix the corrupted `const renderNumber = () => (` that probably has extra </span></div>
code = code.replace(/<\/span><\/div>\n      <div className=\{`grid grid-cols-1\s*\);\s*const renderNumber = \(\) => \(/g, "</div>\n    );\n\n    const renderNumber = () => (");

// Let's just fix the whole structure manually
