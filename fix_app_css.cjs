const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if(!code.includes('.motion-container-absolute')) {
    code += `\n.motion-container-absolute { width: 100% !important; max-width: 42rem !important; margin: 0 auto !important; left: 0 !important; right: 0 !important; }`;
    fs.writeFileSync('src/index.css', code);
    console.log("Added css");
}

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto min-h-\[80svh\] py-12 origin-top"/, 
'className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-4 sm:mt-8 mb-8 sm:mb-12 mx-auto min-h-[80svh] py-12 origin-top motion-container-absolute"');
fs.writeFileSync('src/App.tsx', appCode);

