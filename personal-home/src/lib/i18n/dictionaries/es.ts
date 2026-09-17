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
      coven: "Coven",
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
      "Actualmente: reconstruyendo después de un despido, resolviendo mis propios retos financieros con código, y ayudando a Chatter Snow a escalar sus operaciones como miembro de la junta y director de tecnología y medios.",
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
      body: "Soy Rickie, ingeniero de software con más de 12 años de experiencia en consultoría, servicios financieros, tecnología de recursos humanos y liderazgo de ingeniería. Empecé construyendo integraciones de datos en Accenture, pasé de desarrollador a líder de equipo y gerente en First Data y Fiserv, y más recientemente dirigí el desarrollo de aplicaciones en ADP.",
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
        "Me acostumbré temprano a asumir responsabilidad. Como líder del equipo de UI en First Data y Fiserv, dirigí equipos de ingeniería distribuidos entre recursos locales y remotos, entregando productos a cerca de 100 clientes empresariales. Coordinar entre zonas horarias y equipos me enseñó a comunicarme con claridad, señalar los problemas antes de que se conviertan en incendios y tomar decisiones sin esperar permiso.",
      durability:
        "Me importa construir cosas que sobrevivan a quien las construyó: escribir código pensando en la siguiente persona, ser franco sobre las compensaciones en lugar de sobrevender una solución rápida, y tratar la mantenibilidad como parte del trabajo y no como algo secundario.",
    },

    experience: {
      heading: "Experiencia",
      body: "Empecé en Accenture construyendo integraciones de datos con Informatica/ETL, luego trabajé de forma independiente en desarrollo full-stack antes de entrar a First Data como desarrollador de AngularJS. Crecí hasta liderar el equipo de UI, dirigiendo equipos distribuidos locales y remotos, y después asumí un rol de líder y gerente a cargo de un equipo de ingeniería multifuncional en la plataforma de alertas de fraude de Fiserv. De ahí pasé a ADP como desarrollador líder de aplicaciones, enfocado en el desarrollo práctico, desde 2022 hasta julio de 2026.",
      resumeLinkPrefix: "Para el desglose completo, consulta mi ",
      resumeLinkLabel: "currículum",
      resumeLinkSuffix: ".",
    },

    currently: {
      heading: "Actualmente",
      body: "Estoy buscando lo que sigue, ya sea un puesto de tiempo completo o trabajo de consultoría con un equipo que lo necesite. Mientras tanto, estoy desarrollando este sitio y avanzando en las primeras etapas de una aplicación de finanzas personales que he querido construir durante años. También soy miembro de la junta y director de tecnología y medios en Chatter, una comunidad LGBTQ+ de esquí y snowboard que se está organizando para convertirse en una organización sin fines de lucro, donde lidero la parte técnica.",
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
      "La tecnología no debería ser una fuente de confusión. Ayudo a organizaciones pequeñas y sin fines de lucro a definir lo que realmente necesitan, sin complejidad innecesaria ni burocracia corporativa. He hecho este trabajo (miembro de la junta y director de tecnología y medios en Chatter Snow) y entiendo sus limitaciones.",

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

  coven: {
    name: "Coven",
    navAriaLabel: "Secciones de Coven",
    nav: {
      overview: "Resumen",
      nonprofits: "Para organizaciones sin fines de lucro",
      business: "Para empresas",
      modules: "Módulos",
      pricing: "Precios",
      security: "Seguridad y datos",
      faq: "Documentación y preguntas",
    },
    demo: {
      cta: "Prueba la demostración",
      newTabHint: "(se abre en una pestaña nueva)",
      note: "Sin registro. Datos ficticios, reconstruidos desde cero cada noche.",
    },
    screenshotPending: "Captura",
    breadcrumbCoven: "Coven",

    overview: {
      metaTitle: "Coven",
      metaDescription:
        "Coven reemplaza la hoja de cálculo, la carpeta compartida, el formulario de donaciones y la herramienta de reservas con un solo sistema. Hecho para organizaciones sin fines de lucro y pequeñas empresas.",
      title: "Coven",
      tagline:
        "Un solo sistema para las organizaciones pequeñas que ya no caben en una hoja de cálculo.",
      intro:
        "Casi toda organización pequeña funciona sobre un montón de piezas sueltas: una hoja de cálculo para el dinero, una carpeta compartida para los documentos, un formulario para donaciones o reservas, otra herramienta para los horarios y un sitio web que solo una persona puede cambiar. Coven es todo eso como un solo sistema, donde el mismo registro aparece en cada lugar donde importa.",
      audienceNote:
        "Hecho para organizaciones sin fines de lucro y pequeñas empresas. Un solo producto en tu propio vocabulario, no una edición distinta para cada quien.",
      seeModules: "Ver los módulos",

      proof: {
        modules: { label: "Módulos", value: "8" },
        signup: { label: "Registro para mirar", value: "Ninguno" },
        reset: { label: "Datos de la demostración", value: "Se reinician cada noche" },
      },

      replaces: {
        heading: "Qué reemplaza",
        todayLabel: "Hoy",
        covenLabel: "Con Coven",
        rows: [
          {
            today: "Una hoja de cálculo que solo una persona entiende del todo",
            withCoven:
              "Dinero, presupuestos y reembolsos en un solo libro que todo el equipo puede leer",
          },
          {
            today: "Una carpeta compartida llamada Documentos (nuevo) FINAL",
            withCoven:
              "Documentos adjuntos a aquello de lo que tratan: una reunión, una subvención, un evento",
          },
          {
            today: "Un formulario de donación o de pago que te manda un correo",
            withCoven:
              "Pagos que quedan en el registro de la persona y en los libros al mismo tiempo",
          },
          {
            today: "Una herramienta de reservas que nunca oyó hablar de tus miembros",
            withCoven: "Eventos, sesiones e inscripciones sobre la misma lista de personas",
          },
          {
            today: "Un sitio web que tienes que pedirle a alguien que edite",
            withCoven: "Un sitio público que edita tu propio equipo, en tu propio dominio",
          },
        ],
        footnote:
          "La combinación es el punto. Muchas herramientas hacen bien una de esas filas; lo que estás pagando son las costuras entre ellas.",
      },

      strip: {
        heading: "Cómo se ve",
        shots: [
          "La pantalla a la que llega una organización pequeña: dinero que entra, dinero que sale y qué necesita una decisión esta semana.",
          "Un evento con sus inscripciones, su voluntariado y sus costos en una sola página.",
          "El registro de una persona: membresía, historial de donaciones o compras, exenciones firmadas y los eventos a los que asistió.",
        ],
      },

      doors: {
        heading: "Dos puertas de entrada",
        body:
          "El producto es el mismo. Las palabras en pantalla no: cada organización define las suyas, así que donde una lee donantes otra lee clientes.",
        nonprofits: {
          title: "Para organizaciones sin fines de lucro",
          body:
            "Donaciones, subvenciones, voluntariado y programas, más el gobierno de la junta directiva, que ningún CRM de donantes cubre.",
          cta: "Ver el camino para organizaciones sin fines de lucro",
        },
        business: {
          title: "Para pequeñas empresas",
          body:
            "Ingresos, facturas, reservas, inventario y horarios del personal en un solo lugar en vez de cuatro suscripciones.",
          cta: "Ver el camino para empresas",
        },
      },

      who: {
        heading: "Quién está detrás",
        body:
          "Coven lo construye y lo opera Rickie Cruz, que ha sido miembro de la junta directiva de una organización sin fines de lucro y ha dirigido sus operaciones digitales. Nació de la infraestructura construida para Chatter Snow, una organización comunitaria que hoy es su primer cliente.",
        email: "hello@rickiecruz.com",
        emailIntro: "Monitoreado, y respondido por una persona:",
        aboutCta: "Sobre Rickie",
        contactCta: "Iniciar una conversación",
      },

      closing: {
        heading: "Míralo antes de hablar con nadie",
        body:
          "La demostración es una organización común en un plan de demostración, sembrada con datos ficticios y reconstruida desde cero cada noche. Nada de lo que toques puede romper algo, y no hay nada real adentro.",
      },
    },

    nonprofits: {
      metaTitle: "Coven para organizaciones sin fines de lucro",
      metaDescription:
        "Donaciones, subvenciones, voluntariado, programas, eventos y gobierno de la junta directiva en un solo sistema, hecho para organizaciones pequeñas.",
      title: "Coven para organizaciones sin fines de lucro",
      intro:
        "Diriges una organización sin fines de lucro —o vas en camino a serlo— con un formulario de donaciones, una hoja de cálculo y la buena voluntad de dos personas voluntarias. Coven es un solo lugar para el dinero, las personas, los programas y la junta directiva.",
      leadHeading: "El gobierno de la junta es la parte que nadie más construye",
      leadBody:
        "Composición y periodos de la junta directiva, órdenes del día, actas y resoluciones registradas junto a la reunión que las aprobó. Los CRM de donantes se detienen en el donante y la contabilidad se detiene en el libro mayor. El mes más difícil de una organización pequeña es aquel en que tiene que demostrar qué decidió y cuándo.",
      modulesHeading: "Qué incluye",
      modules: {
        governance: {
          title: "Junta directiva y gobernanza",
          body:
            "Composición de la junta con cargos y periodos, órdenes del día, actas y resoluciones registradas junto a la reunión que las aprobó: el registro que pedirán tu auditoría, tu trámite estatal y la próxima presidencia de la junta.",
          caption:
            "Una reunión de junta directiva con su orden del día, asistencia y resoluciones registradas.",
        },
        finance: {
          title: "Donaciones, subvenciones y reembolsos",
          body:
            "Donaciones con sus acuses de recibo, fondos restringidos y no restringidos, periodos de reporte de subvenciones y reembolsos al voluntariado que pasan por una aprobación en vez de una app de pagos. Mover dinero entre tus propias cuentas nunca cuenta como gasto.",
          caption:
            "Un mes de donaciones, subvenciones y reembolsos con los fondos restringidos aparte.",
        },
        people: {
          title: "Miembros, donantes y participantes",
          body:
            "Un registro por persona: estado de membresía, historial de donaciones, exenciones firmadas, los programas a los que se unió y los eventos a los que asistió. Sin una segunda lista que mantener al día.",
          caption:
            "El registro de una persona con su membresía, historial de donaciones y asistencia a eventos.",
        },
        volunteers: {
          title: "Voluntariado y turnos",
          body:
            "Roles, turnos, inscripciones y horas. Las horas se suman en los totales que piden las solicitudes de subvenciones, sin que nadie rehaga la hoja de cálculo en marzo.",
          caption: "Un calendario de turnos con inscripciones y horas de voluntariado registradas.",
        },
        programs: {
          title: "Programas y sesiones",
          body:
            "Programas, sus sesiones, quién las dirigió y quién asistió: las cifras que necesita tu informe anual, recogidas mientras pasa el año en vez de reconstruidas después.",
          caption: "Un programa con sus sesiones, responsables y asistencia.",
        },
        events: {
          title: "Recaudaciones y eventos comunitarios",
          body:
            "Inscripción con boletos o gratuita, cupo, voluntariado asignado y lo que el evento costó de verdad frente a lo que recaudó.",
          caption:
            "Una recaudación con sus inscripciones, voluntariado asignado y su costo frente a lo recaudado.",
        },
        inventory: {
          title: "Equipo y bienes donados",
          body:
            "Qué tienes, qué fue donado, quién lo tiene y cuándo debe volver. Los préstamos de equipo son donde las organizaciones pequeñas pierden más dinero en silencio.",
          caption: "Un inventario de equipo que muestra qué está prestado y a quién.",
        },
        content: {
          title: "Sitio público y calendario comunitario",
          body:
            "Tu sitio web público y el calendario que tu comunidad de verdad lee, editados por tu propio equipo en tu propio dominio: los mismos eventos, no una segunda copia.",
          caption:
            "El sitio público y el calendario comunitario que una organización publica en su propio dominio.",
        },
      },
      why: {
        heading: "Por qué no un CRM de donantes",
        body: [
          "Un CRM de donantes es excelente con los donantes y ciego con todo lo demás: tu equipo prestado, tus horas de voluntariado, tus actas de junta, tu calendario público. Terminas con el CRM más otras cuatro suscripciones y una hoja de cálculo sosteniéndolo todo.",
          "La apuesta de Coven es la contraria: la combinación es el producto. Ningún CRM de donantes hace gobernanza de junta e inventario de equipo, porque ninguno de los dos es un mercado suficientemente grande por separado. Para una organización de treinta personas son el mismo trabajo.",
        ],
      },
    },

    business: {
      metaTitle: "Coven para pequeñas empresas",
      metaDescription:
        "Ingresos, facturas, gastos, reservas, inventario y horarios del personal en un solo sistema, hecho para pequeñas empresas.",
      title: "Coven para pequeñas empresas",
      intro:
        "Un estudio, una tienda, un pequeño negocio de servicios. Pagas por una herramienta de reservas, otra de facturación, una hoja de cálculo para el inventario, una app de horarios y un sitio web que no puedes editar, y ninguna ha oído hablar de las otras. Coven es un solo sistema donde una reserva, un pago, un turno del personal y un artículo de inventario son los mismos datos.",
      leadHeading: "Las costuras son lo que te cuesta",
      leadBody:
        "Cada herramienta por separado está bien. El costo está en los huecos: un cliente que existe en tres sistemas con tres grafías distintas, inventario que solo conoce la hoja de cálculo y un cierre de mes que cuadras a mano porque nada coincide.",
      modulesHeading: "Qué incluye",
      modules: {
        finance: {
          title: "Ingresos, facturas y gastos",
          body:
            "Facturas, pagos, ingresos recurrentes y gastos en un solo libro, con los recibos adjuntos a la línea a la que pertenecen. Mover dinero entre tus propias cuentas nunca cuenta como gasto.",
          caption: "Un mes de ingresos y gastos con facturas y recibos adjuntos.",
        },
        events: {
          title: "Clases, reservas y talleres",
          body:
            "Sesiones con cupo, reservas, listas de espera y cancelaciones, y lo que cada una generó frente a lo que costó realizarla.",
          caption: "Un calendario de clases con sus reservas, cupo y lista de espera.",
        },
        people: {
          title: "Clientes y contactos",
          body:
            "Un registro por cliente: historial de compras y reservas, exenciones firmadas, notas y las clases a las que de verdad asistió. Sin una segunda lista que mantener al día.",
          caption: "El registro de un cliente con su historial de reservas y exenciones firmadas.",
        },
        programs: {
          title: "Servicios y ofertas",
          body:
            "Qué vendes, cuánto cuesta entregarlo y quién lo entregó, para ver qué oferta está cargando a las demás.",
          caption: "Una oferta de servicio con sus sesiones, personal y costo de entrega.",
        },
        inventory: {
          title: "Inventario y equipo",
          body:
            "Niveles de inventario, equipo, rentas y devoluciones, con qué está fuera y quién lo tiene. El equipo que sale del local es por donde se va el margen sin que nadie lo note.",
          caption: "Inventario y equipo mostrando qué está prestado y a quién.",
        },
        volunteers: {
          title: "Horarios del personal",
          body:
            "Turnos, roles, cobertura y horas, en el mismo calendario que las clases y reservas que atienden.",
          caption: "Un horario de personal con turnos, roles y cobertura.",
        },
        content: {
          title: "Sitio público y calendario",
          body:
            "Tu sitio web y tu calendario reservable, editados por tu propio equipo en tu propio dominio: las mismas sesiones que reservan tus clientes, no una segunda copia.",
          caption:
            "El sitio público y el calendario reservable que una empresa publica en su propio dominio.",
        },
      },
      why: {
        heading: "Sobre la demostración",
        body: [
          "La demostración pública está sembrada como organización sin fines de lucro, así que verás pantallas de donaciones y voluntariado. Es el mismo producto con otras palabras: cada etiqueta de arriba es una configuración por organización, no una edición distinta.",
          "Viene una demostración para empresas. Mientras llega, la respuesta más honesta y rápida a si esto nos sirve es una llamada corta donde las pantallas se renombran en vivo.",
        ],
        cta: "Pedir una demostración guiada",
      },
    },

    modules: {
      metaTitle: "Módulos",
      metaDescription:
        "Finanzas, personas, voluntariado, programas, eventos, inventario, gobernanza y un sitio público: los módulos que Coven tiene hoy.",
      title: "Módulos",
      itemsHeading: "Qué existe hoy",
      intro:
        "Todo lo de abajo existe hoy y está en la demostración. Cada plan incluye todos los módulos: la combinación es el producto, así que venderlo por partes sería vender otra cosa.",
      items: {
        finance: {
          title: "Finanzas",
          body:
            "Ingresos y gastos en un solo libro, con presupuestos, reembolsos o facturas, y los recibos adjuntos a la línea a la que pertenecen. Mover dinero entre tus propias cuentas nunca cuenta como gasto.",
          caption: "Un mes de ingresos y gastos con presupuestos y recibos adjuntos.",
        },
        people: {
          title: "Personas",
          body:
            "Un registro por persona —miembro, donante, cliente o participante— con su historial, sus documentos y todo aquello a lo que se inscribió.",
          caption: "El registro de una persona con su historial, documentos e inscripciones.",
        },
        volunteers: {
          title: "Voluntariado y horarios",
          body:
            "Roles, turnos, inscripciones, cobertura y horas registradas, en el mismo calendario que aquello que atienden.",
          caption: "Un calendario de turnos con inscripciones, cobertura y horas registradas.",
        },
        programs: {
          title: "Programas",
          body:
            "Ofertas recurrentes y sus sesiones: quién las dirigió, quién asistió y cuánto costó entregarlas.",
          caption: "Un programa con sus sesiones, responsables y asistencia.",
        },
        events: {
          title: "Eventos",
          body:
            "Eventos puntuales con cupo, inscripciones, listas de espera y cancelaciones, y lo que cada uno recaudó o generó frente a lo que costó.",
          caption: "Un evento con sus inscripciones, cupo y costos.",
        },
        inventory: {
          title: "Inventario",
          body:
            "Qué tiene la organización, qué está prestado, a quién y cuándo debe volver.",
          caption: "Una lista de inventario que muestra qué está prestado y a quién.",
        },
        governance: {
          title: "Gobernanza",
          body:
            "Composición y periodos de la junta directiva, reuniones, órdenes del día, actas y resoluciones registradas junto a la reunión que las aprobó. Lo usan las organizaciones sin fines de lucro, y para las empresas simplemente no aparece.",
          caption:
            "Una reunión de junta directiva con su orden del día, asistencia y resoluciones registradas.",
        },
        content: {
          title: "Sitio público y calendario de contenido",
          body:
            "Un sitio web público y un calendario para cada organización, en su propio dominio, editados por quienes de verdad la operan. Tus tokens de marca definen cómo se ve — y generan una guía de marca viva en tu propio /brand, a partir de los mismos tokens con los que el producto renderiza, así que la referencia que usan tus voluntarios y tus diseñadores nunca queda desactualizada y nadie la mantiene a mano.",
          caption:
            "Un sitio público y un calendario comunitario en el dominio propio de una organización.",
        },
      },
      lexicon: {
        heading: "El mismo producto, en tus palabras",
        body:
          "No hay una edición para organizaciones sin fines de lucro ni una edición para empresas. Cada etiqueta —donante o cliente, programa o servicio, voluntariado o personal— es una configuración por organización, junto con tus propios roles, tu marca y tus textos públicos. Eso es lo que hace que un producto para dos públicos sea una afirmación honesta y no una de marketing.",
      },
    },

    pricing: {
      metaTitle: "Precios",
      metaDescription:
        "Precios de Coven: planes según el tamaño de la organización, todos los módulos incluidos, cifras reales y sin obligarte a hablar con ventas.",
      title: "Precios",
      intro:
        "Los planes se dimensionan según el tamaño de tu organización, no según qué funciones te dejan usar. Son los mismos planes para organizaciones sin fines de lucro y para empresas.",
      draftNote:
        "Precios en borrador. Estas cifras son un punto de partida y todavía no están definidas; confírmalas antes de citarlas en cualquier lado.",
      everyPlanHeading: "En todos los planes",
      everyPlan: [
        "Todos los módulos: finanzas, personas, voluntariado, programas, eventos, inventario, gobernanza y tu sitio público",
        "Tu propio dominio, con el sitio público y el portal de tu equipo",
        "Registros ilimitados de personas, donantes, clientes y transacciones",
        "Una exportación completa de tus datos, cuando quieras, sin pedir permiso",
        "Soporte de la persona que lo construyó",
      ],
      perMonth: "/mes",
      plans: {
        small: {
          name: "Pequeña",
          price: "$39",
          annual: "o $390 al año",
          fit: "Todo voluntariado, o menos de cinco personas al frente",
          includes: [
            "Hasta 5 cuentas de personal",
            "Respaldos cada noche",
            "Soporte por correo",
          ],
        },
        growing: {
          name: "En crecimiento",
          price: "$89",
          annual: "o $890 al año",
          fit: "De cinco a veinte personas al frente, o una temporada muy cargada",
          includes: [
            "Hasta 20 cuentas de personal",
            "Respaldos cada noche con restauración a un punto en el tiempo",
            "Soporte por correo, al siguiente día hábil",
          ],
        },
        established: {
          name: "Establecida",
          price: "$179",
          annual: "o $1,790 al año",
          fit: "Veinte personas o más, varios programas, o más de una sede",
          includes: [
            "Cuentas de personal ilimitadas",
            "Respaldos cada noche con restauración a un punto en el tiempo",
            "Soporte prioritario y una revisión trimestral",
          ],
        },
      },
      onboarding: {
        heading: "Puesta en marcha",
        price: "$750 una sola vez",
        body:
          "Tus datos fuera de las hojas de cálculo y dentro de Coven, tu vocabulario y tus roles configurados, tu dominio conectado y dos sesiones de capacitación para quienes lo usarán a diario. No es obligatorio —puedes configurarlo tú— pero casi todas las organizaciones lo quieren.",
        nonprofit:
          "Las organizaciones sin fines de lucro con un presupuesto anual menor a $250,000 pagan $375, y reservo una capacidad limitada pro bono cada trimestre. Pregunta.",
      },
      notes: [
        "Sin contrato, sin plazo mínimo, sin cobros por registro y sin cobro por las personas que solo ven tu sitio público.",
        "Cancela cuando quieras y llévate una exportación completa.",
      ],
      faqCta: "Qué pasa si te vas",
    },

    security: {
      metaTitle: "Seguridad y datos",
      metaDescription:
        "Cómo Coven aísla los datos de cada organización: seguridad a nivel de fila en Postgres, permisos que tú defines, registro de auditoría, y exportación y borrado a solicitud.",
      title: "Seguridad y datos",
      intro:
        "Las juntas directivas y las personas dueñas preguntan esto antes que nada, así que aquí está la respuesta real en vez de un sello.",
      items: [
        {
          title: "El aislamiento lo impone la base de datos, no el cuidado al programar",
          body:
            "Cada tabla lleva la organización a la que pertenece cada fila, cada política de seguridad a nivel de fila está acotada a la organización actual y cada llave foránea entre dos de esas tablas es compuesta. Postgres mismo rechaza una lectura o una referencia entre organizaciones, incluso desde una conexión con el rol de servicio. Un error en la aplicación no puede filtrar los datos de otra organización, porque la consulta nunca los devuelve.",
        },
        {
          title: "No existe una cuenta de superadministración",
          body:
            "Ningún rol de plataforma puede ver a través de las organizaciones. Cuando el soporte necesita acceso, tu organización emite una membresía de soporte con tiempo limitado y la revoca después. Nadie conserva acceso permanente a tus datos.",
        },
        {
          title: "Los permisos los defines tú",
          body:
            "Los roles, y lo que cada rol puede hacer, son configuraciones por organización y no niveles fijos. Quien lleva la tesorería ve el libro mayor, quien coordina turnos ve el calendario, quien está en la junta ve las actas: tú decides y lo cambias sin abrir un ticket.",
        },
        {
          title: "Un registro de auditoría sobre lo que importa",
          body:
            "Quién cambió un registro financiero, una membresía, un rol o una resolución, y cuándo. Las preguntas que de verdad aparecen son sobre dinero y sobre accesos, así que eso es lo que queda registrado.",
        },
        {
          title: "Exportación y borrado a solicitud",
          body:
            "Una exportación completa de los datos de tu organización es una función del producto, no una solicitud de soporte: se construyó antes de dar de alta a la segunda organización. El borrado a solicitud se cumple, y las reglas de retención que tú definas deciden cuánto tiempo se guarda lo demás.",
        },
        {
          title: "Tu sitio público es la única parte pública",
          body:
            "Todo lo del portal está detrás de autenticación y acotado a tu organización. Lo que ve el mundo es el sitio y el calendario que elegiste publicar.",
        },
      ],
      hosting: {
        heading: "Dónde corre",
        body:
          "La aplicación corre en Vercel, la base de datos es Postgres administrado en Supabase, el DNS y la CDN pasan por Cloudflare, y el correo transaccional se envía con Resend. La infraestructura principal está en regiones de Estados Unidos, y los respaldos corren cada noche.",
      },
      ask: {
        heading: "Preguntas que tu junta necesita por escrito",
        body:
          "Pregunta y recibirás una respuesta escrita, no una llamada de ventas. Los cuestionarios de seguridad también sirven.",
        cta: "Hacer una pregunta de seguridad",
      },
    },

    faq: {
      metaTitle: "Documentación y preguntas",
      metaDescription:
        "Cómo meter tus datos en Coven, quién es dueño de ellos, qué pasa si te vas y cómo es la puesta en marcha.",
      title: "Documentación y preguntas",
      intro: "Las preguntas que aparecen antes de que alguien firme algo.",
      items: [
        {
          question: "¿Cómo metemos nuestros datos?",
          answer:
            "Con hojas de cálculo y exportaciones CSV de lo que uses hoy: personas, donaciones o facturas, y transacciones históricas. La puesta en marcha incluye la importación. Si prefieres hacerlo tú, el importador está en el producto y te muestra qué coincidió antes de escribir nada.",
        },
        {
          question: "¿Quién es dueño de los datos?",
          answer:
            "Tú. Los registros de tu organización son tuyos. Nada de lo que hay en ellos se vende, se comparte ni se usa para entrenar nada.",
        },
        {
          question: "¿Qué pasa si nos vamos?",
          answer:
            "Exportas todo, y la exportación es completa: los datos de toda la organización en formatos abiertos. La exportación ya existe en el producto; no es una promesa pendiente. Después de irte, el borrado es a solicitud, y las reglas de retención que definas deciden el resto.",
        },
        {
          question: "¿Podemos usar nuestro propio dominio?",
          answer:
            "Sí, en todos los planes. Tu sitio público y el portal de tu equipo corren en tu dominio. Conectarlo es parte de la puesta en marcha y es un cambio de configuración, no una reconstrucción.",
        },
        {
          question: "¿Reemplaza a nuestro software de contabilidad?",
          answer:
            "No, y no lo intenta. Coven es donde vive el dinero operativo: donaciones, facturas, reembolsos, lo que costó un evento. Quien lleva tu contabilidad sigue presentando la declaración, y la exportación es lo que le entregas.",
        },
        {
          question: "¿Nuestros miembros y clientes necesitan cuenta?",
          answer:
            "Solo quienes operan la organización necesitan cuenta, y eso es lo que dimensiona el plan. Todos los demás se inscriben a un evento, hacen una donación o reservan una clase sin tener una.",
        },
        {
          question: "¿Cuánto tarda la puesta en marcha?",
          answer:
            "Una organización pequeña suele estar funcionando en una o dos semanas, y la mayor parte de ese tiempo es decidir tu vocabulario y tus roles, no trabajo técnico. Puedes ver el producto completo hoy sin hablar con nadie.",
        },
        {
          question: "¿Está terminado, o somos una prueba beta?",
          answer:
            "Hoy opera de verdad una organización, y lo hacía antes de ser un producto. Es joven, y serías un cliente temprano, lo que significa acceso directo a la persona que lo construye e influencia real sobre lo que sigue.",
        },
      ],
    },
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
      "Ingeniero de software full-stack sénior y líder técnico con más de 12 años de experiencia entregando plataformas empresariales en servicios financieros y tecnología de recursos humanos. He construido y operado aplicaciones de cara al cliente, mejorado el rendimiento de APIs en servicios de alto tráfico, modernizado plataformas heredadas y diseñado microservicios nativos de la nube que sostienen flujos de trabajo críticos para el negocio. Aporto sólida experiencia en frontend, backend, AWS, APIs y liderazgo multifuncional en equipos de entrega ágil. Actualmente abierto a nuevas oportunidades.",

    experienceHeading: "Experiencia",
    roles: {
      adp: {
        title: "Desarrollador líder de aplicaciones, ADP",
        period: "Feb 2022 – Jul 2026",
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
        period: "Jun 2020 – Feb 2022",
        bullets: [
          "Dirigí un equipo de ingeniería multifuncional que daba soporte a plataformas empresariales de alertas de fraude para instituciones financieras.",
          "Gestioné riesgos de entrega, soporte en producción y coordinación entre equipos para mantener los compromisos de la hoja de ruta.",
          "Trabajé con Product Owners y partes interesadas para priorizar mejoras impulsadas por clientes y trabajos de migración.",
          "Apoyé iniciativas de modernización que trasladaron a los clientes de funciones heredadas de alertas de fraude a los flujos actuales de la plataforma.",
        ],
      },
      fiservUiLead: {
        title: "Líder del equipo de UI, First Data → Fiserv",
        period: "Mar 2019 – Jun 2020",
        bullets: [
          "Dirigí equipos de ingeniería distribuidos entre recursos locales y remotos, entregando aplicaciones en AngularJS y Angular para 4 o 5 líneas de producto y cerca de 100 clientes empresariales.",
          "Entregué productos de UI basados en Angular y experiencias de cara al cliente, desde agencias pequeñas hasta cuentas empresariales con millones de usuarios.",
          "Presenté nuevas funciones de UI mediante seminarios web y sesiones con clientes para impulsar su adopción y uso.",
          "Colaboré con Producto y analistas de negocio para traducir la retroalimentación de clientes en mejoras de producto y prioridades de entrega.",
          "Fui mentor de desarrolladores y establecí estándares de entrega para una organización de ingeniería distribuida.",
          "Mantuve el rol durante la adquisición de First Data por Fiserv en 2019, sosteniendo la entrega en las líneas de producto de la organización combinada.",
        ],
      },
      fiservAngular: {
        title: "Desarrollador AngularJS, First Data",
        period: "Ene 2017 – Mar 2019",
        bullets: [
          "Desarrollé un framework reutilizable de aplicaciones en AngularJS que permitió entregar rápidamente aplicaciones web empresariales configurables.",
          "Construí y mantuve pipelines de CI/CD en Jenkins para el despliegue de aplicaciones.",
          "Planifiqué y ejecuté versiones de CAT, UAT y producción.",
        ],
      },
      freelance: {
        title: "Desarrollador web full-stack independiente",
        period: "Ene 2016 – Dic 2018",
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
        period: "Ago 2014 – Feb 2016",
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
