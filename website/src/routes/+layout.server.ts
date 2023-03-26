import { createTables } from '$lib/utils/database'

export const load = (async () => {
  await createTables();
}) as () => Promise<void>;
