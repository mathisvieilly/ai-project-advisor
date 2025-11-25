'use client';

import Link from 'next/link';
import { getProjects, createProject, Project } from '../../utils/actions';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Progress } from '@heroui/progress';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Input, Textarea } from '@heroui/input';
import { PlusIcon, EyeIcon, CogIcon, DocumentTextIcon, SparklesIcon, ClockIcon, ExclamationTriangleIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [creationError, setCreationError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadProjects = () => {
        getProjects().then((data) => {
            setProjects(data);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreateProject = async (formData: FormData) => {
        setIsCreatingProject(true);
        setCreationError(null);

        try {
            await createProject(formData);
            setIsModalOpen(false); // Fermer la modal
            loadProjects(); // Recharger les projets pour voir le nouveau
        } catch (err) {
            setCreationError((err as Error).message);
        } finally {
            setIsCreatingProject(false);
        }
    };

    // Rafraîchir automatiquement toutes les 3 secondes si il y a des projets en cours de génération
    useEffect(() => {
        if (!isLoading && projects.length > 0) {
            const hasGeneratingProjects = projects.some(p => p.status === 'generating' || p.status === 'pending');

            if (hasGeneratingProjects) {
                const interval = setInterval(() => {
                    loadProjects();
                }, 3000);

                return () => clearInterval(interval);
            }
        }
    }, [projects, isLoading]);

    return (
        <div className="min-h-screen bg-background">
            {/* Modal de création de projet */}
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <form action={handleCreateProject}>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <FolderIcon className="h-5 w-5 text-blue-600" />
                                    <span>Nouveau Projet</span>
                                </div>
                            </ModalHeader>
                            <ModalBody className="space-y-6">
                                <div className="space-y-4">
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        label="Nom du projet"
                                        placeholder="Mon super projet"
                                        labelPlacement="outside"
                                        isRequired
                                        minLength={3}
                                        size="lg"
                                        variant="bordered"
                                        startContent={
                                            <div className="text-default-400 text-sm">📝</div>
                                        }
                                    />

                                    <Textarea
                                        id="description"
                                        name="description"
                                        label="Description du projet"
                                        placeholder="Décrivez votre projet en détail, ses objectifs, son public cible, etc."
                                        labelPlacement="outside"
                                        isRequired
                                        minLength={10}
                                        minRows={4}
                                        size="lg"
                                        variant="bordered"
                                        startContent={
                                            <div className="text-default-400 text-sm mt-2">📋</div>
                                        }
                                    />
                                </div>

                                {creationError && (
                                    <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                                        <div className="text-sm text-danger">{creationError}</div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    color="primary"
                                    isLoading={isCreatingProject}
                                    startContent={!isCreatingProject && <SparklesIcon className="h-4 w-4" />}
                                >
                                    {isCreatingProject ? 'Création en cours...' : 'Créer le projet'}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground flex items-center gap-4">
                                <div className="p-3 bg-primary rounded-xl shadow-lg">
                                    <DocumentTextIcon className="h-8 w-8 text-primary-foreground" />
                                </div>
                                <span>Tableau de bord</span>
                            </h1>
                            <p className="mt-3 text-lg text-default-600">
                                Gérez vos projets analysés par IA
                            </p>
                        </div>
                        <Button
                            color="primary"
                            size="lg"
                            startContent={<PlusIcon className="h-5 w-5" />}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Nouveau projet
                        </Button>
                    </div>
                </div>

                {/* Projects Grid */}
                {isLoading ? (
                    <Card className="p-12 text-center border-0 shadow-lg bg-content1">
                        <CardBody>
                            <div className="text-6xl mb-4">⏳</div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Chargement de vos projets...
                            </h3>
                            <p className="text-default-600">
                                Nous récupérons vos analyses IA
                            </p>
                        </CardBody>
                    </Card>
                ) : projects.length === 0 ? (
                    <Card className="p-12 text-center border-0 shadow-lg bg-content1">
                        <CardBody>
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Aucun projet trouvé
                            </h3>
                            <p className="text-default-600 mb-6 max-w-md mx-auto">
                                Commencez par créer votre premier projet avec l&apos;intelligence artificielle pour obtenir une analyse complète.
                            </p>
                            <Link href="/">
                                <Button
                                    color="primary"
                                    size="lg"
                                    startContent={<PlusIcon className="h-5 w-5" />}
                                    className="font-semibold"
                                >
                                    Créer votre premier projet
                                </Button>
                            </Link>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.map((project, index) => {
                            const isGenerating = project.status === 'generating' || project.status === 'pending';
                            const hasError = project.status === 'error';
                            const isCompleted = project.status === 'completed';

                            return (
                                <Card
                                    key={project.id}
                                    className={`group transition-all duration-300 border-0 shadow-lg ${
                                        isGenerating
                                            ? 'bg-linear-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 animate-pulse'
                                            : hasError
                                            ? 'bg-linear-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20'
                                            : 'bg-content1/80 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-1'
                                    }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between w-full">
                                            <h3 className="text-xl font-bold text-foreground leading-tight flex-1 mr-3 line-clamp-2">
                                                {project.analysis?.name || 'Nouveau projet'}
                                            </h3>
                                            <Chip
                                                color={
                                                    isGenerating ? "warning" :
                                                    hasError ? "danger" :
                                                    "success"
                                                }
                                                variant="flat"
                                                size="sm"
                                                className="shrink-0"
                                            >
                                                {isGenerating && <div><ClockIcon className="h-3 w-3 mr-1" /> En cours</div>}
                                                {hasError && <><ExclamationTriangleIcon className="h-3 w-3 mr-1" /> Erreur</>}
                                                {isCompleted && <><SparklesIcon className="h-3 w-3 mr-1" /> Terminé</>}
                                            </Chip>
                                        </div>
                                    </CardHeader>

                                    <CardBody className="pt-0 pb-4">
                                        {isGenerating ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400">
                                                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                                    Analyse IA en cours...
                                                </div>
                                                <Progress
                                                    value={undefined}
                                                    size="sm"
                                                    color="primary"
                                                    className="w-full"
                                                    isIndeterminate
                                                />
                                                <p className="text-xs text-default-500 italic">
                                                    Cette analyse prend généralement 30-60 secondes
                                                </p>
                                            </div>
                                        ) : hasError ? (
                                            <div className="space-y-3">
                                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                    Erreur lors de la génération
                                                </p>
                                                <p className="text-xs text-default-600">
                                                    {project.error || 'Une erreur inconnue est survenue'}
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm text-default-600 line-clamp-3 leading-relaxed mb-4">
                                                    {project.analysis?.description}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-default-500">
                                                    <div className="w-4 h-4 bg-default-100 rounded-full flex items-center justify-center">
                                                        📅
                                                    </div>
                                                    {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </CardBody>

                                    <CardFooter className="pt-0">
                                        <div className="flex gap-3 w-full">
                                            {isCompleted ? (
                                                <>
                                                    <Link href={`/project/${project.id}`} className="flex-1">
                                                        <Button
                                                            variant="solid"
                                                            color="primary"
                                                            size="sm"
                                                            className="w-full font-semibold"
                                                            startContent={<EyeIcon className="h-4 w-4" />}
                                                        >
                                                            Voir l'analyse
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="bordered"
                                                        color="secondary"
                                                        size="sm"
                                                        className="shrink-0"
                                                        startContent={<CogIcon className="h-4 w-4" />}
                                                        onClick={() => {
                                                            // TODO: Implement boilerplate generation
                                                            alert('Fonction boilerplate à implémenter');
                                                        }}
                                                    >
                                                        Boilerplate
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="bordered"
                                                    color={hasError ? "danger" : "default"}
                                                    size="sm"
                                                    className="w-full"
                                                    disabled={!hasError}
                                                    startContent={hasError ? <ExclamationTriangleIcon className="h-4 w-4" /> : <ClockIcon className="h-4 w-4" />}
                                                >
                                                    {isGenerating ? 'Génération en cours...' : hasError ? 'Réessayer' : 'En attente'}
                                                </Button>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Stats Footer */}
                {projects.length > 0 && (
                    <div className="mt-16">
                        <Card className="bg-content1 border-0 shadow-xl">
                            <CardBody className="py-8">
                                <h3 className="text-center text-xl font-bold text-foreground mb-8">
                                    Statistiques de vos projets
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                    <div className="group">
                                        <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                                            {projects.length}
                                        </div>
                                        <div className="text-sm font-medium text-default-600 uppercase tracking-wide">
                                            Projets analysés
                                        </div>
                                        <div className="mt-2 text-xs text-default-500">
                                            Total créé
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="text-4xl font-bold text-secondary mb-2 group-hover:scale-110 transition-transform">
                                            {projects.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}
                                        </div>
                                        <div className="text-sm font-medium text-default-600 uppercase tracking-wide">
                                            Ce mois
                                        </div>
                                        <div className="mt-2 text-xs text-default-500">
                                            Nouveaux projets
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="text-4xl font-bold text-success mb-2 group-hover:scale-110 transition-transform">
                                            100%
                                        </div>
                                        <div className="text-sm font-medium text-default-600 uppercase tracking-wide">
                                            Taux de succès
                                        </div>
                                        <div className="mt-2 text-xs text-default-500">
                                            Analyses IA complètes
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
