const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);

let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Pattern 1: $123.00 -> 123.00 dh
    content = content.replace(/\$(\d+(?:\.\d+)?)/g, '$1 dh');

    // Pattern 2: ${item.price} -> {item.price} dh 
    // This looks for $ immediately followed by {
    content = content.replace(/\$\{([^}]+)\}/g, (match, p1) => {
        // Only modify if it looks like a price variable (e.g. price, discountedPrice, totalPrice)
        // Or if we know it's a JSX string interpolation where the $ is literal
        if (p1.toLowerCase().includes('price') || p1.includes(' * ')) {
            return `{${p1}} dh`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        changedFiles++;
        console.log('Modified:', file);
    }
});

console.log(`Changed ${changedFiles} files.`);
