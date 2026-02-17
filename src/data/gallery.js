const galleryConfig = {
  legno: {
    title: "Legno inciso",
    icon: "✶",
    service:
      "Targhe e insegne in essenze naturali con pattern audaci, perfette per locali, studi e case creative.",
    description:
      "Incisioni su legno di diverse essenze: targhe commemorative, insegne per attivita, bomboniere e decorazioni su misura.",
    caption: "Incisioni su legno con finitura naturale e dettagli personalizzati.",
    images: [
      "legno1.jpeg",
      "legno2.jpeg",
      "legno3.jpeg",
      "legno4.jpeg",
      "legno5.jpeg",
      "legno6.jpeg",
      "legno7.jpeg",
      "legno8.jpeg",
      "legno9.jpeg",
      "legno10.jpeg",
      "legno11.jpeg",
      "legno12.jpeg",
      "legno13.jpeg",
      "legno14.jpeg",
      "legno15.jpeg",
      "legno16.jpeg",
      "legno17.jpeg"
    ]
  },
  metallo: {
    title: "Metallo inciso",
    icon: "✦",
    service:
      "Acciaio e alluminio ad alto contrasto per loghi, numerazioni e placche industrial chic.",
    description:
      "Acciaio e alluminio diventano supporti scenografici per loghi, targhe, gadget tecnici e pezzi decorativi.",
    caption: "Incisioni nette su metallo, perfette per targhe e accessori industrial chic.",
    images: [
      "metallo1.jpeg",
      "metallo2.jpeg",
      "metallo3.jpeg",
      "metallo4.jpeg",
      "metallo5.jpeg",
      "metallo6.jpeg",
      "metallo7.jpeg",
      "metallo8.jpeg",
      "metallo9.jpeg",
      "metallo10.jpeg",
      "metallo11.jpeg",
      "metallo12.jpeg",
      "metallo13.jpeg",
      "metallo14.jpeg"
    ]
  },
  vetro: {
    title: "Vetro inciso",
    icon: "✺",
    service:
      "Trasparenze scolpite a mano per oggetti luminosi, gift personalizzati e serie limitate.",
    description:
      "Incisioni su vetro trasparente o satinato che riflettono la luce e valorizzano forme e pattern.",
    caption: "Lavorazioni su vetro con incisioni luminose e dettagliate.",
    images: ["vetro1.jpeg"]
  },
  bicchieri: {
    title: "Bicchieri incisi",
    icon: "❋",
    service:
      "Set coordinati per eventi, wedding table e regali one-off con grafiche su richiesta.",
    description:
      "Set di bicchieri incisi a mano per eventi speciali, collezioni limitate e regali unici.",
    caption: "Bicchieri incisi per eventi, cerimonie e regali personalizzati.",
    images: ["bicchiere1.jpeg", "bicchiere2.jpeg", "bicchiere3.jpeg"]
  },
  bottiglie: {
    title: "Bottiglie con lampada",
    icon: "✹",
    service:
      "Bottiglie recuperate trasformate in lampade scenografiche, con incisioni e luce calda.",
    description:
      "Bottiglie recuperate trasformate in lampade poetiche: incisioni e luce per un effetto scenografico.",
    caption: "Bottiglie trasformate in lampade con incisioni decorative.",
    images: ["bottoglia1.jpeg"]
  },
  tessuto: {
    title: "Stampa su tessuto",
    icon: "✿",
    service:
      "Texture stampate su tessuti naturali e tecnici per capsule brandizzate e interior details.",
    description:
      "Pattern e grafiche stampate su tessuti naturali e tecnici per accessori e arredo personalizzato.",
    caption: "Stampe su tessuto con texture su misura per progetti creativi.",
    images: [
      "tessuto1.jpeg",
      "tessuto2.jpeg",
      "tessuto3.jpeg",
      "tessuto4.jpeg",
      "tessuto5.jpeg",
      "tessuto6.jpeg",
      "tessuto7.jpeg"
    ]
  }
};

export const categories = Object.entries(galleryConfig).map(([id, config]) => ({
  id,
  title: config.title,
  icon: config.icon,
  service: config.service
}));

export const heroSlides = [
  {
    image: "bicchiere2.jpeg",
    alt: "Bicchiere inciso con pattern geometrico",
    caption: "Bicchieri incisi • Set personalizzati per eventi speciali"
  },
  {
    image: "metallo4.jpeg",
    alt: "Lastra in metallo con incisione luminosa",
    caption: "Metallo inciso • Contrasti netti e riflessi metallici"
  },
  {
    image: "legno13.jpeg",
    alt: "Pannello in legno inciso a mano",
    caption: "Legno inciso • Pattern geometrici su essenze naturali"
  },
  {
    image: "bottoglia1.jpeg",
    alt: "Bottiglia trasformata in lampada decorativa",
    caption: "Bottiglie luminose • Lampade poetiche da pezzi recuperati"
  },
  {
    image: "tessuto5.jpeg",
    alt: "Texture grafica su tessuto naturale",
    caption: "Stampa su tessuto • Texture su misura per accessori e arredo"
  }
];

export const filters = [
  { id: "all", label: "Tutti" },
  ...categories.map((category) => ({ id: category.id, label: category.title }))
];

export const products = Object.entries(galleryConfig).flatMap(([category, config]) =>
  config.images.map((filename, index) => ({
    id: `${category}-${index + 1}`,
    category,
    categoryTitle: config.title,
    title: config.title,
    alt: `${config.title} lavorazione artigianale`,
    caption: config.caption,
    description: config.description,
    image: filename
  }))
);

export const privacyCards = [
  {
    title: "Dati raccolti",
    text: "Quando contatti Anna vengono trattati nome, e-mail, telefono (se indicato) e contenuto della richiesta."
  },
  {
    title: "Finalita",
    text: "I dati vengono usati solo per rispondere, preparare preventivi e gestire ordini o consegne concordate."
  },
  {
    title: "Condivisione",
    text: "Le informazioni non vengono vendute e sono condivise solo con fornitori necessari alla realizzazione del progetto."
  },
  {
    title: "Diritti",
    text: "Puoi chiedere accesso, rettifica o cancellazione scrivendo a brizzianna83@gmail.com."
  }
];
