import { z } from 'zod';

export const StepPhaseSchema = z.enum([
  'reconnaissance',
  'enumeration',
  'exploitation',
  'privesc',
  'post-exploitation',
]);

export const TargetOSSchema = z.enum(['windows', 'linux', 'other']);

export const PlaybookCategorySchema = z.enum([
  'network',
  'privesc',
  'post-exploitation',
  'web',
  'passwords',
  'ad',
]);

export const PlaybookStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  phase: StepPhaseSchema,
  purpose: z.string(),
  command: z.string(),
  expected_output: z.array(z.string()).default([]),
  common_mistakes: z.array(z.string()).default([]),
  if_success: z.string().optional(),
  if_failure: z.string().optional(),
  references: z.array(z.string()).default([]),
});

export const PlaybookSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: PlaybookCategorySchema,
  description: z.string(),
  port_triggers: z.array(z.number()).default([]),
  service_triggers: z.array(z.string()).default([]),
  requires_shell: z.boolean().optional(),
  target_os: TargetOSSchema.optional(),
  tags: z.array(z.string()).default([]),
  steps: z.array(PlaybookStepSchema),
});

export type PlaybookStepDTO = z.infer<typeof PlaybookStepSchema>;
export type PlaybookDTO = z.infer<typeof PlaybookSchema>;
