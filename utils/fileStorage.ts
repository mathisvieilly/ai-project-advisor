import { promises as fs } from 'fs';
import path from 'path';

const PROJECTS_DIR = path.join(process.cwd(), 'data', 'projects');

/**
 * Sauvegarde des données JSON dans un fichier
 */
export async function saveJSON(filePath: string, data: any): Promise<void> {
  try {
    // Créer le dossier si nécessaire
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // Écrire le fichier JSON
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Erreur lors de la sauvegarde du fichier ${filePath}: ${error}`);
  }
}

/**
 * Lit un fichier JSON et retourne les données parsées
 */
export async function readJSON<T = any>(filePath: string): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Fichier non trouvé: ${filePath}`);
    }
    throw new Error(`Erreur lors de la lecture du fichier ${filePath}: ${error}`);
  }
}

/**
 * Liste tous les fichiers de projets dans le dossier data/projects
 */
export async function listProjectFiles(): Promise<string[]> {
  try {
    // Créer le dossier s'il n'existe pas
    await fs.mkdir(PROJECTS_DIR, { recursive: true });

    const files = await fs.readdir(PROJECTS_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(PROJECTS_DIR, file));
  } catch (error) {
    throw new Error(`Erreur lors de la lecture du dossier projets: ${error}`);
  }
}

/**
 * Génère le chemin complet pour un fichier projet
 */
export function getProjectFilePath(projectId: string): string {
  return path.join(PROJECTS_DIR, `${projectId}.json`);
}
