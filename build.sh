#!/bin/bash

set -ex

rm -rf ./dist/routines
mkdir -p ./dist/routines

routines=()
for filename in $(find ./src/routines -type f \( -name "*.ts" -o -name "*.js" \) ! -name "_*") ; do
    # Run esbuild for each file
    npm run esbuild "$filename"
    basename=$(basename "$filename")
    basename_no_ext="${basename%.*}"
    target="./dist/routines/$basename_no_ext.js"
    update_time=$(TZ=UTC0 git log -1 --format=%at "$filename")
    # mv "./dist/main.mjs" "$target"
    routine=$(node ./get-meta.js "$target" | jq -c ". + {url:\"./routines/$basename_no_ext.js\",updateTime:$update_time}")
    routines+=("$routine")
done
printf '%s\n' "${routines[@]}" | jq -c -s '{routines: .}' > ./dist/index.json

set -ex
