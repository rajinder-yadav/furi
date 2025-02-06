#!/usr/bin/env python3
import re
import sys

## This script is used to enable debug logging in a TypeScript file.

def main():
    filename = sys.argv[1]
    enable_logging = len(sys.argv) - 1

    modified_lines = []

    match_pattern = r'^\s*? //\s*LOG_DEBUG'
    match_string = '// LOG_DEBUG'
    replace_string = 'LOG_DEBUG'

    if enable_logging == 2 and (sys.argv[2] == '--disable' or sys.argv[2] == '-d'):
        match_pattern = r'^\s*?LOG_DEBUG'
        match_string = 'LOG_DEBUG'
        replace_string = '// LOG_DEBUG'

    try:
        # read file and replace the match string with the replace string
        # saved lines into a list
        with open(filename, 'r') as f:
            for i, line in enumerate(f):
                matched = re.search(match_pattern, line)
                if matched:
                    modified_line = line.replace(match_string, replace_string)
                    modified_lines.append(modified_line)
                else:
                    modified_lines.append(line)

        # Save the modified list to a new file
        with open(filename, 'w') as f:
            f.writelines(modified_lines)

    except FileNotFoundError:
        print(f"File '{filename}' not found.")
        return


if __name__ == "__main__":
    main()
