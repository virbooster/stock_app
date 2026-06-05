# Changelog

Todas las novedades y cambios notables de este proyecto serán documentados en este archivo.

## [1.0.0-stable] - 2026-06-05

### Añadido
- **Rediseño Profesional de UI**: Implementación de tres estilos visuales predefinidos:
  - *Modern SaaS*: Estilo limpio basado en Indigo y blanco con sombras suaves.
  - *Minimalist*: Estilo monocromático de alto contraste.
  - *Corporate Steel*: Diseño robusto en tonos azul marino y gris acero.
- **Selector de Temas Dinámico**: Nuevo componente en el menú lateral para cambiar entre estilos en tiempo real con persistencia en `localStorage`.
- **Eliminación Definitiva**: Nueva acción para borrar productos archivados y todo su historial de movimientos de forma permanente.
- **Modal de Confirmación**: Pop-up con desenfoque de fondo (`backdrop-blur`) para confirmar acciones críticas de borrado.
- **Iconografía Mejorada**: Integración de iconos de `lucide-react` en botones de acción, búsquedas y exportación.

### Cambiado
- **Optimización de Densidad Visual**: Compactación del layout para permitir la visualización de 10 registros y controles de paginación en una sola pantalla sin necesidad de scroll.
- **Botones de Exportación**: Rediseño de los botones de Excel y PDF para un look más elegante y discreto.
- **Navegación Lateral**: Mejora visual de los enlaces de navegación con estados activos más claros y tipografía refinada.
- **Jerarquía Tipográfica**: Ajuste de tamaños de fuente en tablas y encabezados para equilibrar legibilidad y densidad de datos.

### Corregido
- **Alineación de Botones**: Unificación de alturas entre botones de acción y botones de exportación en el dashboard.
- **Consistencia de Transacciones**: Asegurada la integridad de la base de datos al eliminar registros vinculados en las tablas `Product` y `Movement`.
- **Estabilidad General**: Sincronización completa de la base de datos `dev.db` con el estado actual de la aplicación.

---
*Este registro marca la primera versión estable y profesional del sistema.*
