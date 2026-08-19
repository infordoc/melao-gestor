import "dotenv/config"
import path from "path"
import express from "express"
import cors from "cors"
import { ExpressAuth } from "@auth/express"
import { authConfig } from "./auth.config"
import conversationsRouter from "./routes/conversations"
import messagesRouter from "./routes/messages"
import eventsRouter from "./routes/events"
import clientsRouter from "./routes/clients"
import companiesRouter from "./routes/companies"
import remindersRouter from "./routes/reminders"
import webhooksRouter from "./routes/webhooks"

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1", (_req, res, next) => { res.set("Cache-Control", "no-store"); next() })

app.use("/api/auth/*", ExpressAuth(authConfig))

app.use("/api/v1/conversations", conversationsRouter)
app.use("/api/v1/messages", messagesRouter)
app.use("/api/v1/clients", clientsRouter)
app.use("/api/v1/companies", companiesRouter)
app.use("/api/v1/reminders", remindersRouter)
app.use("/api/events", eventsRouter)
app.use("/webhooks", webhooksRouter)

app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

if (process.env.NODE_ENV === "production") {
  const frontendDist = process.env.FRONTEND_DIST_PATH || "/app/public"
  app.use(express.static(frontendDist))
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"), (err) => {
      if (err) res.status(500).send("Erro ao carregar a página")
    })
  })
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app
