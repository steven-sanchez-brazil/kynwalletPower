# Consigna para extraer el diseño de Registro desde Figma

La referencia es [04 Registro](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2),
archivo `f7uDsv8sh6ZOtK2OitTqtg`, nodo `31:2`.

**Estado**: el usuario informó el 2026-10-15 que Claude Code ya está conectado a Figma.
La extracción está pendiente. Esta carpeta contiene la consigna; las exportaciones se
guardan en `specs/002-registro-usuarios/design/`.

Claude Code puede obtener la referencia cuando la cuenta autenticada tenga acceso al
archivo y las herramientas estén disponibles. El MCP permite consultar contexto, estilos,
variables y estructura, además de obtener capturas y descargar recursos. Los formatos y
las herramientas se describen en la [documentación oficial de Figma](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/).

## Consigna para Claude Code

Copiar este prompt en Claude Code, abierto en la misma carpeta del repo y conectado a Figma:

```text
Extrae únicamente la referencia de diseño de este frame de Figma:
https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2
Archivo: f7uDsv8sh6ZOtK2OitTqtg. Nodo: 31:2. Frame esperado: 04 Registro.

Guarda la extracción en specs/002-registro-usuarios/design/:
1. design-context.md: contexto del diseño, textos exactos, layout, dimensiones,
   espaciados, tipografía, colores, bordes, radios y componentes identificados.
   Conserva la respuesta útil del MCP y separa los datos de tus interpretaciones.
2. metadata.xml: estructura del frame obtenida con get_metadata, si está disponible.
3. design-tokens.json: nombres y valores de variables o estilos obtenidos con
   get_variable_defs. No inventes tokens ni valores que la herramienta no devuelva.
4. registro-desktop.png: exportación del frame mediante download_assets o una
   captura guardada a partir de get_screenshot. Descarga el fichero real; un enlace
   temporal o una imagen solo visible en el chat no equivalen a un archivo guardado.
5. assets/: SVG o imágenes del diseño que realmente hagan falta, si son exportables.
6. extraction-notes.md: fecha de extracción, URL de origen, nodo consultado,
   herramientas usadas, lista de archivos efectivamente guardados y limitaciones.

Empieza por get_design_context y comprueba la captura del mismo nodo. Usa las demás
herramientas cuando estén disponibles y sean necesarias. Si un resultado no puede
exportarse o descargarse, indícalo en las notas; no crees un archivo ficticio.
No deduzcas un diseño móvil que no exista en el archivo. Si encuentras un frame
móvil vinculado al registro, documenta su nodo y expórtalo por separado.
Si la herramienta devuelve código como contexto, consérvalo como referencia y
describe su procedencia; no lo copies a src/ ni decidas nuevas dependencias.
Mantén intactos la aplicación, las specs, las skills y la integración de spec-kit.
No guardes tokens de acceso ni credenciales y no modifiques el archivo de Figma.
```

## Recepción en Codex

Se comprobará que los archivos existan, correspondan al nodo esperado y contengan datos
utilizables. Después se contrastarán con la spec y se incorporarán al plan las decisiones
de reutilización y fidelidad. Los enlaces temporales se descargarán mientras sean válidos;
la extracción quedará como una instantánea fechada del diseño.

No hace falta cambiar la integración de spec-kit a Claude para realizar esta extracción.
La conexión de Claude no conecta automáticamente esta sesión de Codex a Figma.
