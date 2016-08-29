#!/usr/bin/env bash

node_bin=$(which node)
babel="./node_modules/.bin/babel"


[ $# -ge 1 -a -f "$1" ] && input="$1" || input="-"

if [ ! -f "./index.out.js" ]; then
  echo "mmm no"
  "${babel}" ./index.js --out-file ./index.out.js
fi

"${node_bin}" ./index.out.js "${input}"


