#! /bin/bash

# npx glyphhanger http://localhost:3000/ --family='VictorMono' >glyphs_VictorMono.txt

FAMILY="VictorMono-Regular VictorMono-Bold VictorMono-Italic VictorMono-BoldItalic"

for FONT in ${FAMILY}; do
  echo Processing fonts/${FONT}.woff2
  python3 \
    /home/rommel/.local/lib/python3.7/site-packages/fontTools/subset/__main__.py \
    fonts/${FONT}.woff2 \
    --unicodes-file=glyphs_VictorMono.txt \
    --flavor=woff2
done
