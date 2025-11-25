'use server';

import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { generateProjectAnalysis, type ProjectAnalysis } from './ai';
import { saveJSON, readJSON, listProjectFiles, getProjectFilePath } from './fileStorage';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Project {
    id: string;
    createdAt: string;
    status: 'pending' | 'generating' | 'completed' | 'error';
    analysis: ProjectAnalysis | null;
    error?: string;
}

/**
 * Crée un nouveau projet immédiatement (sans attendre l'IA)
 */
export async function createProject(formData: FormData): Promise<Project> {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    // Validation basique
    if (!name?.trim() || !description?.trim()) {
        throw new Error('Le nom et la description sont requis');
    }

    if (name.length < 3 || description.length < 10) {
        throw new Error('Le nom doit faire au moins 3 caractères et la description au moins 10 caractères');
    }

    try {
        // Créer l'objet projet avec statut "pending"
        const project: Project = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            analysis: {
                name: name.trim(),
                description: description.trim(),
                businessModel: { revenueStreams: [], pricingStrategy: { tiers: [] } },
                marketAnalysis: { marketSize: '', trends: [], opportunities: [] },
                swotAnalysis: { Forces: [], Faiblesses: [], Opportunités: [], Menaces: [] },
                competitorsAnalysis: { mainCompetitors: [], positioning: '' },
                keyFeatures: [],
                strengthsWeaknesses: { forces: [], faiblesses: [] },
                recommendedPlatforms: { Web: { justification: '' }, Mobile: { justification: '' }, Desktop: { justification: '' } },
                boilerplateInstructions: { setup: '', backend: '', deployment: '', versionControl: '' }
            }
        };

        // Sauvegarder immédiatement
        const filePath = getProjectFilePath(project.id);
        await saveJSON(filePath, project);

        // Lancer la génération IA en arrière-plan
        generateProjectAnalysisAsync(project.id, name.trim(), description.trim());

        return project;
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        throw new Error(`Erreur lors de la création du projet: ${error}`);
    }
}

/**
 * Génère l'analyse IA en arrière-plan pour un projet existant
 */
async function generateProjectAnalysisAsync(projectId: string, name: string, description: string) {
    try {
        // Marquer comme en cours de génération
        await updateProjectStatus(projectId, 'generating');

        // Générer l'analyse via IA
        const analysis = await generateProjectAnalysis(name, description);

        // Mettre à jour le projet avec l'analyse complète
        await updateProjectAnalysis(projectId, analysis);
        await updateProjectStatus(projectId, 'completed');

        console.log(`Analyse IA terminée pour le projet ${projectId}`);
    } catch (error) {
        console.error(`Erreur lors de la génération IA pour le projet ${projectId}:`, error);
        await updateProjectStatus(projectId, 'error', (error as Error).message);
    }
}

/**
 * Met à jour le statut d'un projet
 */
async function updateProjectStatus(projectId: string, status: Project['status'], error?: string) {
    try {
        const filePath = getProjectFilePath(projectId);
        const project = await readJSON<Project>(filePath);

        project.status = status;
        if (error) {
            project.error = error;
        }

        await saveJSON(filePath, project);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du statut du projet ${projectId}:`, error);
    }
}

/**
 * Met à jour l'analyse d'un projet
 */
async function updateProjectAnalysis(projectId: string, analysis: ProjectAnalysis) {
    try {
        const filePath = getProjectFilePath(projectId);
        const project = await readJSON<Project>(filePath);

        project.analysis = analysis;
        await saveJSON(filePath, project);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'analyse du projet ${projectId}:`, error);
    }
}

/**
 * Récupère tous les projets
 */
export async function getProjects(): Promise<Project[]> {
    try {
        const filePaths = await listProjectFiles();
        const projects: Project[] = [];

        for (const filePath of filePaths) {
            try {
                const project = await readJSON<Project>(filePath);

                // Migration automatique : ajouter le statut aux anciens projets
                if (!project.status) {
                    project.status = 'completed';
                    if (!project.analysis) {
                        project.analysis = null;
                    }
                    // Sauvegarder la migration
                    await saveJSON(filePath, project);
                }

                projects.push(project);
            } catch (error) {
                console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
                // Continuer avec les autres fichiers
            }
        }

        // Trier par date de création (plus récent en premier)
        return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        throw new Error('Erreur lors de la récupération des projets');
    }
}

/**
 * Récupère un projet par son ID
 */
export async function getProjectById(id: string): Promise<Project> {
    try {
        const filePath = getProjectFilePath(id);
        return await readJSON<Project>(filePath);
    } catch (error) {
        if ((error as Error).message.includes('non trouvé')) {
            throw new Error('Projet non trouvé');
        }
        throw new Error(`Erreur lors de la récupération du projet: ${error}`);
    }
}

/**
 * Régénère une section spécifique d'un projet avec l'IA
 */
export async function regenerateSection(
    projectId: string,
    sectionKey: keyof ProjectAnalysis,
    userPrompt: string
): Promise<void> {
    try {
        const project = await getProjectById(projectId);

        if (!project.analysis) {
            throw new Error('Analyse non disponible pour ce projet');
        }

        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY n\'est pas configurée');
        }

        // Créer un prompt spécifique pour régénérer cette section
        const sectionPrompt = `
Régénère UNIQUEMENT la section "${sectionKey}" pour ce projet.

Nom du projet: ${project.analysis.name}
Description originale: ${project.analysis.description}

Section à régénérer: ${sectionKey}
Prompt utilisateur: ${userPrompt}

Voici la structure JSON attendue pour cette section :
${getSectionStructure(sectionKey)}

IMPORTANT :
- Respecte EXACTEMENT cette structure JSON
- Toutes les phrases doivent commencer par une MAJUSCULE
- Sois concis mais complet
- Fournis uniquement le JSON de la section, rien d'autre
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `Tu es un expert en analyse business. Tu dois régénérer une section spécifique en gardant exactement la même structure JSON.`,
                },
                {
                    role: 'user',
                    content: sectionPrompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1500,
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

        const newSectionData = JSON.parse(jsonMatch[0]);

        // Mettre à jour la section dans le projet
        await updateProjectSection(projectId, sectionKey, newSectionData);

        console.log(`Section ${sectionKey} régénérée pour le projet ${projectId}`);
    } catch (error) {
        console.error(`Erreur lors de la régénération de la section ${sectionKey}:`, error);
        throw new Error(`Erreur lors de la régénération: ${error}`);
    }
}

/**
 * Met à jour une section spécifique d'un projet
 */
async function updateProjectSection(
    projectId: string,
    sectionKey: keyof ProjectAnalysis,
    newSectionData: any
) {
    try {
        const filePath = getProjectFilePath(projectId);
        const project = await readJSON<Project>(filePath);

        if (!project.analysis) {
            throw new Error('Analyse non disponible');
        }

        // Mettre à jour la section spécifique
        (project.analysis as any)[sectionKey] = newSectionData;

        await saveJSON(filePath, project);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la section ${sectionKey}:`, error);
        throw error;
    }
}

/**
 * Retourne la structure JSON attendue pour une section donnée
 */
function getSectionStructure(sectionKey: keyof ProjectAnalysis): string {
    const structures: Record<string, string> = {
        businessModel: `{
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
}`,
        marketAnalysis: `{
  "marketSize": "Taille du marché avec chiffres",
  "trends": ["tendance1", "tendance2", "tendance3"],
  "opportunities": ["opportunité1", "opportunité2"]
}`,
        swotAnalysis: `{
  "Forces": ["force1", "force2", "force3"],
  "Faiblesses": ["faiblesse1", "faiblesse2"],
  "Opportunités": ["opportunité1", "opportunité2", "opportunité3"],
  "Menaces": ["menace1", "menace2", "menace3"]
}`,
        competitorsAnalysis: `{
  "mainCompetitors": [
    {
      "name": "Nom concurrent",
      "strengths": ["force1", "force2"],
      "weaknesses": ["faiblesse1", "faiblesse2"]
    }
  ],
  "positioning": "Positionnement stratégique du projet"
}`,
        keyFeatures: `[
  "Fonctionnalité principale 1",
  "Fonctionnalité principale 2",
  "Fonctionnalité principale 3",
  "Fonctionnalité principale 4"
]`,
        strengthsWeaknesses: `{
  "forces": ["Force produit1", "Force produit2"],
  "faiblesses": ["Faiblesse produit1", "Faiblesse produit2"]
}`,
        recommendedPlatforms: `{
  "Web": {"justification": "Raison web"},
  "Mobile": {"justification": "Raison mobile"},
  "Desktop": {"justification": "Raison desktop"}
}`,
        boilerplateInstructions: `{
  "setup": "Instructions setup",
  "backend": "Instructions backend",
  "deployment": "Instructions déploiement",
  "versionControl": "Instructions version control"
}`
    };

    return structures[sectionKey as string] || '{}';
}

/**
 * Génère le boilerplate pour un projet (fonction placeholder)
 */
export async function generateBoilerplate(projectId: string): Promise<string> {
    try {
        const project = await getProjectById(projectId);

        if (!project.analysis) {
            throw new Error('Analyse non disponible pour ce projet');
        }

        // Simulation de génération de boilerplate
        // Dans une vraie implémentation, cela pourrait appeler un script ou une API
        const result = `Boilerplate généré localement pour "${project.analysis.name}" à l'emplacement /workspaces/${project.analysis.name.toLowerCase().replace(/\s+/g, '-')}`;

        console.log(`Boilerplate simulé pour le projet ${projectId}: ${result}`);

        return result;
    } catch (error) {
        console.error('Erreur lors de la génération du boilerplate:', error);
        throw new Error(`Erreur lors de la génération du boilerplate: ${error}`);
    }
}
