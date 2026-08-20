import path from "path"
import postgres from "postgres"

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") })
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida nas variáveis de ambiente")
}

export const db = postgres(process.env.DATABASE_URL, {
  ssl: process.env.DATABASE_SSL === "true" ? "require" : false,
  max: 10,
})
