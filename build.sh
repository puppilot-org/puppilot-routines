#!/bin/bash

set -ex

rm -r ./dist
mkdir -p ./dist/routines
find ./src/routines -type f \( -name "*.ts" -o -name "*.js" \) ! -name "_*" | while read filename; do
    # Run webpack for each file
    npm run webpack "$filename"
    basename=$(basename "$filename")
    basename_no_ext="${basename%.*}"
    mv "./dist/main.mjs" "./dist/routines/$basename_no_ext.js"
done
