'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProject } from '../utils/actions';
import { SparklesIcon, FolderIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Input, Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            const project = await createProject(formData);
            router.push(`/project/${project.id}`);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary rounded-full">
                            <SparklesIcon className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        AI Project Advisor
                    </h1>
                    <p className="text-lg text-default-600 max-w-md mx-auto">
                        Créez et analysez vos projets avec l&apos;intelligence artificielle
                    </p>
                </div>

                {/* Main Card */}
                <Card className="shadow-2xl border-0">
                    <CardHeader className="pb-0">
                        <div className="flex items-center gap-2">
                            <FolderIcon className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-semibold">Nouveau Projet</h2>
                        </div>
                    </CardHeader>

                    <CardBody className="space-y-6">
                        <form action={handleSubmit} className="space-y-6">
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

                            {error && (
                                <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                                    <div className="text-sm text-danger">{error}</div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                isLoading={isLoading}
                                className="w-full font-semibold"
                                startContent={!isLoading && <SparklesIcon className="h-5 w-5" />}
                            >
                                {isLoading ? 'Analyse en cours...' : 'Créer et analyser le projet'}
                            </Button>
                        </form>
                    </CardBody>

                    <CardFooter className="pt-0">
                        <div className="w-full">
                            <Divider className="my-4" />
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-3">Vous avez déjà des projets ?</p>
                                <Link href="/dashboard" className="w-full">
                                    <Button
                                        variant="bordered"
                                        color="primary"
                                        className="w-full"
                                        startContent={<FolderIcon className="h-4 w-4" />}
                                    >
                                        Voir tous les projets
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                {/* Features Preview */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 text-center bg-default-50 border-0">
                        <div className="text-2xl mb-2">🧠</div>
                        <h3 className="font-semibold text-sm text-foreground">Analyse IA</h3>
                        <p className="text-xs text-default-600 mt-1">Business model, SWOT, concurrents</p>
                    </Card>
                    <Card className="p-4 text-center bg-default-50 border-0">
                        <div className="text-2xl mb-2">📊</div>
                        <h3 className="font-semibold text-sm text-foreground">Étude de marché</h3>
                        <p className="text-xs text-default-600 mt-1">Taille, tendances, opportunités</p>
                    </Card>
                    <Card className="p-4 text-center bg-default-50 border-0">
                        <div className="text-2xl mb-2">🔧</div>
                        <h3 className="font-semibold text-sm text-foreground">Boilerplate</h3>
                        <p className="text-xs text-default-600 mt-1">Génération de code de base</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
