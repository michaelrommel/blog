#! /bin/bash -x
ssh blog@crow-vpn mkdir -p /home/blog/blog_preview_new
scp -r package* build articles blog@crow-vpn:/home/blog/blog_preview_new/
ssh blog@crow-vpn "cd blog_preview_new; cp ../blog_preview/.env .; npm ci --omit dev; cd ..; rm -rf blog_preview/; mv blog_preview_new blog_preview"
echo "restart the blog_preview service on crow"
