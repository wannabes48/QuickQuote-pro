import * as React from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-100 to-amber-200/50",
        gray: "bg-gradient-to-br from-slate-100 to-slate-200/50",
        purple: "bg-gradient-to-br from-purple-100 to-indigo-200/50",
        green: "bg-gradient-to-br from-emerald-100 to-teal-200/50",
        blue: "bg-gradient-to-br from-blue-100 to-cyan-200/50",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

const GradientCard = React.forwardRef(
  ({ className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, imageUrl, ...props }, ref) => {
    
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.03, y: -4 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.1, rotate: 3 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          {...props}
        >
          {/* Decorative background image with animation */}
          <motion.img
            src={imageUrl}
            alt={`${title} background graphic`}
            variants={imageAnimation}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -right-1/4 -bottom-1/4 w-3/4 opacity-80 pointer-events-none dark:opacity-30 object-cover rounded-full mix-blend-multiply"
          />

          {/* Card Content */}
          <div className="z-10 flex flex-col h-full relative">
            {/* Badge */}
            {badgeText && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-slate-800 backdrop-blur-sm w-fit shadow-sm border border-white/40">
                <span 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: badgeColor }}
                />
                {badgeText}
              </div>
            )}

            {/* Title and Description */}
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-700 max-w-xs leading-relaxed font-medium">{description}</p>
            </div>
            
            {/* Call to Action Link */}
            {ctaText && (
              <a
                href={ctaHref || "#"}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 bg-white/50 hover:bg-white/80 transition-colors w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/60"
              >
                {ctaText}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
