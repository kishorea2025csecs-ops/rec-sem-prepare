import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const translateToTamil = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        texts: z.array(z.string().min(1).max(600)).min(1).max(120),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { handleTranslate } = await import("./i18n.server");
    return { items: await handleTranslate(data.texts) };
  });
