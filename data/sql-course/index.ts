export interface ValidationRule {
  type: 'cost_under' | 'sql_score'
  value: number
  errorMessage: { fr: string }
}

export interface SqlModule {
  id: string
  order: number
  isPremium: boolean
  title: string
  estimatedMinutes: number
  xpReward: { sql?: number; business?: number; optimization?: number }
  businessAlert: {
    urgency: 'low' | 'medium' | 'high' | 'critical'
    slackMessage: { author: string; role: string; initials: string; color: string; time: string; text: string }
    financialImpact: string
  }
  concept: {
    headline: string
    explanation: string
    costWarning: string
    beforeCode: string
    afterCode: string
    costBefore: number
    costAfter: number
  }
  practice: {
    instructions: string
    businessContext: string
    starterCode: string
    validationRules: ValidationRule[]
    hints: Array<{ fr: string }>
  }
  roiDebrief: {
    savingsPercent: number
    monthlySavingsUSD: number
    interviewTalkingPoint: string
  }
}

export const SQL_MODULES: SqlModule[] = [

  // ─── MODULE 1 — SELECT · FROM · WHERE ────────────────────────────
  {
    id: 'sql-m01', order: 1, isPremium: false,
    title: 'SELECT · FROM · WHERE — extraire les bonnes données',
    estimatedMinutes: 10,
    xpReward: { sql: 40, business: 20 },

    businessAlert: {
      urgency: 'medium',
      slackMessage: {
        author: 'Sophie Chen', role: 'Head of Growth', initials: 'SC', color: '#10b981', time: '08:55',
        text: "@data-analyst combien de commandes on a eu hier ? J'en ai besoin pour ma réunion de 9h.",
      },
      financialImpact: "Sans cette réponse, la réunion se fait sans données. Décision à l'aveugle.",
    },

    concept: {
      headline: 'SELECT choisit les colonnes. FROM la table. WHERE filtre les lignes.',
      explanation: "C'est la structure de 90% des requêtes que tu écriras en entreprise. Trois mots, des dizaines de cas d'usage.",
      costWarning: 'SELECT * sur la table orders scanne 800 GB → $5.00. SELECT order_id, amount scanne 8 GB → $0.05.',
      beforeCode: `SELECT *\nFROM orders`,
      afterCode: `SELECT\n  COUNT(order_id) AS nb_orders,\n  ROUND(SUM(amount), 2) AS total_revenue\nFROM orders\nWHERE date = (CURRENT_DATE - INTERVAL '1' DAY)`,
      costBefore: 5.00, costAfter: 0.05,
    },

    practice: {
      instructions: "La Head of Growth a besoin du nombre de commandes et du CA total d'hier. Écris la requête la moins chère possible.",
      businessContext: "Ce chiffre sera affiché dans le morning brief envoyé à 60 managers. Il tourne automatiquement chaque matin.",
      starterCode: `-- Compte les commandes d'hier avec le CA total
-- Table : orders
-- Colonnes : order_id, amount, status, device_type, created_at, date

SELECT`,
      validationRules: [
        { type: 'cost_under', value: 0.10, errorMessage: { fr: 'Essaie de filtrer par date pour réduire le scan.' } },
        { type: 'sql_score',  value: 65,   errorMessage: { fr: 'Évite SELECT * et filtre la date.' } },
      ],
      hints: [
        { fr: "Quelles colonnes sont vraiment nécessaires pour 'nombre de commandes et CA total' ?" },
        { fr: "COUNT(order_id) compte les commandes. SUM(amount) donne le CA. Deux colonnes suffisent." },
        { fr: "Filtre sur la colonne `date` pour éviter le scan complet : WHERE date = (CURRENT_DATE - INTERVAL '1' DAY)" },
      ],
    },

    roiDebrief: {
      savingsPercent: 99,
      monthlySavingsUSD: 4455,
      interviewTalkingPoint: '"Je filtre systématiquement par date et cible les colonnes utiles. Sur ce seul rapport quotidien : $4 500/mois économisés."',
    },
  },

  // ─── MODULE 2 — ORDER BY · LIMIT · DISTINCT ──────────────────────
  {
    id: 'sql-m02', order: 2, isPremium: false,
    title: 'ORDER BY · LIMIT · DISTINCT — trier et limiter',
    estimatedMinutes: 8,
    xpReward: { sql: 35, business: 15 },

    businessAlert: {
      urgency: 'low',
      slackMessage: {
        author: 'Marie Dupont', role: 'Head of Marketing', initials: 'MD', color: '#8b5cf6', time: '10:22',
        text: 'Peux-tu me donner les 10 meilleures ventes de la semaine ? Pour mon rapport vendredi.',
      },
      financialImpact: 'Un rapport de ventes sans tri = 200 lignes dans le désordre. Illisible.',
    },

    concept: {
      headline: 'ORDER BY trie. LIMIT coupe. DISTINCT supprime les doublons.',
      explanation: "En entreprise, ORDER BY + LIMIT est dans chaque rapport de classement. Attention : LIMIT ne réduit pas le coût de scan — seul WHERE le fait.",
      costWarning: "LIMIT 10 ne scanne pas moins de données. BigQuery lit toute la table, puis coupe. La vraie économie vient du WHERE.",
      beforeCode: `SELECT *\nFROM orders\nORDER BY amount DESC`,
      afterCode: `SELECT order_id, amount, status, device_type\nFROM orders\nWHERE date >= (CURRENT_DATE - INTERVAL '7' DAY)\nORDER BY amount DESC\nLIMIT 10`,
      costBefore: 5.00, costAfter: 0.08,
    },

    practice: {
      instructions: 'Écris la requête qui retourne les 10 commandes avec le plus gros montant cette semaine.',
      businessContext: 'Marie veut ce classement chaque vendredi. Il sera copié dans son slide PowerPoint pour le comité de direction.',
      starterCode: `-- Top 10 commandes par montant cette semaine
SELECT`,
      validationRules: [
        { type: 'cost_under', value: 0.20, errorMessage: { fr: 'Filtre sur date pour limiter le scan.' } },
        { type: 'sql_score',  value: 60,   errorMessage: { fr: 'Utilise ORDER BY ... DESC LIMIT 10.' } },
      ],
      hints: [
        { fr: 'ORDER BY amount DESC trie du plus grand au plus petit.' },
        { fr: 'LIMIT 10 garde seulement les 10 premiers résultats.' },
        { fr: "Ajoute WHERE date >= (CURRENT_DATE - INTERVAL '7' DAY) pour ne scanner qu'une semaine." },
      ],
    },

    roiDebrief: {
      savingsPercent: 98,
      monthlySavingsUSD: 1548,
      interviewTalkingPoint: '"Je combine toujours WHERE sur la partition avec ORDER BY + LIMIT. Sur ce rapport hebdomadaire : -98% de coût."',
    },
  },

  // ─── MODULE 3 — COUNT · SUM · AVG ────────────────────────────────
  {
    id: 'sql-m03', order: 3, isPremium: false,
    title: 'COUNT · SUM · AVG — agréger pour décider',
    estimatedMinutes: 10,
    xpReward: { sql: 45, business: 30 },

    businessAlert: {
      urgency: 'high',
      slackMessage: {
        author: 'Lucas Martin', role: 'CTO', initials: 'LM', color: '#6366f1', time: '17:02',
        text: "Board demain matin. J'ai besoin du CA total de ce mois, du panier moyen et du nombre de commandes. ASAP.",
      },
      financialImpact: "Sans ces 3 chiffres, le board se réunit sans KPIs. Mauvaise image pour toute l'équipe.",
    },

    concept: {
      headline: 'COUNT compte. SUM additionne. AVG fait la moyenne.',
      explanation: "Les fonctions d'agrégation transforment des milliers de lignes en un seul chiffre. C'est le pain quotidien du data analyst.",
      costWarning: "Une requête d'agrégation bien écrite avec filtre de date scanne seulement les colonnes nécessaires.",
      beforeCode: `-- Junior : 3 requêtes séparées\nSELECT COUNT(*) FROM orders;\nSELECT SUM(amount) FROM orders;\nSELECT AVG(amount) FROM orders;`,
      afterCode: `SELECT\n  COUNT(DISTINCT order_id) AS nb_orders,\n  ROUND(SUM(amount), 2)    AS total_revenue,\n  ROUND(AVG(amount), 2)    AS avg_basket\nFROM orders\nWHERE date >= DATE_TRUNC('month', CURRENT_DATE)`,
      costBefore: 15.00, costAfter: 0.12,
    },

    practice: {
      instructions: "Calcule en une seule requête : nombre de commandes, CA total, panier moyen — pour le mois en cours uniquement.",
      businessContext: "Ces 3 KPIs ouvrent le board meeting. Ils doivent être justes, rapides, et le moins coûteux possible.",
      starterCode: `-- KPIs du mois en cours en une seule requête
SELECT`,
      validationRules: [
        { type: 'cost_under', value: 0.15, errorMessage: { fr: 'Filtre sur le mois courant.' } },
        { type: 'sql_score',  value: 70,   errorMessage: { fr: 'Utilise COUNT, SUM et AVG dans la même requête.' } },
      ],
      hints: [
        { fr: 'Tu peux mettre COUNT, SUM et AVG dans le même SELECT.' },
        { fr: "DATE_TRUNC('month', CURRENT_DATE) donne le premier jour du mois en cours." },
        { fr: 'ROUND(SUM(amount), 2) pour arrondir à 2 décimales.' },
      ],
    },

    roiDebrief: {
      savingsPercent: 99,
      monthlySavingsUSD: 3240,
      interviewTalkingPoint: '"Je regroupe les agrégations dans une seule requête avec filtre de partition. Passage de 3 requêtes à 1 : -99% de coût."',
    },
  },

  // ─── MODULE 4 — GROUP BY · HAVING ────────────────────────────────
  {
    id: 'sql-m04', order: 4, isPremium: false,
    title: 'GROUP BY · HAVING — segmenter pour trouver la cause',
    estimatedMinutes: 12,
    xpReward: { sql: 55, business: 40 },

    businessAlert: {
      urgency: 'critical',
      slackMessage: {
        author: 'Marie Dupont', role: 'Head of Marketing', initials: 'MD', color: '#8b5cf6', time: '09:14',
        text: "@data-analyst notre conversion a baissé de 23% depuis lundi. Board dans 2h. J'ai besoin de savoir POURQUOI.",
      },
      financialImpact: '$243 000 de revenu manqué par mois. Chaque heure sans réponse = $12 000 supplémentaires.',
    },

    concept: {
      headline: 'GROUP BY segmente. HAVING filtre les groupes.',
      explanation: "GROUP BY est l'outil du diagnostic. Un chiffre global dit 'ça baisse'. GROUP BY par device, pays, source dit 'ça baisse SUR MOBILE depuis lundi'.",
      costWarning: "GROUP BY ne change pas le coût de scan. Le coût vient toujours des colonnes sélectionnées et du filtre de date.",
      beforeCode: `-- Junior : un seul chiffre global\nSELECT AVG(converted::INTEGER) AS conv_rate\nFROM sessions`,
      afterCode: `SELECT\n  device_type,\n  COUNT(*) AS sessions,\n  SUM(converted::INTEGER) AS conversions,\n  ROUND(AVG(converted::INTEGER)*100, 2) AS conv_rate_pct\nFROM sessions\nWHERE date >= (CURRENT_DATE - INTERVAL '14' DAY)\nGROUP BY device_type\nHAVING COUNT(*) > 10\nORDER BY conv_rate_pct ASC`,
      costBefore: 9.60, costAfter: 0.09,
    },

    practice: {
      instructions: 'Calcule le taux de conversion par device_type ET par source sur les 14 derniers jours. Montre seulement les groupes avec plus de 5 sessions.',
      businessContext: "Marie a besoin de voir si la baisse est isolée sur un device ou une source de trafic. Cette segmentation est la clé du diagnostic.",
      starterCode: `-- Taux de conversion segmenté
-- Table : sessions
-- Colonnes : session_id, device_type, source, converted (boolean), date
SELECT`,
      validationRules: [
        { type: 'cost_under', value: 0.15, errorMessage: { fr: 'Filtre les 14 derniers jours avec WHERE date.' } },
        { type: 'sql_score',  value: 65,   errorMessage: { fr: 'Utilise GROUP BY et HAVING.' } },
      ],
      hints: [
        { fr: 'GROUP BY device_type, source pour segmenter sur deux dimensions.' },
        { fr: 'AVG(converted::INTEGER) * 100 donne le taux en pourcentage.' },
        { fr: 'HAVING COUNT(*) > 5 filtre les groupes trop petits (non représentatifs).' },
      ],
    },

    roiDebrief: {
      savingsPercent: 99,
      monthlySavingsUSD: 6912,
      interviewTalkingPoint: '"Quand une métrique baisse, je segmente immédiatement avec GROUP BY. En 45 minutes j\'ai isolé que la baisse était 100% sur mobile — décision de rollback prise en 30 minutes."',
    },
  },

  // ─── MODULE 5 — JOINs ────────────────────────────────────────────
  {
    id: 'sql-m05', order: 5, isPremium: false,
    title: 'JOINs — relier les tables sans exploser les coûts',
    estimatedMinutes: 14,
    xpReward: { sql: 60, optimization: 40 },

    businessAlert: {
      urgency: 'high',
      slackMessage: {
        author: 'Sophie Chen', role: 'Head of Growth', initials: 'SC', color: '#10b981', time: '11:30',
        text: 'On a besoin du taux de conversion sessions → commandes par source de trafic. Et vite.',
      },
      financialImpact: 'Sans JOIN entre sessions et orders, impossible de calculer un funnel. La décision budget marketing est bloquée.',
    },

    concept: {
      headline: 'INNER JOIN garde les correspondances. LEFT JOIN garde tout, même sans correspondance.',
      explanation: "En data analytics, LEFT JOIN est le plus courant : on veut toutes les sessions, qu'elles aient converti ou non. INNER JOIN exclut les sessions sans commande = taux de conversion faussé.",
      costWarning: "Un JOIN sans filtre de date sur les DEUX tables scanne les deux tables complètes. Filtre toujours les deux côtés.",
      beforeCode: `-- Junior : JOIN sans filtre → scan complet\nSELECT s.source, COUNT(o.order_id)\nFROM sessions s\nJOIN orders o ON s.session_id = o.session_id`,
      afterCode: `SELECT\n  s.source,\n  COUNT(DISTINCT s.session_id) AS sessions,\n  COUNT(DISTINCT o.order_id)  AS orders,\n  ROUND(\n    COUNT(DISTINCT o.order_id)::FLOAT\n    / COUNT(DISTINCT s.session_id) * 100, 2\n  ) AS conv_rate_pct\nFROM sessions s\nLEFT JOIN orders o\n  ON s.session_id = o.session_id\n  AND o.date >= (CURRENT_DATE - INTERVAL '7' DAY)\nWHERE s.date >= (CURRENT_DATE - INTERVAL '7' DAY)\nGROUP BY s.source\nORDER BY conv_rate_pct DESC`,
      costBefore: 12.00, costAfter: 0.18,
    },

    practice: {
      instructions: 'Calcule le taux de conversion sessions → commandes par source de trafic sur les 7 derniers jours. Filtre les deux tables.',
      businessContext: 'Sophie alloue le budget marketing la semaine prochaine. Ce chiffre détermine quelles sources reçoivent plus de budget.',
      starterCode: `-- Funnel sessions → commandes par source
-- Tables : sessions (s), orders (o)
-- JOIN sur session_id
SELECT`,
      validationRules: [
        { type: 'cost_under', value: 0.25, errorMessage: { fr: 'Filtre la date sur les deux tables.' } },
        { type: 'sql_score',  value: 65,   errorMessage: { fr: 'Utilise LEFT JOIN avec ON et filtre les deux tables.' } },
      ],
      hints: [
        { fr: 'LEFT JOIN pour garder toutes les sessions, même celles sans commande.' },
        { fr: 'Filtre WHERE date sur sessions ET AND date sur orders dans la condition JOIN.' },
        { fr: 'COUNT(DISTINCT order_id) / COUNT(DISTINCT session_id) = taux de conversion.' },
      ],
    },

    roiDebrief: {
      savingsPercent: 98,
      monthlySavingsUSD: 8424,
      interviewTalkingPoint: '"Je filtre systématiquement les deux tables d\'un JOIN. Passage de $12 à $0.18 par exécution. $8 400/mois économisés sur ce seul rapport."',
    },
  },

  // ─── MODULE 6 — WITH · CTE ───────────────────────────────────────
  {
    id: 'sql-m06', order: 6, isPremium: true,
    title: 'WITH · CTE — structurer les requêtes complexes',
    estimatedMinutes: 15,
    xpReward: { sql: 65, business: 30 },

    businessAlert: {
      urgency: 'medium',
      slackMessage: {
        author: 'Lucas Martin', role: 'CTO', initials: 'LM', color: '#6366f1', time: '14:15',
        text: "J'ai besoin d'un rapport funnel complet : sessions → commandes → CA par pays. Avec les taux à chaque étape.",
      },
      financialImpact: "Un funnel multi-étapes sans CTE = sous-requêtes imbriquées illisibles. Impossible à maintenir en équipe.",
    },

    concept: {
      headline: 'WITH crée des étapes nommées. Chaque CTE est une requête réutilisable.',
      explanation: "Les CTEs rendent les requêtes complexes lisibles. Au lieu d'une sous-requête imbriquée sur 3 niveaux, tu as 3 étapes nommées que n'importe quel collègue peut lire et modifier.",
      costWarning: "Les CTEs ne matérialisent pas les résultats par défaut — elles sont recalculées à chaque utilisation. Filtre la date dans chaque CTE individuellement.",
      beforeCode: `-- Illisible : sous-requêtes imbriquées\nSELECT * FROM (\n  SELECT * FROM (\n    SELECT * FROM orders\n  ) x\n) y`,
      afterCode: `WITH sessions_agg AS (\n  SELECT country, COUNT(*) AS sessions\n  FROM sessions\n  WHERE date >= (CURRENT_DATE - INTERVAL '30' DAY)\n  GROUP BY country\n),\norders_agg AS (\n  SELECT country, COUNT(*) AS orders,\n         SUM(amount) AS revenue\n  FROM orders\n  WHERE date >= (CURRENT_DATE - INTERVAL '30' DAY)\n  GROUP BY country\n)\nSELECT s.country, s.sessions, o.orders,\n  ROUND(o.revenue, 2) AS revenue,\n  ROUND(o.orders::FLOAT/s.sessions*100, 2) AS conv_rate\nFROM sessions_agg s\nLEFT JOIN orders_agg o USING (country)\nORDER BY o.revenue DESC`,
      costBefore: 18.00, costAfter: 0.22,
    },

    practice: {
      instructions: "Écris une requête avec 2 CTEs : une pour agréger les sessions par pays, une pour agréger les commandes par pays. Joins-les pour calculer le taux de conversion par pays.",
      businessContext: "Le CTO veut voir quel pays a le meilleur potentiel d'expansion. Ce rapport guide la décision d'investissement géographique.",
      starterCode: `-- Funnel par pays avec CTEs
WITH sessions_agg AS (
  -- Étape 1 : agréger les sessions par pays
  SELECT

),
orders_agg AS (
  -- Étape 2 : agréger les commandes par pays
  SELECT

)
-- Étape 3 : joindre et calculer
SELECT`,
      validationRules: [
        { type: 'cost_under', value: 0.30, errorMessage: { fr: 'Filtre les 30 derniers jours dans chaque CTE.' } },
        { type: 'sql_score',  value: 65,   errorMessage: { fr: 'Utilise WITH ... AS () pour les deux étapes.' } },
      ],
      hints: [
        { fr: "Chaque CTE est comme une table temporaire que tu peux utiliser dans le SELECT final." },
        { fr: "USING (country) dans le JOIN est plus concis que ON s.country = o.country." },
        { fr: "Filtre la date dans chaque CTE séparément pour optimiser." },
      ],
    },

    roiDebrief: {
      savingsPercent: 98,
      monthlySavingsUSD: 5832,
      interviewTalkingPoint: '"Je structure mes requêtes complexes avec des CTEs. Code lisible, maintenable par toute l\'équipe, et -98% de coût vs les sous-requêtes imbriquées."',
    },
  },

  // ─── MODULE 7 — WINDOW FUNCTIONS ─────────────────────────────────
  {
    id: 'sql-m07', order: 7, isPremium: true,
    title: 'ROW_NUMBER · LAG · LEAD — les window functions',
    estimatedMinutes: 16,
    xpReward: { sql: 70, business: 35 },

    businessAlert: {
      urgency: 'medium',
      slackMessage: {
        author: 'Marie Dupont', role: 'Head of Marketing', initials: 'MD', color: '#8b5cf6', time: '09:50',
        text: 'Besoin du CA de chaque jour + la variation vs J-1. En une seule requête si possible.',
      },
      financialImpact: "Sans window functions, ça prend 2 requêtes et une jointure complexe. Les window functions font ça en 3 lignes.",
    },

    concept: {
      headline: 'Les window functions calculent sur un voisinage sans regrouper les lignes.',
      explanation: "LAG(col) OVER (ORDER BY date) donne la valeur de la ligne précédente. ROW_NUMBER() numérote. LEAD() regarde en avant. Ce sont des fonctions de contexte : chaque ligne conserve son identité.",
      costWarning: "Les window functions ne changent pas le coût de scan. Toujours filtrer avec WHERE en amont.",
      beforeCode: `-- Junior : auto-jointure complexe et coûteuse\nSELECT a.date, a.rev, b.rev AS prev_rev\nFROM daily_rev a\nJOIN daily_rev b ON b.date = a.date - 1`,
      afterCode: `SELECT\n  date,\n  ROUND(SUM(amount), 2) AS revenue,\n  LAG(ROUND(SUM(amount),2))\n    OVER (ORDER BY date) AS prev_day,\n  ROUND(\n    (SUM(amount) - LAG(SUM(amount)) OVER (ORDER BY date))\n    / LAG(SUM(amount)) OVER (ORDER BY date) * 100, 1\n  ) AS pct_change\nFROM orders\nWHERE date >= (CURRENT_DATE - INTERVAL '14' DAY)\nGROUP BY date\nORDER BY date`,
      costBefore: 3.20, costAfter: 0.06,
    },

    practice: {
      instructions: 'Calcule le CA par jour sur les 14 derniers jours avec la variation en % vs J-1.',
      businessContext: 'Marie envoie ce graphique chaque matin à la direction. La variation % est le premier chiffre qu\'ils regardent.',
      starterCode: `-- CA quotidien + variation vs J-1
SELECT
  date,
  ROUND(SUM(amount), 2) AS revenue
  -- Ajoute le CA du jour précédent avec LAG
  -- Ajoute la variation en %
FROM orders
WHERE date >= (CURRENT_DATE - INTERVAL '14' DAY)
GROUP BY date
ORDER BY date`,
      validationRules: [
        { type: 'cost_under', value: 0.10, errorMessage: { fr: 'Filtre les 14 derniers jours.' } },
        { type: 'sql_score',  value: 60,   errorMessage: { fr: 'Utilise LAG() OVER (ORDER BY date).' } },
      ],
      hints: [
        { fr: 'LAG(valeur) OVER (ORDER BY date) donne la valeur de la ligne précédente.' },
        { fr: 'La variation % = (revenue - LAG(revenue)) / LAG(revenue) * 100.' },
        { fr: "Utilise ROUND(..., 1) pour arrondir à 1 décimale." },
      ],
    },

    roiDebrief: {
      savingsPercent: 98,
      monthlySavingsUSD: 2304,
      interviewTalkingPoint: '"Je remplace les auto-jointures complexes par des window functions. Code 3× plus court, lisible, et -98% de coût."',
    },
  },

  // ─── MODULE 8 — PARTITIONING ──────────────────────────────────────
  {
    id: 'sql-m08', order: 8, isPremium: true,
    title: 'Partitioning BigQuery — diviser les coûts par 100',
    estimatedMinutes: 15,
    xpReward: { sql: 50, optimization: 80 },

    businessAlert: {
      urgency: 'critical',
      slackMessage: {
        author: 'Thomas Bernard', role: 'CFO', initials: 'TB', color: '#ef4444', time: '08:47',
        text: "La facture BigQuery de novembre : $23 400. Budget prévu $5 000. Quelqu'un peut m'expliquer ? Board dans 2h.",
      },
      financialImpact: "$18 400 de dépassement. Le CFO bloque les dépenses data jusqu'à explication et plan de réduction.",
    },

    concept: {
      headline: 'Le partitioning divise la table en segments. Tu ne paies que le segment que tu lis.',
      explanation: "Une table partitionnée par date est découpée en tranches quotidiennes. Filtrer sur `date` (la colonne partition) lit seulement la tranche demandée — pas les 365 autres. C'est la technique n°1 de réduction des coûts BigQuery.",
      costWarning: "WHERE created_at = '2024-01-01' scanne TOUTE la table puis filtre en mémoire. WHERE date = '2024-01-01' scanne seulement 1/365 de la table.",
      beforeCode: `-- Filtre sur colonne normale → scan complet\nSELECT *\nFROM orders\nWHERE created_at >= '2024-11-01'`,
      afterCode: `-- Filtre sur partition → scan minimal\nSELECT\n  order_id, amount, status, device_type\nFROM orders\nWHERE date >= '2024-11-01'`,
      costBefore: 5.00, costAfter: 0.42,
    },

    practice: {
      instructions: "Réécris cette requête pour utiliser le filtre de partition (colonne `date`) au lieu de `created_at`. Élimine SELECT * et passe sous $0.50.",
      businessContext: "Ce rapport quotidien tourne 10×/jour. À $5.00 × 10 × 30j = $1 500/mois. Ton objectif : passer sous $150/mois grâce au partitioning.",
      starterCode: `-- Requête actuelle : $5.00 par exécution
SELECT *
FROM orders
WHERE created_at >= (CURRENT_DATE - INTERVAL '30' DAY)
ORDER BY created_at DESC`,
      validationRules: [
        { type: 'cost_under', value: 0.50, errorMessage: { fr: "Utilise la colonne `date` plutôt que `created_at`." } },
        { type: 'sql_score',  value: 70,   errorMessage: { fr: "Élimine SELECT * et utilise le filtre de partition." } },
      ],
      hints: [
        { fr: "Remplace `created_at` par `date` dans le WHERE." },
        { fr: "Élimine SELECT * et sélectionne seulement les colonnes utiles." },
        { fr: "ORDER BY date DESC (pas created_at) pour rester sur la partition." },
      ],
    },

    roiDebrief: {
      savingsPercent: 90,
      monthlySavingsUSD: 13500,
      interviewTalkingPoint: '"J\'ai audité les 15 requêtes les plus coûteuses et ajouté des filtres de partition. Résultat : -90% sur la facture BigQuery. $13 500/mois économisés."',
    },
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getSqlModule(id: string): SqlModule | undefined {
  return SQL_MODULES.find(m => m.id === id)
}

export function getNextModule(currentOrder: number): SqlModule | undefined {
  return SQL_MODULES.find(m => m.order === currentOrder + 1)
}

export const TRACK_META = {
  title: 'SQL & Coûts BigQuery',
  description: 'Maîtrise SQL en contexte réel. Tes requêtes tournent sur des données ShopStream avec coûts BigQuery simulés en temps réel.',
  totalModules: SQL_MODULES.length,
  totalXP: SQL_MODULES.reduce((s, m) => s + (m.xpReward.sql ?? 0) + (m.xpReward.business ?? 0) + (m.xpReward.optimization ?? 0), 0),
  freeModules: SQL_MODULES.filter(m => !m.isPremium).length,
}
