#! /bin/bash -x
npm run build
ssh blog@crow-vpn mkdir -p /home/blog/blog_preview_new
scp -r package* pnpm-lock.yaml build articles ngstatic blog@crow-vpn:/home/blog/blog_preview_new/
ssh blog@crow-vpn "/home/blog/bin/deploy.sh"
