const fs = require('fs');
console.log('Starting copy...');
fs.cpSync('c:/Users/rodri/Documents/2DAW/DIW2/proyectoFinalDiseño', 'c:/Users/rodri/Documents/2DAW/DIW2/proyectoFinalDisenio', { recursive: true });
console.log('Copy complete!');
