import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
    const { t } = useTranslation();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if device is iOS
        const isIOSDevice =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

        // Check if already installed (standalone mode)
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone;

        if (isIOSDevice && !isStandalone) {
            setIsIOS(true);
            // Show prompt after a small delay for iOS users
            setTimeout(() => setIsVisible(true), 2000);
        }

        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
                >
                    <div className="bg-white rounded-lg shadow-xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <img
                                        src="/only_icon_transparent.png"
                                        alt="App Icon"
                                        className="w-8 h-8 object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                        {isIOS ? t('pwa.iosInstallTitle', 'Instalează pe iPhone') : t('pwa.installTitle', 'Instalează Aplicatia')}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        {t('pwa.installDesc', 'Accesează mai rapid rutele tale')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={t('common.close', 'Închide')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {isIOS ? (
                            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                <p className="mb-2">
                                    {t('pwa.iosInstallBody', 'Apasă pe butonul de partajare și selectează "Adaugă la ecranul principal"')}
                                </p>
                                <div className="flex justify-center items-center gap-2 text-blue-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 15V3M12 3L7 8M12 3L17 8M2 13V15C2 17.5 4 20 7 20H17C20 20 22 17.5 22 15V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>→</span>
                                    <span className="font-semibold">Add to Home Screen</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleInstallClick}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
                                >
                                    {t('pwa.installButton', 'Instalează')}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;
