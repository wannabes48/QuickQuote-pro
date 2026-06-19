import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RippleButton } from "./multi-type-ripple-buttons";

const CheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const PricingCard = ({
  planName, description, price, features, buttonText, isPopular = false, buttonVariant = 'primary'
}) => {
  const navigate = useNavigate();

  const cardClasses = `
    backdrop-blur-[14px] bg-gradient-to-br rounded-2xl shadow-xl flex-1 max-w-xs px-7 py-8 flex flex-col transition-all duration-300
    from-black/5 to-black/0 border border-black/10
    dark:from-white/10 dark:to-white/5 dark:border-white/10 dark:backdrop-brightness-[0.91]
    ${isPopular ? 'scale-105 relative ring-2 ring-primary/20 dark:from-white/20 dark:to-white/10 dark:border-primary/30 shadow-2xl' : ''}
  `;
  
  // Adjusted colors to use 'primary' variable (which maps to --primary in index.css)
  const buttonClasses = `
    mt-auto w-full py-2.5 rounded-xl font-semibold text-[14px] transition font-sans
    ${buttonVariant === 'primary' 
      ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
      : 'bg-black/10 hover:bg-black/20 text-foreground border border-black/20 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20'
    }
  `;

  return (
    <div className={cardClasses.trim()}>
      {isPopular && (
        <div className="absolute -top-4 right-4 px-3 py-1 text-[12px] font-semibold rounded-full bg-primary text-primary-foreground dark:text-white shadow-md">
          Most Popular
        </div>
      )}
      <div className="mb-3">
        <h2 className="text-[48px] font-extralight tracking-[-0.03em] text-foreground font-display">{planName}</h2>
        <p className="text-[16px] text-foreground/70 mt-1 font-sans">{description}</p>
      </div>
      <div className="my-6 flex items-baseline gap-2">
        <span className="text-[48px] font-extralight text-foreground font-display">${price}</span>
        <span className="text-[14px] text-foreground/70 font-sans">/mo</span>
      </div>
      <div className="card-divider w-full mb-5 h-px bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.1)_50%,transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.09)_20%,rgba(255,255,255,0.22)_50%,rgba(255,255,255,0.09)_80%,transparent)]"></div>
      <ul className="flex flex-col gap-2 text-[14px] text-foreground/90 mb-6 font-sans">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckIcon className="text-primary w-4 h-4" /> {feature}
          </li>
        ))}
      </ul>
      <RippleButton 
        className={buttonClasses.trim()}
        onClick={() => navigate('/register')}
      >
        {buttonText}
      </RippleButton>
    </div>
  );
};

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
}) => {
  // Removed showAnimatedBackground & ShaderCanvas to use existing background per user request
  return (
    <div className="text-foreground min-h-screen w-full overflow-x-hidden">
      <main className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 mt-16">
        <div className="w-full max-w-5xl mx-auto text-center mb-14">
          <h1 className="text-[48px] md:text-[64px] font-extralight leading-tight tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-r from-gray-dark via-primary to-accent dark:from-white dark:via-primary dark:to-accent font-display">
            {title}
          </h1>
          <p className="mt-3 text-[16px] md:text-[20px] text-foreground/80 max-w-2xl mx-auto font-sans">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center w-full max-w-4xl">
          {plans.map((plan) => <PricingCard key={plan.planName} {...plan} />)}
        </div>
      </main>
    </div>
  );
};
