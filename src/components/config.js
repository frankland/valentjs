var colors = [
  '#008EBA',
  '#99CC00',
  '#AA66CC',
  '#FD7400',
  '#723147',
  '#FF5F5F',
  '#AC59D6',
  '#6B5D99',
  '#FFBB33',
  '#FF4444',
  '#1F8A70',
  '#9BCF2E',
  '#004358',
  '#979C9C',
  '#962D3E',
  '#35478C',
  '#5F9C6D',
  '#FD7400',
  '#16193B',
  '#7FB2F0'
];

var config = {
  colors,
  scopeLogs: false,
  moduleName: 'frankland.valent',
  routeProviderName: '$routeProvider',
  baseUrl: '',
  html5: true
};

class ConfigManager {
  constructor() {

  }

  useHtml5() {
    if (arguments.length == 1) {
      config.html5 = !!arguments[0];
    } else {
      return config.html5;
    }
  }

  setBaseUrl(baseUrl) {
    config.baseUrl = baseUrl;
  }

  getBaseUrl() {
    return config.baseUrl;
  }

  getColors() {
    return config.colors;
  }

  enableScopeLogs(){
    config.scopeLogs = true;
  }

  disableScopeLogs(){
    config.scopeLogs = false;
  }

  isScopeLogsEnabled() {
    return !!config.scopeLogs;
  }

  setRouteProviderName(provider) {
    config.routeProviderName = provider;
  }

  getRouteProviderName() {
    return config.routeProviderName;
  }

  setModuleName(name) {
    config.moduleName = name;
  }

  getModuleName() {
    return config.moduleName;
  }
}


export default new ConfigManager();
