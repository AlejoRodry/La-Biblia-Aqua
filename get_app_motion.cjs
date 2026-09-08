const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const match = code.match(/key="home-view"[\s\S]*?(?=\{\/\* Results Area)/);
if (match) {
    console.log(match[0].substring(0, 4000));
} else {
    console.log("No match");
}
