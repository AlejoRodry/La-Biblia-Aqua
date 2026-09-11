const fs = require('fs');
let code = fs.readFileSync('src/components/TypographyControl.tsx', 'utf8');

code = code.replace(/Familia Tipográfica\n\s*<\/div>/g, "Familia Tipográfica</span>\n      </div>");

fs.writeFileSync('src/components/TypographyControl.tsx', code);
