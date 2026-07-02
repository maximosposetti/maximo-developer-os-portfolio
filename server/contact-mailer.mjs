import nodemailer from "nodemailer";

const DEFAULT_MAIL_TO = "maximosposetti@hotmail.com";

export function validateContact(payload) {
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

export async function sendContactEmails({ name, email, message }) {
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
