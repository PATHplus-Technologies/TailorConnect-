
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { designsService } from '@/services/designs';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GenerateDesignPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState('');

    // Pre-filled inspirations to help user start
    // Pre-filled inspirations to help user start
    const tVal = t('designs.generate.inspirations');
    const inspirations = Array.isArray(tVal) ? tVal : [
        "A modern African print blazer with sharp lapels",
        "A flowing silk evening gown with golden embroidery",
        "A traditional Agbada in deep blue with white stitching",
        "A minimalist linen suit for a summer wedding"
    ];

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError('');
        setGeneratedImage(null);

        try {
            const data = await designsService.generate(prompt);
            setGeneratedImage(data.image_url);
        } catch (err) {
            console.error(err);
            setError(t('designs.generate.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Left Panel: Controls */}
            <div className="w-full md:w-1/3 p-8 bg-white border-r border-gray-200 flex flex-col justify-center min-h-[500px]">
                <div className="mb-8">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-green-600 mb-4 flex items-center gap-2">
                        â† {t('dashboard.client.title')}
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {t('designs.generate.title')} <span className="text-purple-600">Beta</span>
                    </h1>
                    <p className="text-gray-500">
                        {t('designs.generate.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {t('designs.generate.promptLabel')}
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-32 p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-lg"
                            placeholder={t('designs.generate.promptPlaceholder')}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{t('designs.generate.inspirationsLabel')}</p>
                        <div className="flex flex-wrap gap-2">
                            {inspirations.map((insp: string, idx: number) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setPrompt(insp)}
                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-left"
                                >
                                    {insp}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                {t('designs.generate.generating')}
                            </>
                        ) : (
                            <>
                                âœ¨ {t('designs.generate.generateButton')}
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}
                </form>
            </div>

            {/* Right Panel: Result */}
            <div className="w-full md:w-2/3 bg-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 pattern-grid-lg opacity-5 pointer-events-none"></div>

                {generatedImage ? (
                    <div className="relative group max-w-2xl w-full animate-in zoom-in duration-500">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <img
                            src={generatedImage}
                            alt="Generated Design"
                            className="relative rounded-2xl shadow-2xl w-full object-cover border-4 border-white"
                        />
                        <div className="absolute bottom-6 right-6 flex gap-3">
                            <button
                                onClick={() => window.open(generatedImage, '_blank')}
                                className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50 transition-transform hover:-translate-y-1"
                            >
                                â¬‡ï¸ {t('designs.generate.download')}
                            </button>
                            <button
                                onClick={() => navigate('/tailors')} // Placeholder flow
                                className="bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition-transform hover:-translate-y-1"
                            >
                                ðŸ§µ {t('designs.generate.findTailor')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 max-w-md">
                        <div className="text-6xl mb-6 opacity-30">ðŸŽ¨</div>
                        <h3 className="text-xl font-bold mb-2 text-gray-500">{t('designs.generate.emptyTitle')}</h3>
                        <p>{t('designs.generate.emptySubtitle')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

