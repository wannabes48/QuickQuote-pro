export const quoteTemplates = [
    {
        id: "blank",
        name: "Blank Quote",
        category: "General",
        description: "Start from scratch with a completely blank canvas.",
        items: [{ description: "", quantity: 1, unit_price: 0 }],
        notes: ""
    },
    // Freelancer / Solo Creator
    {
        id: "web_design",
        name: "Web Design",
        category: "Freelancer / Solo Creator",
        description: "Standard website design and development package.",
        items: [
            { description: "UI/UX Design & Wireframing", quantity: 1, unit_price: 25000 },
            { description: "Frontend Development", quantity: 1, unit_price: 45000 },
            { description: "Backend Setup", quantity: 1, unit_price: 30000 }
        ],
        notes: "Valid for 30 days. 50% deposit required before work commences."
    },
    {
        id: "copywriting",
        name: "Copywriting",
        category: "Freelancer / Solo Creator",
        description: "Content writing and SEO copy services.",
        items: [
            { description: "Website Copy (Home, About, Services)", quantity: 1, unit_price: 15000 },
            { description: "Blog Posts (500 words each)", quantity: 4, unit_price: 2500 },
            { description: "SEO Meta Descriptions", quantity: 10, unit_price: 500 }
        ],
        notes: "Includes 2 rounds of revisions. Extra revisions billed at standard hourly rate."
    },
    {
        id: "consultation",
        name: "Consultation",
        category: "Freelancer / Solo Creator",
        description: "Hourly consulting or strategic advising blocks.",
        items: [
            { description: "Initial Strategy Audit", quantity: 1, unit_price: 10000 },
            { description: "1-on-1 Consulting Hours", quantity: 5, unit_price: 5000 }
        ],
        notes: "Consulting hours must be used within 60 days of invoice payment."
    },
    // Agency / Growing Team
    {
        id: "branding_package",
        name: "Branding Package",
        category: "Agency / Growing Team",
        description: "Comprehensive corporate identity and branding.",
        items: [
            { description: "Logo Design (3 Concepts)", quantity: 1, unit_price: 40000 },
            { description: "Brand Guidelines Document", quantity: 1, unit_price: 20000 },
            { description: "Business Card & Letterhead Design", quantity: 1, unit_price: 15000 }
        ],
        notes: "Final deliverables provided in AI, EPS, PNG, and PDF formats upon full payment."
    },
    {
        id: "monthly_retainer",
        name: "Monthly Retainer",
        category: "Agency / Growing Team",
        description: "Ongoing monthly marketing and support.",
        items: [
            { description: "Social Media Management", quantity: 1, unit_price: 15000 },
            { description: "Monthly Ad Campaign Management", quantity: 1, unit_price: 25000 },
            { description: "Performance Reporting", quantity: 1, unit_price: 5000 }
        ],
        notes: "Monthly retainer contract. Cancellation requires a 30-day written notice."
    },
    // Contractor / Field Services
    {
        id: "plumbing_inspection",
        name: "Plumbing Inspection",
        category: "Contractor / Field Services",
        description: "Standard call-out and diagnostic assessment.",
        items: [
            { description: "Call-out / Diagnostic Fee", quantity: 1, unit_price: 2500 },
            { description: "Labor (Hourly Rate)", quantity: 2, unit_price: 1500 },
            { description: "Standard Replacement Parts", quantity: 1, unit_price: 4500 }
        ],
        notes: "Quote is an estimate based on visible damage. Hidden issues discovered during repair may incur additional costs."
    },
    {
        id: "electrical_wiring",
        name: "Electrical Wiring",
        category: "Contractor / Field Services",
        description: "Wiring, conduits, and breaker installations.",
        items: [
            { description: "Electrical Wiring & Conduits (per meter)", quantity: 50, unit_price: 200 },
            { description: "Switchboard & Breaker Installation", quantity: 1, unit_price: 15000 },
            { description: "Labor & Testing", quantity: 1, unit_price: 8000 }
        ],
        notes: "All work guarantees compliance with national electrical safety standards."
    },
    {
        id: "construction_subcontract",
        name: "Construction Subcontract",
        category: "Contractor / Field Services",
        description: "Heavy construction and material estimates.",
        items: [
            { description: "Site Preparation & Clearing", quantity: 1, unit_price: 30000 },
            { description: "Raw Materials (Cement, Bricks, Sand)", quantity: 1, unit_price: 85000 },
            { description: "Skilled Labor (Daily Rate x Days)", quantity: 10, unit_price: 2500 }
        ],
        notes: "Material costs are subject to market fluctuations and valid for 14 days only."
    }
];
