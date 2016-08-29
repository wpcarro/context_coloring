import ansiStyles from 'ansi-styles';
import chalk from 'chalk';
import eslevels from 'eslevels';
import esprima from 'esprima';
import fs from 'fs';


// view "https://www.npmjs.com/package/colors" for a list of supported colors
const nestingLevelToFgBg = {
  ['-1']: {fg: 'white'},
  ['0']: {fg: 'green'},
  ['1']: {fg: 'yellow'},
  ['2']: {fg: 'blue'},
  ['3']: {fg: 'magenta'},
  ['4']: {fg: 'cyan'},
  ['5']: {fg: 'gray'}
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
  const { fg } = color;

  return ansiStyles[fg].open + string + ansiStyles[fg].close;
}


const output = contextRanges.reduce(function(string, contextRange) {
  const [nestingLevel, start, end] = contextRange;
  const color = nestingLevelToFgBg[nestingLevel];
  const colorizedString = colorize(color, fileContents.slice(start, end + 1));

  return string + colorizedString;
}, '');

console.log(output);

process.exit(0);

