// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome', // A partir de aquí lineas metidas por mi
    chromeOptions: {
      binary: '/usr/bin/chromium',
      args: [
        "--headless",          // No abre ventana física
        "--no-sandbox",       // Necesario para correr como root en Docker
        "--disable-dev-shm-usage", // Evita errores de memoria en contenedores
      ]
    } // Hasta aquí lineas metidas por mi
  },
  chromeDriver: '/usr/bin/chromedriver', //Añadimos tambien esta linea
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};