import re

path = r'C:\Users\Esteban Selvaggi\Desktop\subagent-driven_development\estudiogsr-astro\src\components\Header.astro'

with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix corrupted HTML patterns
fixed = c.replace('</a<',</a>')
fixed = fixed.replace('aria-hidden="true<', 'aria-hidden="true"')
# Fix any remaining link closing corruption
fixed = re.sub(r</a<',</a>', fixed)
# Fix any remaining aria-hidden corruption
fixed = re.sub(r'aria-hidden="true<', 'aria-hidden="true"', fixed)

with open(path, 'w', encoding='utf-8') as f:
    f.write(fixed)

print('Fixed. Verifying...')
with open(path, 'r', encoding='utf-8') as f:
    check = f.read()
broken1 = re.findall(r</a<', check)
broken2 = re.findall(r'aria-hidden="true<', check)
print(f'Broken</a< remaining: {len(broken1)}')
print(f'Broken aria-hidden remaining: {len(broken2)}')
print('Done')
