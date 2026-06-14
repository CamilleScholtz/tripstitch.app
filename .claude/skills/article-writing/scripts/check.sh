#!/usr/bin/env bash
#
# check.sh — lint Tripstitch articles for em dashes and AI/marketing tells.
#
# Usage:
#   check.sh <file.md> [more.md ...]
#   check.sh                # defaults to content/blog/*.md
#
# Exit status:
#   0  no hard failures (warnings may still print)
#   1  one or more HARD failures found
#
# HARD failures are non-negotiable bans (em dashes, the strongest AI words).
# WARN matches are softer tells worth a manual look, and never fail the run.

set -u

# Resolve files: args, or every markdown file under content/blog.
if [ "$#" -gt 0 ]; then
  files=("$@")
else
  # shellcheck disable=SC2206
  files=(content/blog/*.md)
fi

# Hard bans: an extended regex, matched case-insensitively. Word-ish phrases
# are kept loose on purpose so "delving"/"delved" also trip.
HARD='—|delve|seamless|game[ -]?chang|cutting[ -]edge|revolutioni|supercharge|groundbreaking|world[ -]class|hidden gem|off the beaten|instagram[ -]worthy|bucket list|without further ado|lets dive|let.s dive|in this article we|in today.s|whether you.?re a |a testament to|stands as a|rich tapestry|treasure trove|leaves an indelible|ever[ -](evolving|changing)|navigating the'

# Softer tells: review each, but they do not fail the run.
WARN='\bdiscover|\bunlock|\belevate\b|\bboasts\b|\bvibrant\b|\bbustling\b|\bnestled\b|in the heart of|\bleverage|\bmeticulous|\bintricate|\bmoreover\b|\bfurthermore\b|\badditionally,|important to note|worth noting|in conclusion|in summary|\boverall,|not only |but also |\bshowcas|\bunderscore|plays a (vital|crucial|pivotal|key|significant) role|faces challenges|the future looks'

status=0

for f in "${files[@]}"; do
  [ -f "$f" ] || { printf '  skip (not found): %s\n' "$f"; continue; }

  hard_hits=$(grep -nIE "$HARD" -- "$f" 2>/dev/null)
  warn_hits=$(grep -niIE "$WARN" -- "$f" 2>/dev/null)

  if [ -z "$hard_hits" ] && [ -z "$warn_hits" ]; then
    printf 'OK    %s\n' "$f"
    continue
  fi

  printf '\n===== %s =====\n' "$f"

  if [ -n "$hard_hits" ]; then
    printf -- '--- HARD (must fix) ---\n%s\n' "$hard_hits"
    status=1
  fi

  if [ -n "$warn_hits" ]; then
    printf -- '--- warn (review) ---\n%s\n' "$warn_hits"
  fi
done

if [ "$status" -ne 0 ]; then
  printf '\nHard failures found. Fix them before finishing.\n' >&2
fi

exit "$status"
