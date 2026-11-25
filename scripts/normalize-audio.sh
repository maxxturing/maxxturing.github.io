#!/bin/bash
# Two-pass EBU R128 loudness normalisation for the gallery clips.
# Pass 1 measures, pass 2 applies a linear gain to hit the target exactly.
# Video is stream-copied, so the picture is bit-for-bit untouched.
set -euo pipefail

DIR="/Users/maxxwell/GitHub/maxxturing.github.io/assets/video"
OUT="/Users/maxxwell/GitHub/maxxturing.github.io/assets/video-normalised"
I=-18; TP=-1.5; LRA=11

mkdir -p "$OUT"

for f in "$DIR"/*.mp4; do
  name=$(basename "$f")
  rate=$(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of csv=p=0 "$f")

  json=$(ffmpeg -hide_banner -nostats -nostdin -i "$f" \
    -af "loudnorm=I=$I:TP=$TP:LRA=$LRA:print_format=json" \
    -f null - 2>&1 | sed -n '/^{/,/^}/p')
  get() { echo "$json" | grep "\"$1\"" | sed 's/.*: *"//;s/".*//'; }

  # loudnorm resamples internally to 192k; -ar puts the source rate back.
  ffmpeg -hide_banner -loglevel error -nostdin -y -i "$f" \
    -af "loudnorm=I=$I:TP=$TP:LRA=$LRA:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" \
    -ar "$rate" -c:v copy -c:a aac -b:a 128k -movflags +faststart \
    "$OUT/$name"

  printf '%-28s %8s -> ' "$name" "$(get input_i)"
  ffmpeg -hide_banner -nostats -nostdin -i "$OUT/$name" -af ebur128=peak=true -f null - 2>&1 \
    | tail -20 | grep -E '^ +(I|Peak):' | tr -s ' ' | tr '\n' ' '
  echo
done
