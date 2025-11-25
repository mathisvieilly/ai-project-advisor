'use client';

import Link from 'next/link';
import { getProjectById, generateBoilerplate, Project } from '../../../utils/actions';
import { useEffect, useState, use } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Badge } from '@heroui/badge';
import { Divider } from '@heroui/divider';
import { Progress } from '@heroui/progress';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table';
import {
    ArrowLeftIcon,
    CogIcon,
    CalendarIcon,
    DocumentTextIcon,
    SparklesIcon,
    CheckIcon,
    StarIcon,
    BoltIcon,
    CurrencyEuroIcon,
    ChartBarIcon,
    TrophyIcon,
    ExclamationTriangleIcon,
    LightBulbIcon,
    BuildingOfficeIcon,
    CpuChipIcon,
    GlobeAltIcon,
    WrenchScrewdriverIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    MinusIcon,
    EyeIcon,
    EyeSlashIcon,
    PresentationChartBarIcon
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

                {/* Sections d'analyse avec design amélioré */}
                <div className="space-y-12">
                    {sections.map((section) => {
                        const content = project.analysis[section.key as keyof typeof project.analysis];

                        // Section SWOT - Design matriciel visuel
                        if (section.key === 'swotAnalysis' && typeof content === 'object' && content !== null) {
                            const swotData = content as any;
                            const strengths = swotData.Forces || [];
                            const weaknesses = swotData.Faiblesses || [];
                            const opportunities = swotData.Opportunités || [];
                            const threats = swotData.Menaces || [];

                            return (
                                <div key={section.key} className="space-y-6">
                                    {/* Header */}
                                    <Card className="shadow-xl border-0 bg-linear-to-r from-blue-500/10 to-purple-500/10">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-blue-500 rounded-full">
                                                    <PresentationChartBarIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground">
                                                        Analyse SWOT
                                                    </h2>
                                                    <p className="text-default-600">Forces, Faiblesses, Opportunités, Menaces</p>
                                                </div>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                                        <p>IA Généré</p>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    {/* Matrice SWOT */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Forces (Haut-Gauche) */}
                                        <Card className="shadow-lg border-0 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-500 rounded-full">
                                                        <ArrowTrendingUpIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                                                        Forces
                                                    </h3>
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-3">
                                                    {strengths.map((strength: string, index: number) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-content2/60 rounded-lg border border-green-200 dark:border-green-800">
                                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                                <span className="text-xs font-bold text-white">{index + 1}</span>
                                                            </div>
                                                            <span className="text-sm text-green-800 dark:text-green-200 font-medium">{strength}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>

                                        {/* Faiblesses (Haut-Droite) */}
                                        <Card className="shadow-lg border-0 bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-orange-500 rounded-full">
                                                        <ArrowTrendingDownIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300">
                                                        Faiblesses
                                                    </h3>
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-3">
                                                    {weaknesses.map((weakness: string, index: number) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-content2/60 rounded-lg border border-orange-200 dark:border-orange-800">
                                                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                                <span className="text-xs font-bold text-white">{index + 1}</span>
                                                            </div>
                                                            <span className="text-sm text-orange-800 dark:text-orange-200 font-medium">{weakness}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>

                                        {/* Opportunités (Bas-Gauche) */}
                                        <Card className="shadow-lg border-0 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500 rounded-full">
                                                        <LightBulbIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                                                        Opportunités
                                                    </h3>
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-3">
                                                    {opportunities.map((opportunity: string, index: number) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-content2/60 rounded-lg border border-blue-200 dark:border-blue-800">
                                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                                <span className="text-xs font-bold text-white">{index + 1}</span>
                                                            </div>
                                                            <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">{opportunity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>

                                        {/* Menaces (Bas-Droite) */}
                                        <Card className="shadow-lg border-0 bg-linear-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-red-500 rounded-full">
                                                        <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                                                        Menaces
                                                    </h3>
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-3">
                                                    {threats.map((threat: string, index: number) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-content2/60 rounded-lg border border-red-200 dark:border-red-800">
                                                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                                <span className="text-xs font-bold text-white">{index + 1}</span>
                                                            </div>
                                                            <span className="text-sm text-red-800 dark:text-red-200 font-medium">{threat}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    {/* Résumé visuel */}
                                    <Card className="shadow-lg border-0 bg-content1">
                                        <CardHeader>
                                            <h3 className="text-lg font-semibold text-foreground">Résumé de l'analyse</h3>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">{strengths.length}</div>
                                                    <div className="text-sm text-green-700 dark:text-green-300">Forces</div>
                                                </div>
                                                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-orange-600">{weaknesses.length}</div>
                                                    <div className="text-sm text-orange-700 dark:text-orange-300">Faiblesses</div>
                                                </div>
                                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">{opportunities.length}</div>
                                                    <div className="text-sm text-blue-700 dark:text-blue-300">Opportunités</div>
                                                </div>
                                                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-red-600">{threats.length}</div>
                                                    <div className="text-sm text-red-700 dark:text-red-300">Menaces</div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            );
                        }

                        // Section Business Model - Design amélioré
                        if (section.key === 'businessModel' && typeof content === 'object' && content !== null) {
                            const businessModelData = content as any;
                            const pricingTiers = businessModelData?.pricingStrategy?.tiers || [];
                            const revenueStreams = businessModelData?.revenueStreams || [];

                            return (
                                <div key={section.key} className="space-y-6">
                                    {/* Header */}
                                    <Card className="shadow-xl border-0 bg-linear-to-r from-green-500/10 to-emerald-500/10">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-green-500 rounded-full">
                                                    <CurrencyEuroIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground">
                                                        Modèle économique
                                                    </h2>
                                                    <p className="text-default-600">Stratégie de monétisation proposée</p>
                                                </div>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                                        <p>IA Généré</p>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    {/* Streams de revenus */}
                                    {revenueStreams.length > 0 && (
                                        <Card className="shadow-lg border-0 bg-content1">
                                            <CardHeader className="pb-3">
                                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                    <ChartBarIcon className="h-5 w-5" />
                                                    Sources de revenus identifiées
                                                </h3>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {revenueStreams.map((stream: string, index: number) => (
                                                        <div key={index} className="flex items-center gap-3 p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                                                <span className="text-sm font-bold text-white">€</span>
                                                            </div>
                                                            <span className="text-sm text-green-800 dark:text-green-200 font-medium">{stream}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}

                                    {/* Stratégie de pricing - Tableau */}
                                    {pricingTiers.length > 0 && (
                                        <Card className="shadow-lg border-0 bg-content1">
                                            <CardHeader className="pb-3">
                                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                    <BoltIcon className="h-5 w-5" />
                                                    Stratégie de tarification
                                                </h3>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-4">
                                                    {pricingTiers.map((tier: any, index: number) => (
                                                        <div key={tier.name} className="border border-default-200 dark:border-default-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-500' :
                                                                        index === 1 ? 'bg-purple-500' : 'bg-orange-500'
                                                                        }`}>
                                                                        <span className="text-white font-bold text-sm">
                                                                            {index === 0 ? 'B' : index === 1 ? 'P' : 'E'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold text-foreground">{tier.name}</h4>
                                                                        <p className="text-2xl font-bold text-primary">{tier.price}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {tier.features.map((feature: string, featureIndex: number) => (
                                                                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                                                        <CheckIcon className="h-4 w-4 text-success shrink-0" />
                                                                        <span className="text-default-700">{feature}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            );
                        }

                        // Section Concurrents - Tableau
                        if (section.key === 'competitorsAnalysis' && typeof content === 'object' && content !== null) {
                            const competitorsData = content as any;
                            const mainCompetitors = competitorsData.mainCompetitors || [];
                            const positioning = competitorsData.positioning || '';

                            return (
                                <div key={section.key} className="space-y-6">
                                    {/* Header */}
                                    <Card className="shadow-xl border-0 bg-linear-to-r from-red-500/10 to-pink-500/10">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-red-500 rounded-full">
                                                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground">
                                                        Analyse des concurrents
                                                    </h2>
                                                    <p className="text-default-600">Positionnement sur le marché</p>
                                                </div>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                                        <p>IA Généré</p>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    {/* Tableau des concurrents */}
                                    {mainCompetitors.length > 0 && (
                                        <Card className="shadow-lg border-0 bg-content1">
                                            <CardHeader className="pb-3">
                                                <h3 className="text-lg font-semibold text-foreground">Concurrents principaux</h3>
                                            </CardHeader>
                                            <CardBody>
                                                <Table aria-label="Tableau des concurrents">
                                                    <TableHeader>
                                                        <TableColumn>Concurrent</TableColumn>
                                                        <TableColumn>Forces</TableColumn>
                                                        <TableColumn>Faiblesses</TableColumn>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {mainCompetitors.map((competitor: any, index: number) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                                            <span className="text-xs font-bold text-white">
                                                                                {competitor.name.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                        <span className="font-medium">{competitor.name}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="space-y-1">
                                                                        {competitor.strengths.map((strength: string, sIndex: number) => (
                                                                            <div key={sIndex} className="flex items-center gap-2 text-sm">
                                                                                <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                                                                                <span className="text-green-700 dark:text-green-300">{strength}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="space-y-1">
                                                                        {competitor.weaknesses.map((weakness: string, wIndex: number) => (
                                                                            <div key={wIndex} className="flex items-center gap-2 text-sm">
                                                                                <ArrowTrendingDownIcon className="h-3 w-3 text-red-500" />
                                                                                <span className="text-red-700 dark:text-red-300">{weakness}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    )}

                                    {/* Positionnement */}
                                    {positioning && (
                                        <Card className="shadow-lg border-0 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                            <CardHeader className="pb-3">
                                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                    <EyeIcon className="h-5 w-5" />
                                                    Positionnement stratégique
                                                </h3>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="p-4 bg-white/60 dark:bg-content2/60 rounded-lg border border-blue-200 dark:border-blue-800">
                                                    <p className="text-blue-800 dark:text-blue-200 font-medium">{positioning}</p>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            );
                        }

                        // Section Étude de marché
                        if (section.key === 'marketAnalysis' && typeof content === 'object' && content !== null) {
                            const marketData = content as any;
                            const marketSize = marketData.marketSize || '';
                            const trends = marketData.trends || [];
                            const opportunities = marketData.opportunities || [];

                            return (
                                <div key={section.key} className="space-y-6">
                                    {/* Header */}
                                    <Card className="shadow-xl border-0 bg-linear-to-r from-purple-500/10 to-indigo-500/10">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-purple-500 rounded-full">
                                                    <ChartBarIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground">
                                                        Étude de marché
                                                    </h2>
                                                    <p className="text-default-600">Analyse du secteur et opportunités</p>
                                                </div>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                                        <p>IA Généré</p>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    {/* Taille du marché */}
                                    {marketSize && (
                                        <Card className="shadow-lg border-0 bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                                            <CardBody className="text-center py-8">
                                                <div className="text-4xl mb-4">📊</div>
                                                <h3 className="text-2xl font-bold text-orange-800 dark:text-orange-300 mb-2">
                                                    Taille du marché
                                                </h3>
                                                <p className="text-lg text-orange-700 dark:text-orange-200 font-medium">
                                                    {marketSize}
                                                </p>
                                            </CardBody>
                                        </Card>
                                    )}

                                    {/* Tendances */}
                                    {trends.length > 0 && (
                                        <Card className="shadow-lg border-0 bg-content1">
                                            <CardHeader className="pb-3">
                                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                    <ArrowTrendingUpIcon className="h-5 w-5" />
                                                    Tendances du marché
                                                </h3>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {trends.map((trend: string, index: number) => (
                                                        <div key={index} className="flex items-center gap-3 p-3 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                                                                <ArrowTrendingUpIcon className="h-4 w-4 text-white" />
                                                            </div>
                                                            <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">{trend}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}

                                    {/* Opportunités */}
                                    {opportunities.length > 0 && (
                                        <Card className="shadow-lg border-0 bg-content1">
                                            <CardHeader className="pb-3">
                                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                    <LightBulbIcon className="h-5 w-5" />
                                                    Opportunités identifiées
                                                </h3>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-3">
                                                    {opportunities.map((opportunity: string, index: number) => (
                                                        <div key={index} className="flex items-start gap-3 p-4 bg-linear-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                                                <span className="text-lg">💡</span>
                                                            </div>
                                                            <span className="text-sm text-green-800 dark:text-green-200 font-medium">{opportunity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            );
                        }

                        // Section Fonctionnalités
                        if (section.key === 'keyFeatures' && Array.isArray(content)) {
                            return (
                                <div key={section.key} className="space-y-6">
                                    {/* Header */}
                                    <Card className="shadow-xl border-0 bg-linear-to-r from-cyan-500/10 to-blue-500/10">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-cyan-500 rounded-full">
                                                    <BoltIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground">
                                                        Fonctionnalités phares
                                                    </h2>
                                                    <p className="text-default-600">Capacités principales de votre solution</p>
                                                </div>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                                        <p>IA Généré</p>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    {/* Grille des fonctionnalités */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {content.map((feature: string, index: number) => (
                                            <Card key={index} className="shadow-md border-0 bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 hover:shadow-lg transition-shadow">
                                                <CardBody className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shrink-0">
                                                            <span className="text-white font-bold text-sm">{index + 1}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm text-cyan-800 dark:text-cyan-200 font-medium leading-relaxed">
                                                                {feature}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        // Section Forces et Faiblesses - Design avec barres de progression
                        if (section.key === 'strengthsWeaknesses' && typeof content === 'object' && content !== null) {
                            const swData = content as any;
                            const forces = swData.forces || swData.Forces || [];
                            const faiblesses = swData.faiblesses || swData.Faiblesses || [];

                            return (
                                <div key={section.key} className="space-y-6">
                                    {/* Header */}
                                    <Card className="shadow-xl border-0 bg-linear-to-r from-amber-500/10 to-orange-500/10">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-amber-500 rounded-full">
                                                    <TrophyIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground">
                                                        Forces et faiblesses
                                                    </h2>
                                                    <p className="text-default-600">Analyse comparative interne</p>
                                                </div>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                                        <p>IA Généré</p>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Forces */}
                                        <Card className="shadow-lg border-0 bg-content1">
                                            <CardHeader className="pb-3">
                                                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
                                                    <ArrowTrendingUpIcon className="h-5 w-5" />
                                                    Forces ({forces.length})
                                                </h3>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-4">
                                                    {forces.map((force: string, index: number) => (
                                                        <div key={index} className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-default-700 font-medium">{force}</span>
                                                                <span className="text-green-600 font-semibold">100%</span>
                                                            </div>
                                                            <Progress
                                                                value={100}
                                                                color="success"
                                                                size="sm"
                                                                className="h-2"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>

                                        {/* Faiblesses */}
                                        <Card className="shadow-lg border-0 bg-content1">
                                            <CardHeader className="pb-3">
                                                <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                                                    <ArrowTrendingDownIcon className="h-5 w-5" />
                                                    Faiblesses ({faiblesses.length})
                                                </h3>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-4">
                                                    {faiblesses.map((faiblesse: string, index: number) => (
                                                        <div key={index} className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-default-700 font-medium">{faiblesse}</span>
                                                                <span className="text-orange-600 font-semibold">100%</span>
                                                            </div>
                                                            <Progress
                                                                value={100}
                                                                color="warning"
                                                                size="sm"
                                                                className="h-2"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                            );
                        }

                        // Section Plateformes recommandées
                        if (section.key === 'recommendedPlatforms' && typeof content === 'object' && content !== null) {
                            const platformsData = content as any;

                            return (
                                <div key={section.key} className="space-y-6">
                                    {/* Header */}
                                    <Card className="shadow-xl border-0 bg-linear-to-r from-indigo-500/10 to-purple-500/10">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-indigo-500 rounded-full">
                                                    <GlobeAltIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground">
                                                        Plateformes recommandées
                                                    </h2>
                                                    <p className="text-default-600">Solutions techniques adaptées</p>
                                                </div>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                                        <p>IA Généré</p>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    {/* Plateformes */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {Object.entries(platformsData).map(([platform, data]: [string, any], index: number) => (
                                            <Card key={platform} className="shadow-lg border-0 bg-content1 hover:shadow-xl transition-shadow">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-3 rounded-full ${platform === 'Web' ? 'bg-blue-500' :
                                                            platform === 'Mobile' ? 'bg-green-500' : 'bg-purple-500'
                                                            }`}>
                                                            {platform === 'Web' && <GlobeAltIcon className="h-6 w-6 text-white" />}
                                                            {platform === 'Mobile' && <CpuChipIcon className="h-6 w-6 text-white" />}
                                                            {platform === 'Desktop' && <WrenchScrewdriverIcon className="h-6 w-6 text-white" />}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-foreground">{platform}</h3>
                                                    </div>
                                                </CardHeader>
                                                <CardBody>
                                                    <p className="text-sm text-default-600 leading-relaxed">
                                                        {data.justification}
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        // Section Instructions boilerplate
                        if (section.key === 'boilerplateInstructions' && typeof content === 'object' && content !== null) {
                            const boilerplateData = content as any;

                            return (
                                <div key={section.key} className="space-y-6">
                                    {/* Header */}
                                    <Card className="shadow-xl border-0 bg-linear-to-r from-teal-500/10 to-cyan-500/10">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-teal-500 rounded-full">
                                                    <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-foreground">
                                                        Démarrage technique
                                                    </h2>
                                                    <p className="text-default-600">Instructions pour le développement</p>
                                                </div>
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                                        <p>IA Généré</p>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    {/* Instructions */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(boilerplateData).map(([key, value]: [string, any], index: number) => (
                                            <Card key={key} className="shadow-md border-0 bg-content1">
                                                <CardHeader className="pb-3">
                                                    <h3 className="text-lg font-semibold text-foreground capitalize">
                                                        {key === 'setup' ? 'Configuration' :
                                                            key === 'backend' ? 'Backend' :
                                                                key === 'deployment' ? 'Déploiement' : 'Contrôle de version'}
                                                    </h3>
                                                </CardHeader>
                                                <CardBody>
                                                    <p className="text-sm text-default-600 leading-relaxed">
                                                        {value}
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        // Sections par défaut (si pas spécialisées)
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
                                                <div className="flex items-center justify-center gap-2">
                                                    <SparklesIcon className="h-3 w-3 mr-1" />
                                                    <p>IA Généré</p>
                                                </div>
                                            </Chip>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody className="pt-0">
                                    <div className="text-sm text-default-700 leading-relaxed">
                                        {typeof content === 'string' ? content :
                                            Array.isArray(content) ? (content as string[]).join(', ') :
                                                typeof content === 'object' && content !== null ? JSON.stringify(content, null, 2) :
                                                    String(content)}
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
