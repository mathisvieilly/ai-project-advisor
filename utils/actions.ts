'use server';

import { v4 as uuidv4 } from 'uuid';
import { generateProjectAnalysis, type ProjectAnalysis } from './ai';
import { saveJSON, readJSON, listProjectFiles, getProjectFilePath } from './fileStorage';

export interface Project {
  id: string;
  createdAt: string;
  analysis: ProjectAnalysis;
}

/**
 * Crée un nouveau projet avec analyse IA
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
    // Générer l'analyse via IA
    const analysis = await generateProjectAnalysis(name.trim(), description.trim());

    // Créer l'objet projet
    const project: Project = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      analysis,
    };

    // Sauvegarder dans un fichier JSON
    const filePath = getProjectFilePath(project.id);
    await saveJSON(filePath, project);

    return project;
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    throw new Error(`Erreur lors de la création du projet: ${error}`);
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
 * Génère le boilerplate pour un projet (fonction placeholder)
 */
export async function generateBoilerplate(projectId: string): Promise<string> {
  try {
    const project = await getProjectById(projectId);

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
