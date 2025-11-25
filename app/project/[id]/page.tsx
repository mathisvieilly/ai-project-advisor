'use client';

import Link from 'next/link';
import { getProjectById, generateBoilerplate, Project } from '../../../utils/actions';
import { useEffect, useState, use } from 'react';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import {
    ArrowLeftIcon,
    CogIcon,
    CalendarIcon,
    DocumentTextIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProject() {
            try {
                const projectData = await getProjectById(id);
                setProject(projectData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setIsLoading(false);
            }
        }

        loadProject();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="p-8 text-center bg-content1">
                    <CardBody>
                        <div className="text-6xl mb-4">⏳</div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Chargement de l'analyse...
                        </h3>
                        <p className="text-default-600">
                            Nous récupérons les détails de votre projet
                        </p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="p-8 text-center bg-content1">
                    <CardBody>
                        <div className="text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Projet non trouvé
                        </h3>
                        <p className="text-default-600 mb-4">
                            {error || "Le projet demandé n'existe pas."}
                        </p>
                        <Link href="/dashboard">
                            <Button color="primary">
                                Retour au tableau de bord
                            </Button>
                        </Link>
                    </CardBody>
                </Card>
            </div>
        );
    }

    async function handleGenerateBoilerplate(formData: FormData) {
        const result = await generateBoilerplate(id);
        console.log('Boilerplate généré:', result);
        // Pour l'instant, on log juste le résultat
        // TODO: Afficher un message à l'utilisateur
    }

    const sections = [
        { key: 'businessModel', title: 'Modèle économique et pricing', icon: '💰' },
        { key: 'marketAnalysis', title: 'Étude de marché', icon: '📊' },
        { key: 'swotAnalysis', title: 'Analyse SWOT', icon: '🎯' },
        { key: 'competitorsAnalysis', title: 'Analyse des concurrents', icon: '🏢' },
        { key: 'keyFeatures', title: 'Fonctionnalités phares', icon: '⚡' },
        { key: 'strengthsWeaknesses', title: 'Forces et faiblesses', icon: '⚖️' },
        { key: 'recommendedPlatforms', title: 'Plateformes recommandées', icon: '🖥️' },
        { key: 'boilerplateInstructions', title: 'Instructions de boilerplate', icon: '🔧' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center text-primary hover:text-primary-700 text-sm font-medium mb-6 transition-colors"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Retour au tableau de bord
                            </Link>
                            <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                                {project.analysis.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-default-600">
                                    <CalendarIcon className="h-4 w-4" />
                                    Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                <Chip
                                    color="success"
                                    variant="flat"
                                    size="sm"
                                    startContent={<SparklesIcon className="h-3 w-3" />}
                                >
                                    Analysé par IA
                                </Chip>
                            </div>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <form action={handleGenerateBoilerplate}>
                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant="solid"
                                    size="lg"
                                    startContent={<CogIcon className="h-5 w-5" />}
                                    className="font-semibold shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    Générer le boilerplate
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Description Card */}
                    <Card className="mt-8 shadow-xl border-0 bg-content1/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-default-100 rounded-xl">
                                    <DocumentTextIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Description du projet</h2>
                                    <p className="text-default-600">Votre idée originale</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div className="bg-default-50 p-6 rounded-xl border-l-4 border-primary">
                                <p className="text-default-700 leading-relaxed text-lg italic">
                                    "{project.analysis.description}"
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Sections d'analyse */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {sections.map((section) => {
                        const content = project.analysis[section.key as keyof typeof project.analysis];

                        // Fonction pour convertir les objets en texte lisible
                        function formatContent(content: any): string {
                            if (typeof content === 'string') {
                                return content;
                            }

                            if (Array.isArray(content)) {
                                return content.map((item, index) => {
                                    if (typeof item === 'string') {
                                        return `${index + 1}. ${item}`;
                                    }
                                    if (typeof item === 'object') {
                                        const entries = Object.entries(item);
                                        return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
                                    }
                                    return String(item);
                                }).join('\n');
                            }

                            if (typeof content === 'object' && content !== null) {
                                const result: string[] = [];

                                Object.entries(content).forEach(([key, value]) => {
                                    if (key === 'tiers' && Array.isArray(value)) {
                                        result.push('**Tiers de prix:**');
                                        value.forEach((tier: any, index: number) => {
                                            result.push(`  ${index + 1}. ${tier.name} - ${tier.price}`);
                                            result.push(`     ${tier.features}`);
                                        });
                                    } else if (Array.isArray(value)) {
                                        result.push(`**${key}:**`);
                                        value.forEach((item, index) => {
                                            result.push(`  ${index + 1}. ${item}`);
                                        });
                                    } else if (typeof value === 'object' && value !== null) {
                                        result.push(`**${key}:**`);
                                        Object.entries(value).forEach(([subKey, subValue]) => {
                                            result.push(`  ${subKey}: ${subValue}`);
                                        });
                                    } else {
                                        result.push(`${key}: ${value}`);
                                    }
                                });

                                return result.join('\n');
                            }

                            return String(content);
                        }

                        const formattedContent = formatContent(content);

                        return (
                            <Card key={section.key} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300 bg-content1">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-default-100 rounded-lg">
                                            <span className="text-xl">{section.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {section.title}
                                            </h3>
                                            <Chip
                                                color="primary"
                                                variant="flat"
                                                size="sm"
                                                className="mt-1"
                                            >
                                                <SparklesIcon className="h-3 w-3 mr-1" />
                                                IA Généré
                                            </Chip>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody className="pt-0">
                                    <div className="prose prose-sm max-w-none">
                                        {formattedContent.split('\n').map((paragraph, index) => (
                                            <div key={index} className="mb-3 text-default-700 leading-relaxed whitespace-pre-line text-sm">
                                                {paragraph.startsWith('**') && paragraph.endsWith(':**') ? (
                                                    <div className="font-semibold text-foreground mt-4 mb-2 text-base">
                                                        {paragraph.slice(2, -2)}
                                                    </div>
                                                ) : paragraph.startsWith('  ') ? (
                                                    <div className="ml-4 text-default-600">
                                                        {paragraph.trim()}
                                                    </div>
                                                ) : (
                                                    paragraph
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>

                {/* Footer avec actions */}
                <div className="mt-12 flex justify-center gap-4">
                    <Link href="/dashboard">
                        <Button
                            variant="bordered"
                            color="primary"
                            size="lg"
                            startContent={<ArrowLeftIcon className="h-5 w-5" />}
                            className="font-semibold"
                        >
                            Retour au tableau de bord
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button
                            color="primary"
                            size="lg"
                            startContent={<DocumentTextIcon className="h-5 w-5" />}
                            className="font-semibold"
                        >
                            Créer un nouveau projet
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
