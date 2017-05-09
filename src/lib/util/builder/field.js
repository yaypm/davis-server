"use strict";

/**
 * Field for CardBuilder
 *
 * @class Field
 */
class Field {
  constructor(title, value, short = true) {
    this.title = title;
    this.value = value;
    this.short = short;
  }


  /**
   * Generate slack version of field
   *
   * @returns
   *
   * @memberOf Field
   */
  async slack() {
    return {
      title: await ((this.title.slack) ? this.title.slack() : this.title.toString()),
      value: await ((this.value.slack) ? this.value.slack() : this.value.toString()),
      short: this.short,
    };
  }
}

module.exports = Field;
