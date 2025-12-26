#!/bin/bash
# Copy all non-TS files to lib/
rsync -av --include='*/' --include='*.png' --include='*.jpg' --include='*.json' --exclude='*.ts' --exclude='*.tsx' src/ lib/