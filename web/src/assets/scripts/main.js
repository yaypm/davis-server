(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('../js-common-components/accordion');

var toggleClass = 'is-expanded';

var init = function init() {
  (0, _dollar2.default)('.expandable__trigger').forEach(function (el) {
    if (!el.getAttribute('data-initialized')) {
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        el.closest('.expandable').classList.toggle(toggleClass);
      });
      el.setAttribute('data-initialized', true);
    }
  });
};

init();

},{"../js-common-components/accordion":2,"../js-common-components/dollar":4}],2:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toggleClass = 'is-expanded';

var handleClick = function handleClick(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  var trigger = ev.target.closest('.expandable');
  var expandables = trigger.parentNode.querySelectorAll('.expandable');
  Array.prototype.forEach.call(expandables, function (el) {
    if (el !== trigger) {
      el.classList.remove(toggleClass);
    }
    return;
  });
};

var init = function init() {
  (0, _dollar2.default)('[data-behavior*=accordion] .expandable__trigger').forEach(function (el) {
    el.addEventListener('click', handleClick);
  });
};

init();

},{"../js-common-components/dollar":4}],3:[function(require,module,exports){
// matches polyfill
var matchesPolyfill = function applyMatchesPolyfill(proto) {
  var ElementPrototype = proto;
  ElementPrototype.matches = ElementPrototype.matches || ElementPrototype.matchesSelector || ElementPrototype.webkitMatchesSelector || ElementPrototype.msMatchesSelector || function matches(selector) {
    var node = this;
    var nodes = (node.parentNode || node.document).querySelectorAll(selector);
    var i = -1;
    while (nodes[++i] && nodes[i] !== node) {}
    return !!nodes[i];
  };
};
matchesPolyfill(Element.prototype);

// closest polyfill
var closestPolyfill = function applyClosestPolyfill(proto) {
  var ElementPrototype = proto;
  ElementPrototype.closest = ElementPrototype.closest || function closest(selector) {
    var el = this;
    while (el.matches && !el.matches(selector)) {
      el = el.parentNode;
    }return el.matches ? el : null;
  };
};
closestPolyfill(Element.prototype);

},{}],4:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
var $ = function $(str) {
  return [].slice.call(document.querySelectorAll(str));
};

exports.default = $;

},{}],5:[function(require,module,exports){
var _dollar = require('./dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toggleClass = 'is-active';

(0, _dollar2.default)('[data-target]').forEach(function (el) {
  el.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    (0, _dollar2.default)(el.dataset.target)[0].classList.toggle(toggleClass);
  });
});

},{"./dollar":4}],6:[function(require,module,exports){

require('./js-common-components/toggler');
require('./js-common-components/closest');
require('./expandable/expandable');
require('./tabs/tabs');
require('./slider/slider');

},{"./expandable/expandable":1,"./js-common-components/closest":3,"./js-common-components/toggler":5,"./slider/slider":7,"./tabs/tabs":8}],7:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function colorRangeInput() {
  this.min = this.min || 0;
  this.max = this.max || 100;

  var currentValue = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.backgroundImage = 'linear-gradient(to right, #00a1b2 0%, #00a1b2 ' + currentValue + '%,\n  #ccc ' + currentValue + '%, #ccc 100%)';
}

var init = function init() {
  (0, _dollar2.default)('input[type=range]').forEach(function (el) {
    if (!el.getAttribute('data-initialized')) {
      el.addEventListener('change', colorRangeInput);
      el.addEventListener('mousemove', colorRangeInput);
      el.setAttribute('data-initialized', true);
    }
  });
};

init();

},{"../js-common-components/dollar":4}],8:[function(require,module,exports){
var _dollar = require('../js-common-components/dollar');

var _dollar2 = _interopRequireDefault(_dollar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('../js-common-components/closest');

// TOOD: Flag for refactoring

var clickTab = function clickTab(ev) {
  var target = ev.target;
  var tabContainer = target.closest('.tabs');
  var tabs = tabContainer.querySelectorAll('.tab');
  Array.prototype.forEach.call(tabs, function (t) {
    return t.classList.remove('is-active');
  });
  target.classList.add('is-active');
};

var init = function init() {
  (0, _dollar2.default)('button.tab').forEach(function (el) {
    if (!el.getAttribute('data-initialized')) {
      el.addEventListener('click', function (ev) {
        return clickTab(ev);
      });
      el.setAttribute('data-initialized', true);
    }
  });
};

init();

},{"../js-common-components/closest":3,"../js-common-components/dollar":4}]},{},[6]);
