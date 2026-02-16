import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Tell search engines not to index 404 pages
    document.title = 'Pagina nu a fost găsită - eDistanța';
    let metaRobots = document.querySelector('meta[name="robots"]');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <img
            src="/logo_with_text_transparent.png"
            alt="eDistanta"
            className="w-64 mx-auto opacity-80"
          />
        </div>

        {/* 404 Error */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {t('404.title', 'Pagina nu a fost găsită')}
          </h2>
          <p className="text-gray-800 text-lg mb-8">
            {t('404.description', 'Ne pare rău, dar pagina pe care o căutați nu există sau a fost mutată.')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t('404.goHome', 'Înapoi la pagina principală')}</span>
          </button>

          <button
            onClick={() => window.history.back()}
            className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t('404.goBack', 'Înapoi')}</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-700 text-sm mb-4">
            {t('404.helpfulLinks', 'Poate te interesează:')}
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              {t('404.linkHome', 'Pagina principală')}
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-700 text-sm">
            {t('404.contact', 'Dacă problema persistă, vă rugăm să ne contactați.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
