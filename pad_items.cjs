const fs = require('fs');
let code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

// Padding of the list items: <label className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group ${
code = code.replace(
  /px-4 py-3 cursor-pointer/g,
  "px-5 py-4 md:px-8 md:py-5 cursor-pointer"
);

// Space between items:
// currently space-y-6 inside visual panel
code = code.replace(
  /uiStyle === 'dynamic' \? 'space-y-6'/g,
  "uiStyle === 'dynamic' ? 'space-y-8'"
);

// Tono del fondo buttons: <button className={`flex flex-col items-center justify-center p-4 text-sm
code = code.replace(
  /justify-center p-4 text-sm/g,
  "justify-center p-5 md:p-6 text-base"
);
code = code.replace(
  /w-full px-4 py-3 text-sm/g,
  "w-full px-5 py-4 md:px-6 md:py-5 text-base md:text-lg"
);

// Top header space
// <h2 className="text-3xl font-black italic tracking-tighter text-[#81e6e6] drop-shadow-md uppercase">Efectos</h2>
code = code.replace(
  /text-3xl font-black italic tracking-tighter/g,
  "text-4xl md:text-5xl font-black italic tracking-tighter"
);

// Volver button
// px-4 py-2 text-sm
code = code.replace(
  /px-4 py-2 font-black italic uppercase/g,
  "px-6 py-3 md:px-8 md:py-4 md:text-lg font-black italic uppercase"
);


fs.writeFileSync('src/components/SystemMenu.tsx', code);
