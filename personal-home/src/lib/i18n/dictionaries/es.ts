import type { Dictionary } from "./en"

// Neutral Latin American Spanish. Two standing rules from
// docs/PROJECT_OVERVIEW.md carry over into translation: never position Rickie
// as a "web developer"/"React developer"/"freelancer" — so "desarrollador web"
// and "freelance" are off-limits here in favour of "ingeniero de software",
// "estratega tecnológico" and "consultoría".
//
// Typed as Dictionary, not inferred: that is what turns a missing key into a
// build failure.
export const es: Dictionary = {
  client: {
    nav: {
      ariaLabel: "Principal",
      work: "Trabajo",
      projects: "Proyectos",
      about: "Acerca de",
      consulting: "Consultoría",
      contact: "Contacto",
    },
    mobileNav: {
      close: "Cerrar",
      open: "Abrir menú",
      title: "Menú",
    },
    themeToggle: {
      toLight: "Cambiar al modo claro",
      toDark: "Cambiar al modo oscuro",
    },
    error: {
      title: "Algo salió mal",
      description:
        "Esta página no se pudo cargar. Volver a intentarlo suele funcionar; si no, avísame qué estabas buscando.",
      tryAgain: "Intentar de nuevo",
      backHome: "Volver al inicio",
      report: "Reportar el problema",
      reference: "Referencia:",
    },
    contactForm: {
      errors: {
        nameRequired: "El nombre es obligatorio.",
        emailInvalid: "Ingresa una dirección de correo válida.",
        reasonRequired: "Elige en qué te gustaría recibir ayuda.",
        messageTooShort: "El mensaje debe tener al menos 10 caracteres.",
        generic: "Algo salió mal. Vuelve a intentarlo.",
      },
      reasons: {
        consulting: "Consultoría",
        "website-application": "Sitio web / aplicación",
        "technical-question": "Pregunta técnica",
        collaboration: "Colaboración",
        employment: "Empleo",
        other: "Otro",
      },
      honeypotLabel: "Deja este campo en blanco",
      name: "Nombre",
      email: "Correo electrónico",
      organization: "Organización",
      reasonLegend: "¿En qué puedo ayudarte?",
      message: "Mensaje",
      submit: "Iniciar una conversación",
      submitting: "Enviando…",
      successTitle: "Gracias, tu mensaje va en camino.",
      successBody: "Te responderé pronto.",
    },
    downloadResume: "Descargar PDF",
    printResume: "Imprimir / Guardar como PDF",
    localeSwitcher: {
      ariaLabel: "Idioma",
    },
  },

  common: {
    skipToContent: "Saltar al contenido",
    readCaseStudy: "Leer el estudio de caso",
    siteName: "Rickie Cruz",
    jobTitle: "Ingeniero de Software",
    siteDescription:
      "Ingeniero de software que crea productos digitales útiles y ayuda a las organizaciones a tomar mejores decisiones tecnológicas.",
  },

  status: {
    active: "Activo",
    experiment: "Experimento",
    completed: "Completado",
    archived: "Archivado",
  },

  caseStudy: {
    published: "Publicado",
    updated: "Actualizado",
    ogAlt: "Vista previa del estudio de caso",
    problem: "Problema",
    context: "Contexto",
    goals: "Objetivos",
    constraints: "Restricciones",
    research: "Investigación y descubrimiento",
    architecture: "Arquitectura",
    design: "Diseño",
    implementation: "Implementación",
    challenges: "Desafíos",
    decisions: "Decisiones",
    metrics: "Métricas",
    result: "Resultado",
    lessonsLearned: "Lecciones aprendidas",
    whatItDoes: "Qué hace",
    whyIBuiltIt: "Por qué lo construí",
    technicalDecisions: "Decisiones técnicas",
    untranslatedNotice:
      "Este estudio de caso todavía no está traducido — se muestra a continuación en inglés.",
  },

  home: {
    tagline: "Te ayudo a encontrar soluciones tecnológicas sensatas.",
    intro:
      "Ingeniero de software y estratega tecnológico. Diseño y construyo aplicaciones web, plataformas de operaciones y herramientas que resuelven problemas reales. Ayudo a organizaciones pequeñas y sin fines de lucro a navegar la tecnología sin la burocracia corporativa ni complejidad innecesaria.",
    currently:
      "Actualmente: reconstruyendo después de un despido, resolviendo mis propios retos financieros con código, y ayudando a Chatter Snow a escalar sus operaciones como miembro de la junta y director de operaciones digitales.",
    viewWork: "Ver mi trabajo",
    letsTalk: "Conversemos",
    featuredWork: "Trabajo destacado",
  },

  work: {
    metaTitle: "Trabajo",
    metaDescription:
      "Estudios de caso de trabajo de ingeniería profesional y voluntario.",
    title: "Trabajo",
    description:
      "Estudios de caso de trabajo de ingeniería profesional y voluntario: cómo se entendió el problema, qué se construyó y qué compensaciones dieron forma al resultado.",
    empty:
      "Todavía no hay estudios de caso publicados; mientras tanto, los proyectos personales están documentados.",
    browseProjects: "Ver proyectos",
    getInTouch: "Ponte en contacto",
  },

  projects: {
    metaTitle: "Proyectos",
    metaDescription:
      "Proyectos personales: qué hacen, por qué se construyeron y cómo.",
    title: "Proyectos",
    description:
      "Proyectos personales, aparte del trabajo profesional: construidos para aprender algo, resolver un problema real o explorar una idea.",
    empty:
      "Todavía no hay proyectos publicados; por ahora los estudios de caso profesionales son la lectura más completa.",
    viewCaseStudies: "Ver estudios de caso",
    getInTouch: "Ponte en contacto",
  },

  contact: {
    metaTitle: "Contacto",
    metaDescription:
      "Inicia una conversación sobre consultoría, un proyecto o una pregunta.",
    title: "Ponte en contacto",
    description:
      "Ya sea una pregunta de consultoría, una idea de proyecto o algo completamente distinto, cuéntame un poco al respecto aquí abajo.",
  },

  notFound: {
    metaTitle: "Página no encontrada",
    eyebrow: "404",
    title: "Página no encontrada",
    description:
      "Esa página no existe, o se movió. Los enlaces de abajo cubren todo el sitio.",
    backHome: "Volver al inicio",
    viewWork: "Ver mi trabajo",
  },

  about: {
    metaTitle: "Acerca de",
    metaDescription: "Quién soy, qué hago y cómo trabajo.",
    title: "Acerca de",
    description: "La persona detrás del trabajo, no sólo el currículum.",

    whoIAm: {
      heading: "Quién soy",
      body: "Soy Rickie, ingeniero de software con más de 10 años de experiencia en consultoría, servicios financieros, tecnología de recursos humanos y liderazgo de ingeniería. Empecé construyendo integraciones de datos en Accenture, pasé de desarrollador a líder de equipo y gerente en Fiserv, y más recientemente dirigí el desarrollo de aplicaciones en ADP.",
    },

    whatIDo: {
      heading: "Qué hago",
      body: "Mi trabajo abarca todo el stack —canalizaciones de datos y sistemas de backend, además de las interfaces que la gente realmente usa— junto con la arquitectura y el liderazgo de equipo que lo mantienen todo funcionando. He construido software como colaborador individual y lo he dirigido como gerente responsable del resultado de un equipo, lo cual moldea cómo pienso las compensaciones entre entregar rápido y construir cosas que duren.",
    },

    howIWork: {
      heading: "Cómo trabajo",
      systems:
        "Me gusta entender el sistema completo antes de tocar una sola línea de código, ya sea una canalización de datos, el flujo de trabajo de un equipo o una base de código que heredé. Prefiero dedicar tiempo a entender cómo encajan las piezas que adivinar el camino hacia una solución.",
      ownership:
        "Me acostumbré temprano a asumir responsabilidad. Como líder del equipo de UI en Fiserv, dirigí equipos de ingeniería distribuidos entre recursos locales y remotos, entregando productos a cerca de 100 clientes empresariales. Coordinar entre zonas horarias y equipos me enseñó a comunicarme con claridad, señalar los problemas antes de que se conviertan en incendios y tomar decisiones sin esperar permiso.",
      durability:
        "Me importa construir cosas que sobrevivan a quien las construyó: escribir código pensando en la siguiente persona, ser franco sobre las compensaciones en lugar de sobrevender una solución rápida, y tratar la mantenibilidad como parte del trabajo y no como algo secundario.",
    },

    experience: {
      heading: "Experiencia",
      body: "Empecé en Accenture construyendo integraciones de datos con Informatica/ETL, luego trabajé de forma independiente en desarrollo full-stack antes de entrar a Fiserv como desarrollador de AngularJS. Crecí hasta liderar el equipo de UI, dirigiendo equipos distribuidos locales y remotos, y después asumí un rol de líder y gerente a cargo de un equipo de ingeniería multifuncional en la plataforma de alertas de fraude de Fiserv. De ahí pasé a ADP como desarrollador líder de aplicaciones, enfocado en el desarrollo práctico, desde 2020 hasta julio de 2026.",
      resumeLinkPrefix: "Para el desglose completo, consulta mi ",
      resumeLinkLabel: "currículum",
      resumeLinkSuffix: ".",
    },

    currently: {
      heading: "Actualmente",
      body: "Estoy buscando lo que sigue, ya sea un puesto de tiempo completo o trabajo de consultoría con un equipo que lo necesite. Mientras tanto, estoy desarrollando este sitio y avanzando en las primeras etapas de una aplicación de finanzas personales que he querido construir durante años. También soy miembro de la junta y director de operaciones digitales en Chatter, una comunidad LGBTQ+ de esquí y snowboard que se está organizando para convertirse en una organización sin fines de lucro, donde lidero la parte técnica.",
    },

    outsideOfWork: {
      heading: "Fuera del trabajo",
      skiingPrefix:
        "Esquío. Encontré a Chatter en un momento en que no tenía equipo ni conocía a muchas personas queer en el deporte, y salí de ese primer evento con amistades y mi primera chamarra Burton. Hoy mi participación va mucho más allá de la montaña: ayudo a planear eventos, monto la infraestructura y trabajo para lograr el estatus de organización sin fines de lucro. (Más sobre eso en el ",
      skiingLinkLabel: "estudio de caso de Chatter",
      skiingSuffix: ".)",
      sports:
        "Cuando no estoy esquiando, juego tenis (no tan seguido como quisiera, pero me defiendo), y llevo tres años entrenando de forma constante en el gimnasio; este año retomé el running porque mi rodilla se ha fortalecido. Soy más feliz cerca del agua o al aire libre en general, lo que hace del paddleboard mi actividad favorita de verano: es básicamente todo lo anterior a la vez.",
      reading:
        "También leo bastante, entre 5 y 50 libros al año según cómo vaya la vida, y comparto mi departamento con Cleo, una gata calicó de 12 años que manda en la casa.",
    },
  },

  consulting: {
    metaTitle: "Consultoría",
    metaDescription:
      "Evaluaciones tecnológicas, sitios y aplicaciones web, estrategia técnica y herramientas internas para organizaciones pequeñas.",
    title: "Consultoría",
    intro:
      "La tecnología no debería ser una fuente de confusión. Ayudo a organizaciones pequeñas y sin fines de lucro a definir lo que realmente necesitan, sin complejidad innecesaria ni burocracia corporativa. He hecho este trabajo (miembro de la junta y director de operaciones digitales en Chatter Snow) y entiendo sus limitaciones.",

    howThisWorks: {
      heading: "Cómo funciona",
      conversation:
        "Empezamos con una conversación. 30 minutos, sin compromiso. Tú me cuentas qué está roto o qué te confunde de tu tecnología. Yo escucho.",
      deeper: "Si tiene sentido profundizar, definimos juntos cómo se vería eso.",
    },

    servicesHeading: "Servicios",
    services: {
      healthCheck: {
        title: "Diagnóstico tecnológico",
        price: "Desde $150–350 USD (sin fines de lucro) o $350–500 USD (pequeña empresa)",
        description: ["Revisión integral de tu ecosistema tecnológico."],
        details: [
          { label: "Entregable", value: "Evaluación + hoja de ruta priorizada" },
          {
            label: "Abarca",
            value:
              "Sitio web, hosting, DNS, correo, SaaS, seguridad, accesos, analítica, pagos, almacenamiento, respaldos y costos.",
          },
        ],
      },
      websites: {
        title: "Sitios y aplicaciones web",
        price: "Desde $1,500 USD",
        description: [
          "Sitios web modernos y aplicaciones a la medida para organizaciones que ya superaron las plantillas.",
        ],
        details: [
          { label: "Entregable", value: "Estimación con alcance y cronograma" },
          {
            label: "Para",
            value:
              "Organizaciones sin fines de lucro en crecimiento, pequeñas empresas u organizaciones que necesitan algo específico para su flujo de trabajo.",
          },
        ],
      },
      strategy: {
        title: "Estrategia técnica",
        price: "Desde $100 USD por hora",
        description: [
          'La pregunta que realmente necesitas responder: "¿Qué deberíamos usar y por qué?"',
          "Mapeamos tus limitaciones (presupuesto, equipo, plazos, crecimiento), revisamos tus opciones y construimos una estrategia que tenga sentido para ti ahora mismo, no la que se ve bien en un estudio de caso.",
        ],
        details: [
          {
            label: "Abarca",
            value:
              "Selección de tecnología, arquitectura, infraestructura en la nube, integraciones, datos, autenticación y automatización.",
          },
        ],
      },
      internalTools: {
        title: "Herramientas internas",
        price: "Desde $1,500 USD (herramientas pequeñas), $5,000+ USD (sistemas más grandes)",
        description: [
          "Reemplaza hojas de cálculo, procesos manuales y tareas repetitivas con herramientas ligeras que de verdad le funcionen a tu equipo.",
        ],
        details: [
          {
            label: "Ejemplos",
            value:
              "Sistemas de gestión de miembros, control de inventario, tableros de equipo, formularios de admisión, flujos de aprobación y herramientas de reportes.",
          },
        ],
      },
    },

    nonprofit: {
      heading: "Apoyo a organizaciones sin fines de lucro y comunitarias",
      belief:
        "Creo que las organizaciones pequeñas deberían tener acceso a buena tecnología incluso cuando los recursos son limitados.",
      offer:
        "Ofrezco consultoría a tarifa reducida para organizaciones sin fines de lucro y comunitarias, con capacidad limitada pro bono (1 o 2 proyectos por trimestre).",
      freeHeading: "Gratis",
      freeBody: "Conversación de 30 minutos para entender tu situación",
      paidHeading: "De pago",
      paidBody:
        "Todo lo que implique investigación detallada, auditoría escrita, implementación o soporte continuo",
    },

    readyToTalk: "¿Listo para conversar?",
    startConversation: "Iniciar una conversación",
  },

  legal: {
    lastUpdated: (date: string) => `Última actualización: ${date}`,
  },

  privacy: {
    metaTitle: "Política de privacidad",
    metaDescription: "Cómo rickiecruz.com recopila, usa y protege la información.",
    title: "Política de privacidad",

    collects: {
      heading: "Qué recopila este sitio",
      body: "El formulario de contacto recopila la información que envías —nombre, correo electrónico, organización (opcional), la categoría que seleccionas y tu mensaje— únicamente para responder a tu consulta. No se requiere crear una cuenta ni iniciar sesión para usar este sitio.",
    },
    analytics: {
      heading: "Analítica",
      body: "Este sitio usa Vercel Analytics, un servicio de analítica respetuoso de la privacidad y sin cookies. Reporta vistas de página agregadas y un pequeño conjunto de eventos de interacción con nombre (por ejemplo, ver un proyecto o enviar el formulario de contacto) sin rastrear a personas entre sitios ni almacenar identificadores personales.",
    },
    cookies: {
      heading: "Cookies",
      body: "Este sitio no usa cookies de rastreo ni de publicidad. Puede guardarse una pequeña cantidad de datos en el almacenamiento local de tu navegador sólo para recordar tu preferencia de modo claro u oscuro, y una cookie registra tu elección de idioma si usas el selector de idioma; ambos permanecen en tu dispositivo y nunca se usan para identificarte.",
    },
    thirdParty: {
      heading: "Servicios de terceros",
      body: "Los envíos del formulario de contacto pueden transmitirse a través de un proveedor de correo transaccional únicamente para entregar el mensaje. Ese proveedor no usa tu información para ningún otro fin.",
    },
    retention: {
      heading: "Conservación de datos",
      inbox:
        "Este sitio no tiene base de datos ni cuentas de usuario. Un envío del formulario de contacto llega como un correo a mi bandeja de entrada, y ese correo es la única copia que conservo. Lo guardo el tiempo necesario para responder y mantener un registro razonable de la conversación posterior; las consultas que no derivan en trabajo se eliminan en un plazo de 24 meses. El proveedor de correo transaccional que transmite el mensaje mantiene sus propios registros de entrega a corto plazo bajo su propia política de conservación.",
      ip: "Tu dirección IP se usa sólo en memoria, durante unos segundos, para limitar la frecuencia de envíos del formulario de contacto y frenar el spam. Nunca se escribe en una base de datos ni se incluye en el correo que recibo. Por separado, mi proveedor de hosting mantiene registros estándar de solicitudes del servidor, que incluyen direcciones IP, durante un periodo limitado.",
    },
    rights: {
      heading: "Tus derechos",
      requestPrefix:
        "Puedes pedirme qué información tuya conservo, pedirme que la corrija o pedirme que la elimine. Envía la solicitud a través del ",
      contactLinkLabel: "formulario de contacto",
      requestSuffix:
        " desde la misma dirección de correo con la que escribiste originalmente, y te confirmaré en un plazo de 30 días. Como la única información que conservo es la que escribiste en ese formulario, atender una solicitud de eliminación significa borrar el hilo de correo.",
      noSelling:
        "No vendo ni comparto información personal, y este sitio no realiza publicidad, perfilado ni rastreo entre sitios. Según dónde vivas, es posible que tengas derechos legales adicionales, por ejemplo bajo el RGPD en el EEE y el Reino Unido, o la CCPA en California. Atiendo las solicitudes de la misma manera, aplique o no una ley en particular.",
    },
    contact: {
      heading: "Contacto",
      prefix: "Las preguntas sobre esta política pueden enviarse a través del ",
      linkLabel: "formulario de contacto",
      suffix: ".",
    },
  },

  terms: {
    metaTitle: "Términos",
    metaDescription: "Términos de uso de rickiecruz.com.",
    title: "Términos",

    use: {
      heading: "Uso de este sitio",
      body: "Este sitio y su contenido —incluidos los estudios de caso, las descripciones de proyectos y cualquier fragmento de código referenciado— se ofrecen con fines informativos. Puedes leerlo, compartirlo y enlazarlo libremente.",
    },
    ownership: {
      heading: "Propiedad del contenido",
      body: (year: number) =>
        `Salvo que se indique lo contrario, el contenido, el diseño y la identidad de este sitio son © ${year} Rickie Cruz. Los nombres y logotipos de proyectos referidos en los estudios de caso (por ejemplo, Chatter Snow) pertenecen a sus respectivas organizaciones.`,
    },
    engagements: {
      heading: "Trabajos de consultoría",
      offerPrefix:
        "Nada en este sitio constituye una oferta, una cotización ni un contrato. Las descripciones de servicios y las tarifas iniciales en la ",
      consultingLinkLabel: "página de consultoría",
      offerSuffix:
        " son un punto de partida para una conversación y están sujetas a cambios; el precio real depende del alcance.",
      agreement:
        "El trabajo remunerado se rige por un acuerdo escrito aparte que cubre alcance, entregables, cronograma, honorarios, condiciones de pago, propiedad del trabajo y confidencialidad, firmado antes de comenzar. Estos términos cubren únicamente tu uso de este sitio web. Cuando un acuerdo firmado y estos términos entren en conflicto, prevalece el acuerdo firmado.",
    },
    warranty: {
      heading: "Sin garantía",
      body: 'Este sitio y su contenido se ofrecen "tal cual", sin garantía de ningún tipo. Los resultados y las métricas de los estudios de caso reflejan el relato del propio autor sobre el trabajo y no han sido auditados de forma independiente.',
    },
    governingLaw: {
      heading: "Ley aplicable",
      body: (state: string) =>
        `Estos términos se rigen por las leyes del Estado de ${state}, Estados Unidos, sin considerar sus normas sobre conflicto de leyes, y cualquier disputa derivada de tu uso de este sitio se presentará ante los tribunales estatales o federales ubicados allí. Si alguna disposición de estos términos resulta inexigible, las demás disposiciones seguirán vigentes.`,
      separateAgreement:
        "Esto aplica al sitio web. Un acuerdo de consultoría firmado incluye sus propios términos de ley aplicable y resolución de disputas, y esos prevalecen para ese trabajo.",
    },
    contact: {
      heading: "Contacto",
      prefix: "Las preguntas sobre estos términos pueden enviarse a través del ",
      linkLabel: "formulario de contacto",
      suffix: ".",
    },
  },

  resume: {
    metaTitle: "Currículum",
    metaDescription:
      "Resumen profesional, experiencia, habilidades y proyectos seleccionados.",
    title: "Currículum",
    subtitle:
      "Ingeniero de software full-stack sénior · Líder técnico · Líder de ingeniería",

    summaryHeading: "Resumen profesional",
    summary:
      "Ingeniero de software full-stack sénior y líder técnico con más de 10 años de experiencia entregando plataformas empresariales en servicios financieros y tecnología de recursos humanos. He construido y operado aplicaciones de cara al cliente, mejorado el rendimiento de APIs en servicios de alto tráfico, modernizado plataformas heredadas y diseñado microservicios nativos de la nube que sostienen flujos de trabajo críticos para el negocio. Aporto sólida experiencia en frontend, backend, AWS, APIs y liderazgo multifuncional en equipos de entrega ágil. Actualmente abierto a nuevas oportunidades.",

    experienceHeading: "Experiencia",
    roles: {
      adp: {
        title: "Desarrollador líder de aplicaciones, ADP",
        period: "Feb 2020 – Jul 2026",
        bullets: [
          "Construí y mantuve la plataforma comunitaria de ADP de cara al cliente, con funciones de colaboración en chat, feed, encuestas, comunicados, analítica y experiencias administrativas.",
          "Diseñé, desarrollé y lancé un nuevo microservicio en NestJS para funciones de cara al cliente, desde la arquitectura hasta el despliegue en producción, tomando decisiones técnicas sobre selección de paquetes, estructura del servicio y estrategia de implementación.",
          "Dirigí la configuración de servicios de AWS para la nueva plataforma, incluyendo CloudFormation, la conexión de servicios en ECS y el registro de endpoints de autenticación y autorización.",
          "Modernicé un servicio heredado en Express.js, actualicé dependencias y mejoré la mantenibilidad, la seguridad y la eficiencia en tiempo de ejecución.",
          "Mejoré el rendimiento de la API de un microservicio de alto tráfico de aproximadamente 500 TPS y 2.5 segundos de respuesta a cerca de 1,350 TPS y 100 milisegundos, mediante caché y reducción de consultas de datos.",
          "Migré el almacenamiento de medios de Amazon EFS a Amazon S3 para habilitar despliegue multirregión y recuperación ante desastres en un servicio de alto tráfico.",
          "Modernicé módulos administrativos de Angular convirtiéndolos en micro-frontends de Stencil.js, permitiendo una modernización incremental de la plataforma y reduciendo el costo de mantenimiento.",
          "Entregué nuevas funciones de producto basadas en Angular para Encuestas y Comunicados, incluyendo soporte multilingüe de encuestas, mejoras de analítica y experiencias de encuesta configurables.",
          "Di soporte a aproximadamente 2 millones de solicitudes de API al día en las funciones de colaboración de cara al cliente.",
          "Colaboré con los equipos de Producto, UX, QA e ingeniería para traducir requisitos en entregas listas para producción, aportando revisiones de arquitectura, planificación de sprints y ejecución ágil en un equipo de 4 a 8 ingenieros.",
          "Fui mentor de ingenieros, integré a nuevos miembros del equipo e impulsé la calidad con cobertura de pruebas unitarias y de integración en Jest.",
        ],
      },
      fiservManager: {
        title: "Líder de equipo / Gerente, Fiserv",
        period: "Ene 2019 – Feb 2020",
        bullets: [
          "Dirigí un equipo de ingeniería multifuncional que daba soporte a plataformas empresariales de alertas de fraude para instituciones financieras.",
          "Gestioné riesgos de entrega, soporte en producción y coordinación entre equipos para mantener los compromisos de la hoja de ruta.",
          "Trabajé con Product Owners y partes interesadas para priorizar mejoras impulsadas por clientes y trabajos de migración.",
          "Apoyé iniciativas de modernización que trasladaron a los clientes de funciones heredadas de alertas de fraude a los flujos actuales de la plataforma.",
        ],
      },
      fiservUiLead: {
        title: "Líder del equipo de UI, Fiserv",
        period: "Ene 2018 – Dic 2018",
        bullets: [
          "Dirigí equipos de ingeniería distribuidos entre recursos locales y remotos, entregando aplicaciones en AngularJS y Angular para 4 o 5 líneas de producto y cerca de 100 clientes empresariales.",
          "Entregué productos de UI basados en Angular y experiencias de cara al cliente, desde agencias pequeñas hasta cuentas empresariales con millones de usuarios.",
          "Presenté nuevas funciones de UI mediante seminarios web y sesiones con clientes para impulsar su adopción y uso.",
          "Colaboré con Producto y analistas de negocio para traducir la retroalimentación de clientes en mejoras de producto y prioridades de entrega.",
          "Fui mentor de desarrolladores y establecí estándares de entrega para una organización de ingeniería distribuida.",
        ],
      },
      fiservAngular: {
        title: "Desarrollador AngularJS, Fiserv",
        period: "Jun 2017 – Dic 2018",
        bullets: [
          "Desarrollé un framework reutilizable de aplicaciones en AngularJS que permitió entregar rápidamente aplicaciones web empresariales configurables.",
          "Construí y mantuve pipelines de CI/CD en Jenkins para el despliegue de aplicaciones.",
          "Planifiqué y ejecuté versiones de CAT, UAT y producción.",
        ],
      },
      freelance: {
        title: "Desarrollador web full-stack independiente",
        period: "2016 – 2017",
        bullets: [
          "Diseñé y desarrollé sitios web y aplicaciones web a la medida para varios clientes.",
          "Construí aplicaciones frontend adaptables y los servicios backend que las respaldan con HTML5, CSS3, JavaScript, PHP y MySQL.",
          "Implementé soluciones de CMS y comercio electrónico con WordPress.",
          "Recopilé requisitos de clientes y traduje objetivos de negocio en soluciones técnicas.",
          "Mantuve aplicaciones existentes asegurando calidad, rendimiento y confiabilidad.",
        ],
      },
      accenture: {
        title: "Desarrollador Informatica, Accenture",
        period: "2014 – 2016",
        bullets: [
          "Desarrollé aplicaciones web internas que simplificaron el acceso a datos empresariales para equipos de ingeniería.",
          "Creé mapeos complejos en Informatica que implementaban lógica de negocio para la integración de datos empresariales.",
          "Desarrollé procedimientos en PL/SQL y scripts puntuales de remediación para sistemas en producción.",
          "Optimicé flujos de ETL mientras diagnosticaba problemas de datos en producción y lógica de transformación.",
        ],
      },
    },

    skillsHeading: "Habilidades técnicas",
    skillGroups: {
      frontend: "Frontend",
      backend: "Backend",
      cloud: "Nube e infraestructura",
      dataTesting: "Datos y pruebas",
      delivery: "Entrega y liderazgo",
    },

    selectedProjectsHeading: "Proyectos seleccionados",

    educationHeading: "Educación",
    education: {
      masters: {
        degree: "Maestría en Ciencias — Sistemas de Información Computacional (en curso)",
        detail: "Boston University · Concentración: Desarrollo Web",
      },
      bachelors: {
        degree: "Licenciatura en Artes — Software y Sistemas de Información (Cum Laude)",
        detail: "University of North Carolina at Charlotte · Minor: Matemáticas",
      },
    },

    contactHeading: "Contacto",
    startConversation: "Iniciar una conversación",
  },

  footer: {
    profilesAriaLabel: "Perfiles",
    navAriaLabel: "Pie de página",
    resume: "Currículum",
    privacy: "Privacidad",
    terms: "Términos",
    contact: "Contacto",
    copyright: (year: number) => `© ${year} Rickie Cruz. Todos los derechos reservados.`,
  },
}
