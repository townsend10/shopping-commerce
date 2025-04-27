import z from "zod";
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3, "min 3 letters"),
  username: z
    .string()
    .min(3, "Min 3 characters")
    .max(63, "Max of 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Just lowercase letters,numbers and hyphens.Start and end with letter or number"
    )
    .refine(
      (val) => !val.includes("--"),
      "Cannot contain much more than 1 hyphens!"
    )
    .transform((val) => val.toLowerCase()),
});



export const loginSchema =   z.object({
        email: z.string().email(),
        password: z.string(),
      })
    