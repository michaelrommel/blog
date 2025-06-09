#! /bin/bash
npm run build
rm -rf ../blog-prod/*
cp -r package* pnpm-lock.yaml build ngstatic ../blog-prod/
cd ../blog-prod || exit
pnpm i --frozen-lockfile --prod
echo "run 'node build' to start the preview"
