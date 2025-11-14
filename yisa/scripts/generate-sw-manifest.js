const fs = require("fs");
const path = require("path");

const buildPath = path.join(process.cwd(), ".next");

const buildManifest = require(path.join(buildPath, "build-manifest.json"));
const prerenderManifest = require(path.join(buildPath, "prerender-manifest.json"));

let files = [
  "/",                      // Página inicial
  "/manifest.json",
  "/logo.png",
  "/globals.css"
];

// Todos os JS/CSS gerados pelo Next
for (const file of buildManifest.rootMainFiles) {
  files.push("/" + file);
}

// Todos os arquivos estáticos das rotas do Next
for (const route in prerenderManifest.routes) {
  files.push(route);
}

fs.writeFileSync(
  path.join(process.cwd(), "public", "sw-assets.json"),
  JSON.stringify(files, null, 2)
);

console.log("✔ sw-assets.json gerado com sucesso!");
