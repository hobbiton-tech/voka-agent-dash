const { writeFile } = require('fs');
const { argv } = require('yargs');

require('dotenv').config();

const environment = argv.environment;
const isProduction = environment === 'prod';
// const targetPath = isProduction
//   ? `./src/environments/environment.prod.ts`
//   : `./src/environments/environment.ts`;
const targetPaths = [
  './src/environments/environment.ts',
  './src/environments/environment.prod.ts',
];

// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
  production: ${isProduction},
  baseUrl: '${process.env.BASE_URL}',
  api: {
    mobicom: {
      url: '${process.env.MOBICOM_API_URL}',
    },
    vokaadmin: {
      url: '${process.env.VOKA_ADMIN_API_URL}',
    },
    billPayments: {
      url: '${process.env.BILL_PAYMENT_API_URL}',
      userId: '${process.env.BILL_PAYMENT_API_USER_ID}',
      apiKey: '${process.env.BILL_PAYMENT_API_KEY}',
    },
  },
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    databaseURL: '${process.env.FIREBASE_DB_URL}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MSG_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
  },
};`;

targetPaths.forEach((targetPath) => {
  writeFile(targetPath, environmentFileContent, function (err) {
    if (err) {
      console.log(err);
    }

    console.info(`Wrote variables to ${targetPath}`);
  });
});
