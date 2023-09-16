const path = require('path');

const COMMON_EXTENSIONS = '/**/*.{js,jsx,ts,tsx,vue,html}';

module.exports = {
  input: [
    `./src/pages${COMMON_EXTENSIONS}`,
    `./src/components${COMMON_EXTENSIONS}`,
    `./src/container${COMMON_EXTENSIONS}`,
    `./src/data${COMMON_EXTENSIONS}`,
  ],
  options: {
    defaultLng: 'ko',
    lngs: ['ko', 'en', 'ja'],
    func: {
      list: ['i18next.t', 'i18n.t', '$i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html'],
    },
    resource: {
      loadPath: path.join(__dirname, 'src/i18n/locales/{{lng}}/{{ns}}.json'),
      savePath: path.join(__dirname, 'src/i18n/locales/{{lng}}/{{ns}}.json'),
    },
    defaultValue(lng, ns, key) {
      const keyAsDefaultValue = ['ko'];
      if (keyAsDefaultValue.includes(lng)) {
        const separator = '~~';
        const value = key.includes(separator) ? key.split(separator)[1] : key;

        return value;
      }

      return '';
    },
    keySeparator: false,
    nsSeparator: false,
    prefix: '%{',
    suffix: '}',
  },
};
