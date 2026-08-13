const fs = require('fs');
const file = 'd:/al3ab/screen-duplicate-hero/src/data/enta_bet2ol_eh.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let modified = false;

data.categories.forEach(c => {
  c.questions.forEach(q => {
    q.options = q.options.map(o => {
      // Remove any text in parentheses or brackets, e.g., ' (Pumice)' or ' [1]'
      const cleaned = o.replace(/\s*[\(\[].*?[\)\]]/g, '').trim();
      if (cleaned !== o) modified = true;
      return cleaned;
    });
  });
});

if (modified) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully removed brackets from options in enta_bet2ol_eh.json');
} else {
  console.log('No modifications needed');
}
