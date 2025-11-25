import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface ProjectAnalysis {
  name: string;
  description: string;
  businessModel: {
    revenueStreams: string[];
    pricingStrategy: {
      tiers: Array<{
        name: string;
        price: string;
        features: string[];
      }>;
    };
  };
  marketAnalysis: {
    marketSize: string;
    trends: string[];
    opportunities: string[];
  };
  swotAnalysis: {
    Forces: string[];
    Faiblesses: string[];
    Opportunités: string[];
    Menaces: string[];
  };
  competitorsAnalysis: {
    mainCompetitors: Array<{
      name: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    positioning: string;
  };
  keyFeatures: string[];
  strengthsWeaknesses: {
    forces: string[];
    faiblesses: string[];
  };
  recommendedPlatforms: {
    Web: { justification: string };
    Mobile: { justification: string };
    Desktop: { justification: string };
  };
  boilerplateInstructions: {
    setup: string;
    backend: string;
    deployment: string;
    versionControl: string;
  };
}

/**
 * Génère une analyse complète du projet via IA
 */
export async function generateProjectAnalysis(
    name: string,
    description: string
): Promise<ProjectAnalysis> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY n\'est pas configurée');
    }

    const prompt = `
Analyse ce projet et fournis une analyse structurée complète en JSON.

Nom du projet: ${name}
Description: ${description}

Génère exactement cette structure JSON (respecte les clés et types) :

{
  "name": "nom exact du projet",
  "description": "description exacte du projet",
  "businessModel": {
    "revenueStreams": ["source1", "source2", "source3"],
    "pricingStrategy": {
      "tiers": [
        {
          "name": "Nom du plan",
          "price": "Prix (ex: 29€ par mois)",
          "features": ["fonctionnalité1", "fonctionnalité2"]
        }
      ]
    }
  },
  "marketAnalysis": {
    "marketSize": "Taille du marché avec chiffres",
    "trends": ["tendance1", "tendance2", "tendance3"],
    "opportunities": ["opportunité1", "opportunité2"]
  },
  "swotAnalysis": {
    "Forces": ["force1", "force2", "force3"],
    "Faiblesses": ["faiblesse1", "faiblesse2"],
    "Opportunités": ["opportunité1", "opportunité2", "opportunité3"],
    "Menaces": ["menace1", "menace2", "menace3"]
  },
  "competitorsAnalysis": {
    "mainCompetitors": [
      {
        "name": "Nom concurrent",
        "strengths": ["force1", "force2"],
        "weaknesses": ["faiblesse1", "faiblesse2"]
      }
    ],
    "positioning": "Positionnement stratégique du projet"
  },
  "keyFeatures": ["fonctionnalité1", "fonctionnalité2", "fonctionnalité3"],
  "strengthsWeaknesses": {
    "forces": ["force produit1", "force produit2"],
    "faiblesses": ["faiblesse produit1", "faiblesse produit2"]
  },
  "recommendedPlatforms": {
    "Web": {"justification": "Raison web"},
    "Mobile": {"justification": "Raison mobile"},
    "Desktop": {"justification": "Raison desktop"}
  },
  "boilerplateInstructions": {
    "setup": "Instructions setup",
    "backend": "Instructions backend",
    "deployment": "Instructions déploiement",
    "versionControl": "Instructions version control"
  }
}

Sois concis mais complet. Fournis uniquement du JSON valide.
`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Tu es un analyste business expert. Fournis des analyses structurées et actionnables en JSON pur.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('Aucune réponse reçue de l\'IA');
        }

        // Nettoyer la réponse pour extraire le JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Format JSON invalide dans la réponse de l\'IA');
        }

        const analysis = JSON.parse(jsonMatch[0]) as ProjectAnalysis;

        // Validation basique
        if (!analysis.name || !analysis.description) {
            throw new Error('Analyse incomplète reçue de l\'IA');
        }

        return analysis;
    } catch (error) {
        console.error('Erreur lors de la génération d\'analyse IA:', error);
        throw new Error(`Erreur IA: ${error}`);
    }
}
