const path = require('path');

const ImageUtilities = require('./ImageUtilities');

const imgsrc = path.resolve(__dirname, '../images/Hillary_Goldwynn.jpg');

const imgdest = path.resolve(__dirname, '../images/dist/Hillary_Goldwynn.jpg');

const utilities = new ImageUtilities(imgsrc, imgdest);

utilities.resize(200, 400).then((data) => {
  console.log(data);
}).catch((err) => console.log(err));
