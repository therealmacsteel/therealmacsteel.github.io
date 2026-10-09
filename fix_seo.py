import sys
from pathlib import Path
sys.path.append('/Users/openclawbot/openclaw/scripts')
import pre_launch_checklist as plc

plc.SITE = Path("/Users/openclawbot/site-seo-wt")

skipped = []
favicon_count = 0
og_count = 0

for page in plc.pages():
    page_str = str(page)
    try:
        with open(page_str, 'r') as f:
            html = f.read()
    except Exception as e:
        print(f"Error reading {page_str}: {e}")
        continue

    head_end = html.find('</head>')
    if head_end == -1:
        print(page_str)
        skipped.append(page_str)
        continue

    to_insert = []
    if 'rel="icon"' not in html:
        to_insert.append('<link rel="icon" href="/favicon.svg" type="image/svg+xml">')
    if 'og:image' not in html and 'twitter:image' not in html:
        to_insert.append('<meta property="og:image" content="https://therealmacsteel.github.io/assets/ms/og.png">')

    if to_insert:
        insertion = '\n'.join(to_insert) + '\n'
        new_html = html[:head_end] + insertion + html[head_end:]
        with open(page_str, 'w') as f:
            f.write(new_html)

        if 'rel="icon"' not in html:
            favicon_count += 1
        if ('og:image' not in html and 'twitter:image' not in html):
            og_count += 1

print(f"Favicon: {favicon_count}")
print(f"OG image: {og_count}")