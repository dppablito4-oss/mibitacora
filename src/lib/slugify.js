export function generateSlug(title) {
  if (!title) return 'entrada';

  const baseSlug = title
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  const hash = Math.random().toString(36).substring(2, 6);

  return baseSlug ? `${baseSlug}-${hash}` : hash;
}
