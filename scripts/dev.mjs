import { spawn } from "node:child_process";

const processes = [
  spawn(process.execPath, ["server/contact-server.mjs"], {
    stdio: "inherit",
    env: { ...process.env, PORT: process.env.PORT ?? "3001" },
  }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js"], {
    stdio: "inherit",
  }),
];

let shuttingDown = false;

for (const child of processes) {
  child.on("exit", (code) => {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const processToKill of processes) {
      if (processToKill !== child) processToKill.kill();
    }
    process.exit(code ?? 0);
  });
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    shuttingDown = true;
    for (const child of processes) {
      child.kill(signal);
    }
  });
}
