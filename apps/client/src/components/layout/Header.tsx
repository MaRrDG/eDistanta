import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../common';

interface HeaderProps {
  setIsInfoModalOpen: (isInfoModalOpen: boolean) => void;
  setIsTermsModalOpen: (isTermsModalOpen: boolean) => void;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  isSidebarOpen: boolean;
  setIsDetailsExpanded: (isDetailsExpanded: boolean) => void;
}

const Header = ({
  setIsInfoModalOpen,
  setIsTermsModalOpen,
  setIsSidebarOpen,
  isSidebarOpen,
  setIsDetailsExpanded,
}: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-blue-100 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/only_icon_transparent.png" alt="eDistanta" className="w-8" />
        <h1 className="text-xl font-semibold text-blue-800">
          {t('header.title')}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50 cursor-pointer"
          title={t('info.title')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </button>
        <button
          onClick={() => setIsTermsModalOpen(true)}
          className="hidden sm:flex text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          {t('terms.button')}
        </button>
        <LanguageSelector />
        <button
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
            setIsDetailsExpanded(false);
          }}
          className="md:hidden bg-blue-50 hover:bg-blue-100 p-2 rounded-full text-blue-600"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
