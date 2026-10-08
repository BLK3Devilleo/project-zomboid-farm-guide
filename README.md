# Guía de granja · Project Zomboid

Aplicación Next.js en español y documentación para aprender agricultura y ganadería en Project Zomboid, con foco en Build 42.

## Contenido del paquete

- `app/` — aplicación interactiva: pasos para empezar, calendario de trigo y patata, consejos para vacas/cerdos/ovejas y lista de rutina.
- `docs/Informe_granja_Project_Zomboid_Build42.pdf` — informe para leer o imprimir.
- `docs/Informe_granja_Project_Zomboid_Build42.docx` — versión editable en Word.
- `docs/Informe_granja_Project_Zomboid_Build42.md` — fuente en Markdown, con enlaces a las referencias.
- `package.json` y `package-lock.json` — dependencias y comandos reproducibles.

## Abrir la aplicación

Necesitas Node.js compatible con Next.js 16 (recomendado: Node.js 20.9 o posterior).

1. Descomprime el ZIP.
2. Abre una terminal dentro de la carpeta `project-zomboid-farm-guide`.
3. Instala las dependencias: `npm ci`
4. Inicia la app en modo desarrollo: `npm run dev`
5. Abre `http://localhost:3000` en el navegador.

Para comprobar la compilación de producción, ejecuta `npm run build`. Después puedes iniciar esa versión con `npm run start`.

La carpeta `node_modules` y la compilación `.next` no se incluyen en el ZIP para reducir su tamaño: se regeneran al instalar las dependencias y ejecutar los comandos anteriores. La lista de tareas de la app se guarda en el almacenamiento local del navegador.

## Sobre los datos del juego

La guía toma Build 42.21 Stable como referencia a fecha de 7 de octubre de 2026. Calendarios, tiempos, reglas de animales y rendimiento pueden cambiar por parche, ajustes Sandbox o mods. El informe enumera las fuentes y marca las páginas que todavía advierten que pueden estar desactualizadas.
