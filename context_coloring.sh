#!/usr/bin/env bash

node_bin=$(which node)
pkg_dir="/usr/local/bin/context_coloring"
babel="${pkg_dir}/node_modules/.bin/babel"


[ $# -ge 1 -a -f "$1" ] && input="$1" || input="-"

if [ ! -f "${pkg_dir}/index.out.js" ]; then
  echo "mmm no"
  "${babel}" "${pkg_dir}/index.js" --out-file "${pkg_dir}/index.out.js"
fi

"${node_bin}" "${pkg_dir}/index.out.js" "${input}"


