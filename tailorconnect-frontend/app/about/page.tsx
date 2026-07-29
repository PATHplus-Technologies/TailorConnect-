export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 py-16">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">À propos de TailorConnect</h1>
            <div className="prose lg:prose-xl text-gray-600 space-y-6">
                <p>
                    TailorConnect est la première plateforme qui comble le fossé entre les tailleurs qualifiés et les passionnés de mode.
                    Née de la frustration liée à la recherche de tailleurs fiables et à la gestion des mensurations, nous avons conçu une solution qui rend les vêtements sur mesure accessibles à tous.
                </p>
                <p>
                    Notre mission est de donner les moyens aux artisans locaux en leur fournissant des outils numériques pour exposer leur travail, tout en offrant aux clients une expérience fluide et basée sur la confiance.
                </p>
                <h2 className="text-2xl font-bold text-gray-800 mt-8">Pourquoi nous choisir ?</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Artisans Vérifiés :</strong> Chaque tailleur sur notre plateforme est évalué pour sa qualité.</li>
                    <li><strong>Commodité Numérique :</strong> Gérez vos mensurations et vos commandes en un seul endroit.</li>
                    <li><strong>Axé sur la Communauté :</strong> Nous soutenons les entreprises locales et la mode durable.</li>
                </ul>
            </div>
        </div>
    );
}
