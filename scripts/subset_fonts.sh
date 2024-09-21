#! /bin/bash

# Here's how you get the used glyphs on a webpage.
# npx glyphhanger http://localhost:3000/ --family='VictorMono' >unicode_glyphs.txt
# npx glyphhanger --whitelist=U+20-7E,U+A0-17F,U+250-3FF,U+2000-20CF,U+2100-22FF,U+2500-25FF

# How to prepare the modules for the font subsetter
# python3 -m venv .venv
# source .venv/bin/activate
# pip3 install fontTools brotli

# FAMILY="VictorMono-Regular VictorMono-Bold VictorMono-Italic VictorMono-BoldItalic"
# FAMILY="RobotoSerif-VariableFont_sliced RobotoSerif-Italic-VariableFont_sliced"
FAMILY="RobotoMono-VariableFont"

for FONT in ${FAMILY}; do
  echo Processing ../resources/fonts/${FONT}.woff2
  python3 \
    ./.venv/lib/python*/site-packages/fontTools/subset/__main__.py \
    ../resources/fonts/${FONT}.woff2 \
    --unicodes-file=../resources/fonts/unicode_glyphs.txt \
    --flavor=woff2
done
