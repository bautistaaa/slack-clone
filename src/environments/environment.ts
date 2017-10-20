// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBq3sfV_ZPgOTjosMEC_cw84toWHBq0CSo',
    authDomain: 'slack-clone-f13de.firebaseapp.com',
    databaseURL: 'https://slack-clone-f13de.firebaseio.com',
    projectId: 'slack-clone-f13de',
    storageBucket: 'slack-clone-f13de.appspot.com',
    messagingSenderId: '1076304979536'
  }
};
