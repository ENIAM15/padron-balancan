<?php
/**
 * Plugin Name: Portal Único del Padrón de Beneficiarios — H. Ayuntamiento de Balancán
 * Plugin URI:  https://ebalancan.gob.mx
 * Description: Sistema Unificado de Consulta Ciudadana, Datos Abiertos y Panel Administrativo TIC (Art. 76 Fracc. XV Ley de Transparencia Tabasco). Uso: inserte el shortcode [padron_balancan] en cualquier página.
 * Version:     1.0.0
 * Author:      Departamento de TIC — H. Ayuntamiento de Balancán
 * License:     GPLv2 or later
 */

if (!defined('ABSPATH')) {
    exit; // Bloquear acceso directo al archivo PHP
}

class Padron_Beneficiarios_Balancan_WP {

    private static $instance = null;
    private $table_name;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'padron_beneficiarios_balancan';

        register_activation_hook(__FILE__, array($this, 'activar_plugin'));
        add_shortcode('padron_balancan', array($this, 'renderizar_shortcode'));
        add_action('rest_api_init', array($this, 'registrar_endpoints_rest'));
    }

    /**
     * 1. CREACIÓN AUTOMÁTICA DE TABLA MYSQL Y DATOS SEMILLA AL ACTIVAR EL PLUGIN
     */
    public function activar_plugin() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$this->table_name} (
            id varchar(64) NOT NULL,
            folio varchar(64) NOT NULL,
            periodo varchar(32) NOT NULL,
            direccion varchar(120) NOT NULL,
            programa varchar(255) NOT NULL,
            apellidoPaterno varchar(120) NOT NULL,
            apellidoMaterno varchar(120) DEFAULT '',
            nombres varchar(150) NOT NULL,
            sexo char(1) NOT NULL DEFAULT 'M',
            localidad varchar(180) NOT NULL,
            tipoApoyo varchar(80) NOT NULL,
            montoEspecie varchar(255) NOT NULL,
            montoNumerico decimal(12,2) NOT NULL DEFAULT 0.00,
            protegido tinyint(1) NOT NULL DEFAULT 0,
            fechaActualizacion datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY idx_direccion (direccion),
            KEY idx_folio (folio)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
        // La tabla se crea limpia para producción (0 registros).
    }

    private function insertar_semillas_iniciales() {
        global $wpdb;
        $semillas = array(
            array('seed-1', 'BAL-DIF-001', '2026 - T3', 'DIF Municipal', 'APOYO ALIMENTARIO A GRUPOS VULNERABLES', 'PEREZ', 'LOPEZ', 'MARIA DEL CARMEN', 'M', 'Villa El Triunfo', 'Especie', '1 CANASTA BASICA NUTRICIONAL', 650, 0),
            array('seed-2', 'BAL-DIF-002', '2026 - T3', 'DIF Municipal', 'APARATOS FUNCIONALES Y ORTOPEDICOS', 'DOMINGUEZ', 'CHABLE', 'JOSE MANUEL', 'H', 'Cabecera Municipal (Balancán)', 'Especie', '1 SILLA DE RUEDAS ESTANDAR', 3200, 0),
            array('seed-3', 'BAL-IAM-001', '2026 - T3', 'Atención a la Mujer', 'REFUGIO Y ASISTENCIA INTEGRAL PREVENTIVA', 'GONZALEZ', 'MENDEZ', 'LAURA ELENA', 'M', 'Villa Quetzalcóatl', 'Económico', '$2,500.00 MXN', 2500, 1),
            array('seed-4', 'BAL-IAM-002', '2026 - T3', 'Atención a la Mujer', 'MUJERES EMPRENDEDORAS DE BALANCAN', 'HERNANDEZ', 'CRUZ', 'ROSAURA', 'M', 'Poblado Mactún', 'Especie', '1 KIT DE INSUMOS DE REPOSTERIA', 1500, 0),
            array('seed-5', 'BAL-DEC-001', '2026 - T3', 'DECUR', 'BECAS AL TALENTO DEPORTIVO Y CULTURAL', 'GOMEZ', 'SANCHEZ', 'JUAN CARLOS', 'H', 'Cabecera Municipal (Balancán)', 'Económico', '$1,500.00 MXN', 1500, 0),
            array('seed-6', 'BAL-DEC-002', '2026 - T3', 'DECUR', 'EQUIPAMIENTO DEPORTIVO COMUNITARIO', 'LANDERO', 'CHAN', 'CARLOS MARIO', 'H', 'Poblado San Pedro', 'Especie', '1 LOTE DE BALONES Y REDES DEPORTIVAS', 2200, 0),
            array('seed-7', 'BAL-DES-001', '2026 - T2', 'Desarrollo Municipal', 'MEJORAMIENTO DE VIVIENDA DIGNA', 'RAMIREZ', 'TORRES', 'LUCIA', 'M', 'Ranchería El Águila', 'Especie', '10 LAMINAS DE ZINC Y CEMENTO', 4500, 0),
            array('seed-8', 'BAL-DES-002', '2026 - T3', 'Desarrollo Municipal', 'IMPULSO AL AUTOEMPLEO LOCAL', 'MORALES', 'JIMENEZ', 'PEDRO PABLO', 'H', 'Poblado Multé', 'Económico', '$3,000.00 MXN', 3000, 0),
            array('seed-9', 'BAL-FOM-001', '2026 - T3', 'Fomento Económico', 'INSUMOS AGRICOLAS Y SEMILLA MEJORADA', 'BAUTISTA', 'MAY', 'CANDELARIO', 'H', 'Poblado Netzahualcóyotl (Santa Ana)', 'Especie', '2 BULTOS DE SEMILLA DE MAIZ CERTIFICADA', 2600, 0),
            array('seed-10', 'BAL-FOM-002', '2026 - T2', 'Fomento Económico', 'APOYO A PEQUEÑOS PRODUCTORES GANADEROS', 'ZACARIAS', 'LOPEZ', 'VICTORIANO', 'H', 'Ejido Capitán Felipe Castellanos', 'Económico', '$4,000.00 MXN', 4000, 0),
            array('seed-11', 'BAL-FOM-003', '2026 - T3', 'Fomento Económico', 'HUERTOS FAMILIARES SUSTENTABLES', 'CAMBRANO', 'DIAZ', 'JUANA FRANCISCA', 'M', 'Ranchería Leona Vicario', 'Capacitación / Servicio', 'TALLER TECNICO Y PAQUETE DE SEMILLAS HORTICOLAS', 0, 0),
            array('seed-12', 'BAL-DIF-003', '2026 - T2', 'DIF Municipal', 'DESAYUNOS ESCOLARES PRIMERA INFANCIA', 'CORNELIO', 'VALENCIA', 'MARTHA PATRICIA', 'M', 'Ejido General Luis Felipe Domínguez', 'Especie', 'DOTACION MENSUAL DESAYUNO CALIENTE', 450, 0),
            array('seed-13', 'BAL-IAM-003', '2026 - T2', 'Atención a la Mujer', 'ASESORIA JURIDICA Y PSICOLOGICA INTEGRAL', 'VAZQUEZ', 'PERALTA', 'ANA SOFIA', 'M', 'Cabecera Municipal (Balancán)', 'Capacitación / Servicio', 'ACOMPAÑAMIENTO LEGAL INTEGRAL', 0, 1),
            array('seed-14', 'BAL-DEC-003', '2026 - T2', 'DECUR', 'IMPULSO A ARTESANOS Y CULTURA MAYA', 'PECH', 'DZIB', 'TEODORA', 'M', 'Poblado Mactún', 'Económico', '$2,000.00 MXN', 2000, 0),
            array('seed-15', 'BAL-DES-003', '2026 - T3', 'Desarrollo Municipal', 'PROGRAMA DE BACHEO Y EMPLEO TEMPORAL', 'CASTILLO', 'MENDOZA', 'ROBERTO', 'H', 'Villa El Triunfo', 'Económico', '$1,800.00 MXN', 1800, 0),
            array('seed-16', 'BAL-FOM-004', '2026 - T3', 'Fomento Económico', 'FOMENTO APICOLA Y MELIFERO', 'OSORIO', 'GARCIA', 'RIGOBERTO', 'H', 'Ejido Apatzingán', 'Especie', '3 NUCLEOS DE ABEJAS REINAS Y CAJAS', 3800, 0)
        );

        foreach ($semillas as $s) {
            $wpdb->replace(
                $this->table_name,
                array(
                    'id'              => $s[0],
                    'folio'           => $s[1],
                    'periodo'         => $s[2],
                    'direccion'       => $s[3],
                    'programa'        => $s[4],
                    'apellidoPaterno' => $s[5],
                    'apellidoMaterno' => $s[6],
                    'nombres'         => $s[7],
                    'sexo'            => $s[8],
                    'localidad'       => $s[9],
                    'tipoApoyo'       => $s[10],
                    'montoEspecie'    => $s[11],
                    'montoNumerico'   => $s[12],
                    'protegido'       => $s[13]
                )
            );
        }
    }

    /**
     * 2. SHORTCODE [padron_balancan] PARA INSERTAR EN CUALQUIER PÁGINA DE WORDPRESS
     */
    public function renderizar_shortcode() {
        $plugin_url = plugin_dir_url(__FILE__);

        wp_enqueue_style(
            'padron-balancan-css',
            $plugin_url . 'dist/assets/padron-balancan.css',
            array(),
            '1.0.0'
        );

        wp_enqueue_script(
            'padron-balancan-js',
            $plugin_url . 'dist/assets/padron-balancan.js',
            array(),
            '1.0.0',
            true
        );

        $config = array(
            'restUrl'       => esc_url_raw(rest_url('padron-balancan/v1')),
            'nonce'         => wp_create_nonce('wp_rest'),
            'logoUrl'       => esc_url_raw($plugin_url . 'dist/logo-balancan.png'),
            'logoBlancoUrl' => esc_url_raw($plugin_url . 'dist/logo-balancan-blanco.png')
        );

        wp_add_inline_script(
            'padron-balancan-js',
            'window.PADRON_BALANCAN_WP = ' . wp_json_encode($config) . ';',
            'before'
        );

        return '<div id="root" class="padron-balancan-wp-wrapper"></div>';
    }

    /**
     * 3. ENDPOINTS REST API CON PROTECCIÓN ANTI-FUERZA BRUTA Y TOKENS HMAC
     */
    public function registrar_endpoints_rest() {
        register_rest_route('padron-balancan/v1', '/auth', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'api_autenticar'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route('padron-balancan/v1', '/registros', array(
            array(
                'methods'             => 'GET',
                'callback'            => array($this, 'api_obtener_registros'),
                'permission_callback' => '__return_true'
            ),
            array(
                'methods'             => 'POST',
                'callback'            => array($this, 'api_guardar_registro'),
                'permission_callback' => array($this, 'verificar_token_tic')
            )
        ));

        register_rest_route('padron-balancan/v1', '/registros/(?P<id>[a-zA-Z0-9\-_]+)', array(
            'methods'             => 'DELETE',
            'callback'            => array($this, 'api_eliminar_registro'),
            'permission_callback' => array($this, 'verificar_token_tic')
        ));

        register_rest_route('padron-balancan/v1', '/lote', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'api_importar_lote'),
            'permission_callback' => array($this, 'verificar_token_tic')
        ));

        register_rest_route('padron-balancan/v1', '/vaciar', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'api_vaciar_padron'),
            'permission_callback' => array($this, 'verificar_token_tic')
        ));
    }

    private function obtener_ip_cliente() {
        return isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '0.0.0.0';
    }

    private function generar_token_firmado($usuario) {
        $expira = time() + (15 * 60); // 15 minutos
        $payload = $usuario . '|' . $expira;
        $firma = hash_hmac('sha256', $payload, wp_salt('auth'));
        return base64_encode($payload . '|' . $firma);
    }

    public function verificar_token_tic($request) {
        if (current_user_can('manage_options') || current_user_can('edit_pages')) {
            return true;
        }
        $auth_header = $request->get_header('authorization');
        if (!$auth_header || strpos($auth_header, 'Bearer ') !== 0) {
            return false;
        }
        $token = trim(substr($auth_header, 7));
        $decoded = base64_decode($token, true);
        if (!$decoded) return false;

        $partes = explode('|', $decoded);
        if (count($partes) !== 3) return false;

        list($usuario, $expira, $firma) = $partes;
        if (time() > (int) $expira) return false;

        $firma_esperada = hash_hmac('sha256', $usuario . '|' . $expira, wp_salt('auth'));
        return hash_equals($firma_esperada, $firma);
    }

    public function api_autenticar($request) {
        $ip = $this->obtener_ip_cliente();
        $transient_key = 'padron_lock_' . md5($ip);
        $intentos = (int) get_transient($transient_key);

        if ($intentos >= 5) {
            return new WP_REST_Response(array(
                'exito'   => false,
                'mensaje' => 'IP bloqueada temporalmente por exceso de intentos fallidos (5 minutos).'
            ), 429);
        }

        $params = $request->get_json_params();
        $usuario = isset($params['usuario']) ? sanitize_text_field($params['usuario']) : '';
        $clave   = isset($params['clave']) ? $params['clave'] : '';

        // 1. Verificar si es usuario administrador/editor de WordPress
        $wp_user = wp_authenticate($usuario, $clave);
        if (!is_wp_error($wp_user) && (user_can($wp_user, 'manage_options') || user_can($wp_user, 'edit_pages'))) {
            delete_transient($transient_key);
            return new WP_REST_Response(array(
                'exito'   => true,
                'usuario' => $wp_user->user_login,
                'nombre'  => $wp_user->display_name,
                'rol'     => 'ADMIN_WP_TIC',
                'token'   => $this->generar_token_firmado($wp_user->user_login)
            ), 200);
        }

        // 2. Verificar credenciales institucionales TIC por defecto
        $cuentas_tic = array(
            'admin_tic'        => array('clave' => 'Balancan2026*', 'nombre' => 'Administrador General TIC', 'rol' => 'ADMIN_TIC'),
            'enlace_municipal' => array('clave' => 'Padron2026*',   'nombre' => 'Enlace de Dirección Municipal', 'rol' => 'CAPTURISTA_DIRECCION')
        );

        $u_lower = strtolower($usuario);
        if (isset($cuentas_tic[$u_lower]) && hash_equals($cuentas_tic[$u_lower]['clave'], $clave)) {
            delete_transient($transient_key);
            return new WP_REST_Response(array(
                'exito'   => true,
                'usuario' => $u_lower,
                'nombre'  => $cuentas_tic[$u_lower]['nombre'],
                'rol'     => $cuentas_tic[$u_lower]['rol'],
                'token'   => $this->generar_token_firmado($u_lower)
            ), 200);
        }

        // Registrar intento fallido por 5 minutos
        set_transient($transient_key, $intentos + 1, 5 * MINUTE_IN_SECONDS);
        return new WP_REST_Response(array(
            'exito'   => false,
            'mensaje' => 'Credenciales inválidas (' . ($intentos + 1) . '/5 intentos).'
        ), 401);
    }

    public function api_obtener_registros() {
        global $wpdb;
        $resultados = $wpdb->get_results("SELECT * FROM {$this->table_name} ORDER BY folio ASC", ARRAY_A);
        $formateados = array_map(function($r) {
            $r['montoNumerico'] = (float) $r['montoNumerico'];
            $r['protegido']     = (bool) $r['protegido'];
            return $r;
        }, $resultados ? $resultados : array());

        return new WP_REST_Response(array('registros' => $formateados), 200);
    }

    public function api_guardar_registro($request) {
        global $wpdb;
        $r = $request->get_json_params();

        $id = isset($r['id']) ? sanitize_text_field($r['id']) : 'BAL-' . time();
        $wpdb->replace(
            $this->table_name,
            array(
                'id'              => $id,
                'folio'           => sanitize_text_field($r['folio'] ?? ''),
                'periodo'         => sanitize_text_field($r['periodo'] ?? '2026 - T3'),
                'direccion'       => sanitize_text_field($r['direccion'] ?? 'DIF Municipal'),
                'programa'        => sanitize_text_field($r['programa'] ?? ''),
                'apellidoPaterno' => sanitize_text_field($r['apellidoPaterno'] ?? ''),
                'apellidoMaterno' => sanitize_text_field($r['apellidoMaterno'] ?? ''),
                'nombres'         => sanitize_text_field($r['nombres'] ?? ''),
                'sexo'            => (isset($r['sexo']) && $r['sexo'] === 'H') ? 'H' : 'M',
                'localidad'       => sanitize_text_field($r['localidad'] ?? ''),
                'tipoApoyo'       => sanitize_text_field($r['tipoApoyo'] ?? 'Especie'),
                'montoEspecie'    => sanitize_text_field($r['montoEspecie'] ?? ''),
                'montoNumerico'   => isset($r['montoNumerico']) ? (float) $r['montoNumerico'] : 0,
                'protegido'       => !empty($r['protegido']) ? 1 : 0
            )
        );

        return new WP_REST_Response(array('exito' => true, 'id' => $id), 200);
    }

    public function api_eliminar_registro($request) {
        global $wpdb;
        $id = sanitize_text_field($request['id']);
        $wpdb->delete($this->table_name, array('id' => $id));
        return new WP_REST_Response(array('exito' => true), 200);
    }

    public function api_importar_lote($request) {
        global $wpdb;
        $params = $request->get_json_params();
        $lote = isset($params['registros']) && is_array($params['registros']) ? $params['registros'] : array();
        $reemplazar = !empty($params['reemplazar']);

        if ($reemplazar) {
            $wpdb->query("TRUNCATE TABLE {$this->table_name}");
        }

        foreach ($lote as $r) {
            $wpdb->replace(
                $this->table_name,
                array(
                    'id'              => sanitize_text_field($r['id'] ?? ('BAL-' . uniqid())),
                    'folio'           => sanitize_text_field($r['folio'] ?? ''),
                    'periodo'         => sanitize_text_field($r['periodo'] ?? '2026 - T3'),
                    'direccion'       => sanitize_text_field($r['direccion'] ?? 'DIF Municipal'),
                    'programa'        => sanitize_text_field($r['programa'] ?? ''),
                    'apellidoPaterno' => sanitize_text_field($r['apellidoPaterno'] ?? ''),
                    'apellidoMaterno' => sanitize_text_field($r['apellidoMaterno'] ?? ''),
                    'nombres'         => sanitize_text_field($r['nombres'] ?? ''),
                    'sexo'            => (isset($r['sexo']) && $r['sexo'] === 'H') ? 'H' : 'M',
                    'localidad'       => sanitize_text_field($r['localidad'] ?? ''),
                    'tipoApoyo'       => sanitize_text_field($r['tipoApoyo'] ?? 'Especie'),
                    'montoEspecie'    => sanitize_text_field($r['montoEspecie'] ?? ''),
                    'montoNumerico'   => isset($r['montoNumerico']) ? (float) $r['montoNumerico'] : 0,
                    'protegido'       => !empty($r['protegido']) ? 1 : 0
                )
            );
        }

        return $this->api_obtener_registros();
    }

    public function api_vaciar_padron() {
        global $wpdb;
        $wpdb->query("TRUNCATE TABLE {$this->table_name}");
        return new WP_REST_Response(array('exito' => true, 'registros' => array()), 200);
    }
}

Padron_Beneficiarios_Balancan_WP::get_instance();
