'use client';

import Link from 'next/link';
import { getProjects, Project } from '../../utils/actions';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { PlusIcon, EyeIcon, CogIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getProjects().then((data) => {
            setProjects(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-background">
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
                        <Link href="/">
                            <Button
                                color="primary"
                                size="lg"
                                startContent={<PlusIcon className="h-5 w-5" />}
                            >
                                Nouveau projet
                            </Button>
                        </Link>
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
                        {projects.map((project, index) => (
                            <Card
                                key={project.id}
                                className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg bg-content1/80 backdrop-blur-sm"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between w-full">
                                        <h3 className="text-xl font-bold text-foreground leading-tight flex-1 mr-3 line-clamp-2">
                                            {project.analysis.name}
                                        </h3>
                                        <Chip
                                            color="success"
                                            variant="flat"
                                            size="sm"
                                            className="shrink-0"
                                        >
                                            ✅ Analysé
                                        </Chip>
                                    </div>
                                </CardHeader>

                                <CardBody className="pt-0 pb-4">
                                    <p className="text-sm text-default-600 line-clamp-3 leading-relaxed mb-4">
                                        {project.analysis.description}
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
                                </CardBody>

                                <CardFooter className="pt-0">
                                    <div className="flex gap-3 w-full">
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
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
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
