const fs = require('fs');
const code = fs.readFileSync('src/components/SystemMenu.tsx', 'utf8');

const regex = /\{\/\* Polígono Diagonal a la Derecha[^]*?<\/motion\.div>/m;
const match = code.match(regex);
if (match) {
    console.log(match[0]);
} else {
    console.log("No match");
}
