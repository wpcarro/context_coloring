import ansiStyles from 'ansi-styles';
import chalk from 'chalk';
import eslevels from 'eslevels';
import esprima from 'esprima';
import fs from 'fs';


// view "https://www.npmjs.com/package/colors" for a list of supported colors
const nestingLevelToFgBg = {
  ['-1']: {fg: 'black', bg: 'bgRed'},
  ['0']: {fg: 'black', bg: 'bgGreen'},
  ['1']: {fg: 'black', bg: 'bgYellow'},
  ['2']: {fg: 'black', bg: 'bgBlue'},
  ['3']: {fg: 'black', bg: 'bgMagenta'},
  ['4']: {fg: 'black', bg: 'bgCyan'},
  ['5']: {fg: 'black', bg: 'bgWhite'}
};


const filePath = process.argv[2];

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
const fileContents = fs.readFileSync(filePath, 'utf8');
const syntax = esprima.parse(fileContents, {
  range: true,
  sourceType: 'module'
});
const contextRanges = eslevels.levels(syntax, {
  escopeOpts: {
    sourceType: 'module',
    ecmaVersion: 6
  }
});


function colorize(color, string) {
  const {fg, bg} = color;

  return ansiStyles[fg].open + ansiStyles[bg].open +
      string + ansiStyles[fg].close + ansiStyles[bg].close;
}


const output = contextRanges.reduce(function(string, contextRange) {
  const [nestingLevel, start, end] = contextRange;
  const color = nestingLevelToFgBg[nestingLevel];
  const colorizedString = colorize(color, fileContents.slice(start, end + 1));

  return string + colorizedString;
}, '');

console.log(output);

process.exit(0);

