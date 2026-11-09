# NYX — Web oficial

Primera versión de la web oficial de **NYX**, un ecosistema creativo y tecnológico impulsado por IA. Lema provisional: «Imagina. Crea. Transforma.»

> Prototipo en desarrollo. No hay despliegue a producción.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
```

## Verificación

```bash
npm run typecheck
npm run lint
npm run build
```

## Documentación

- [Brief y criterios de aceptación](docs/NYX-CREATIVE-LAB-BRIEF.md)
- [Arquitectura, decisiones y pendientes](docs/ARCHITECTURE.md)
- Agentes de IA: leer [`AGENTS.md`](AGENTS.md) antes de escribir código (Next 16 tiene cambios incompatibles).

## Contenido

Todo el texto vive en [`src/content/site.ts`](src/content/site.ts). Regla del proyecto: no se inventan funcionalidades, estadísticas ni historia; lo que no existe lleva su estado explícito.
