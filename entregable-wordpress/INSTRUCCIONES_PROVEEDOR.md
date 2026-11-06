# Guía de Implementación para el Proveedor de WordPress (`ebalancan.gob.mx`)

Este paquete contiene el **Portal Único del Padrón de Beneficiarios del H. Ayuntamiento de Balancán**, listo para instalarse en WordPress en menos de 2 minutos sin configuraciones externas.

---

## Opción 1: Instalación como Plugin de WordPress (Recomendada)

1. Ingrese al panel de administración de WordPress (`/wp-admin`).
2. Vaya a **Plugins $\rightarrow$ Añadir nuevo plugin $\rightarrow$ Subir plugin**.
3. Seleccione el archivo **`padron-balancan-wp.zip`** incluido en esta carpeta y haga clic en **Instalar ahora**.
4. Haga clic en **Activar plugin**.
   - *Al activarse, el plugin crea automáticamente la tabla MySQL `wp_padron_beneficiarios_balancan` dentro de la base de datos de WordPress y carga los 16 registros iniciales.*
5. Cree o edite la página donde desee mostrar el portal (por ejemplo: `ebalancan.gob.mx/padron-beneficiarios`) e inserte el siguiente **Shortcode**:
   ```text
   [padron_balancan]
   ```
6. Publique la página. *(Se recomienda usar la plantilla de página "Ancho completo / Full Width" o "Canvas" de su tema para aprovechar todo el ancho de la pantalla).*

---

## Seguridad y Acceso al Panel Administrativo (TIC)

El botón **"Panel Admin (TIC)"** dentro del portal está protegido contra intrusiones mediante:
- **Autenticación en servidor WordPress (`/wp-json/padron-balancan/v1/auth`):**
  Permite iniciar sesión con:
  - Cualquier cuenta de **Administrador o Editor de WordPress**, o bien:
  - Las credenciales institucionales del Departamento de TIC:
    - **Usuario:** `admin_tic` | **Contraseña:** `Balancan2026*`
    - **Usuario:** `enlace_municipal` | **Contraseña:** `Padron2026*`
- **Bloqueo automático por Fuerza Bruta (Rate Limiting):** Bloquea temporalmente la dirección IP y el navegador tras **5 intentos fallidos consecutivos**.
- **Cierre automático por inactividad:** Expira la sesión administrativa tras **15 minutos de inactividad**.
- **Tokens firmados HMAC-SHA256 + `X-WP-Nonce`** en cada operación de alta, edición, baja o importación masiva CSV.
- **Sanitización SQL (`$wpdb->prepare` / `sanitize_text_field`) y Anti-Inyección de Fórmulas CSV.**
