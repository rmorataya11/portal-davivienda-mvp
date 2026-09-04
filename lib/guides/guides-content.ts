export type GuideLevel = "básico" | "intermedio" | "avanzado";

export type GuideIconId = "shield" | "bank" | "bell" | "retry" | "rocket" | "alert";

export type GuideCodeSample = {
  label: string;
  language: "bash" | "json";
  code: string;
};

export type GuideRequestExample = {
  samples: GuideCodeSample[];
  caption?: string;
};

export type GuideResponseExample = {
  status: string;
  json: string;
  caption?: string;
};

export type GuideStepError = {
  status: string;
  code: string;
  cause: string;
  solution: string;
};

export type GuideTopicSection = {
  id: string;
  title: string;
  explanation: string[];
  request?: GuideRequestExample;
  response?: GuideResponseExample;
  errors: GuideStepError[];
  pendingNotes?: string[];
  infoNotes?: string[];
};

export type GuideReference = {
  label: string;
  href: string;
};

export type GuideArticle = {
  introduction: string[];
  sections: GuideTopicSection[];
  diagram: {
    title: string;
    mermaid: string;
  };
  checklist: string[];
  references?: GuideReference[];
};

export type Guide = {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  level: GuideLevel;
  minutes: number;
  endpoint: string | null;
  description: string;
  topics: string[];
  icon: GuideIconId;
  article: GuideArticle | null;
};

const autenticacionMtlsOauth: GuideArticle = {
  introduction: [
    "Sin un canal autenticado, el resto de las APIs no existen: el banco no sabe quién es usted y usted no tiene cómo demostrar que es quien dice ser. Esta guía cubre el primer contrato de verdad entre su aplicación y Davivienda: un certificado de cliente (mTLS) y una llave de acceso (OAuth 2.0).",
    "El problema que resuelve es simple de enunciar y caro de ignorar. Si el certificado está mal firmado, si pide la llave con un secreto en un header inventado, o si reutiliza una llave vencida, cada llamada posterior —saldos, pagos, webhooks— se cae por la misma razón. Aquí dejamos esa base bien puesta.",
    "Al terminar va a poder generar el CSR, cargar el certificado de cliente, pedir una llave de acceso con POST /oauth/token y renovarla o revocarla sin improvisar. El resto de las guías asume que este paso ya está hecho.",
  ],
  sections: [
    {
      id: "csr-certificado",
      title: "Generar el CSR y cargar el certificado",
      explanation: [
        "mTLS (Mutual TLS) quiere decir exactamente eso: los dos lados muestran certificado. El banco ya tiene el suyo. A usted le toca un certificado de cliente, atado a la aplicación que registró en la consola. La llave privada no sale de su servidor; lo que viaja es una solicitud de firma (CSR) para que la autoridad del banco —o la que ellos indiquen— le devuelva el certificado listo.",
        "En un perfil FAPI 2.0 el certificado no es un adorno: es la prueba de que la aplicación es quien dice ser. Por eso el token endpoint no se autentica con un client_secret en texto plano. Presenta el certificado en el handshake TLS (tls_client_auth, RFC 8705 — el estándar de autenticación mutua-TLS para OAuth 2.0, no el de registro de clientes; el alta en sí es RFC 7591) y, si el banco lo pide, un client_id en el cuerpo para empatar esa identidad con el registro.",
        "El flujo práctico es de tres movimientos: genera el par de llaves, arma el CSR con los datos de su aplicación, y carga el CSR (o el certificado ya firmado) donde el portal se lo pida. Abajo va el estándar de la industria. Lo que dependa del contrato de Davivienda queda marcado.",
      ],
      pendingNotes: [
        "<!-- PENDIENTE: confirmar con el contrato real de la API de OAuth el host, el endpoint de carga de certificados y si el alta se hace por consola, por API de registro (RFC 7591) o por ambos -->",
      ],
      request: {
        caption:
          "El CSR se genera en su máquina. El JSON de abajo es el cuerpo típico de un alta de certificado o de Dynamic Client Registration (RFC 7591); no es un campo propietario de Davivienda. El valor tls_client_auth lo define RFC 8705 (mTLS), no RFC 7591.",
        samples: [
          {
            label: "cURL / OpenSSL",
            language: "bash",
            code: `# 1) Par de llaves (se queda en su servidor)
openssl genrsa -out client.key 2048

# 2) CSR con el subject de su aplicación
openssl req -new -key client.key -out client.csr \\
  -subj "/C=CO/O=Su Empresa SAS/OU=Open Banking/CN=app-tesoreria-sandbox"

# 3) Carga del CSR — la URL exacta depende del contrato
curl --request POST \\
  --url "https://{host-oauth}/connect/register" \\
  --header "Content-Type: application/json" \\
  --header "Authorization: Bearer {registration_access_token}" \\
  --data @client-registration.json`,
          },
          {
            label: "JSON",
            language: "json",
            code: `{
  "client_name": "Tesorería Sandbox",
  "token_endpoint_auth_method": "tls_client_auth",
  "tls_client_auth_subject_dn": "CN=app-tesoreria-sandbox,OU=Open Banking,O=Su Empresa SAS,C=CO",
  "jwks": {
    "keys": [
      {
        "kty": "RSA",
        "use": "sig",
        "alg": "PS256",
        "kid": "2026-09-sandbox-1",
        "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx...",
        "e": "AQAB"
      }
    ]
  },
  "scope": "accounts payments",
  "grant_types": ["client_credentials", "authorization_code", "refresh_token"],
  "response_types": ["code"],
  "redirect_uris": ["https://su-app.example/callback"]
}`,
          },
        ],
      },
      response: {
        status: "201 Created",
        caption: "Respuesta típica de un registro de cliente (RFC 7591). El client_id es el que va a usar en /oauth/token.",
        json: `{
  "client_id": "a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11",
  "client_id_issued_at": 1756944000,
  "token_endpoint_auth_method": "tls_client_auth",
  "tls_client_auth_subject_dn": "CN=app-tesoreria-sandbox,OU=Open Banking,O=Su Empresa SAS,C=CO",
  "registration_access_token": "reg-at-7f2c9b...",
  "registration_client_uri": "https://{host-oauth}/connect/register/a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11",
  "grant_types": ["client_credentials", "authorization_code", "refresh_token"],
  "scope": "accounts payments"
}`,
      },
      errors: [
        {
          status: "400",
          code: "invalid_redirect_uri",
          cause: "El valor de una o más redirect_uris es inválido",
          solution:
            "Use solo URIs absolutas HTTPS, sin fragmento, y que coincidan con las que el banco espera para esta aplicación.",
        },
        {
          status: "400",
          code: "invalid_client_metadata",
          cause: "El valor de uno de los campos de metadata del cliente es inválido",
          solution:
            "Revise token_endpoint_auth_method, jwks, grant_types y tls_client_auth_subject_dn contra el perfil de registro. No suba la llave privada.",
        },
        {
          status: "400",
          code: "invalid_software_statement",
          cause: "El software statement no pudo validarse",
          solution:
            "El assertion está ausente, vencido o la firma no cierra con el JWKS del emisor. Regenere el software_statement y reintente.",
        },
        {
          status: "400",
          code: "unapproved_software_statement",
          cause: "El software statement es válido pero no está aprobado",
          solution:
            "El statement está bien formado, pero el banco todavía no aprobó ese software_id. Complete la aprobación en el portal antes de registrar.",
        },
      ],
      infoNotes: [
        "El código invalid_token no aplica al registro inicial de un cliente. Ese código pertenece a operaciones posteriores de gestión del cliente ya registrado (actualizar o eliminar), donde se usa el registration_access_token como credencial.",
      ],
    },
    {
      id: "llave-de-acceso",
      title: "Solicitar la llave de acceso",
      explanation: [
        "Con el certificado ya aceptado, pide la llave de acceso. En OAuth 2.0 eso es POST /oauth/token con grant_type=client_credentials (RFC 6749 §4.4). No hay usuario en este paso: está pidiendo permiso para que su aplicación hable con el banco, no para leer la cuenta de un cliente. Eso viene en la guía de consentimientos.",
        "El estándar manda application/x-www-form-urlencoded, no JSON. El JSON de al lado es la misma carga útil, escrita como objeto para que se lea fácil. En FAPI 2.0 el secreto no viaja en el body: el autenticador es el certificado que presenta en el handshake (--cert y --key en curl). El client_id solo empató esa identidad con el registro.",
        "La respuesta útil es access_token, token_type=Bearer y expires_in. Guarde la llave en memoria o en un almacén cifrado de su backend. No la deje en el front, no la loguee completa y no la rebase de Sandbox a Producción: son ambientes distintos, certificados distintos, llaves distintas.",
      ],
      pendingNotes: [
        "<!-- PENDIENTE: confirmar con el contrato real de la API de OAuth el host de Sandbox/Producción, los scopes exactos, el lifetime de expires_in y si exigen private_key_jwt además de mTLS -->",
      ],
      request: {
        caption:
          "RFC 6749 + RFC 8705 (mTLS). El body real va en form-urlencoded; el JSON es la misma carga útil para lectura.",
        samples: [
          {
            label: "cURL",
            language: "bash",
            code: `curl --request POST \\
  --url "https://{host-oauth}/oauth/token" \\
  --cert ./client.crt \\
  --key ./client.key \\
  --header "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode "grant_type=client_credentials" \\
  --data-urlencode "client_id=a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11" \\
  --data-urlencode "scope=accounts payments"`,
          },
          {
            label: "JSON",
            language: "json",
            code: `{
  "grant_type": "client_credentials",
  "client_id": "a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11",
  "scope": "accounts payments"
}`,
          },
        ],
      },
      response: {
        status: "200 OK",
        caption: "Respuesta estándar de RFC 6749 §5.1. La llave de acceso es el access_token.",
        json: `{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGYzYzJlMS00YjA5LTRkNzctOWMxYS0yZTZiMGQ4ZjRhMTEiLCJzY29wZSI6ImFjY291bnRzIHBheW1lbnRzIiwiaWF0IjoxNzU2OTQ0MDAwLCJleHAiOjE3NTY5NDQ5MDB9.signature",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "accounts payments"
}`,
      },
      errors: [
        {
          status: "400",
          code: "invalid_request",
          cause: "Falta grant_type, el body no es form-urlencoded, o mandó JSON crudo al token endpoint.",
          solution:
            "Envíe application/x-www-form-urlencoded con grant_type=client_credentials. El JSON de esta guía es solo para leer, no para pegar como body.",
        },
        {
          status: "401",
          code: "invalid_client",
          cause: "El handshake mTLS falló: certificado vencido, DN que no coincide, o no presentó certificado.",
          solution:
            "Verifique --cert/--key, la cadena intermedia y que el subject DN sea el mismo del registro. Un 401 aquí casi nunca se arregla rotando el client_id.",
        },
        {
          status: "400",
          code: "invalid_scope",
          cause: "Pidió un scope que esa aplicación no tiene habilitado en Sandbox.",
          solution:
            "Pida solo los scopes que aparecen en la consola para esa app. Si necesita payments, habilítelo antes; no lo invente en la llamada.",
        },
        {
          status: "400",
          code: "unauthorized_client",
          cause: "La aplicación existe, pero no tiene permitido client_credentials.",
          solution:
            "Revise grant_types en el registro. Si solo tiene authorization_code, este paso no aplica: vaya a la guía de consentimientos.",
        },
      ],
    },
    {
      id: "renovar-revocar",
      title: "Renovar y revocar llaves",
      explanation: [
        "La llave de acceso se vence. Con client_credentials no hay refresh_token: cuando expires_in se acaba, vuelve a POST /oauth/token con el mismo certificado y pide otra. No reintente la operación de negocio con una llave vencida; primero renueve, después dispare el llamado.",
        "Si más adelante usa el flujo de autorización de usuario (guía de consentimientos), ahí sí puede aparecer grant_type=refresh_token. Lo dejamos escrito para que el patrón le suene, no porque este paso lo necesite.",
        "Revocar es el cierre limpio: POST /oauth/revoke (RFC 7009). Sirve cuando rota certificados, apaga una app o sospecha que la llave se filtró. El banco invalida esa llave; las demás de la misma aplicación siguen vivas salvo que revoque también el refresh_token. La guía de errores y cierre de sesión profundiza el incidente; aquí alcanza con saber cortar la llave.",
      ],
      pendingNotes: [
        "<!-- PENDIENTE: confirmar con el contrato real de la API de OAuth si client_credentials emite refresh_token (el estándar no lo hace), el path exacto de /oauth/revoke y si la revocación invalida solo la llave o también el certificado -->",
      ],
      request: {
        caption:
          "Renovación = un token nuevo. Revocación = RFC 7009. El JSON otra vez es la misma carga útil, no el content-type real.",
        samples: [
          {
            label: "cURL",
            language: "bash",
            code: `# Renovar (client_credentials): pida otra llave
curl --request POST \\
  --url "https://{host-oauth}/oauth/token" \\
  --cert ./client.crt \\
  --key ./client.key \\
  --header "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode "grant_type=client_credentials" \\
  --data-urlencode "client_id=a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11" \\
  --data-urlencode "scope=accounts payments"

# Si más adelante tiene refresh_token (flujo de usuario):
curl --request POST \\
  --url "https://{host-oauth}/oauth/token" \\
  --cert ./client.crt \\
  --key ./client.key \\
  --header "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode "grant_type=refresh_token" \\
  --data-urlencode "refresh_token=def50200a91c..." \\
  --data-urlencode "client_id=a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11"

# Revocar la llave de acceso (RFC 7009)
curl --request POST \\
  --url "https://{host-oauth}/oauth/revoke" \\
  --cert ./client.crt \\
  --key ./client.key \\
  --header "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode "token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  --data-urlencode "token_type_hint=access_token" \\
  --data-urlencode "client_id=a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11"`,
          },
          {
            label: "JSON",
            language: "json",
            code: `{
  "revoke": {
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type_hint": "access_token",
    "client_id": "a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11"
  },
  "refresh": {
    "grant_type": "refresh_token",
    "refresh_token": "def50200a91c...",
    "client_id": "a8f3c2e1-4b09-4d77-9c1a-2e6b0d8f4a11"
  }
}`,
          },
        ],
      },
      response: {
        status: "200 OK",
        caption:
          "RFC 7009: una revocación exitosa responde 200 con body vacío. Esta respuesta (200 con body vacío) se recibe tanto si la revocación fue exitosa como si el token ya era inválido o había expirado — revocar un token ya inválido no es un error, porque el objetivo de que ese token deje de servir ya está cumplido.",
        json: `{}`,
      },
      errors: [
        {
          status: "400",
          code: "invalid_request",
          cause: "Mandó el token en un header Bearer en vez del campo token del body, o no indicó el token.",
          solution:
            "El revoke no es un GET autenticado. Va POST, form-urlencoded, campo token. Authorization Bearer no sustituye ese campo.",
        },
        {
          status: "401",
          code: "invalid_client",
          cause: "Intentó revocar sin mTLS, o con el certificado de otra aplicación.",
          solution:
            "Revoca con el mismo certificado que usó para pedir la llave. Si está rotando certificados, revoque antes de dar de baja el viejo.",
        },
        {
          status: "400",
          code: "unsupported_token_type",
          cause: "El banco no acepta el token_type_hint que envió (por ejemplo, un tipo propietario).",
          solution:
            "Use access_token o refresh_token, que son los hints de RFC 7009. Si duda, omita el hint y mande solo token.",
        },
      ],
    },
  ],
  diagram: {
    title: "De la CSR a la llave de acceso",
    mermaid: `sequenceDiagram
    autonumber
    actor Dev as Su backend
    participant Portal as Consola / registro
    participant AS as Authorization Server
    participant API as API de negocio

    Dev->>Dev: Genera client.key + CSR
    Dev->>Portal: Carga CSR / registra cliente (mTLS)
    Portal-->>Dev: client_id + certificado firmado
    Dev->>AS: POST /oauth/token (client_credentials + mTLS)
    AS-->>Dev: access_token (llave de acceso)
    Dev->>API: GET|POST ... Authorization Bearer
    API-->>Dev: 200 o 401 si la llave venció
    alt Llave por vencer
      Dev->>AS: POST /oauth/token otra vez
      AS-->>Dev: nueva llave de acceso
    else Incidente o rotación
      Dev->>AS: POST /oauth/revoke
      AS-->>Dev: 200
    end`,
  },
  checklist: [
    "El par de llaves vive en el servidor; el CSR que subió no incluye la llave privada.",
    "Puede obtener un 200 en POST /oauth/token con --cert y --key, sin client_secret en el body.",
    "Guarda access_token y expires_in, y renueva antes de que la llave se venza —no cuando la API de negocio ya respondió 401.",
    "Probó POST /oauth/revoke y confirmó que la misma llave ya no autentica una llamada siguiente.",
    "Tiene separado el certificado y el client_id de Sandbox de los de Producción.",
  ],
  references: [
    {
      label: "RFC 6749 (The OAuth 2.0 Authorization Framework)",
      href: "https://www.rfc-editor.org/rfc/rfc6749",
    },
    {
      label: "RFC 7009 (OAuth 2.0 Token Revocation)",
      href: "https://www.rfc-editor.org/rfc/rfc7009",
    },
    {
      label: "RFC 7591 (OAuth 2.0 Dynamic Client Registration Protocol)",
      href: "https://www.rfc-editor.org/rfc/rfc7591",
    },
    {
      label: "RFC 7592 (OAuth 2.0 Dynamic Client Registration Management Protocol)",
      href: "https://www.rfc-editor.org/rfc/rfc7592",
    },
    {
      label: "RFC 8705 (OAuth 2.0 Mutual-TLS Client Authentication)",
      href: "https://www.rfc-editor.org/rfc/rfc8705",
    },
    {
      label: "RFC 6750 (The OAuth 2.0 Authorization Framework: Bearer Token Usage)",
      href: "https://www.rfc-editor.org/rfc/rfc6750",
    },
  ],
};

export const guides: Guide[] = [
  {
    id: "guia-01",
    slug: "autenticacion-mtls-oauth",
    number: "01",
    title: "Autenticación mTLS + OAuth 2.0",
    category: "SEGURIDAD",
    level: "intermedio",
    minutes: 15,
    endpoint: "POST /oauth/token",
    description:
      "La base de todo. Dejamos su certificado y sus llaves bien puestos para que el resto de las integraciones simplemente funcione.",
    topics: ["generar el CSR y cargar el certificado", "solicitar la llave de acceso", "renovar y revocar llaves"],
    icon: "shield",
    article: autenticacionMtlsOauth,
  },
  {
    id: "guia-02",
    slug: "consentimiento-acceso-cuentas",
    number: "02",
    title: "Consentimiento y acceso a cuentas",
    category: "OPEN BANKING",
    level: "intermedio",
    minutes: 20,
    endpoint: "POST /consents",
    description:
      "Cómo pedirle permiso al cliente —con todas las de la ley— para poder leer sus saldos y movimientos.",
    topics: ["crear la solicitud de permiso", "redirigir y autorizar al usuario", "consultar saldos y movimientos"],
    icon: "bank",
    article: null,
  },
  {
    id: "guia-03",
    slug: "webhooks-notificaciones",
    number: "03",
    title: "Webhooks y notificaciones",
    category: "EVENTOS",
    level: "intermedio",
    minutes: 12,
    endpoint: "POST /webhooks",
    description: "Deje de preguntarle al banco a cada rato: que él le avise. Montamos los webhooks de punta a punta.",
    topics: ["registrar su dirección receptora", "validar la firma HMAC", "manejar reintentos e idempotencia"],
    icon: "bell",
    article: null,
  },
  {
    id: "guia-04",
    slug: "idempotencia-reintentos",
    number: "04",
    title: "Idempotencia y reintentos",
    category: "OPERACIÓN",
    level: "básico",
    minutes: 8,
    endpoint: null,
    description: "El truco para que un reintento nunca se convierta en un pago doble. Corto y al grano.",
    topics: ["generar marcas únicas", "reintentar de forma segura", "interpretar respuestas 409"],
    icon: "retry",
    article: null,
  },
  {
    id: "guia-05",
    slug: "paso-a-produccion",
    number: "05",
    title: "Paso a Producción",
    category: "PRODUCCIÓN",
    level: "avanzado",
    minutes: 18,
    endpoint: null,
    description:
      "La lista de chequeo final antes de salir en vivo: seguridad, acuerdos y monitoreo, sin sorpresas.",
    topics: ["completar la certificación de seguridad", "firmar el acuerdo de servicio", "homologar y monitorear"],
    icon: "rocket",
    article: null,
  },
  {
    id: "guia-06",
    slug: "manejo-errores-cierre-sesion",
    number: "06",
    title: "Manejo de errores y cierre de sesión",
    category: "OPERACIÓN",
    level: "básico",
    minutes: 10,
    endpoint: "POST /oauth/revoke",
    description:
      "Cuando una llamada falla o el token se vence, hay que leer el error, no duplicar la operación y cortar las llaves que ya no sirven.",
    topics: ["interpretar 4xx y 5xx", "renovar o revocar el token", "registrar el incidente sin perder el rastro"],
    icon: "alert",
    article: null,
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getPublishedGuides() {
  return guides.filter((guide) => guide.article);
}
