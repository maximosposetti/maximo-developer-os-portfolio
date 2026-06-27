import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

const PORT = Number(process.env.PORT ?? 3001);
const MAX_BODY_SIZE = 1024 * 1024;
const DEFAULT_MAIL_TO = "maximosposetti@hotmail.com";

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

function validateContact(payload) {
  const name = String(payload?.name ?? "").trim();
  const email = String(payload?.email ?? "").trim();
  const message = String(payload?.message ?? "").trim();

  if (!name || !email || !message) {
    throw new Error("Completa nombre, email y mensaje.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Ingresa un email valido.");
  }

  return { name, email, message };
}

async function sendContactEmails({ name, email, message }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("Configura SMTP_HOST, SMTP_USER y SMTP_PASS en .env.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: String(process.env.SMTP_SECURE ?? "true") === "true",
    auth: { user, pass },
  });

  const mailTo = process.env.MAIL_TO ?? DEFAULT_MAIL_TO;
  const from = process.env.MAIL_FROM ?? `"Portfolio Maximo" <${user}>`;

  await transporter.sendMail({
    from,
    to: mailTo,
    replyTo: `"${name}" <${email}>`,
    subject: `Nuevo mensaje desde el portfolio - ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    html: `
      <h2>Nuevo mensaje desde el portfolio</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Confirmacion de mensaje enviado",
    text:
      `Hola ${name},\n\n` +
      "Tu mensaje fue enviado correctamente a Maximo Sposetti.\n" +
      "Gracias por ponerte en contacto.\n\n" +
      "Resumen del mensaje:\n" +
      `${message}\n\n` +
      "Maximo/OS Portfolio",
    html: `
      <p>Hola ${escapeHtml(name)},</p>
      <p>Tu mensaje fue enviado correctamente a Maximo Sposetti.</p>
      <p>Gracias por ponerte en contacto.</p>
      <p><strong>Resumen del mensaje:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      <p>Maximo/OS Portfolio</p>
    `,
  });

  transporter.close();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}
