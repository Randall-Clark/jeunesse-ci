-- ============================================================
-- RIJA — Réseau Information pour la Jeunesse Africaine
-- Script de configuration Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1. CRÉATION DES TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS "categories" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "icon" text NOT NULL,
  "color" text NOT NULL,
  CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "guides" (
  "id" serial PRIMARY KEY NOT NULL,
  "category_id" integer NOT NULL,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "step_count" integer DEFAULT 0 NOT NULL,
  "duration" text NOT NULL,
  "difficulty" text NOT NULL,
  "is_featured" boolean DEFAULT false NOT NULL,
  "tags" text[] DEFAULT '{}' NOT NULL
);

CREATE TABLE IF NOT EXISTS "guide_steps" (
  "id" serial PRIMARY KEY NOT NULL,
  "guide_id" integer NOT NULL,
  "order" integer NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "tips" text[] DEFAULT '{}' NOT NULL,
  "documents" text[] DEFAULT '{}' NOT NULL,
  "related_resource_ids" integer[] DEFAULT '{}' NOT NULL
);

CREATE TABLE IF NOT EXISTS "resources" (
  "id" serial PRIMARY KEY NOT NULL,
  "category_id" integer NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "type" text NOT NULL,
  "address" text,
  "city" text NOT NULL,
  "phone" text,
  "email" text,
  "website" text,
  "services" text[] DEFAULT '{}' NOT NULL,
  "opening_hours" text
);

CREATE TABLE IF NOT EXISTS "news" (
  "id" serial PRIMARY KEY NOT NULL,
  "category_id" integer NOT NULL,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "content" text,
  "type" text NOT NULL,
  "published_at" timestamp with time zone DEFAULT now() NOT NULL,
  "deadline" timestamp with time zone,
  "source" text,
  "is_featured" boolean DEFAULT false NOT NULL,
  "tags" text[] DEFAULT '{}' NOT NULL
);

-- 2. DONNÉES INITIALES — CATÉGORIES
-- ============================================================

INSERT INTO categories (slug, name, description, icon, color) VALUES
  ('entrepreneuriat', 'Entrepreneuriat', 'Créer et développer votre entreprise en Côte d''Ivoire', 'Briefcase', '#E67E22'),
  ('emploi', 'Emploi & Carrière', 'Trouver un emploi, préparer votre CV et réussir vos entretiens', 'Users', '#2ECC71'),
  ('formation', 'Formation & Éducation', 'Accéder aux formations, bourses d''études et programmes éducatifs', 'GraduationCap', '#3498DB'),
  ('sante', 'Santé & Bien-être', 'Services de santé, droits des patients et bien-être des jeunes', 'Heart', '#E74C3C'),
  ('droits', 'Droits & Justice', 'Connaître vos droits, accéder à la justice et aux services administratifs', 'Scale', '#9B59B6'),
  ('logement', 'Logement', 'Trouver un logement, comprendre les baux et vos droits de locataire', 'Home', '#1ABC9C')
ON CONFLICT (slug) DO NOTHING;

-- 3. DONNÉES INITIALES — GUIDES
-- ============================================================

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO guides (category_id, title, summary, step_count, duration, difficulty, is_featured, tags)
SELECT
  c.id,
  g.title,
  g.summary,
  g.step_count,
  g.duration,
  g.difficulty,
  g.is_featured,
  g.tags
FROM (VALUES
  ('entrepreneuriat', 'Créer son entreprise en Côte d''Ivoire', 'Guide complet pour lancer votre activité : de l''idée à l''immatriculation au RCCM', 6, '2 à 4 semaines', 'Intermédiaire', true, ARRAY['RCCM','CEPICI','Immatriculation','Business plan']),
  ('entrepreneuriat', 'Obtenir un financement pour votre projet', 'Les sources de financement disponibles pour les jeunes entrepreneurs ivoiriens', 5, '1 à 3 mois', 'Intermédiaire', false, ARRAY['Financement','Microfinance','FAFCI','BNI']),
  ('emploi', 'Trouver votre premier emploi', 'Étapes clés pour décrocher votre premier poste sur le marché ivoirien', 5, '1 à 6 mois', 'Débutant', true, ARRAY['CV','Entretien','AGEFOP','AGEPE']),
  ('formation', 'Obtenir une bourse d''études', 'Toutes les démarches pour bénéficier d''une bourse nationale ou internationale', 4, '3 à 6 mois', 'Débutant', true, ARRAY['Bourse','MESRS','Campus France']),
  ('sante', 'Accéder aux soins de santé gratuits', 'Comment bénéficier de la CMU (Couverture Maladie Universelle) en Côte d''Ivoire', 3, '1 à 2 semaines', 'Débutant', false, ARRAY['CMU','CNAM-CI','Santé']),
  ('droits', 'Obtenir votre Carte Nationale d''Identité', 'Démarches pour obtenir ou renouveler votre CNI ivoirienne', 4, '1 à 4 semaines', 'Débutant', false, ARRAY['CNI','ONECI','État civil'])
) AS g(slug, title, summary, step_count, duration, difficulty, is_featured, tags)
JOIN cat c ON c.slug = g.slug;

-- 4. DONNÉES INITIALES — ÉTAPES DES GUIDES
-- ============================================================

WITH g AS (SELECT id, title FROM guides)
INSERT INTO guide_steps (guide_id, "order", title, description, tips, documents, related_resource_ids)
SELECT
  g.id,
  s."order",
  s.title,
  s.description,
  s.tips,
  s.documents,
  ARRAY[]::integer[]
FROM (VALUES
  -- Guide "Créer son entreprise"
  ('Créer son entreprise en Côte d''Ivoire', 1, 'Valider votre idée et rédiger votre Business Plan',
   'Avant tout, définissez votre projet d''entreprise clairement. Un business plan est votre feuille de route : il décrit votre activité, votre marché, vos clients cibles, vos concurrents, et votre modèle économique. Le CEPICI propose des formations et du soutien pour vous aider.',
   ARRAY['Faites une étude de marché simple : interrogez 10 clients potentiels','Identifiez votre proposition de valeur unique','Estimez vos coûts de démarrage et votre seuil de rentabilité'],
   ARRAY['Plan d''affaires rédigé','Étude de marché']),
  ('Créer son entreprise en Côte d''Ivoire', 2, 'Choisir votre forme juridique',
   'La forme juridique détermine votre responsabilité, votre fiscalité et vos obligations. Les plus courantes pour les jeunes entrepreneurs sont l''Entreprise Individuelle (EI), la SARL ou la SAS.',
   ARRAY['SARL : idéale si vous avez des associés, capital minimum 100 000 FCFA','EI : parfaite pour démarrer seul, sans capital minimum','Consultez un juriste ou le CEPICI pour choisir'],
   ARRAY['Décision sur la forme juridique']),
  ('Créer son entreprise en Côte d''Ivoire', 3, 'Rassembler les documents nécessaires',
   'Pour l''immatriculation, vous aurez besoin d''un certain nombre de documents officiels. Préparez-les à l''avance pour éviter les allers-retours.',
   ARRAY['Les originaux et des copies sont souvent demandés','Certains documents doivent être légalisés'],
   ARRAY['Copie de la CNI ou du passeport','Extrait de casier judiciaire (moins de 3 mois)','Justificatif de domicile','Photos d''identité récentes','Statuts de l''entreprise (pour les sociétés)']),
  ('Créer son entreprise en Côte d''Ivoire', 4, 'S''immatriculer au RCCM via le CEPICI',
   'Le Centre de Promotion des Investissements en Côte d''Ivoire (CEPICI) est le guichet unique pour la création d''entreprise. Vous pouvez déposer votre dossier en ligne ou physiquement. Le délai est de 24h pour une EI, 72h pour une société.',
   ARRAY['Le CEPICI propose un service en ligne sur cepici.gouv.ci','Frais : environ 35 000 FCFA pour une EI, 100 000+ FCFA pour une société','Vous recevrez votre numéro de compte contribuable (NCC) et votre RCCM'],
   ARRAY['Formulaire de demande d''immatriculation','Dossier complet']),
  ('Créer son entreprise en Côte d''Ivoire', 5, 'Ouvrir un compte bancaire professionnel',
   'Un compte bancaire dédié à votre activité est indispensable pour séparer vos finances personnelles et professionnelles, et pour recevoir des paiements clients.',
   ARRAY['Comparez les offres des banques : SGBCI, BNI, Ecobank, NSIA Banque','Certaines banques proposent des offres spéciales jeunes entrepreneurs','Les fintechs comme Wave Business peuvent être une alternative rapide'],
   ARRAY['RCCM','CNI','Justificatif de domicile']),
  ('Créer son entreprise en Côte d''Ivoire', 6, 'Déclarer votre activité aux impôts',
   'Dans les 30 jours suivant la création, vous devez vous déclarer à la Direction Générale des Impôts (DGI) pour obtenir votre Numéro Identifiant du Contribuable (NIC) définitif et connaître votre régime fiscal.',
   ARRAY['Régime Simplifié d''Imposition pour les petites entreprises','Pensez à la TVA si votre CA dépasse 50 millions FCFA','Envisagez de faire appel à un comptable'],
   ARRAY['RCCM','Formulaire de déclaration fiscale']),
  -- Guide "Trouver votre premier emploi"
  ('Trouver votre premier emploi', 1, 'Identifier vos compétences et votre secteur cible',
   'Avant de chercher un emploi, faites un bilan de vos compétences, diplômes et expériences. Identifiez les secteurs qui recrutent à Abidjan et qui correspondent à votre profil.',
   ARRAY['Les secteurs porteurs : BTP, agroalimentaire, numérique, finance, télécom','L''AGEPE propose des bilans de compétences gratuits'],
   ARRAY['CV mis à jour','Diplômes et attestations']),
  ('Trouver votre premier emploi', 2, 'Rédiger un CV percutant et une lettre de motivation',
   'Votre CV est votre première impression. Il doit être clair, concis (1-2 pages) et adapté à chaque poste. La lettre de motivation doit montrer votre motivation spécifique pour l''entreprise.',
   ARRAY['Adaptez votre CV à chaque offre d''emploi','Mentionnez vos réalisations concrètes avec des chiffres','Faites relire votre CV par un proche ou un conseiller AGEPE'],
   ARRAY['CV (format PDF)','Lettre de motivation personnalisée']),
  ('Trouver votre premier emploi', 3, 'Rechercher des offres d''emploi',
   'Multipliez les canaux de recherche : sites d''emploi en ligne, réseaux sociaux professionnels, candidatures spontanées et réseau personnel.',
   ARRAY['Plateformes locales : Emploi.ci, JobsInCI, Jobartis CI','LinkedIn est très utilisé par les recruteurs ivoiriens','L''AGEPE publie des offres d''emploi gratuitement','Ne sous-estimez pas le réseau : 60% des emplois ne sont pas publiés'],
   ARRAY[]::text[]),
  -- Guide "Obtenir une bourse"
  ('Obtenir une bourse d''études', 1, 'Identifier les bourses disponibles',
   'Plusieurs types de bourses existent : nationales (MESRS), étrangères (Campus France, bourses d''excellence), et privées (fondations, entreprises). Chacune a ses critères d''éligibilité.',
   ARRAY['Bourses nationales : s''adresser au MESRS, critères académiques stricts','Campus France : études en France avec bourses du gouvernement français','Fondation Félix Houphouët-Boigny offre des bourses d''excellence'],
   ARRAY[]::text[]),
  ('Obtenir une bourse d''études', 2, 'Vérifier votre éligibilité et rassembler les documents',
   'Chaque bourse a ses critères spécifiques : moyenne académique, niveau d''études, filière, nationalité, conditions socio-économiques. Vérifiez attentivement avant de postuler.',
   ARRAY['Demandez vos relevés de notes dès maintenant car cela prend du temps','Une lettre de recommandation de qualité est souvent déterminante','Traduction assermentée des documents peut être nécessaire'],
   ARRAY['Relevés de notes des 2 ou 3 dernières années','Attestation d''inscription ou dernier diplôme','Lettre de motivation','Lettres de recommandation','Extrait de naissance','Photo d''identité'])
) AS s(guide_title, "order", title, description, tips, documents)
JOIN g ON g.title = s.guide_title;

-- 5. DONNÉES INITIALES — RESSOURCES
-- ============================================================

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO resources (category_id, name, description, type, address, city, phone, email, website, services, opening_hours)
SELECT c.id, r.name, r.description, r.type, r.address, r.city, r.phone, r.email, r.website, r.services, r.opening_hours
FROM (VALUES
  ('entrepreneuriat','CEPICI — Centre de Promotion des Investissements','Guichet unique pour la création d''entreprise en Côte d''Ivoire. Traite les dossiers d''immatriculation en 24-72h.','Institution publique','Avenue Noguès, Plateau','Abidjan','+225 27 20 21 40 11','contact@cepici.gouv.ci','https://www.cepici.gouv.ci',ARRAY['Création d''entreprise','Immatriculation RCCM','Guichet unique','Accompagnement'],'Lun-Ven 7h30-17h30'),
  ('entrepreneuriat','FAFCI — Fonds d''Appui aux Femmes de Côte d''Ivoire','Finance les projets des femmes entrepreneures et jeunes porteurs de projets en Côte d''Ivoire.','Fonds public','Plateau, Abidjan','Abidjan','+225 27 22 40 80 00','info@fafci.ci','https://www.fafci.ci',ARRAY['Microfinancement','Formation','Accompagnement entrepreneurial'],'Lun-Ven 8h-17h'),
  ('emploi','AGEPE — Agence d''Études et de Promotion de l''Emploi','Agence publique d''emploi offrant des services d''orientation, de placement et de formation professionnelle.','Institution publique','Avenue Terrasson de Fougères, Plateau','Abidjan','+225 27 20 21 36 36','contact@agepe.ci','https://www.agepe.ci',ARRAY['Recherche d''emploi','Bilan de compétences','Formation','Aide à l''embauche'],'Lun-Ven 7h30-17h'),
  ('formation','MESRS — Ministère de l''Enseignement Supérieur','Gère les bourses d''études nationales et les programmes de formation supérieure en Côte d''Ivoire.','Ministère','Cité Administrative, Tour D','Abidjan','+225 27 20 21 58 58','info@mesrs.ci','https://www.mesrs.ci',ARRAY['Bourses nationales','Équivalences de diplômes','Accréditation d''établissements'],'Lun-Ven 8h-17h'),
  ('sante','CNAM-CI — Couverture Maladie Universelle','Assurance maladie universelle permettant aux Ivoiriens d''accéder aux soins à moindre coût.','Institution publique','Tour CCIA, Plateau','Abidjan','+225 27 20 22 30 30','contact@cnam-ci.net','https://www.cnam-ci.net',ARRAY['Inscription CMU','Remboursement de soins','Liste des établissements partenaires'],'Lun-Ven 7h30-17h'),
  ('droits','ONECI — Office National de l''État Civil et de l''Identification','Délivre les cartes nationales d''identité et gère l''état civil en Côte d''Ivoire.','Institution publique','Boulevard Carde, Plateau','Abidjan','+225 27 20 21 10 10','contact@oneci.ci','https://www.oneci.ci',ARRAY['Carte Nationale d''Identité','Extrait de naissance','Passeport','Actes d''état civil'],'Lun-Ven 7h30-17h'),
  ('logement','SICOGI — Société Ivoirienne de Construction','Société nationale proposant des logements sociaux et des programmes d''accession à la propriété pour les jeunes.','Société publique','Cocody, Riviera','Abidjan','+225 27 22 44 55 55','info@sicogi.ci','https://www.sicogi.ci',ARRAY['Location','Accession propriété','Logements sociaux'],'Lun-Ven 8h-17h')
) AS r(slug, name, description, type, address, city, phone, email, website, services, opening_hours)
JOIN cat c ON c.slug = r.slug;

-- 6. DONNÉES INITIALES — ACTUALITÉS
-- ============================================================

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO news (category_id, title, summary, content, type, published_at, deadline, source, is_featured, tags)
SELECT c.id, n.title, n.summary, n.content, n.type, n.published_at::timestamptz, n.deadline::timestamptz, n.source, n.is_featured, n.tags
FROM (VALUES
  ('entrepreneuriat','Programme JOBS de la Banque Mondiale : 50 000 jeunes accompagnés','La Côte d''Ivoire lance la deuxième phase du programme JOBS pour financer et accompagner 50 000 jeunes entrepreneurs sur 3 ans.','Le gouvernement ivoirien, avec l''appui de la Banque Mondiale, lance la Phase 2 du Programme JOBS (Jobs Opportunity and Business Support). Ce programme vise à créer des opportunités économiques pour les jeunes de 18 à 35 ans à travers des financements, formations et accompagnements. Les candidatures sont ouvertes jusqu''au 30 juin 2026.','Programme','2026-03-15','2026-06-30','CEPICI',true,ARRAY['Financement','Accompagnement','Banque Mondiale']),
  ('formation','Bourses d''excellence : 500 places pour les meilleurs étudiants ivoiriens','Le MESRS ouvre les candidatures pour 500 bourses d''excellence destinées aux étudiants ivoiriens en master et doctorat.','Le Ministère de l''Enseignement Supérieur et de la Recherche Scientifique (MESRS) lance son appel à candidatures pour l''octroi de 500 bourses d''excellence pour l''année académique 2026-2027. Ces bourses couvrent les frais de scolarité, le logement et une allocation mensuelle.','Bourse','2026-04-01','2026-05-31','MESRS',true,ARRAY['Bourse','Master','Doctorat','Excellence']),
  ('emploi','Forum de l''Emploi Jeunesse 2026 : 3 000 offres d''emploi disponibles','La 8ème édition du Forum de l''Emploi organisé par l''AGEPE se tient à Abidjan avec plus de 200 entreprises participantes.','L''Agence d''Études et de Promotion de l''Emploi (AGEPE) organise la 8ème édition du Forum de l''Emploi du 12 au 14 mai 2026 au Palais des Sports de Treichville. Plus de 200 entreprises proposeront 3 000 offres d''emploi dans tous les secteurs. Inscription gratuite obligatoire sur le site de l''AGEPE.','Événement','2026-04-05','2026-05-12','AGEPE',true,ARRAY['Forum Emploi','Recrutement','AGEPE']),
  ('formation','Campus France CI : inscriptions ouvertes pour étudier en France','Campus France Côte d''Ivoire ouvre les inscriptions pour les étudiants souhaitant poursuivre leurs études en France à la rentrée 2026.','Campus France Côte d''Ivoire informe les étudiants que la procédure Études en France (PEF) pour la rentrée de septembre 2026 est ouverte. Créez votre dossier en ligne, choisissez vos formations et préparez votre entretien de motivation.','Opportunité','2026-03-20','2026-05-15','Campus France CI',false,ARRAY['France','Études','International']),
  ('sante','Journée nationale de vaccination : accès gratuit dans tous les centres CMU','Le Ministère de la Santé organise une journée de vaccination gratuite contre plusieurs maladies dans 500 centres de santé à travers le pays.','Dans le cadre de la Semaine Africaine de la Vaccination, le Ministère de la Santé et de l''Hygiène Publique organise le 24 avril 2026 une journée nationale de vaccination gratuite. Tous les citoyens peuvent se présenter munis de leur carte CMU dans l''un des 500 centres participants.','Santé publique','2026-04-10','2026-04-24','Ministère de la Santé',false,ARRAY['Vaccination','CMU','Gratuit'])
) AS n(slug, title, summary, content, type, published_at, deadline, source, is_featured, tags)
JOIN cat c ON c.slug = n.slug;

-- ============================================================
-- FIN DU SCRIPT — Vérification
-- ============================================================
SELECT 'categories' as table_name, count(*) FROM categories
UNION ALL SELECT 'guides', count(*) FROM guides
UNION ALL SELECT 'guide_steps', count(*) FROM guide_steps
UNION ALL SELECT 'resources', count(*) FROM resources
UNION ALL SELECT 'news', count(*) FROM news;
