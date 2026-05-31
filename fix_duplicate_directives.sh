#!/bin/bash
# Run this in ~/client on the server to fix ALL duplicate directive imports
cd ~/client

python3 << 'PYEOF'
import re
import glob

files = (
    glob.glob('packages/client/src/**/*.tsx', recursive=True) +
    glob.glob('packages/client/components/**/*.tsx', recursive=True)
)

fixed = 0
for f in files:
    try:
        with open(f) as fp:
            content = fp.read()
    except:
        continue
    
    # Find all directive import lines
    pattern = re.compile(r'\nimport \{([^}]+)\} from "@revolt/ui/directives";')
    matches = list(pattern.finditer(content))
    
    if len(matches) <= 1:
        continue
    
    # Collect all imported names
    all_names = set()
    for m in matches:
        names = re.findall(r'\b(\w+)\b', m.group(1))
        all_names.update(names)
    
    # Remove all directive imports
    cleaned = pattern.sub('', content)
    
    # Find end of last import
    import_matches = list(re.finditer(r'^import\b', cleaned, re.MULTILINE))
    if not import_matches:
        continue
    last = import_matches[-1]
    end_pos = cleaned.find(';', last.start()) + 1
    
    # Add single consolidated import
    new_import = '\nimport { ' + ', '.join(sorted(all_names)) + ' } from "@revolt/ui/directives";'
    result = cleaned[:end_pos] + new_import + cleaned[end_pos:]
    
    with open(f, 'w') as fp:
        fp.write(result)
    fixed += 1
    print(f"Fixed: {f}")

print(f"\nTotal fixed: {fixed}")
PYEOF
