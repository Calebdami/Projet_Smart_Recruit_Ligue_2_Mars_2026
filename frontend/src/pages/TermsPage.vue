<template>
    <div class="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans antialiased selection:bg-amber-100">
        <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
            <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-black tracking-tight text-slate-900">Conditions Générales d'Utilisation</h1>
                    <p class="text-sm text-slate-500 font-medium">Contrat d'utilisation de la plateforme SmartRecruit • v2.4</p>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="window.print()" class="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    </button>
                    <a href="/contact" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                        Besoin d'aide ?
                    </a>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-6 py-12">
            <section class="mb-16">
                <div class="bg-amber-50 border border-amber-100 rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
                    <div class="absolute -right-8 -top-8 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl"></div>
                    <h2 class="text-amber-900 font-black text-xl mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        L'essentiel en 60 secondes
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div v-for="(point, i) in summaryPoints" :key="i" class="space-y-2">
                            <h3 class="font-bold text-amber-950 text-sm uppercase tracking-wide">{{ point.title }}</h3>
                            <p class="text-amber-800/80 text-sm leading-relaxed">{{ point.desc }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div class="flex flex-col lg:flex-row gap-16">
                <aside class="lg:w-72 shrink-0">
                    <div class="sticky top-32">
                        <nav class="space-y-1">
                            <a v-for="section in termsSections" :key="section.id" :href="'#' + section.id" 
                               class="group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                               :class="activeSection === section.id ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'">
                                <span class="text-sm font-semibold tracking-tight">{{ section.title }}</span>
                                <span class="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">0{{ section.index }}</span>
                            </a>
                        </nav>
                        <div class="mt-10 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p class="text-xs text-slate-400 leading-relaxed font-medium">
                                En utilisant SmartRecruit, vous acceptez d'être lié par ces termes. Si vous n'acceptez pas ces conditions, veuillez cesser toute utilisation du service.
                            </p>
                        </div>
                    </div>
                </aside>

                <div class="flex-1 max-w-3xl space-y-20 pb-32">
                    
                    <section id="usage" class="scroll-mt-36">
                        <span class="text-indigo-600 font-bold text-sm tracking-widest uppercase">Article 01</span>
                        <h2 class="text-3xl font-black text-slate-900 mt-2 mb-8">Conditions d'Accès & Usage</h2>
                        <div class="prose prose-slate prose-lg text-slate-600 space-y-6">
                            <p>L'accès à la plateforme est strictement réservé aux personnes physiques majeures recherchant un emploi et aux entités morales dûment enregistrées.</p>
                            <div class="p-6 bg-white border-l-4 border-indigo-600 rounded-r-2xl shadow-sm italic text-slate-700">
                                "L'utilisateur s'engage à fournir des informations sincères, exactes et non trompeuses lors de la constitution de son dossier de candidature."
                            </div>
                            <p>Toute usurpation d'identité ou falsification de diplômes entraînera la clôture immédiate du compte sans préavis.</p>
                        </div>
                    </section>

                    <section id="intellectual" class="scroll-mt-36">
                        <span class="text-indigo-600 font-bold text-sm tracking-widest uppercase">Article 02</span>
                        <h2 class="text-3xl font-black text-slate-900 mt-2 mb-8">Propriété Intellectuelle</h2>
                        <div class="prose prose-slate text-slate-600 space-y-6 leading-relaxed">
                            <p>Tous les éléments de la plateforme (algorithmes de scoring, interface, logos, textes) sont la propriété exclusive de SmartRecruit. Vous ne pouvez en aucun cas :</p>
                            <ul class="space-y-3 list-none p-0">
                                <li class="flex items-center gap-3 p-4 bg-red-50/50 rounded-xl text-red-700 text-sm border border-red-100">
                                    <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                                    Extraire ou réutiliser les données via des méthodes de scraping automatisé.
                                </li>
                                <li class="flex items-center gap-3 p-4 bg-red-50/50 rounded-xl text-red-700 text-sm border border-red-100">
                                    <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                                    Tenter de décompiler ou de découvrir le code source de nos algorithmes de scoring.
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section id="liability" class="scroll-mt-36">
                        <span class="text-indigo-600 font-bold text-sm tracking-widest uppercase">Article 03</span>
                        <h2 class="text-3xl font-black text-slate-900 mt-2 mb-8">Limitation de Responsabilité</h2>
                        <div class="prose prose-slate text-slate-600 space-y-6">
                            <p>SmartRecruit agit comme un intermédiaire technique. En conséquence :</p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="p-5 border border-slate-200 rounded-2xl">
                                    <h4 class="font-bold text-slate-900 mb-2">Recrutement</h4>
                                    <p class="text-xs">Nous ne garantissons pas l'obtention d'un emploi ni la véracité des offres publiées par les tiers.</p>
                                </div>
                                <div class="p-5 border border-slate-200 rounded-2xl">
                                    <h4 class="font-bold text-slate-900 mb-2">Continuité</h4>
                                    <p class="text-xs">Nous ne pouvons être tenus responsables des interruptions de service dues à la maintenance.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('usage')

const summaryPoints = [
    { title: 'Vos données', desc: 'Vous restez propriétaire de votre CV. Nous ne vendons jamais vos données personnelles à des tiers publicitaires.' },
    { title: 'Transparence', desc: 'Le scoring algorithmique est un indicateur de compatibilité, pas une décision finale automatisée.' },
    { title: 'Engagement', desc: 'Vous vous engagez à ne pas mentir sur vos compétences et à utiliser la plateforme de manière éthique.' }
]

const termsSections = [
    { id: 'usage', title: 'Accès & Usage', index: 1 },
    { id: 'intellectual', title: 'Propriété Intellectuelle', index: 2 },
    { id: 'liability', title: 'Responsabilité', index: 3 },
    { id: 'termination', title: 'Résiliation', index: 4 },
    { id: 'jurisdiction', title: 'Droit Applicable', index: 5 }
]

const handleScroll = () => {
    termsSections.forEach(section => {
        const el = document.getElementById(section.id)
        if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= 160) activeSection.value = section.id
        }
    })
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
html {
    scroll-behavior: smooth;
}
/* Style pour l'impression propre du document juridique */
@media print {
    aside, header, .bg-amber-50 { display: none !important; }
    main { max-width: 100% !important; padding: 0 !important; }
    .max-w-3xl { max-width: 100% !important; }
    section { page-break-inside: avoid; margin-bottom: 40px !important; }
    .text-indigo-600 { color: black !important; border-bottom: 2px solid black; }
}
</style>