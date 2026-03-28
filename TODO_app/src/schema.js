import { sqliteTable, int, text } from "drizzle-orm/sqlite-core"

export const todosTable = sqliteTable("todos", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  priority: text({enum: ["nízká", "normální", "vysoká"]}).notNull().default("normální"),
  description: text(),
  done: int({ mode: "boolean" }).notNull(),
})
 