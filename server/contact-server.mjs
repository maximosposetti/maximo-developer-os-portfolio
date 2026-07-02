import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { sendContactEmails, validateContact } from "./contact-mailer.mjs";

const PORT = Number(process.env.PORT ?? 3001);
const MAX_BODY_SIZE = 1024 * 1024;

loadEnvFile();

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/contact") {
    sendJson(res, 404, { message: "Ruta no encontrada." });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const contact = validateContact(payload);
    await sendContactEmails(contact);
    sendJson(res, 200, { message: "Mensaje enviado correctamente." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo enviar el mensaje.";
    const status = message.startsWith("Configura") ? 500 : 400;
    sendJson(res, status, { message });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend de contacto listo en http://127.0.0.1:${PORT}`);
});

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        req.destroy();
        reject(new Error("El mensaje es demasiado grande."));
      }
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("El cuerpo de la solicitud no es valido."));
      }
    });

    req.on("error", () => reject(new Error("No se pudo leer el mensaje.")));
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}
