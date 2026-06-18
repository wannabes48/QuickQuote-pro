"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Pricing2 = ({
  heading = "Simple, transparent pricing",
  description = "Choose the perfect plan for your contracting business.",
  plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for solopreneurs getting started.",
      monthlyPrice: "KSh 1,000",
      yearlyPrice: "KSh 10,000",
      features: [
        { text: "Up to 50 quotes/month" },
        { text: "PDF Generation" },
        { text: "Email & SMS sending" },
      ],
      button: {
        text: "Start Free Trial",
        url: "/register",
      },
    },
    {
      id: "professional",
      name: "Professional",
      description: "For growing businesses needing more power.",
      monthlyPrice: "KSh 2,500",
      yearlyPrice: "KSh 25,000",
      features: [
        { text: "Unlimited quotes" },
        { text: "1-Click Invoice Generation" },
        { text: "E-Signatures" },
      ],
      button: {
        text: "Start Professional Trial",
        url: "/register",
      },
    },
    {
      id: "business",
      name: "Business",
      description: "Advanced features for established teams.",
      monthlyPrice: "KSh 5,000",
      yearlyPrice: "KSh 50,000",
      features: [
        { text: "Everything in Pro" },
        { text: "Team accounts" },
        { text: "M-Pesa STK Push Integration" },
        { text: "WhatsApp Delivery" },
      ],
      button: {
        text: "Start Free Trial",
        url: "/register",
      },
    },
  ],
}) => {
  const [isYearly, setIsYearly] = useState(false);

  // --- minimal hero particles ---
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect?.width ?? window.innerWidth));
      const h = Math.max(1, Math.floor(rect?.height ?? window.innerHeight));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    let parts = [];
    let raf = 0;

    const make = () => ({
      x: Math.random() * (canvas.width / (window.devicePixelRatio || 1)),
      y: Math.random() * (canvas.height / (window.devicePixelRatio || 1)),
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      parts = [];
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const count = Math.floor((w * h) / 12000);
      for (let i = 0; i < count; i++) parts.push(make());
    };

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * w;
          p.y = h + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250,250,250,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(canvas.parentElement || document.body);

    init();
    raf = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      data-locked
      className="relative py-24 md:py-32 text-zinc-50 overflow-hidden isolate"
    >
      <style>{`
        section[data-locked]{ color:#f6f7f8; color-scheme:dark }
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#27272a}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .6s ease forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .7s ease forwards}
        .hline:nth-child(1){top:18%;animation-delay:.08s}
        .hline:nth-child(2){top:50%;animation-delay:.16s}
        .hline:nth-child(3){top:82%;animation-delay:.24s}
        .vline:nth-child(4){left:18%;animation-delay:.20s}
        .vline:nth-child(5){left:50%;animation-delay:.28s}
        .vline:nth-child(6){left:82%;animation-delay:.36s}
        @keyframes drawX{to{transform:scaleX(1)}}
        @keyframes drawY{to{transform:scaleY(1)}}
        .card-animate{opacity:0;transform:translateY(12px);animation:fadeUp .6s ease .25s forwards}
        @keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_60%_at_50%_15%,rgba(255,255,255,0.06),transparent_60%)]" />

      {/* Animated accent lines */}
      <div aria-hidden className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      {/* Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
      />

      {/* Content */}
      <div className="relative container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-pretty text-4xl font-bold lg:text-6xl">{heading}</h2>
          <p className="text-zinc-400 lg:text-xl">{description}</p>

          <div className="flex items-center gap-3 text-lg z-10">
            Monthly
            <Switch checked={isYearly} onCheckedChange={() => setIsYearly(!isYearly)} />
            Yearly
          </div>

          <div className="mt-2 flex flex-col items-stretch gap-6 md:flex-row z-10">
            {plans.map((plan, i) => (
              <Card
                key={plan.id}
                className={`card-animate flex w-80 flex-col justify-between text-left border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 ${
                  i === 1 ? "md:translate-y-2" : ""
                }`}
                style={{ animationDelay: `${0.25 + i * 0.08}s` }}
              >
                <CardHeader>
                  <CardTitle>
                    <p className="text-zinc-50">{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-zinc-400">{plan.description}</p>
                  <span className="text-4xl font-bold text-white">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <p className="text-zinc-500">
                    Billed{" "}
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}{" "}
                    annually
                  </p>
                </CardHeader>

                <CardContent>
                  <Separator className="mb-6 bg-zinc-800" />
                  {plan.id === "professional" && (
                    <p className="mb-3 font-semibold text-zinc-200">
                      Everything in Starter, and:
                    </p>
                  )}
                  {plan.id === "business" && (
                    <p className="mb-3 font-semibold text-zinc-200">
                      Everything in Professional, and:
                    </p>
                  )}
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-zinc-200">
                        <CircleCheck className="h-4 w-4 text-zinc-400" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button
                    asChild
                    className={`w-full rounded-lg text-zinc-900 hover:bg-zinc-200 border-0 ${i === 1 ? "bg-white" : "bg-zinc-100"}`}
                  >
                    <Link to={plan.button.url}>
                      {plan.button.text}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
