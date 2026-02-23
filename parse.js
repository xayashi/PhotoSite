import fs from 'fs';
const data = JSON.parse(fs.readFileSync('report.json', 'utf16le').replace(/^\uFEFF/, ''));
data.suites.forEach(s => {
    s.suites?.forEach(s2 => {
        s2.specs?.forEach(sp => {
            if (!sp.ok) {
                console.log(sp.title);
                sp.tests.forEach(t => {
                    t.results.forEach(r => {
                        if (r.error) console.log(r.error.message.split('\n').slice(0, 5).join('\n'));
                    });
                });
                console.log('---');
            }
        });
    });
});
