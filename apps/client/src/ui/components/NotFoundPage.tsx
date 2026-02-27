import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Tell search engines not to index 404 pages
    document.title = 'Pagina nu a fost găsită - eDistanța';
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    }
    return () => {
      // Restore default on unmount
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
      document.title = 'eDistanța - Calculator Distanțe Rutiere România | Prețuri Combustibil';
    };
  }, []);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full text-center z-10"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-12">
          <img
            src="/logo_with_text_transparent.png"
            alt="eDistanta"
            className="w-48 sm:w-64 mx-auto hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* 404 Visual */}
        <motion.div variants={itemVariants} className="relative inline-block mb-8">
          <h1 className="text-[120px] sm:text-[180px] font-black leading-none bg-gradient-to-b from-blue-600 to-indigo-700 bg-clip-text text-transparent select-none">
            404
          </h1>
          <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-2 bg-blue-100 rounded-full blur-md opacity-50" />
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="space-y-4 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            {t('404.title', 'Drum închis sau pagină lipsă')}
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg max-w-md mx-auto">
            {t('404.description', 'Ne pare rău, dar pagina pe care o cauți nu a fost găsită. Poate s-a rătăcit pe drum sau a fost mutată.')}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{t('404.goHome', 'Înapoi la acasă')}</span>
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-white hover:bg-neutral-50 text-neutral-700 font-semibold py-4 px-8 rounded-xl border border-neutral-200 shadow-sm transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('404.goBack', 'Înapoi')}</span>
          </button>
        </motion.div>

        {/* Helpful Tip */}
        <motion.div variants={itemVariants} className="mt-16 text-neutral-400 text-sm">
          <p>{t('404.contact', 'Cauți ceva anume? Verifică pagina principală sau contactează-ne.')}</p>
        </motion.div>
      </motion.div>

      {/* Progress Bar Decor */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-neutral-100">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
