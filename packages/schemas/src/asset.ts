import { z } from "zod";

export const assetRecordSchema = z.object({
  assetId: z.string().min(1),
  kind: z.enum(["illustration"]),
  fileName: z.string().min(1),
  mediaType: z.string().min(1),
  storagePath: z.string().min(1),
  publicPath: z.string().min(1),
  renderUrl: z.string().min(1),
  altText: z.string().nullable().optional()
});

export type AssetRecord = z.infer<typeof assetRecordSchema>;
