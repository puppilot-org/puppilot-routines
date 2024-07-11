#!/bin/bash

set -ex

rm -rf ./dist
mkdir -p ./dist/routines

routines=()
for filename in $(find ./src/routines -type f \( -name "*.ts" -o -name "*.js" \) ! -name "_*") ; do
    # Run webpack for each file
    npm run webpack "$filename"
    basename=$(basename "$filename")
    basename_no_ext="${basename%.*}"
    target="./dist/routines/$basename_no_ext.js"
    mv "./dist/main.mjs" "$target"
    routine=$(node ./get-meta.js "$target" | jq -c ". + {url:\"./routines/$basename_no_ext.js\"}")
    routines+=("$routine")
done
printf '%s\n' "${routines[@]}" | jq -c -s '{routines: .}' > ./dist/index.json

set -ex
