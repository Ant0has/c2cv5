"""
Patch layout.tsx to add Novofon call tracking script.
"""
import re

LAYOUT_PATH = '/home/anton-furs/apps/city2city.ru/front/app/layout.tsx'

with open(LAYOUT_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if already added
if 'novofon' in content.lower():
    print("Novofon script already present in layout.tsx!")
    exit(0)

# Insert Novofon script after the Yandex Metrika script in <head>
# Find the closing of the Yandex Metrika Script tag
novofon_script = '''
        {/* Novofon Call Tracking */}
        <Script
          id="novofon-calltracking"
          strategy="afterInteractive"
          src="https://widget.novofon.ru/novofon.js?k=YbOrnMDxXg3gve1tb9Wt5RrWVM4dv8dI"
        />'''

# Insert after the Yandex Metrika script closing tag
# The metrika script ends with />  and then </head>
# Find pattern: the metrika script end
marker = '''        />
      </head>'''

replacement = f'''        />
{novofon_script}
      </head>'''

if marker in content:
    new_content = content.replace(marker, replacement, 1)
    with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Novofon script added to layout.tsx")
    print("Location: <head> section, after Yandex Metrika script")
else:
    print("ERROR: Could not find insertion point in layout.tsx")
    print("Looking for marker:")
    print(repr(marker))
    # Try alternative
    alt_marker = '</head>'
    if alt_marker in content:
        new_content = content.replace(alt_marker, f'{novofon_script}\n      {alt_marker}', 1)
        with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("SUCCESS (alt): Novofon script added before </head>")
    else:
        print("FATAL: Could not find </head> tag")
