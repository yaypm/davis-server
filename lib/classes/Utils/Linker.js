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
  
  rootcause(problem) {
    // https://cdojfgmpzd.live.dynatrace.com/#hostdetails;id=HOST-2DE619321ED7EF4B;gtf=p_-3622019608616690816;pid=-3622019608616690816
    return this.davis.utils.url.event(problem, problem.rankedEvents[0], this.home());
  }
}

module.exports = Linker;
