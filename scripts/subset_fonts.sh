#! /bin/bash

npx glyphhanger http://localhost:3000/ --family='VictorMono' >glyphs_VictorMono.txt
python3 \
  /home/rommel/.local/lib/python3.7/site-packages/fontTools/subset/__main__.py \
  fonts/VictorMono-Regular.woff2 \
  --unicodes-file=glyphs_VictorMono.txt \
  --flavor=woff2

