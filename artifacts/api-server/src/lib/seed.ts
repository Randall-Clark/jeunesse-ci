import { db } from "@workspace/db";
import {
  categoriesTable,
  guidesTable,
  guideStepsTable,
  resourcesTable,
  newsTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger";

export async function seedIfEmpty() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categoriesTable);

  if (count > 0) {
    logger.info("Database already seeded, skipping");
    return;
  }

  logger.info("Seeding database...");

  const categories = await db
    .insert(categoriesTable)
    .values([
      {
        slug: "entrepreneuriat",
        name: "Entrepreneuriat",
        description: "Créer et développer votre entreprise en Côte d'Ivoire",
        icon: "Briefcase",
        color: "#E67E22",
      },
      {
        slug: "emploi",
        name: "Emploi & Carrière",
        description: "Trouver un emploi, préparer votre CV et réussir vos entretiens",
        icon: "Users",
        color: "#2ECC71",
      },
      {
        slug: "formation",
        name: "Formation & Éducation",
        description: "Accéder aux formations, bourses d'études et programmes éducatifs",
        icon: "GraduationCap",
        color: "#3498DB",
      },
      {
        slug: "sante",
        name: "Santé & Bien-être",
        description: "Services de santé, droits des patients et bien-être des jeunes",
        icon: "Heart",
        color: "#E74C3C",
      },
      {
        slug: "droits",
        name: "Droits & Justice",
        description: "Connaître vos droits, accéder à la justice et aux services administratifs",
        icon: "Scale",
        color: "#9B59B6",
      },
      {
        slug: "logement",
        name: "Logement",
        description: "Trouver un logement, comprendre les baux et vos droits de locataire",
        icon: "Home",
        color: "#1ABC9C",
      },
    ])
    .returning();

  const [entrepreneuriat, emploi, formation, sante, droits, logement] = categories;

  const guides = await db
    .insert(guidesTable)
    .values([
      {
        categoryId: entrepreneuriat.id,
        title: "Créer son entreprise en Côte d'Ivoire",
        summary: "Guide complet pour lancer votre activité : de l'idée à l'immatriculation au RCCM",
        stepCount: 6,
        duration: "2 à 4 semaines",
        difficulty: "Intermédiaire",
        isFeatured: true,
        tags: ["RCCM", "CEPICI", "Immatriculation", "Business plan"],
      },
      {
        categoryId: entrepreneuriat.id,
        title: "Obtenir un financement pour votre projet",
        summary: "Les sources de financement disponibles pour les jeunes entrepreneurs ivoiriens",
        stepCount: 5,
        duration: "1 à 3 mois",
        difficulty: "Intermédiaire",
        isFeatured: false,
        tags: ["Financement", "Microfinance", "FAFCI", "BNI"],
      },
      {
        categoryId: emploi.id,
        title: "Trouver votre premier emploi",
        summary: "Étapes clés pour décrocher votre premier poste sur le marché ivoirien",
        stepCount: 5,
        duration: "1 à 6 mois",
        difficulty: "Débutant",
        isFeatured: true,
        tags: ["CV", "Entretien", "AGEFOP", "AGEPE"],
      },
      {
        categoryId: formation.id,
        title: "Obtenir une bourse d'études",
        summary: "Toutes les démarches pour bénéficier d'une bourse nationale ou internationale",
        stepCount: 4,
        duration: "3 à 6 mois",
        difficulty: "Débutant",
        isFeatured: true,
        tags: ["Bourse", "MESRS", "Campus France"],
      },
      {
        categoryId: sante.id,
        title: "Accéder aux soins de santé gratuits",
        summary: "Comment bénéficier de la CMU (Couverture Maladie Universelle) en Côte d'Ivoire",
        stepCount: 3,
        duration: "1 à 2 semaines",
        difficulty: "Débutant",
        isFeatured: false,
        tags: ["CMU", "CNAM-CI", "Santé"],
      },
      {
        categoryId: droits.id,
        title: "Obtenir votre Carte Nationale d'Identité",
        summary: "Démarches pour obtenir ou renouveler votre CNI ivoirienne",
        stepCount: 4,
        duration: "1 à 4 semaines",
        difficulty: "Débutant",
        isFeatured: false,
        tags: ["CNI", "ONECI", "État civil"],
      },
    ])
    .returning();

  const [creationEntreprise, financement, premierEmploi, bourse] = guides;

  await db.insert(guideStepsTable).values([
    {
      guideId: creationEntreprise.id,
      order: 1,
      title: "Valider votre idée et rédiger votre Business Plan",
      description: "Avant tout, définissez votre projet d'entreprise clairement. Un business plan est votre feuille de route : il décrit votre activité, votre marché, vos clients cibles, vos concurrents, et votre modèle économique. Le CEPICI propose des formations et du soutien pour vous aider.",
      tips: [
        "Faites une étude de marché simple : interrogez 10 clients potentiels",
        "Identifiez votre proposition de valeur unique",
        "Estimez vos coûts de démarrage et votre seuil de rentabilité",
      ],
      documents: ["Plan d'affaires rédigé", "Étude de marché"],
      relatedResourceIds: [],
    },
    {
      guideId: creationEntreprise.id,
      order: 2,
      title: "Choisir votre forme juridique",
      description: "La forme juridique détermine votre responsabilité, votre fiscalité et vos obligations. Les plus courantes pour les jeunes entrepreneurs sont l'Entreprise Individuelle (EI), la SARL ou la SAS. L'EI est la plus simple à créer.",
      tips: [
        "SARL : idéale si vous avez des associés, capital minimum 100 000 FCFA",
        "EI : parfaite pour démarrer seul, sans capital minimum",
        "Consultez un juriste ou le CEPICI pour choisir",
      ],
      documents: ["Décision sur la forme juridique"],
      relatedResourceIds: [],
    },
    {
      guideId: creationEntreprise.id,
      order: 3,
      title: "Rassembler les documents nécessaires",
      description: "Pour l'immatriculation, vous aurez besoin d'un certain nombre de documents officiels. Préparez-les à l'avance pour éviter les allers-retours.",
      tips: [
        "Les originaux et des copies sont souvent demandés",
        "Certains documents doivent être légalisés",
      ],
      documents: [
        "Copie de la CNI ou du passeport",
        "Extrait de casier judiciaire (moins de 3 mois)",
        "Justificatif de domicile",
        "Photos d'identité récentes",
        "Statuts de l'entreprise (pour les sociétés)",
      ],
      relatedResourceIds: [],
    },
    {
      guideId: creationEntreprise.id,
      order: 4,
      title: "S'immatriculer au RCCM via le CEPICI",
      description: "Le Centre de Promotion des Investissements en Côte d'Ivoire (CEPICI) est le guichet unique pour la création d'entreprise. Vous pouvez déposer votre dossier en ligne ou physiquement. Le délai est de 24h pour une EI, 72h pour une société.",
      tips: [
        "Le CEPICI propose un service en ligne sur cepici.gouv.ci",
        "Frais : environ 35 000 FCFA pour une EI, 100 000+ FCFA pour une société",
        "Vous recevrez votre numéro de compte contribuable (NCC) et votre RCCM",
      ],
      documents: ["Formulaire de demande d'immatriculation", "Dossier complet"],
      relatedResourceIds: [],
    },
    {
      guideId: creationEntreprise.id,
      order: 5,
      title: "Ouvrir un compte bancaire professionnel",
      description: "Un compte bancaire dédié à votre activité est indispensable pour séparer vos finances personnelles et professionnelles, et pour recevoir des paiements clients.",
      tips: [
        "Comparez les offres des banques : SGBCI, BNI, Ecobank, NSIA Banque",
        "Certaines banques proposent des offres spéciales jeunes entrepreneurs",
        "Les fintechs comme Wave Business peuvent être une alternative rapide",
      ],
      documents: ["RCCM", "CNI", "Justificatif de domicile"],
      relatedResourceIds: [],
    },
    {
      guideId: creationEntreprise.id,
      order: 6,
      title: "Déclarer votre activité aux impôts",
      description: "Dans les 30 jours suivant la création, vous devez vous déclarer à la Direction Générale des Impôts (DGI) pour obtenir votre Numéro Identifiant du Contribuable (NIC) définitif et connaître votre régime fiscal.",
      tips: [
        "Régime Simplifié d'Imposition pour les petites entreprises",
        "Pensez à la TVA si votre CA dépasse 50 millions FCFA",
        "Envisagez de faire appel à un comptable",
      ],
      documents: ["RCCM", "Formulaire de déclaration fiscale"],
      relatedResourceIds: [],
    },
    {
      guideId: premierEmploi.id,
      order: 1,
      title: "Identifier vos compétences et votre secteur cible",
      description: "Avant de chercher un emploi, faites un bilan de vos compétences, diplômes et expériences. Identifiez les secteurs qui recrutent à Abidjan et qui correspondent à votre profil.",
      tips: [
        "Les secteurs porteurs : BTP, agroalimentaire, numérique, finance, télécom",
        "L'AGEPE propose des bilans de compétences gratuits",
      ],
      documents: ["CV mis à jour", "Diplômes et attestations"],
      relatedResourceIds: [],
    },
    {
      guideId: premierEmploi.id,
      order: 2,
      title: "Rédiger un CV percutant et une lettre de motivation",
      description: "Votre CV est votre première impression. Il doit être clair, concis (1-2 pages) et adapté à chaque poste. La lettre de motivation doit montrer votre motivation spécifique pour l'entreprise.",
      tips: [
        "Adaptez votre CV à chaque offre d'emploi",
        "Mentionnez vos réalisations concrètes avec des chiffres",
        "Faites relire votre CV par un proche ou un conseiller AGEPE",
      ],
      documents: ["CV (format PDF)", "Lettre de motivation personnalisée"],
      relatedResourceIds: [],
    },
    {
      guideId: premierEmploi.id,
      order: 3,
      title: "Rechercher des offres d'emploi",
      description: "Multipliez les canaux de recherche : sites d'emploi en ligne, réseaux sociaux professionnels, candidatures spontanées et réseau personnel.",
      tips: [
        "Plateformes locales : Emploi.ci, JobsInCI, Jobartis CI",
        "LinkedIn est très utilisé par les recruteurs ivoiriens",
        "L'AGEPE publie des offres d'emploi gratuitement",
        "Ne sous-estimez pas le réseau : 60% des emplois ne sont pas publiés",
      ],
      documents: [],
      relatedResourceIds: [],
    },
    {
      guideId: bourse.id,
      order: 1,
      title: "Identifier les bourses disponibles",
      description: "Plusieurs types de bourses existent : nationales (MESRS), étrangères (Campus France, bourses d'excellence), et privées (fondations, entreprises). Chacune a ses critères d'éligibilité.",
      tips: [
        "Bourses nationales : s'adresser au MESRS, critères académiques stricts",
        "Campus France : études en France avec bourses du gouvernement français",
        "Fondation Félix Houphouët-Boigny offre des bourses d'excellence",
      ],
      documents: [],
      relatedResourceIds: [],
    },
    {
      guideId: bourse.id,
      order: 2,
      title: "Vérifier votre éligibilité et rassembler les documents",
      description: "Chaque bourse a ses critères spécifiques : moyenne académique, niveau d'études, filière, nationalité, conditions socio-économiques. Vérifiez attentivement avant de postuler.",
      tips: [
        "Demandez vos relevés de notes dès maintenant car cela prend du temps",
        "Une lettre de recommandation de qualité est souvent déterminante",
        "Traduction assermentée des documents peut être nécessaire",
      ],
      documents: [
        "Relevés de notes des 2 ou 3 dernières années",
        "Attestation d'inscription ou dernier diplôme",
        "Lettre de motivation",
        "Lettres de recommandation",
        "Extrait de naissance",
        "Photo d'identité",
      ],
      relatedResourceIds: [],
    },
  ]);

  await db.insert(resourcesTable).values([
    {
      categoryId: entrepreneuriat.id,
      name: "CEPICI — Centre de Promotion des Investissements",
      description: "Guichet unique pour la création d'entreprise en Côte d'Ivoire. Traite les dossiers d'immatriculation en 24-72h.",
      type: "Institution publique",
      address: "Avenue Noguès, Plateau",
      city: "Abidjan",
      phone: "+225 27 20 21 40 11",
      email: "contact@cepici.gouv.ci",
      website: "https://www.cepici.gouv.ci",
      services: ["Création d'entreprise", "Immatriculation RCCM", "Guichet unique", "Accompagnement"],
      openingHours: "Lun-Ven 7h30-17h30",
    },
    {
      categoryId: entrepreneuriat.id,
      name: "FAFCI — Fonds d'Appui aux Femmes de Côte d'Ivoire",
      description: "Finance les projets des femmes entrepreneures et jeunes porteurs de projets en Côte d'Ivoire.",
      type: "Fonds public",
      address: "Plateau, Abidjan",
      city: "Abidjan",
      phone: "+225 27 22 40 80 00",
      email: "info@fafci.ci",
      website: "https://www.fafci.ci",
      services: ["Microfinancement", "Formation", "Accompagnement entrepreneurial"],
      openingHours: "Lun-Ven 8h-17h",
    },
    {
      categoryId: emploi.id,
      name: "AGEPE — Agence d'Études et de Promotion de l'Emploi",
      description: "Agence publique d'emploi offrant des services d'orientation, de placement et de formation professionnelle.",
      type: "Institution publique",
      address: "Avenue Terrasson de Fougères, Plateau",
      city: "Abidjan",
      phone: "+225 27 20 21 36 36",
      email: "contact@agepe.ci",
      website: "https://www.agepe.ci",
      services: ["Recherche d'emploi", "Bilan de compétences", "Formation", "Aide à l'embauche"],
      openingHours: "Lun-Ven 7h30-17h",
    },
    {
      categoryId: formation.id,
      name: "MESRS — Ministère de l'Enseignement Supérieur",
      description: "Gère les bourses d'études nationales et les programmes de formation supérieure en Côte d'Ivoire.",
      type: "Ministère",
      address: "Cité Administrative, Tour D",
      city: "Abidjan",
      phone: "+225 27 20 21 58 58",
      email: "info@mesrs.ci",
      website: "https://www.mesrs.ci",
      services: ["Bourses nationales", "Équivalences de diplômes", "Accréditation d'établissements"],
      openingHours: "Lun-Ven 8h-17h",
    },
    {
      categoryId: sante.id,
      name: "CNAM-CI — Couverture Maladie Universelle",
      description: "Assurance maladie universelle permettant aux Ivoiriens d'accéder aux soins à moindre coût.",
      type: "Institution publique",
      address: "Tour CCIA, Plateau",
      city: "Abidjan",
      phone: "+225 27 20 22 30 30",
      email: "contact@cnam-ci.net",
      website: "https://www.cnam-ci.net",
      services: ["Inscription CMU", "Remboursement de soins", "Liste des établissements partenaires"],
      openingHours: "Lun-Ven 7h30-17h",
    },
    {
      categoryId: droits.id,
      name: "ONECI — Office National de l'État Civil et de l'Identification",
      description: "Délivre les cartes nationales d'identité et gère l'état civil en Côte d'Ivoire.",
      type: "Institution publique",
      address: "Boulevard Carde, Plateau",
      city: "Abidjan",
      phone: "+225 27 20 21 10 10",
      email: "contact@oneci.ci",
      website: "https://www.oneci.ci",
      services: ["Carte Nationale d'Identité", "Extrait de naissance", "Passeport", "Actes d'état civil"],
      openingHours: "Lun-Ven 7h30-17h",
    },
    {
      categoryId: logement.id,
      name: "SICOGI — Société Ivoirienne de Construction",
      description: "Société nationale proposant des logements sociaux et des programmes d'accession à la propriété pour les jeunes.",
      type: "Société publique",
      address: "Cocody, Riviera",
      city: "Abidjan",
      phone: "+225 27 22 44 55 55",
      email: "info@sicogi.ci",
      website: "https://www.sicogi.ci",
      services: ["Location", "Accession propriété", "Logements sociaux"],
      openingHours: "Lun-Ven 8h-17h",
    },
  ]);

  await db.insert(newsTable).values([
    {
      categoryId: entrepreneuriat.id,
      title: "Programme JOBS de la Banque Mondiale : 50 000 jeunes accompagnés",
      summary: "La Côte d'Ivoire lance la deuxième phase du programme JOBS pour financer et accompagner 50 000 jeunes entrepreneurs sur 3 ans.",
      content: "Le gouvernement ivoirien, avec l'appui de la Banque Mondiale, lance la Phase 2 du Programme JOBS (Jobs Opportunity and Business Support). Ce programme vise à créer des opportunités économiques pour les jeunes de 18 à 35 ans à travers des financements, formations et accompagnements. Les candidatures sont ouvertes jusqu'au 30 juin 2026.",
      type: "Programme",
      publishedAt: new Date("2026-03-15"),
      deadline: new Date("2026-06-30"),
      source: "CEPICI",
      isFeatured: true,
      tags: ["Financement", "Accompagnement", "Banque Mondiale"],
    },
    {
      categoryId: formation.id,
      title: "Bourses d'excellence : 500 places pour les meilleurs étudiants ivoiriens",
      summary: "Le MESRS ouvre les candidatures pour 500 bourses d'excellence destinées aux étudiants ivoiriens en master et doctorat.",
      content: "Le Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MESRS) lance son appel à candidatures pour l'octroi de 500 bourses d'excellence pour l'année académique 2026-2027. Ces bourses couvrent les frais de scolarité, le logement et une allocation mensuelle.",
      type: "Bourse",
      publishedAt: new Date("2026-04-01"),
      deadline: new Date("2026-05-31"),
      source: "MESRS",
      isFeatured: true,
      tags: ["Bourse", "Master", "Doctorat", "Excellence"],
    },
    {
      categoryId: emploi.id,
      title: "Forum de l'Emploi Jeunesse 2026 : 3 000 offres d'emploi disponibles",
      summary: "La 8ème édition du Forum de l'Emploi organisé par l'AGEPE se tient à Abidjan avec plus de 200 entreprises participantes.",
      content: "L'Agence d'Études et de Promotion de l'Emploi (AGEPE) organise la 8ème édition du Forum de l'Emploi du 12 au 14 mai 2026 au Palais des Sports de Treichville. Plus de 200 entreprises proposeront 3 000 offres d'emploi dans tous les secteurs. Inscription gratuite obligatoire sur le site de l'AGEPE.",
      type: "Événement",
      publishedAt: new Date("2026-04-05"),
      deadline: new Date("2026-05-12"),
      source: "AGEPE",
      isFeatured: true,
      tags: ["Forum Emploi", "Recrutement", "AGEPE"],
    },
    {
      categoryId: formation.id,
      title: "Campus France CI : inscriptions ouvertes pour étudier en France",
      summary: "Campus France Côte d'Ivoire ouvre les inscriptions pour les étudiants souhaitant poursuivre leurs études en France à la rentrée 2026.",
      content: "Campus France Côte d'Ivoire informe les étudiants que la procédure Études en France (PEF) pour la rentrée de septembre 2026 est ouverte. Créez votre dossier en ligne, choisissez vos formations et préparez votre entretien de motivation.",
      type: "Opportunité",
      publishedAt: new Date("2026-03-20"),
      deadline: new Date("2026-05-15"),
      source: "Campus France CI",
      isFeatured: false,
      tags: ["France", "Études", "International"],
    },
    {
      categoryId: sante.id,
      title: "Journée nationale de vaccination : accès gratuit dans tous les centres CMU",
      summary: "Le Ministère de la Santé organise une journée de vaccination gratuite contre plusieurs maladies dans 500 centres de santé à travers le pays.",
      content: "Dans le cadre de la Semaine Africaine de la Vaccination, le Ministère de la Santé et de l'Hygiène Publique organise le 24 avril 2026 une journée nationale de vaccination gratuite. Tous les citoyens peuvent se présenter munis de leur carte CMU dans l'un des 500 centres participants.",
      type: "Santé publique",
      publishedAt: new Date("2026-04-10"),
      deadline: new Date("2026-04-24"),
      source: "Ministère de la Santé",
      isFeatured: false,
      tags: ["Vaccination", "CMU", "Gratuit"],
    },
  ]);

  logger.info("Database seeded successfully");
}
