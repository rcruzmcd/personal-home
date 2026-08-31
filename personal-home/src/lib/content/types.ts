import type { z } from "zod"

import type { ProjectFrontmatterSchema } from "./schema"

export type Project = z.infer<typeof ProjectFrontmatterSchema>
export type ProjectCategory = Project["category"]
export type ProjectStatus = Project["status"]
