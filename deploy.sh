#!/bin/sh

# Parse command line arguments
PULL=0
while [ $# -gt 0 ]; do
    case "$1" in
        -p|--pull)
            PULL=1
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [-p|--pull]"
            exit 1
            ;;
    esac
done

# Pull latest changes if requested
if [ "$PULL" -eq 1 ]; then
    git pull
fi

# Build the site
hugo --minify
