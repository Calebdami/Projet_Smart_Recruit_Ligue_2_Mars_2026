<template>
    <div class="min-h-screen bg-[#fafafa] text-slate-900 font-sans antialiased selection:bg-indigo-100">
        <div class="fixed top-0 left-0 w-full h-1 bg-slate-100 z-50">
            <div class="h-full bg-indigo-600 transition-all duration-150" :style="{ width: scrollProgress + '%' }"></div>
        </div>

        <header class="relative overflow-hidden bg-white border-b border-slate-200 pt-24 pb-16">
            <div class="absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.05)_0%,transparent_100%)]"></div>
            <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <div class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-down">
                    Confidentialité & Transparence
                </div>
                <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    Politique de Confidentialité <br/>
                    <span class="text-indigo-600">SmartRecruit</span>
                </h1>
                <p class="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                    Nous traitons vos données avec la plus grande rigueur. Découvrez comment vos informations personnelles, dossiers et scores sont protégés et analysés.
                </p>
                <div class="mt-8 text-sm text-slate-400 font-medium">
                    Dernière mise à jour : 04 Avril 2026
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-6 py-16">
            <div class="flex flex-col lg:flex-row gap-16">
                
                <aside class="lg:w-64 shrink-0">
                    <nav class="sticky top-24 space-y-2">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Sommaire</p>
                        <a v-for="item in sections" :key="item.id" :href="'#' + item.id" 
                           class="block px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
                           :class="activeSection === item.id ? 'bg-white border-slate-200 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'">
                            {{ item.title }}
                        </a>
                    </nav>
                </aside>

                <article class="flex-1 max-w-3xl space-y-16">
                    
                    <section id="collecte" class="scroll-mt-24 group">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h2 class="text-2xl font-bold text-slate-900">Collecte des Données</h2>
                        </div>
                        <div class="prose prose-slate prose-indigo max-w-none text-slate-600 leading-relaxed space-y-4">
                            <p>Lorsque vous déposez votre dossier sur SmartRecruit, nous collectons les catégories de données suivantes :</p>
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0">
                                <li class="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                                    <span class="text-emerald-500 mt-1">✔</span>
                                    <span>Identité (Nom, Prénom, Coordonnées)</span>
                                </li>
                                <li class="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                                    <span class="text-emerald-500 mt-1">✔</span>
                                    <span>Documents (CV, Lettres de motivation, Diplômes)</span>
                                </li>
                                <li class="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                                    <span class="text-emerald-500 mt-1">✔</span>
                                    <span>Parcours (Expériences, Compétences techniques)</span>
                                </li>
                                <li class="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                                    <span class="text-emerald-500 mt-1">✔</span>
                                    <span>Présence en ligne (LinkedIn, Portfolio)</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section id="scoring" class="scroll-mt-24">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-200">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h2 class="text-2xl font-bold text-slate-900">Analyse et Scoring Algorithmique</h2>
                        </div>
                        <div class="bg-slate-900 rounded-[2rem] p-8 text-slate-300 relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl"></div>
                            <p class="relative z-10 mb-6 leading-relaxed">
                                Notre système utilise des algorithmes d'analyse pour faire correspondre vos compétences aux besoins des recruteurs. Ce score de pertinence est un outil d'aide à la décision et ne remplace jamais le jugement humain.
                            </p>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                <div class="p-4 bg-white/5 rounded-2xl border border-white/10 text-center text-sm">
                                    <div class="text-white font-bold mb-1">Objectivité</div>
                                    Neutralité totale face au genre et à l'origine.
                                </div>
                                <div class="p-4 bg-white/5 rounded-2xl border border-white/10 text-center text-sm">
                                    <div class="text-white font-bold mb-1">Pertinence</div>
                                    Focus exclusif sur les hard et soft skills.
                                </div>
                                <div class="p-4 bg-white/5 rounded-2xl border border-white/10 text-center text-sm">
                                    <div class="text-white font-bold mb-1">Transparence</div>
                                    Accès sur demande aux critères de scoring.
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="droits" class="scroll-mt-24">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h2 class="text-2xl font-bold text-slate-900">Vos Droits (RGPD)</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div v-for="droit in droits" :key="droit.title" class="p-6 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                <h3 class="font-bold text-slate-900 mb-2">{{ droit.title }}</h3>
                                <p class="text-sm text-slate-500 leading-relaxed">{{ droit.desc }}</p>
                            </div>
                        </div>
                    </section>

                    <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-center">
                        <h3 class="text-2xl font-bold mb-4">Une question sur vos données ?</h3>
                        <p class="text-indigo-100 mb-8 max-w-md mx-auto italic">
                            "La protection de votre vie privée est le socle de notre relation de confiance."
                        </p>
                        <a href="mailto:dpo@smartrecruit.com" class="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                            Contacter notre DPO
                        </a>
                    </div>
                </article>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollProgress = ref(0)
const activeSection = ref('collecte')

const sections = [
    { id: 'collecte', title: 'Collecte des Données' },
    { id: 'scoring', title: 'Scoring & Algorithmes' },
    { id: 'conservation', title: 'Durée de Conservation' },
    { id: 'droits', title: 'Vos Droits RGPD' },
    { id: 'contact', title: 'Nous Contacter' }
]

const droits = [
    { title: 'Droit d’accès', desc: 'Obtenez une copie complète de toutes les données que nous détenons sur vous.' },
    { title: 'Droit à l’oubli', desc: 'Demandez la suppression définitive de votre dossier candidat à tout moment.' },
    { title: 'Droit de rectification', desc: 'Corrigez vos informations personnelles si elles sont obsolètes.' },
    { title: 'Droit d’opposition', desc: 'Refusez que vos données soient utilisées pour le scoring automatique.' }
]

const handleScroll = () => {
    // Progress Bar
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    scrollProgress.value = (window.scrollY / totalHeight) * 100

    // Active Section Detection
    sections.forEach(section => {
        const element = document.getElementById(section.id)
        if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= 150) activeSection.value = section.id
        }
    })
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
@keyframes fade-in-down {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
    animation: fade-in-down 0.8s ease-out;
}
html {
    scroll-behavior: smooth;
}
</style>