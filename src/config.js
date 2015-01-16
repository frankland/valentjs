class Config {

  constructor() {
    this.config = {};
  }

  enableScopeLogs(){
    this.config.scopeLogs = true;
  }

  disableScopeLogs(){
    this.config.scopeLogs = false;
  }

  isScopeLogsEnabled() {
    return !!this.config.scopeLogs;
  }
}


export default new Config();
