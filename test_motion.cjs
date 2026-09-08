const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<motion\.div\s*key="home-view"[\s\S]*?<\/motion\.div>/m;
const match = code.match(regex);
if (match) {
    console.log(match[0].substring(0, 3000));
}
