import { z } from 'zod';

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.string()
  })
export type CreateCatDto = z.infer<typeof createCatSchema>
