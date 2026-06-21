const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const walk = (dir) => {
    let res = [];
    fs.readdirSync(dir).forEach(f => {
        f = path.join(dir, f);
        if (fs.statSync(f).isDirectory()) res.push(...walk(f));
        else if (f.endsWith('.jsx')) res.push(f);
    });
    return res;
};

walk('src').forEach(f => {
    let txt = fs.readFileSync(f, 'utf8');
    if (txt.includes(' || "";')) {
        try {
            const orig = execSync(`git show HEAD:${f.replace(/\\\\/g, '/')}`).toString();
            const map = {};
            orig.split('\\n').forEach(line => {
                const m = line.match(/(const|let)\\s+(\\w+)\\s*=\\s*([^|=]+)\\|\\|/);
                if (m) map[m[2]] = m[3].trim();
            });
            const newTxt = txt.replace(/(const|let)\\s+(\\w+)\\s*=\\s*\\|\\|\\s*'';/g, (match, prefix, varName) => {
                if (map[varName]) return `${prefix} ${varName} = ${map[varName]} || '';`;
                return match;
            });
            fs.writeFileSync(f, newTxt);
            console.log('Fixed ' + f);
        } catch (e) {
            console.log('Error on ' + f + ': ' + e.message);
        }
    }
});
