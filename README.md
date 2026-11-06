# Portal Único del Padrón de Beneficiarios — H. Ayuntamiento de Balancán (2024 - 2027)

Sistema Unificado de Consulta Ciudadana, Datos Abiertos y Consola Administrativa TIC para el cumplimiento del **Artículo 76 Fracción XV de la Ley de Transparencia y Acceso a la Información Pública del Estado de Tabasco** y lineamientos de protección de datos personales del **ITAIP**.

---

## Características Principales

1. **Vista Ciudadana de Transparencia Proactiva:**
   - Indicadores en tiempo real (KPIs de beneficiarios atendidos, programas activos, direcciones participantes, inversión directa e indicador de equidad de género).
   - Consulta por Dirección Municipal (`DIF Municipal`, `Atención a la Mujer`, `DECUR`, `Desarrollo Municipal`, `Fomento Agropecuario`).
   - Filtros combinados por localidad de Balancán, trimestre/ejercicio y tipo de beneficio.
   - Exportación de **Datos Abiertos en CSV** sanitizados.
   - Resguardo automático de identidad (`BENEFICIARIO PROTEGIDO`) para casos vulnerables.

2. **Panel Administrativo TIC Protegido:**
   - Control de acceso con autenticación verificada (`SHA-256` / `HMAC-SHA256`), bloqueo automático contra fuerza bruta (máximo 5 intentos) y expiración de sesión por inactividad (15 minutos).
   - Captura individual con homologación automática a `MAYÚSCULAS` sin acentos.
   - **Auditor de Privacidad CSV (ITAIP):** Detecta y bloquea automáticamente columnas prohibidas (`CURP`, `RFC`, `TELEFONO`, `DOMICILIO`, `INE`, `DIAGNOSTICO`) antes de importar lotes.
   - **Bitácora de Seguridad y Auditoría:** Registro cronológico de accesos, intentos fallidos, altas, ediciones y bajas.

3. **Integración Nativa con WordPress (`entregable-wordpress/padron-balancan-wp.zip`):**
   - Plugin auto-contenido para WordPress que crea automáticamente la tabla MySQL `wp_padron_beneficiarios_balancan`, expone endpoints REST protegidos y habilita el shortcode `[padron_balancan]`.

---

## Estructura del Proyecto

```text
├── entregable-wordpress/         # Paquete .zip listo para instalar en WordPress + Guía
├── public/                       # Logotipos institucionales con transparencia
├── src/
│   ├── components/               # Encabezado, Pie de página, Modales y Notificaciones
│   │   ├── admin/                # Formulario de captura, Importador CSV, Tabla CRUD y Bitácora
│   │   └── publica/              # KPIs, Filtros y Tabla Ciudadana paginada
│   ├── config/                   # Configuración de Firebase / entorno
│   ├── pages/                    # Vistas principales (VistaPublica y PanelAdmin)
│   └── utils/                    # Catálogos oficiales, normalización, seguridad y CSV
├── wordpress-plugin/             # Código fuente del Plugin PHP para WordPress
├── empaquetar-wordpress.ps1      # Script para compilar y actualizar el .zip de WordPress
└── iniciar-sitio.bat             # Lanzador rápido del servidor local
```

---

## Ejecución en Entorno Local

1. Haga doble clic en `iniciar-sitio.bat` o ejecute en la terminal:
   ```bash
   npm install
   npm run dev
   ```
2. Abra `http://localhost:5173` en su navegador.
