import type { Lesson } from '@/types'

export const LESSONS: Lesson[] = [
  {
    id: 'sql-001',
    trackId: 'sql-cost',
    order: 1,
    title: { fr: 'Pourquoi SQL est un outil financier, pas juste technique' },
    type: 'sql_cost_awareness',
    estimatedMinutes: 8,
    xpReward: { sql: 30, business: 20 },
    isPremium: false,
    businessAlert: {
      urgency: 'high',
      trigger: { fr: 'Réunion budgétaire trimestrielle : la DSI demande à chaque équipe de justifier ses coûts cloud.' },
      financialImpact: { fr: "L'équipe data représente 34% de la facture GCP totale. Le CFO veut une réduction de 20%." },
      costOfIgnorance: { fr: "Un data analyst qui ne comprend pas la facturation cloud coûte en moyenne 2× plus cher à son employeur qu'un profil conscient des coûts." },
      slackMessage: {
        author: 'Camille Royer', role: 'Head of Data', avatar: 'CR', time: '09:02',
        content: { fr: "@team-data réunion budgétaire vendredi. On doit justifier chaque dollar de notre facture GCP. Préparez-vous à expliquer vos requêtes les plus coûteuses." },
      },
    },
    whyItMatters: {
      businessLogic: { fr: "Les data warehouses modernes (BigQuery, Snowflake, Redshift) facturent à la consommation — chaque requête a un prix. Un data analyst qui ignore cela dépense l'argent de son entreprise sans s'en rendre compte." },
      realWorldExample: { fr: "Chez une fintech parisienne de 300 personnes, l'équipe data a réduit sa facture BigQuery de $43 000 à $8 200/mois simplement en ajoutant des filtres de partition sur leurs 20 requêtes les plus fréquentes." },
      proVsJunior: {
        junior: { fr: "Exécute les requêtes sans regarder le coût. Découvre la facture à la fin du mois." },
        pro: { fr: "Estime le coût avant d'exécuter. Optimise si > $1. Documente l'impact pour le manager." },
      },
    },
    concept: {
      headline: { fr: 'La formule simple que tout data analyst doit connaître' },
      explanation: { fr: "Coût = (GB scannés ÷ 1 000) × $6.25. C'est tout. BigQuery scanne les colonnes et les partitions que vous lui demandez. Plus vous êtes précis, moins vous payez." },
      beforeExample: {
        language: 'sql',
        code: `-- Ce que fait un junior (sans le savoir)\nSELECT *\nFROM orders\n-- Scanne TOUT : 800 Go → $5.00`,
        explanation: { fr: "SELECT * force BigQuery à lire toutes les colonnes. Sur une table de 800 Go avec 500 colonnes, c'est 800 Go × $6.25/TB = $5.00 par exécution." },
      },
      afterExample: {
        language: 'sql',
        code: `-- Ce que fait un pro\nSELECT order_id, amount, status\nFROM orders\nWHERE _PARTITIONDATE = CURRENT_DATE\n-- Scanne 8 Go → $0.05`,
        explanation: { fr: "3 colonnes ciblées + filtre de partition = 8 Go scannés. Économie : -99%. Sur 50 exécutions/jour : $249.50 économisés chaque jour." },
      },
      costBefore: 5.00,
      costAfter: 0.05,
    },
    practice: {
      instructions: { fr: "La table `events` de ShopStream fait 2.4 TB et contient 800 colonnes. Tu dois calculer le nombre de clics sur le bouton \"Acheter\" aujourd'hui. Écris la requête la moins chère possible." },
      businessContext: { fr: "Ce chiffre est demandé par le Product Manager toutes les heures pour son dashboard. À $15/exécution × 24h = $360/jour. Ton objectif : passer sous $0.20/exécution." },
      starterCode: `-- Table disponible : events\n-- Colonnes utiles : event_type, button_id, user_id, created_at, _PARTITIONDATE\n-- À toi de jouer :\nSELECT`,
      hints: [
        { fr: "Quelles colonnes as-tu VRAIMENT besoin pour compter des clics ?" },
        { fr: "Hint : COUNT(*) ne nécessite pas de sélectionner les colonnes. Mais la table est partitionnée par jour..." },
        { fr: "Solution direction : filtre sur _PARTITIONDATE + COUNT sur event_type uniquement." },
      ],
      mentorContext: { fr: "L'élève apprend à cibler les colonnes et utiliser les partitions BigQuery." },
      validationRules: [
        { type: 'cost_under', value: 0.20, errorMessage: { fr: "Coût trop élevé. Pense à filtrer la partition du jour." } },
        { type: 'sql_score', value: 70, errorMessage: { fr: "Score minimum 70/100. Vérifie tes colonnes sélectionnées." } },
      ],
    },
    roiDebrief: {
      savingsPercent: 98.7,
      monthlySavingsUSD: 10530,
      annualSavingsUSD: 126360,
      careerImpactStatement: { fr: "Les data analysts qui mesurent l'impact financier de leur code sont promus 18 mois plus tôt en moyenne." },
      interviewTalkingPoint: { fr: '"J\'optimise systématiquement mes requêtes BigQuery en ciblant les colonnes et en utilisant les partitions. Sur mon dernier projet, j\'ai réduit les coûts de scan de 98%, soit ~$126k économisés annuellement."' },
      nextLessonTeaser: { fr: "Prochaine leçon : SELECT * — l'anti-pattern qui ruine silencieusement les budgets data. Avec un vrai cas à $23k de dépassement." },
    },
  },
  {
    id: 'sql-002',
    trackId: 'sql-cost',
    order: 2,
    title: { fr: "SELECT * : l'anti-pattern à $18 400 de dépassement" },
    type: 'sql_cost_awareness',
    estimatedMinutes: 12,
    xpReward: { sql: 50, optimization: 30 },
    isPremium: false,
    businessAlert: {
      urgency: 'critical',
      trigger: { fr: "Facture BigQuery de novembre : $23 400. Budget prévu : $5 000." },
      financialImpact: { fr: "$18 400 de dépassement. Le CFO bloque les dépenses data jusqu'à explication." },
      costOfIgnorance: { fr: "Une seule requête SELECT * sur une grosse table, exécutée 3x/jour, peut coûter $4 200/mois." },
      slackMessage: {
        author: 'Thomas Bernard', role: 'CFO', avatar: 'TB', time: '08:47',
        content: { fr: "@data-team la facture BigQuery de novembre vient de tomber : $23 400. Budget prévu $5k. Quelqu'un peut m'expliquer ce dépassement ? Board meeting dans 2h." },
      },
    },
    whyItMatters: {
      businessLogic: { fr: "BigQuery scanne TOUTES les colonnes demandées. SELECT * = toutes les colonnes = maximum de bytes scannés = facture maximale. Sur une table avec 500 colonnes dont vous n'en utilisez que 5, SELECT * scanne 100× trop." },
      realWorldExample: { fr: 'Un rapport quotidien "chiffre d\'affaires par région" avec SELECT * sur une table orders de 800 Go : $14.20/exécution × 3 fois/jour × 30 jours = $1 278/mois. Avec 6 colonnes ciblées : $12.78/mois.' },
      proVsJunior: {
        junior: { fr: 'Écrit SELECT * parce que "c\'est plus rapide à taper". Ne regarde jamais l\'onglet coût.' },
        pro: { fr: "Liste les colonnes nécessaires avant d'écrire la requête. Règle d'or : si tu ne l'affiches pas, tu ne le sélectionnes pas." },
      },
    },
    concept: {
      headline: { fr: "SELECT * scanne tout. Même ce dont tu n'as pas besoin." },
      explanation: { fr: "BigQuery stocke les données en colonnes (format Parquet). Il peut lire uniquement les colonnes demandées. SELECT * casse cette optimisation : il lit tout. C'est l'équivalent de télécharger un fichier de 50 Go pour lire 3 lignes." },
      beforeExample: {
        language: 'sql',
        code: `SELECT *\nFROM orders\nWHERE created_at >= '2024-11-01'\n-- 800 Go scannés → $5.00`,
        explanation: { fr: "La table orders a 500 colonnes. SELECT * les lit toutes. 800 Go × $6.25/TB = $5.00." },
      },
      afterExample: {
        language: 'sql',
        code: `SELECT\n  order_id,\n  amount,\n  status,\n  region,\n  created_at\nFROM orders\nWHERE _PARTITIONDATE >= '2024-11-01'\n-- 8 Go scannés → $0.05`,
        explanation: { fr: "5 colonnes sur 500 = 1% des données. Plus le filtre de partition qui coupe 11 mois sur 12." },
      },
      costBefore: 5.00,
      costAfter: 0.05,
    },
    practice: {
      instructions: { fr: "Cette requête tourne sur le dashboard du Head of Growth, 24x/jour. Elle coûte actuellement $8.50/exécution. Réécris-la pour passer sous $0.30. Tu as besoin de : la date, le canal d'acquisition, le nombre de sessions, le nombre de conversions." },
      businessContext: { fr: "$8.50 × 24h × 30j = $6 120/mois pour ce seul rapport. Ton manager t'a dit : \"Si tu passes sous $200/mois, je te propose une augmentation à la revue annuelle.\"" },
      starterCode: `-- Requête actuelle (coût : $8.50/exec)\nSELECT *\nFROM sessions s\nJOIN orders o ON s.session_id = o.session_id\nWHERE s.created_at >= CURRENT_DATE - 30`,
      hints: [
        { fr: "Liste d'abord les 4 colonnes dont tu as besoin. Écris-les avant de taper SELECT." },
        { fr: "N'oublie pas : sessions ET orders ont des _PARTITIONDATE. Filtre les deux." },
        { fr: "Pour le JOIN, tu n'as besoin que des colonnes de jointure + les colonnes de résultat." },
      ],
      mentorContext: { fr: "L'élève doit éliminer SELECT * et ajouter des filtres de partition." },
      validationRules: [
        { type: 'cost_under', value: 0.30, errorMessage: { fr: "Encore trop cher. As-tu filtré les partitions des deux tables ?" } },
        { type: 'sql_score', value: 75, errorMessage: { fr: "Score insuffisant. Vérifie que tu n'as plus de SELECT *." } },
      ],
    },
    roiDebrief: {
      savingsPercent: 94.1,
      monthlySavingsUSD: 5751,
      annualSavingsUSD: 69012,
      careerImpactStatement: { fr: "Supprimer SELECT * de tous tes rapports est souvent la première chose qu'un senior data engineer fait quand il rejoint une équipe. C'est visible, mesurable, et appréciable." },
      interviewTalkingPoint: { fr: '"En rejoignant l\'équipe, j\'ai audité les 15 rapports récurrents et supprimé les SELECT *. Résultat : -94% sur la facture BigQuery, soit $69k économisés la première année."' },
      nextLessonTeaser: { fr: "Leçon 3 : le partitionnement BigQuery. Comment aller encore plus loin et diviser les coûts par 100 avec une seule ligne ajoutée." },
    },
  },
  {
    id: 'biz-001',
    trackId: 'business-analytics',
    order: 1,
    title: { fr: 'Le funnel de conversion : lire les chiffres comme un pro' },
    type: 'business_metrics',
    estimatedMinutes: 10,
    xpReward: { business: 60, sql: 20 },
    isPremium: false,
    businessAlert: {
      urgency: 'critical',
      trigger: { fr: "Le taux de conversion de ShopStream a chuté de 2.34% à 1.80% cette semaine. -23%." },
      financialImpact: { fr: "À 50 000 sessions/jour et panier moyen $45 : la baisse représente $243 000 de revenu manqué par mois." },
      costOfIgnorance: { fr: "Un data analyst qui ne sait pas lire un funnel ne peut pas diagnostiquer une anomalie. Résultat : la cause reste inconnue, la perte continue." },
      slackMessage: {
        author: 'Marie Dupont', role: 'Head of Marketing', avatar: 'MD', time: '09:14',
        content: { fr: "@data-analyst notre taux de conversion a chuté de 23% depuis lundi. Board meeting dans 2h. J'ai besoin d'un diagnostic avec des chiffres." },
      },
    },
    whyItMatters: {
      businessLogic: { fr: "Un funnel de conversion mesure à quelle étape les utilisateurs abandonnent. Chaque point de pourcentage perdu = des milliers d'euros de revenu. Le data analyst est la seule personne capable de dire POURQUOI — c'est son rôle critique." },
      realWorldExample: { fr: "Chez un e-commerce B2C : une baisse de 0.5% du taux de conversion coûte $180k/mois. En 45 minutes d'analyse SQL, l'équipe data a identifié que la baisse était 100% sur mobile et 100% depuis un déploiement lundi matin." },
      proVsJunior: {
        junior: { fr: 'Regarde le taux global et dit "ça a baissé". Ne segmente pas. Ne trouve pas la cause.' },
        pro: { fr: "Segmente par device, source, pays, heure. Identifie la cohorte impactée. Remonte à l'événement déclencheur." },
      },
    },
    concept: {
      headline: { fr: 'Taux de conversion = Orders ÷ Sessions × 100' },
      explanation: { fr: "Simple à calculer, puissant à segmenter. La valeur globale ne dit rien. La valeur par device, source, ou cohorte dit tout. Un bon data analyst passe 80% du temps à segmenter, 20% à calculer." },
      beforeExample: {
        language: 'sql',
        code: `-- Ce que fait le junior : un seul chiffre\nSELECT\n  COUNT(DISTINCT o.order_id) / COUNT(DISTINCT s.session_id) * 100\n  AS conversion_rate\nFROM sessions s\nLEFT JOIN orders o ON s.session_id = o.session_id`,
        explanation: { fr: "Ce chiffre dit \"2.1%\". Il ne dit pas pourquoi c'est en baisse ni où." },
      },
      afterExample: {
        language: 'sql',
        code: `-- Ce que fait le pro : segmenté par device et date\nSELECT\n  DATE(s.created_at)            AS date,\n  s.device_type,\n  COUNT(DISTINCT s.session_id)  AS sessions,\n  COUNT(DISTINCT o.order_id)    AS orders,\n  ROUND(\n    COUNT(DISTINCT o.order_id) /\n    COUNT(DISTINCT s.session_id) * 100, 2\n  ) AS conversion_rate\nFROM sessions s\nLEFT JOIN orders o ON s.session_id = o.session_id\nWHERE _PARTITIONDATE >= CURRENT_DATE - 14\nGROUP BY 1, 2\nORDER BY 1 DESC, 2`,
        explanation: { fr: "Ce résultat montre que mobile est passé de 2.1% à 0.8% lundi. Desktop est stable. La cause est immédiatement identifiable." },
      },
      costBefore: 0,
      costAfter: 0,
    },
    practice: {
      instructions: { fr: "Le Head of Marketing attend ton diagnostic dans 45 minutes. Écris la requête SQL qui compare le taux de conversion par device_type et par source de trafic sur les 14 derniers jours." },
      businessContext: { fr: "Chaque minute compte. La réunion board est dans 2h. Si tu arrives avec des chiffres segmentés, tu es le héros." },
      starterCode: `-- Tables disponibles : sessions, orders\n-- Colonnes sessions : session_id, device_type, source, created_at, _PARTITIONDATE\n-- Colonnes orders : order_id, session_id, amount, created_at\nSELECT`,
      hints: [
        { fr: "Commence par les dimensions : quoi segmenter ? device_type et source sont tes premières hypothèses." },
        { fr: "Pour comparer dans le temps, GROUP BY DATE(created_at) + la dimension." },
        { fr: "Si tu vois une baisse sur un seul segment depuis une date précise, c'est probablement là." },
      ],
      mentorContext: { fr: "L'élève doit écrire une requête de segmentation funnel." },
      validationRules: [
        { type: 'contains_keyword', value: 'device_type', errorMessage: { fr: "Pense à segmenter par device_type." } },
        { type: 'contains_keyword', value: 'GROUP BY', errorMessage: { fr: "Il te faut un GROUP BY pour segmenter les résultats." } },
      ],
    },
    roiDebrief: {
      savingsPercent: 0,
      monthlySavingsUSD: 243000,
      annualSavingsUSD: 2916000,
      careerImpactStatement: { fr: "Diagnostiquer une anomalie de conversion en moins d'une heure est l'une des compétences les plus valorisées en entretien data." },
      interviewTalkingPoint: { fr: '"J\'ai diagnostiqué une baisse de conversion de 23% en identifiant qu\'elle était isolée sur mobile depuis un déploiement du lundi matin. Le rollback a été décidé dans les 30 minutes suivant mon analyse."' },
      nextLessonTeaser: { fr: "Leçon 2 : CAC, LTV et churn — les 3 métriques que chaque data analyst doit pouvoir calculer de mémoire." },
    },
  },
]

export function getLessonsForTrack(trackId: string): Lesson[] {
  return LESSONS.filter(l => l.trackId === trackId).sort((a, b) => a.order - b.order)
}

export function getLesson(lessonId: string): Lesson | undefined {
  return LESSONS.find(l => l.id === lessonId)
}
