# kynwalletPower Constitution

Política corporativa de desarrollo de software. Aplica a todo el código, configuración,
infraestructura como código, pruebas y documentación técnica del proyecto, con independencia
del lenguaje, framework o tecnología utilizada. Los términos **DEBE**, **NO DEBE** y
**OBLIGATORIO** expresan requisitos de cumplimiento exigible; **DEBERÍA** expresa una
recomendación cuyo incumplimiento DEBE justificarse por escrito.

## Core Principles

### I. Desarrollo Guiado por Pruebas (TDD) — NO NEGOCIABLE

1.1. Todo cambio de comportamiento DEBE iniciarse con una prueba automatizada que falle y que
exprese el comportamiento esperado, antes de escribir el código de producción.
1.2. El ciclo Rojo → Verde → Refactorizar es OBLIGATORIO; la refactorización NO DEBE alterar
el comportamiento verificado por las pruebas existentes.
1.3. Toda corrección de defecto DEBE incluir una prueba que reproduzca el defecto.
1.4. NO DEBE integrarse código cuyas pruebas fallen, estén deshabilitadas sin justificación
registrada o dependan del orden de ejecución.

*Justificación*: las pruebas previas fijan el contrato del comportamiento, previenen
regresiones y hacen el diseño verificable.

### II. Diseño SOLID

2.1. Cada módulo, clase o función DEBE tener una única responsabilidad claramente nombrable.
2.2. Los componentes DEBEN poder extenderse sin modificar su código estable (abierto/cerrado).
2.3. Las implementaciones DEBEN ser sustituibles por sus abstracciones sin romper a sus
consumidores (Liskov).
2.4. Las interfaces DEBEN ser específicas para sus clientes; NO DEBEN forzar dependencias
de operaciones no utilizadas.
2.5. Los módulos de alto nivel DEBEN depender de abstracciones, no de implementaciones
concretas; las dependencias DEBEN inyectarse, no instanciarse internamente.

*Justificación*: reduce el acoplamiento y permite probar, sustituir y evolucionar componentes
de forma aislada.

### III. Clean Architecture

3.1. El sistema DEBE organizarse en capas con responsabilidades separadas: dominio, casos de
uso/aplicación, adaptadores de interfaz e infraestructura.
3.2. Las dependencias de código DEBEN apuntar exclusivamente hacia el dominio; el dominio NO
DEBE depender de frameworks, bases de datos, UI, red ni servicios externos.
3.3. Las reglas de negocio DEBEN residir en el dominio o en los casos de uso y NO DEBEN
duplicarse ni implementarse en capas de presentación o infraestructura.
3.4. La comunicación entre capas DEBE realizarse mediante contratos explícitos (interfaces,
puertos, DTO); los detalles de infraestructura NO DEBEN filtrarse hacia capas internas.
3.5. Las reglas de dependencia entre capas DEBERÍAN verificarse de forma automatizada.

*Justificación*: aísla la lógica de negocio de decisiones tecnológicas reemplazables.

### IV. Simplicidad y No Duplicación (DRY, KISS, YAGNI)

4.1. Cada pieza de conocimiento (regla, cálculo, constante, validación) DEBE tener una única
fuente autorizada en el código; la duplicación detectada DEBE consolidarse.
4.2. DEBE elegirse la solución más simple que satisfaga los requisitos vigentes; toda
complejidad adicional (patrones, capas, abstracciones) DEBE justificarse por escrito en el
plan o en la revisión de código.
4.3. NO DEBE implementarse funcionalidad, configuración ni extensibilidad que no responda a
un requisito aprobado.
4.4. El código muerto, comentado o no referenciado NO DEBE integrarse.

*Justificación*: menos código y menos abstracción especulativa reducen el costo de
mantenimiento y la superficie de defectos.

### V. Seguridad por Diseño

5.1. Toda entrada externa (usuario, API, archivo, mensaje, variable de entorno) DEBE
validarse en el límite del sistema por tipo, formato, longitud y rango, mediante listas de
permitidos; las salidas DEBEN codificarse según su contexto.
5.2. El acceso a datos y operaciones protegidas DEBE requerir autenticación mediante
mecanismos estándar aprobados y autorización explícita bajo el principio de mínimo privilegio.
5.3. Credenciales, secretos, tokens, claves y certificados NO DEBEN almacenarse en el código
fuente, en archivos versionados ni en registros; DEBEN gestionarse mediante un gestor de
secretos o mecanismo de configuración seguro aprobado.
5.4. Los datos sensibles y personales DEBEN cifrarse en tránsito y en reposo, minimizarse,
y NO DEBEN exponerse en logs, mensajes de error, URLs ni respuestas no autorizadas.
5.5. Los errores DEBEN manejarse de forma explícita: NO DEBEN silenciarse excepciones, los
mensajes al usuario NO DEBEN revelar detalles internos y los eventos relevantes de seguridad
DEBEN registrarse de forma estructurada y trazable.
5.6. El repositorio DEBE someterse a análisis automatizado de secretos y de seguridad estática
antes de integrar cambios.

*Justificación*: la seguridad incorporada desde el diseño es más efectiva y menos costosa que
la remediación posterior.

### VI. Conformidad con BRD y ARD

6.1. Cuando exista un BRD (Business Requirements Document), toda implementación DEBE respetar
las reglas de negocio allí definidas; NO DEBE implementarse una regla de negocio contradictoria
sin una actualización aprobada del BRD.
6.2. Cuando exista un ARD (Architecture Requirements Document), toda implementación DEBE
cumplir sus requisitos y restricciones arquitectónicas.
6.3. Las especificaciones y planes DEBEN referenciar las secciones del BRD y ARD aplicables.
6.4. Toda desviación del BRD o ARD DEBE documentarse, justificarse y aprobarse por el
responsable del documento antes de su implementación.
6.5. En caso de conflicto, el BRD y el ARD prevalecen sobre las especificaciones de feature;
esta constitución prevalece sobre ambos en materia de prácticas de ingeniería.

*Justificación*: garantiza que el software implemente el negocio y la arquitectura acordados.

## Gestión de Dependencias

7.1. Se PERMITE el uso de frameworks y librerías externas siempre que cumplan, de forma
verificable, todas las condiciones siguientes:
   a. Licencia compatible con la política corporativa y con el modelo de distribución del
      proyecto; las licencias no aprobadas DEBEN ser autorizadas antes de su incorporación.
   b. Mantenimiento activo, evidenciado por publicaciones o correcciones de seguridad
      recientes y un mantenedor identificable.
   c. Ausencia de vulnerabilidades críticas o altas conocidas, salvo mitigación documentada
      y aprobada con fecha de revisión.
7.2. Toda dependencia DEBE declararse con versión fijada o acotada y bloquearse mediante
archivo de bloqueo versionado cuando el ecosistema lo soporte.
7.3. Las dependencias DEBEN analizarse automáticamente (vulnerabilidades y licencias) en cada
integración; un hallazgo crítico sin mitigación aprobada DEBE bloquear la integración.
7.4. Cada nueva dependencia DEBE justificarse frente a alternativas existentes en el proyecto
(Principio IV) y aislarse tras abstracciones cuando afecte al dominio (Principio III).
7.5. Las dependencias sin uso, obsoletas o sin soporte DEBEN eliminarse o reemplazarse.

## Estándares de Calidad

8.1. **Pruebas automatizadas**: DEBEN existir pruebas unitarias, de integración y de contrato
proporcionales al riesgo; la cobertura del código nuevo o modificado DEBE cumplir el umbral
corporativo definido en el pipeline, y NO DEBE disminuir la cobertura global sin aprobación.
8.2. **Convenciones de código**: DEBEN aplicarse las guías de estilo y nomenclatura del
lenguaje adoptado, verificadas mediante formateadores y analizadores estáticos automatizados;
el código DEBE integrarse sin errores de análisis.
8.3. **Documentación**: DEBEN documentarse las APIs públicas, contratos, decisiones
arquitectónicas relevantes (ADR), instrucciones de construcción, configuración y despliegue;
la documentación DEBE actualizarse en el mismo cambio que la modifica.
8.4. **Accesibilidad**: toda interfaz de usuario DEBE cumplir como mínimo WCAG 2.1 nivel AA,
verificado mediante pruebas automatizadas y revisión.
8.5. **Reutilización de componentes**: DEBEN reutilizarse componentes, librerías y servicios
corporativos existentes antes de crear nuevos; los componentes compartidos DEBEN ser
modulares, versionados y documentados.
8.6. **Sistema de diseño corporativo**: cuando aplique, las interfaces DEBEN utilizar los
componentes, tokens y lineamientos del sistema de diseño corporativo; las desviaciones DEBEN
aprobarse por el responsable de diseño.
8.7. **Observabilidad**: los componentes DEBEN emitir logs estructurados y métricas que
permitan diagnosticar fallos sin exponer datos sensibles (Principio V).

8.8. **Conflictos entre el diseño de referencia y la Constitución**: Figma, sus capturas y
exportaciones aprobadas son la referencia visual de la interfaz. Si esa referencia entra en
conflicto con un requisito de esta constitución, incluido el de accesibilidad de 8.4, el agente
DEBE aplicar el siguiente procedimiento antes de implementar o modificar el elemento afectado:
   a. Informar al usuario qué elemento y qué requisito entran en conflicto, citando la
      referencia de diseño y la regla constitucional aplicable; explicar el impacto de
      conservar el diseño y el de ajustarlo, con alternativas concretas.
   b. Preguntar al usuario qué criterio debe mantenerse: el diseño de referencia o el requisito
      constitucional. NO DEBE decidirlo por iniciativa propia ni alterar colores, tipografía,
      distribución u otros atributos visuales para resolver el conflicto sin esa decisión.
   c. Esperar una respuesta explícita antes de actuar sobre el elemento en conflicto. Puede
      continuar el trabajo independiente. La falta de respuesta o la aprobación general de un
      plan NO DEBEN interpretarse como aprobación de una desviación visual o constitucional.
      No es necesario repetir la consulta si el mismo conflicto ya tiene una decisión explícita
      registrada y su alcance no ha cambiado.
   d. Registrar la decisión, su justificación y los requisitos afectados en la especificación
      y el plan de la funcionalidad, cuando existan. Si se mantiene un diseño que incumple un
      requisito constitucional, tramitar y registrar la excepción conforme a 9.1 antes de
      integrar; NO DEBE declararse que ese requisito se cumple ni ocultarse el hallazgo.
   e. Someter las desviaciones visuales a la aprobación prevista en 8.6. Este procedimiento
      NO otorga al diseño prioridad automática sobre la Constitución ni al agente autoridad
      para resolver el conflicto sin consultar al usuario.

## Governance

9.1. **Supremacía y excepciones**: esta constitución prevalece sobre cualquier otra práctica de
desarrollo del proyecto. Su supremacía NO autoriza al agente a modificar unilateralmente el
diseño de referencia: los conflictos visuales DEBEN seguir el procedimiento de consulta de
8.8. Las excepciones DEBEN ser temporales, documentadas, aprobadas por los responsables
designados y registradas con fecha de vencimiento. Si el usuario elige conservar un diseño que
incumple un requisito constitucional, esa elección DEBE registrarse y acompañarse de la
excepción correspondiente, indicando requisito afectado, alcance, justificación, impacto,
responsables de aprobación y vencimiento. La elección del usuario NO sustituye las aprobaciones
exigidas cuando correspondan a otros responsables.
9.2. **Trazabilidad**: DEBE mantenerse trazabilidad bidireccional entre requisitos (BRD,
especificaciones), decisiones de arquitectura (ARD, ADR, planes), implementación (commits,
pull requests) y pruebas. Todo cambio DEBE referenciar el requisito, historia o tarea que lo
origina, y todo requisito DEBE estar cubierto por al menos una prueba identificable.
9.3. **Revisión de código**: todo cambio DEBE integrarse mediante solicitud de cambio revisada
y aprobada por al menos un revisor distinto del autor; los cambios que afecten seguridad,
arquitectura o datos sensibles DEBEN contar con la aprobación de un revisor con dicha
competencia. La revisión DEBE verificar el cumplimiento de esta constitución.
9.4. **Controles de cumplimiento**: antes de aprobar un cambio DEBEN superarse, como mínimo,
los siguientes controles automatizados: construcción, pruebas, cobertura, análisis estático,
análisis de secretos, análisis de dependencias y licencias. Un control fallido DEBE bloquear
la integración.
9.5. **Verificación en planificación**: todo plan de implementación DEBE incluir una
verificación explícita de conformidad con cada principio y registrar las desviaciones
justificadas.
9.6. **Enmiendas**: las modificaciones a esta constitución DEBEN proponerse por escrito,
incluir justificación e impacto, ser aprobadas por los responsables técnicos designados y
acompañarse de un plan de adecuación cuando afecten código existente.
9.7. **Versionado**: esta constitución sigue versionado semántico: MAJOR para eliminación o
redefinición incompatible de principios; MINOR para principios o secciones nuevas o
ampliadas materialmente; PATCH para aclaraciones y correcciones de redacción.
9.8. **Revisión periódica**: el cumplimiento y vigencia de esta constitución DEBEN revisarse
al menos una vez al año o ante cambios en las políticas corporativas.

**Version**: 1.1.0 | **Ratified**: 2026-10-14 | **Last Amended**: 2026-10-19
