class Linker {
  constructor(davis) {
    this.davis = davis;
  }

  home() {
    return this.davis.config.getDynatraceUrl();
  }

  vrp(pid) {
    // https://cdojfgmpzd.live.dynatrace.com/#vres;pid=-4502208762326885074
    return `${this.home()}/#vres;pid=${pid}`;
  }

  smartScape() {
    return `${this.home()}/#smartscape`;
  }
}

module.exports = Linker;
