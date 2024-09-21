#! /bin/bash
npm run build
rm -rf ../blog-prod/*
cp -r package* build articles static ../blog-prod/
cd ../blog-prod || exit
npm ci --omit dev
echo "run 'node build' to start the preview"
