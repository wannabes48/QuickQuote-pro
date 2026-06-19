import React from "react";
import { GradientCard } from "./gradient-card";

const cardData = [
  {
    badgeText: "For Freelancers",
    badgeColor: "#F59E0B", 
    title: "Solo Creators",
    description: "Perfect for independent professionals who need to send quick, beautiful quotes without complex CRM features.",
    ctaText: "Start Free",
    ctaHref: "/register",
    imageUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=600&auto=format&fit=crop",
    gradient: "orange",
  },
  {
    badgeText: "For Agencies",
    badgeColor: "#8B5CF6", 
    title: "Growing Teams",
    description: "Manage multiple clients, track invoice statuses, and standardize your team's quoting process effortlessly.",
    ctaText: "Explore Plans",
    ctaHref: "/pricing",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop",
    gradient: "purple",
  },
  {
    badgeText: "Enterprise Ready",
    badgeColor: "#10B981", 
    title: "Large Scale",
    description: "Robust API integrations, custom branding, and advanced analytics for high-volume quotation needs.",
    ctaText: "Contact Sales",
    ctaHref: "#contact",
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop",
    gradient: "green",
  },
  {
    badgeText: "Quick Templates",
    badgeColor: "#3B82F6", 
    title: "Contractors",
    description: "Pre-built templates for construction, electrical, plumbing, and other field services to quote on the go.",
    ctaText: "View Templates",
    ctaHref: "/quotes/new",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&auto=format&fit=crop",
    gradient: "blue",
  },
];

const GradientCardDemo = () => {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md">Built for Every Business</h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Whether you're quoting a one-off gig or managing enterprise contracts, we have the tools you need.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
        {cardData.map((card, index) => (
          <GradientCard
            key={index}
            badgeText={card.badgeText}
            badgeColor={card.badgeColor}
            title={card.title}
            description={card.description}
            ctaText={card.ctaText}
            ctaHref={card.ctaHref}
            imageUrl={card.imageUrl}
            gradient={card.gradient}
          />
        ))}
      </div>
    </div>
  );
};

export default GradientCardDemo;
