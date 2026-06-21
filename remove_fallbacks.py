import os
import re

directories_to_scan = ['src/pages', 'src/components']

# We are looking for lines like:
# const something = obj?.prop || 'Hardcoded String';
# And replacing them with:
# const something = obj?.prop || '';

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex explanation:
    # (const|let)\s+         Group 1: const or let followed by space
    # ([a-zA-Z0-9_]+)\s*=\s* Group 2: variable name followed by =
    # ([a-zA-Z0-9_\?\.]+)\s*\|\|\s* Group 3: the object chain (e.g. contact?.wa_number) followed by ||
    # '([^']*)'|"([^"]*)"     Group 4/5: The hardcoded string 
    
    # We will ONLY target lines that look like they are fetching from Redux state:
    # e.g settings?.something, contact?.something, fp?.something, etc.

    # Specifically we look for: identifier = source || 'string'
    
    lines = content.split('\n')
    modified = False
    
    new_lines = []
    
    pattern = re.compile(r"^(\s*(?:const|let)\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_\?\.]+\s*\|\|\s*)(['\"`][^'`\"]*['\"`])(.*)$")

    for line in lines:
        match = pattern.match(line)
        if match:
            # Check if the right hand side is a string we should wipe
            prefix = match.group(1)
            string_val = match.group(2)
            suffix = match.group(3)
            
            # Don't wipe if the string_val is already '' or ""
            if string_val not in ["''", '""', "``"]:
                new_line = f"{prefix}''{suffix}"
                new_lines.append(new_line)
                modified = True
                continue
        
        new_lines.append(line)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        print(f"Updated {filepath}")

for d in directories_to_scan:
    if os.path.exists(d):
        for filename in os.listdir(d):
            if filename.endswith(".jsx"):
                process_file(os.path.join(d, filename))

print("Done stripping fallbacks.")
