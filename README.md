# Portfolio Maximo/OS

Portfolio interactivo con estilo de sistema operativo.

## Ejecutar en desarrollo

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env` tomando como base `.env.example` y completa tus datos SMTP.

3. Inicia frontend y backend juntos:

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Contacto por email

El formulario envia el mensaje a `maximosposetti@hotmail.com` usando Nodemailer y tambien envia una confirmacion al email del remitente.

Para Gmail, `SMTP_PASS` debe ser una contrasena de aplicacion, no la contrasena normal de la cuenta.

## CV

Coloca el PDF del CV en:

```text
public/Maximo_Sposetti_CV.pdf
```

El boton `Descargar CV` usa esa ruta.
