import re, glob

directive_pat = re.compile(r'^import \{([^}]+)\} from "@revolt/ui/directives";')

fixed = 0
# Process ALL tsx files including src/interface ones
all_files = (
    glob.glob('packages/client/src/**/*.tsx', recursive=True) +
    glob.glob('packages/client/components/**/*.tsx', recursive=True)
)

for f in all_files:
    try:
        lines = open(f).readlines()
    except:
        continue
    
    directive_count = sum(1 for l in lines if '@revolt/ui/directives' in l)
    if directive_count <= 1:
        continue
    
    print(f'Found {directive_count} directive imports in {f}')
    
    # Collect all names, keep first position, remove rest
    names = set()
    first_idx = None
    new_lines = []
    
    for line in lines:
        stripped = line.rstrip('\n').rstrip('\r')
        m = directive_pat.match(stripped)
        if m:
            names.update(re.findall(r'\b(\w+)\b', m.group(1)))
            if first_idx is None:
                first_idx = len(new_lines)
                new_lines.append(None)  # placeholder for consolidated import
            # else: skip duplicate
        else:
            new_lines.append(line)
    
    if first_idx is not None and names:
        new_lines[first_idx] = 'import { ' + ', '.join(sorted(names)) + ' } from "@revolt/ui/directives";\n'
    
    result = ''.join(l for l in new_lines if l is not None)
    open(f, 'w').write(result)
    print(f'  Fixed: merged into import {{ {", ".join(sorted(names))} }}')
    fixed += 1

print(f'Dedup complete. Fixed {fixed} files.')
