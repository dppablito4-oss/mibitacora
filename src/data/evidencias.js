// src/data/evidencias.js
// Base de datos local para el repositorio de evidencias de servicios

export const evidencias = {
  academico: [
    {
      id: "aca-01",
      titulo: "Normalización y Estructura de Tesis",
      foco: "Márgenes, Sangrías y Numeración APA 7",
      antes: "/evidencias/antes.png",
      despues: "/evidencias/despues.png",
      detalles: [
        "Márgenes estandarizados de 2.54 cm (1 pulgada) en todos los lados.",
        "Sangría de primera línea a exactamente 1.27 cm (0.5 pulgadas).",
        "Paginación en la esquina superior derecha con números arábigos.",
        "Tipografía unificada y espaciado doble reglamentario sin saltos huérfanos."
      ]
    }
  ],
  grafico: [
    {
      id: "gra-01",
      mision: "Bautizos / Infantil",
      titulo: "Pack Temático: Ángel Guardián",
      mockup: "/evidencias/mockup_bautizo.png",
      etiquetas: ["Impresión Premium", "Vectorial", "Papel Texturizado"],
      detalles: "Dípticos, invitaciones y recuerdos religiosos con tipografía cursiva fina y vectores limpios."
    },
    {
      id: "gra-02",
      mision: "Cumpleaños / Infantil",
      titulo: "Kit de Operaciones: Aventura Espacial",
      mockup: "/evidencias/mockup_bautizo.png",
      etiquetas: ["Paleta Neon", "Stickers", "Alta Resolución"],
      detalles: "Invitaciones digitales y físicas impresas sobre cartulina premium satinada de 300g."
    }
  ],
  identidades: [
    {
      id: "cv-01",
      tipo: "Perfil Civil (Formal)",
      nombre: "Plantilla Standard-Executive",
      formato: "ATS-Friendly / PDF",
      preview: "/evidencias/preview_cv.png",
      detalles: "Estructura optimizada para sistemas automáticos de reclutamiento laboral. Tipografía limpia, sin tablas complejas y 100% parseable."
    },
    {
      id: "cv-02",
      tipo: "Perfil Operaciones (Creativo)",
      nombre: "Plantilla Tactical-Developer",
      formato: "Interactivo / PDF",
      preview: "/evidencias/preview_cv.png",
      detalles: "Diseño moderno con paleta oscura/clara y acentos de color de alta tecnología. Ideal para programadores y diseñadores."
    }
  ]
};
