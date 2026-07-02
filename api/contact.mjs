import { sendContactEmails, validateContact } from "../server/contact-mailer.mjs";

const MAX_BODY_SIZE = 1024 * 1024;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Metodo no permitido." });
    return;
  }

  try {
    const payload = await getPayload(req);
    const contact = validateContact(payload);
    await sendContactEmails(contact);
    res.status(200).json({ message: "Mensaje enviado correctamente." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo enviar el mensaje.";
    const status = message.startsWith("Configura") ? 500 : 400;
    res.status(status).json({ message });
  }
}

async function getPayload(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

  const body = await readBody(req);
  return JSON.parse(body || "{}");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        req.destroy();
        reject(new Error("El mensaje es demasiado grande."));
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", () => reject(new Error("No se pudo leer el mensaje.")));
  });
}
