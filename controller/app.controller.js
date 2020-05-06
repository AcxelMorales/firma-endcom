const pug = require('pug');
const moment = require('moment');
const fs = require('fs');
const zip = require('node-zip')();
const mime = require('mime');
const webshot = require('webshot');

module.exports.index = (req, res) => res.render('index');

module.exports.check = function (req, res) {
  res.render('check', {
    nombre: req.body.nombre || 'Acxel Morales',
    puesto: req.body.puesto || 'Front-End Developer',
    telefono: req.body.telefono || '',
    movil1: req.body.movil1 || '',
    movil2: req.body.movil2 || '',
    email: req.body.email || 'acxel@conecta.mx',
  });
};

module.exports.generate = function (req, res) {
  pug.renderFile('views/check.pug', {
    nombre: req.body.nombre || '',
    puesto: req.body.puesto || '',
    telefono: req.body.telefono || '',
    movil1: req.body.movil1 || '',
    movil2: req.body.movil2 || '',
    email: req.body.email || '',
  }, function (err, html) {
    let time = moment().unix();
    let path = 'public';

    if (err) {
      console.log(err);
    } else {
      try {
        webshot(html, 'firma.jpg', {
          siteType: 'html',
          quality: 200,
          screenSize: {
            width: 400,
            height: 300
          },
          defaultWhiteBackground: true,
          shotSize: {
            width: 400,
            height: 'all',
          }
        }, function (error) {
          if (error) console.log(error);

          let image = fs.readFileSync('firma.jpg');

          zip.file('firma.html', html);
          zip.file('firma.jpg', image);

          let zipData = zip.generate({
            base64: false,
            compression: 'DEFLATE',
          });

          let zipFile = `${path}/firma${time}.zip`;
          let mimetype = mime.getType(zipFile);

          fs.writeFileSync(zipFile, zipData, 'binary');

          res.setHeader('Content-disposition', `attachment; filename=firma${time}.zip`);
          res.setHeader('Content-type', mimetype);

          let filestream = fs.createReadStream(zipFile);
          filestream.pipe(res);

          fs.unlinkSync(zipFile);
          fs.unlinkSync('firma.jpg');
        });
      } catch (e) {
        console.log(e);
        res.redirect('/');
      }
    }
  });
}