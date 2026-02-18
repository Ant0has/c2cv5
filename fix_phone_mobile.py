"""
Fix phone icon missing on mobile - add grid-area to .phones class
"""
SCSS_PATH = '/home/anton-furs/apps/city2city.ru/front/widgets/Header/Header.module.scss'

with open(SCSS_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the .phones block to add mobile grid support
old_phones = """  .phones {
    display: none;

    @media (max-width: 1120px) {
      display: block;
    }
  }"""

new_phones = """  .phones {
    display: none;

    @media (max-width: 1120px) {
      display: block;
    }

    @media (max-width: 650px) {
      grid-area: c;
      order: 3;
      text-align: center;
      align-self: center;
    }
  }"""

if old_phones in content:
    new_content = content.replace(old_phones, new_phones)
    with open(SCSS_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Added grid-area: c to .phones for mobile")
else:
    print("ERROR: Could not find .phones block")
    print("Looking for:")
    print(repr(old_phones[:50]))
