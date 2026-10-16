# Revisión de Constitución: Inicio

Constitución común 1.0.0, sin cambios. Revisión inicial y posterior al diseño: 2026-10-16.

| Control | Plan y evidencia exigida |
| --- | --- |
| I TDD | Pruebas de datos/UI/acceso fallan antes del código; registrar Rojo/Verde. |
| II SOLID | Snapshot y callbacks inyectados, puerto pequeño, composición en main. |
| III Capas | Dominio independiente; aplicación con puerto; infraestructura con fixture; UI sin imports de infraestructura. ESLint vigente. |
| IV KISS/DRY | Sin dependencias; snapshot único; variantes CSS; reusar navegación y controles. |
| V Seguridad | Datos ficticios, sesión solo con nombre, guardias, limpieza de contraseña, sin nuevas escrituras ni logs. Seguridad real fuera de alcance de demo cliente ya documentada. |
| VI BRD/ARD | No hay BRD/ARD adicionales; PDF de Registro no define Home. Diseño y spec son fuentes explícitas. |
| VII Dependencias | Sin nuevas dependencias; auditorías vigentes. |
| VIII Calidad | verify completo, cobertura >=80 % y sin degradación global injustificada; axe y revisión real de layout/teclado. |
| IX Gobierno | Artefactos trazables y revisión final humana pendiente; no integrar, publicar ni atribuir aprobación a los documentos. |

La corrección explícita del usuario restituye blancos de Figma sobre gradiente. Se documenta una discrepancia con 8.4: blanco/#ff8a65 = 2.314:1. Se cumple su instrucción visual, sin afirmar conformidad AA completa ni modificar el texto normativo. Las demás diferencias y la revisión técnica independiente continúan documentadas; no se atribuye una aprobación de integración al comentario del usuario «Luego todo ok».
