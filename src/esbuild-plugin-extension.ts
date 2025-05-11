import { statSync } from 'node:fs';
import { format, join, parse } from 'node:path';

import type { Plugin } from 'esbuild';

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
}

function removeExtension(path: string): string {
  const parsedPath = parse(path);
  if (['.js', '.mjs', '.cjs'].includes(parsedPath.ext)) {
    parsedPath.base = parsedPath.name;
  }

  return format(parsedPath);
}

export function extension(): Plugin {
  return {
    name: 'extension',
    setup(build) {
      const ext = build.initialOptions.outExtension?.['.js'] ?? '.js';

      build.onResolve({ filter: /.*/ }, (args) => {
        if (
          args.importer &&
          (args.path.startsWith(`../`) || args.path.startsWith(`./`))
        ) {
          const path = removeExtension(args.path);

          return isDirectory(join(args.resolveDir, args.path))
            ? {
                external: true,
                path: `${path}/index${ext}`,
              }
            : {
                external: true,
                path: `${path}${ext}`,
              };
        }
      });
    },
  };
}
