
import { useState } from 'react';
import { authService } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.requestPasswordReset(email);
            setSubmitted(true);
            showToast(t('auth.reset.requestSuccess') || 'Reset instructions sent!', 'success');
        } catch (err) {
            showToast(t('auth.reset.requestError') || 'Email not found or error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold text-gray-900 tracking-tighter">
                        Tailor<span className="text-green-600">Connect</span>
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        {submitted ? (t('auth.reset.checkEmail') || 'Check your email') : (t('auth.reset.title') || 'Reset Password')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {submitted
                            ? (t('auth.reset.submittedNote') || "We've sent recovery instructions to your email.")
                            : (t('auth.reset.subtitle') || "Enter your email to receive a password reset token.")}
                    </p>
                </div>

                {!submitted ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.email') || 'Email Address'}</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="alex@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {loading ? (t('common.loading') || 'Sending...') : (t('auth.reset.button') || 'Send Reset Link')}
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="text-sm font-medium text-green-600 hover:text-green-500">
                                â† {t('auth.reset.backToLogin') || 'Back to login'}
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm leading-relaxed border border-green-100">
                            <strong>Note for local testing:</strong> Check the <strong>Backend Terminal</strong> to see the "email" containing your reset link!
                        </div>
                        <Link
                            href="/login"
                            className="w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
                        >
                            {t('auth.reset.backToLogin') || 'Return to Login'}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

