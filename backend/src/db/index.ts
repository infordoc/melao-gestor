import postgres from "postgres"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida nas variáveis de ambiente")
}

export const db = postgres(process.env.DATABASE_URL, {
  ssl: process.env.DATABASE_SSL === "true" ? "require" : false,
  max: 10,
})
