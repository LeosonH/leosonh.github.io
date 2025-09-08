#!/usr/bin/env python3
"""
Simple script to create favicon files from the profile image.
Since PIL is not available, we'll create a simple fallback.
"""

# For now, let's create a simple text-based favicon as a fallback
# This is a temporary solution until proper image tools are available

# Create a simple SVG favicon as base64 data URI
svg_favicon = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#BD5D38"/>
  <text x="16" y="20" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
        text-anchor="middle" fill="white">L</text>
</svg>'''

with open('/home/leoson/leosonh.github.io/img/favicon.svg', 'w') as f:
    f.write(svg_favicon)

print("Created temporary SVG favicon with 'L' initial")
print("Note: For best results, create proper PNG/ICO favicons using an image editor or online tool")