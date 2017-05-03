"use strict";

/**
 * Create audible and visual versions of entity aliases
 *
 * @class Entity
 */
class Entity {
  constructor(alias, fallback) {
    this.alias = alias;
    this.fallback = fallback;
  }

  slack() {
    return (this.alias) ? this.alias.display.visual : this.fallback;
  }

  audible() {
    return (this.alias) ? this.alias.display.audible : this.fallback;
  }

  toString() {
    return (this.alias) ? this.alias.display.visual : this.fallback;
  }
}

module.exports = Entity;
