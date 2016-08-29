'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _nestingLevelToFgBg;

var _ansiStyles = require('ansi-styles');

var _ansiStyles2 = _interopRequireDefault(_ansiStyles);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _eslevels = require('eslevels');

var _eslevels2 = _interopRequireDefault(_eslevels);

var _esprima = require('esprima');

var _esprima2 = _interopRequireDefault(_esprima);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// view "https://www.npmjs.com/package/colors" for a list of supported colors
var nestingLevelToFgBg = (_nestingLevelToFgBg = {}, _defineProperty(_nestingLevelToFgBg, '-1', { fg: 'white' }), _defineProperty(_nestingLevelToFgBg, '0', { fg: 'green' }), _defineProperty(_nestingLevelToFgBg, '1', { fg: 'yellow' }), _defineProperty(_nestingLevelToFgBg, '2', { fg: 'blue' }), _defineProperty(_nestingLevelToFgBg, '3', { fg: 'magenta' }), _defineProperty(_nestingLevelToFgBg, '4', { fg: 'cyan' }), _defineProperty(_nestingLevelToFgBg, '5', { fg: 'gray' }), _nestingLevelToFgBg);

var filePath = process.argv[2];

if (!/\.js$/.test(filePath)) {
  // TODO (wpcarro@gmail.com) uncomment these lines after developing
  console.error('Please provide a valid Javascript filepath to context-coloring.');
  console.error('If you\'re sure that the filepath you supplied is a valid path, ensure that it has the .js extension in its filename.');
  console.error('Exiting.');
  process.exit(1);
}

/**
/* TODO (wpcarro@gmail.com) detect which version of javascript the file is and
/* set sourceType: 'module'||'script' accordingly.
 */
var fileContents = _fs2.default.readFileSync(filePath, 'utf8');
var syntax = _esprima2.default.parse(fileContents, {
  range: true,
  sourceType: 'module'
});
var contextRanges = _eslevels2.default.levels(syntax, {
  escopeOpts: {
    sourceType: 'module',
    ecmaVersion: 6
  }
});

function colorize(color, string) {
  var fg = color.fg;


  return _ansiStyles2.default[fg].open + string + _ansiStyles2.default[fg].close;
}

var output = contextRanges.reduce(function (string, contextRange) {
  var _contextRange = _slicedToArray(contextRange, 3);

  var nestingLevel = _contextRange[0];
  var start = _contextRange[1];
  var end = _contextRange[2];

  var color = nestingLevelToFgBg[nestingLevel];
  var colorizedString = colorize(color, fileContents.slice(start, end + 1));

  return string + colorizedString;
}, '');

console.log(output);

process.exit(0);
