#! /bin/bash
rm -rf ../blog-prod/*
cp -r package* build articles ../blog-prod/
cd ../blog-prod || exit
npm ci --omit dev
echo "run 'node build' to start the preview"
