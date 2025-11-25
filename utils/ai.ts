import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ProjectAnalysis {
  name: string;
  description: string;
  businessModel: string;
  marketAnalysis: string;
  swotAnalysis: string;
  competitorsAnalysis: string;
  keyFeatures: string;
  strengthsWeaknesses: string;
  recommendedPlatforms: string;
  boilerplateInstructions: string;
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
Analyse ce projet et fournis une analyse structurée complète :

Nom du projet: ${name}
Description: ${description}

Fournis une réponse structurée en JSON avec les sections suivantes (utilise exactement ces clés) :

{
  "name": "nom du projet",
  "description": "description du projet",
  "businessModel": "modèle économique et stratégie de pricing détaillée",
  "marketAnalysis": "analyse de marché complète avec taille, tendances, opportunités",
  "swotAnalysis": "analyse SWOT structurée (Forces, Faiblesses, Opportunités, Menaces)",
  "competitorsAnalysis": "analyse des concurrents principaux et positionnement",
  "keyFeatures": "liste des fonctionnalités phares et différenciateur",
  "strengthsWeaknesses": "forces et faiblesses du produit/service",
  "recommendedPlatforms": "plateformes recommandées (Web, Mobile, Desktop) avec justification",
  "boilerplateInstructions": "instructions détaillées pour générer le boilerplate initial"
}

Sois concis mais complet. Pas de texte décoratif, juste l'analyse pure.
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
