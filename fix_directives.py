import re
import glob
import os

print(f"Working dir: {os.getcwd()}")
print(f"Checking for duplicates...")

files = (
    glob.glob('packages/client/src/**/*.tsx', recursive=True) +
    glob.glob('packages/client/components/**/*.tsx', recursive=True)
)
print(f"Found {len(files)} tsx files")

pat = re.compile(r'\nimport \{([^}]+)\} from "@revolt/ui/directives";')

fixed = 0
for f in files:
    try:
        c = open(f).read()
    except:
        continue
    ms = list(pat.finditer(c))
    if len(ms) <= 1:
        continue
    print(f"DUPLICATE in {f}: {len(ms)} imports")
    names = set()
    for m in ms:
        names.update(re.findall(r'\b(\w+)\b', m.group(1)))
    c = pat.sub('', c)
    imp = list(re.finditer(r'^import\b', c, re.MULTILINE))
    if not imp:
        continue
    ep = c.find(';', imp[-1].start()) + 1
    c = c[:ep] + '\nimport { ' + ', '.join(sorted(names)) + ' } from "@revolt/ui/directives";' + c[ep:]
    open(f, 'w').write(c)
    print(f'Fixed: {f}')
    fixed += 1

print(f'Done. Fixed {fixed} files.')
