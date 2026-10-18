import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// The background-removal model (IMG.LY, AGPL-3.0) is a development dependency that runs only
// on the computer doing the import, when a cut-out is made. The API never loads it.
const PACKAGE = '@imgly/background-removal-node';
const MODEL = 'medium';

export const removeBackground = async (png) => {
  const { removeBackground: remove } = await import(PACKAGE);
  // The model files ship inside the package; without this they are looked for in the current folder.
  const publicPath = pathToFileURL(path.dirname(createRequire(import.meta.url).resolve(PACKAGE)) + path.sep).href;
  const result = await remove(new Blob([png], { type: 'image/png' }), {
    publicPath,
    model: MODEL,
    output: { format: 'image/png', quality: 1 },
  });
  return Buffer.from(await result.arrayBuffer());
};
