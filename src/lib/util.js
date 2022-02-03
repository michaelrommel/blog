export const slugFromPath = (path) => path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;
export const categoryFromPath = (path) => path.match(/\.\/(.*)\/[\w-]+\.(svelte\.md|md|svx)/i)?.[1] ?? null;
