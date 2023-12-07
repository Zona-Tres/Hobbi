import React, {useState, useEffect} from 'react';
import Illustration from '/images/glow-bottom.svg'
import Logo from "../components/ui/Logo";

export default function ErrorBoundary({children}) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
		
	useEffect(() => {
		const handleError = (error, errorInfo) => {
			setHasError(true);
			setError(error);
			setErrorInfo(errorInfo);
		};

		const handleWindowError = (event) => {
			handleError(event.error, null);
		};

		window.addEventListener('error', handleWindowError);

		return () => {
			window.removeEventListener('error', handleWindowError);
		};
	}, []);
    
	useEffect(() => {
		const handleUnhandledRejection = (event) => {
			handleError(event.reason, null);
		};
	
		window.addEventListener('unhandledrejection', handleUnhandledRejection);
	
		return () => {
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		};
	}, []);

  if(hasError) {
    return(
      <div className="flex flex-col w-full overflow-hidden relative">
        {/* Background Image */}
        <section className="flex-grow">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="left-1/2 -translate-x-1/2 bottom-0">
            <img src={Illustration} className="max-w-none" width={2146} alt="Hero Illustration" />
          </div>
        </div>
        <div className="m-4">
          <Logo />
        </div>
        <div className="relative min-h-screen flex items-center justify-center flex-col">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="h1 bg-clip-text text-transparent bg-gradient-to-r from-slate-900/60 via-slate-800 to-slate-700/60 pb-4">Algo salió mal {':('}</h1>
            <p className="font-light text-xl">Utilizando <strong className="text-purple-800">Por favor, contáctanos!</strong></p>
          </div>
        </div>
        </section>
      </div>
    )
  }

  return children;
}