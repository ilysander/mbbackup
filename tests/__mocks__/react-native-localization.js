const interfaceLanguage = 'en';

class RNLocalization {
  constructor(props) {
    this.props = props;
    this.setLanguage(interfaceLanguage);
  }

  setLanguage(interfaceLanguage) {
    const bestLanguage = interfaceLanguage;
    this.language = bestLanguage;
    if (this.props[bestLanguage]) {
      var localizedStrings = this.props[this.language];
      for (var key in localizedStrings) {
        if (localizedStrings.hasOwnProperty(key)) {
          this[key] = localizedStrings[key];
        }
      }
    }
  }
}

export default RNLocalization;
