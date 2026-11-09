import type { Dict } from "./ru";

export const en: Dict = {
  meta: {
    title: "OPERIVA | AISI LAB, an artificial intelligence lab",
    description:
      "AISI LAB develops NAL, its own memory architecture for AI, and builds products on it for hotels, travel, security and business.",
    pages: {
      lab: ["Lab", "Memory, context and character for AI: the NAL architecture, a digital assistant, a translator and digital legacy."],
      aisi: ["AISI LAB", "A product family on one memory architecture: hotels, travel, security."],
      hotels: ["AISI LAB for hotels", "Guest communication, team requests and manager summaries in one system."],
      workforce: ["AI Workforce", "Digital employees for sales, support, bookings and reporting, with clear limits on autonomy."],
      method: ["Methodology", "How we implement AI: from studying the process to scaling after a confirmed result."],
      gov: ["Governance", "Access rights, human approval, action history and data principles."],
      cases: ["Cases", "AISI LAB in practice, with status and verification conditions."],
      tiflis: ["Case: TiFLiS pilot hotel", "How AISI LAB works at the TiFLiS pilot hotel: task, scope, the human role and limitations."],
      company: ["Company", "AISI LAB is an artificial intelligence lab. DG Solution LLC, Tbilisi, Georgia."],
      contact: ["Discuss your task", "Implementation, a demo, an AI-powered website or a partnership: tell us about your task."],
      privacy: ["Data processing", "What data the OPERIVA website collects and how it is used."],
    },
  },

  ui: {
    nav: {
      lab: "Lab",
      aisi: "AISI LAB",
      workforce: "AI Workforce",
      method: "Methodology",
      gov: "Governance",
      cases: "Cases",
      company: "Company",
    },
    cta: "Discuss your task",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
    language: "Language",
    readMore: "Learn more",
    backTo: "Back",
    status: {
      label: "Status",
      pilot: "Live in pilot",
      prototype: "Prototype",
      eta: "Expected release",
      noDate: "No release date announced",
      demo: "Demo",
      example: "Example dialogue",
    },
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    timingNote: "All dates are estimates and may change based on development and testing results.",
    footer: {
      tagline: "Memory and character for artificial intelligence",
      legal: "DG Solution LLC",
      location: "Tbilisi, Georgia",
      privacy: "Data processing",
      contact: "Contact",
      rights: "OPERIVA is the website of the AISI LAB laboratory.",
    },
    fallback: "",
  },

  form: {
    title: "Tell us about your task",
    topicLabel: "Topic",
    topics: ["Business implementation", "Product demo", "AI-powered website", "Partnership", "Other"],
    name: "Name",
    company: "Company",
    optional: "optional",
    contact: "How to reach you",
    contactHint: "Email, phone or messenger, whatever suits you for our reply.",
    task: "Your task",
    taskHint: "What happens now and what you want to change. A few sentences are enough.",
    consent: "We use this data only to reply to your request. See “Data processing” for details.",
    submit: "Send message",
    sending: "Sending…",
    successTitle: "Message sent",
    successText: "We have received your request and will reply using the contact you provided.",
    errorTitle: "Could not send",
    errorText: "Check your connection and try again.",
    notConfiguredTitle: "Sending is not connected yet",
    notConfiguredText:
      "The form is in test mode: your message was not delivered to the team. Your text is still in the form, so you can copy it.",
    required: "Please fill in this field",
    again: "Write another",
  },

  chat: {
    open: "AISI LAB chat",
    title: "AISI LAB assistant",
    demoBadge: "Demo",
    demoNote: "This is a demo chat with prepared answers. It is not connected to the team.",
    greeting:
      "Hello! I’m the AISI LAB assistant. I can tell you about the lab, its products and services, or help you leave a message for the team.",
    quick: ["What is NAL?", "AISI LAB for hotels", "AI-powered website", "Leave a message"],
    placeholder: "Type a question…",
    send: "Send",
    answers: {
      nal: "NAL is a neural memory architecture developed by the lab. It combines short-term, long-term and associative memory so that AI keeps context and experience. Status: prototype.",
      hotels:
        "AISI LAB for hotels talks to guests, helps with bookings, passes requests to staff and gives the manager summaries. It currently runs at the TiFLiS pilot hotel.",
      site: "We build websites with built-in AI: the assistant knows your business, answers visitors in their language, clarifies the request and passes it to your team.",
      products:
        "AISI LAB directions: hotels (live in pilot), Travel (prototype, expected January 2027) and Security (prototype, expected April 2027).",
      fallback:
        "In this demo I cover a limited set of topics: NAL, AISI LAB products and AI-powered websites. I can help you leave a message for the team.",
    },
    leaveTitle: "Message for the team",
    leaveName: "Name",
    leaveContact: "How to reach you",
    leaveText: "Message",
    leaveSubmit: "Pass the message on",
    confirmDemo:
      "Demo: this is what the confirmation will look like. Your message has not been sent: chat delivery is not connected yet. To reach the team, please use the form on the “Discuss your task” page.",
    confirmReal: "Your message has been passed to the team. We will reply using the contact you provided.",
    toContact: "Open the contact form",
  },

  home: {
    hero: {
      eyebrow: "AISI LAB, an artificial intelligence lab",
      title: "AI that remembers\nfor business and for life",
      lead: "On our own memory technology we build products that understand context and remember people: from a hotel assistant and a website with an AI consultant to a translator, smart security and a person’s digital image.",
      links: { lab: "Explore the lab", products: "AISI LAB products", contact: "Discuss your task" },
      offersTitle: "What we do",
      groups: [
        {
          title: "For business",
          items: [
            ["hotels", "AI assistant for hotels", "Guests, requests, bookings and summaries"],
            ["sites", "Website with an AI consultant", "Answers visitors, collects leads"],
            ["workforce", "Digital employees", "Sales, support, service, reports"],
            ["security", "Property security", "Cameras, locks, visitors, alerts"],
          ],
        },
        {
          title: "For people",
          items: [
            ["assistant", "Digital assistant", "A voice assistant that remembers you"],
            ["translator", "Translator", "Live speech translation with context"],
            ["travel", "Travel", "Routes and hotels to fit budget and interests"],
            ["legacy", "Digital legacy", "Preserving the memory of a person"],
          ],
        },
      ],
      tags: { pilot: "Pilot", prototype: "Prototype", service: "Service" },
      custom: "Didn’t find your task? We’ll build an AI solution for it",
      memoryNote: "All products are built on NAL, our own memory technology: the AI remembers the conversation, preferences and history.",
    },
    trust: {
      eyebrow: "Data and trust",
      title: "The principles behind our products",
      items: [
        ["Data belongs to the person", "People share information about themselves for a specific task and keep their rights to it."],
        ["Everything can be viewed, corrected and deleted", "AI memory should be open to the data owner, not hidden inside the system."],
        ["Private stays private", "Personal data is not used for other tasks or shared without consent."],
        ["A person decides the fate of their digital image", "The owner decides who may access the image and when."],
      ],
      note: "These are development principles. How each product implements them is verified separately and depends on its stage of readiness.",
    },
    core: {
      eyebrow: "One foundation, many products",
      title: "At the core is NAL, our own memory architecture",
      text: "At the core of our products is NAL, our own memory architecture. It underpins the digital assistant, the translator, digital legacy and the AISI LAB directions for hotels, travel and security.",
      link: "How the lab works",
      products: ["Digital assistant", "Translator", "Digital legacy", "Hotels", "Travel", "Security"],
    },
    directions: {
      eyebrow: "AISI LAB directions",
      title: "One memory architecture, different tasks",
      forLabel: "For",
      tasksLabel: "Tasks",
      items: {
        hotels: {
          name: "AISI LAB for hotels",
          for: "Hotels and accommodation.",
          tasks: "Guest communication, bookings, staff requests, manager summaries.",
        },
        travel: {
          name: "AISI LAB Travel",
          for: "Travellers planning a trip.",
          tasks: "Hotels and routes matched to budget, tips about places, direct booking.",
        },
        security: {
          name: "AISI LAB Security",
          for: "Homes and sites that need their security systems combined.",
          tasks: "Video surveillance and event analysis, visitor log, alerts, electronic locks.",
        },
      },
    },
    sites: {
      eyebrow: "Service",
      title: "Websites with built-in AI",
      text: "We build websites with built-in artificial intelligence. The assistant knows your business, answers visitors in their language, takes messages and requests and passes them to your team.",
      tasks: [
        ["Answers questions", "Based on a knowledge base about your business, services, terms, rules."],
        ["Introduces products", "Explains your products and services the way your staff would."],
        ["Clarifies the request", "Asks questions to understand what the visitor needs."],
        ["Passes the request on", "Collects contact details and the essence of the request and sends them to your team."],
      ],
      discuss: "Discuss a website",
      demo: "Open the chat demo",
    },
    workforce: {
      eyebrow: "For business",
      title: "AI Workforce: digital employees in your processes",
      text: "We help hand repetitive work over to AI: requests, bookings, tasks, reports. We start with one process and expand after a confirmed result.",
      links: [
        ["Digital employee roles", "workforce"],
        ["Implementation methodology", "method"],
        ["Governance and limits of autonomy", "gov"],
        ["Case study", "tiflis"],
      ],
    },
    example: {
      eyebrow: "Case study",
      title: "AISI LAB at the TiFLiS pilot hotel",
      rows: [
        ["Starting point", "Guest messages, bookings and requests to staff came through different channels and depended on individual employees."],
        ["Where AISI LAB is used", "Guest communication, staff requests, manager summaries."],
        ["What the guest gets", "Answers based on hotel rules and requests passed to staff without waiting for reception."],
        ["What the team gets", "Requests with context, an owner and a status."],
        ["What the manager sees", "Rooms, requests, tasks and situations that need a human decision."],
      ],
      link: "Full case",
    },
    contact: {
      eyebrow: "Get in touch",
      title: "Where shall we start?",
      options: [
        ["Discuss implementation", "We will review the process and choose the first scenario."],
        ["Request a demo", "We will show how AISI LAB for hotels works."],
        ["Discuss an AI-powered website", "Tell us about your business and your site’s visitors."],
        ["Propose a partnership", "Partnerships, research, pilot projects."],
      ],
    },
  },

  landing: {
    hero: {
      eyebrow: "Artificial intelligence lab",
      lead: "We build AI products on our own memory technology. They remember the conversation and the people.",
      cta: "Discuss your task",
      demo: "Try the demo",
      facts: [["8", "products for business and people"], ["NAL", "our own memory technology"], ["Pilot", "already live at a hotel"]],
      live: "AISI LAB assistant. Ask it",
    },
    offers: { title: "What we do", text: "Ready products and custom development", custom: "Need a solution for your task?", customLink: "Let’s talk" },
    play: { title: "Try it yourself", text: "Click and see how it works. The data is fictional" },
    nal: {
      eyebrow: "Technology",
      title: "Memory, like a person’s",
      text: "NAL is our memory architecture. Every AISI LAB product runs on it",
      items: [["Short-term", "holds the current conversation"], ["Long-term", "keeps what matters between meetings"], ["Associative", "links the new with experience"]],
      link: "More about the lab",
    },
    case: {
      eyebrow: "Already live",
      title: "Pilot at the TiFLiS hotel",
      text: "AISI LAB handles guest communication, requests and summaries at a working hotel",
      steps: [["Guest", "Gets answers and passes on requests without waiting"], ["Team", "Sees requests with context, an owner and a status"], ["Manager", "Sees the whole day and where a decision is needed"]],
      link: "More about the case",
    },
    trust: { title: "Your data stays under your control", items: ["Data belongs to the person", "Everything can be viewed and deleted", "Private stays private", "Key decisions stay with people"] },
    final: { title: "Tell us about your task", text: "Together we’ll pick the first scenario and test it in a pilot", cta: "Discuss your task" },
  },
  lab: {
    hero: {
      eyebrow: "Lab",
      title: "Teaching AI to remember and understand context",
      lead: "We research AI memory and character and turn it into products",
    },
    nal: {
      eyebrow: "Architecture",
      title: "NAL: neural memory architecture",
      text: "Our own development. AI doesn’t start every conversation from scratch: it keeps context and builds experience",
      types: [
        ["Short-term", "Holds the current conversation"],
        ["Long-term", "Remembers preferences and agreements"],
        ["Associative", "Links the new with experience"],
      ],
      facts: [
        "The first version already runs in AISI LAB",
        "Not sold separately, it powers our products",
      ],
      note: "We show the principle, not the internal design",
    },
    products: {
      title: "Built on NAL",
      assistant: {
        name: "Digital assistant",
        text: "A voice assistant that remembers you and your habits",
        points: ["Voice", "Memory of conversations", "Its own character", "You choose the name"],
        uses: "Smart home, phone, email, plans and expenses",
        link: "The assistant’s memory becomes the basis of a digital image",
      },
      translator: {
        name: "Translator",
        text: "Live speech translation that understands the conversation",
        points: ["Speech translation", "Context aware", "Built on NAL"],
        note: "Languages and speed will be published after testing",
      },
      legacy: {
        name: "Digital legacy",
        text: "Preserves a person’s story, memories and character in a digital image",
        points: ["Only from your own materials", "Loved ones can talk to the image", "You control access"],
        note: "A way to preserve a person’s memory, not a replacement for them",
      },
    },
  },

  aisi: {
    hero: {
      eyebrow: "Product family",
      title: "AISI LAB products",
      lead: "Hotels, travel and security on one memory technology",
    },
    hotels: {
      name: "AISI LAB for hotels",
      points: ["Guest communication", "Bookings and payments", "Sales channels", "Staff requests", "Manager summaries", "Your own assistant persona"],
      statusText: "Live at the TiFLiS pilot hotel",
      link: "Product page",
    },
    travel: {
      name: "AISI LAB Travel",
      points: ["Routes on budget", "Hotel picks", "Sights from a photo", "Direct booking"],
    },
    security: {
      name: "AISI LAB Security",
      points: ["Cameras and event analysis", "Visitor log", "Alerts", "Electronic locks"],
      note: "Compatible equipment is agreed for each project",
    },
  },

  hotels: {
    hero: {
      eyebrow: "AISI LAB for hotels",
      title: "Guests, team and manager, in one system",
      lead: "The assistant answers guests, routes requests to departments and builds a summary for the manager",
      demo: "Request a demo",
      discuss: "Discuss implementation",
    },
    guest: {
      title: "For guests",
      points: ["Answers by hotel rules", "Help with bookings", "Requests without waiting"],
    },
    team: {
      title: "For the team",
      points: ["Requests with context", "Owner and status", "Departments in sync"],
    },
    manager: {
      title: "For the manager",
      points: ["The day on one screen", "Rooms, tasks and payments", "Where your decision is needed"],
    },
    booking: {
      title: "Sales and personality",
      items: [
        ["Bookings", "Guides the guest to a confirmed booking"],
        ["Payments", "Helps pay, refunds are decided by a person"],
        ["Sales channels", "Every request in one history"],
      ],
      note: "Connections to hotel systems are checked for each property",
    },
    persona: {
      title: "The assistant’s personality",
      text: "Name, character and look of the assistant are tailored to your hotel",
      items: ["Name", "Communication style", "Knowledge base", "Digital image"],
    },
    scenarios: {
      title: "How it works",
      note: "The dialogues below are examples written for demonstration. They are not recordings of real conversations.",
      items: [
        {
          title: "An extra blanket",
          lines: [
            ["guest", "Could I get another blanket in 204?"],
            ["ai", "Of course. I’m passing your request to housekeeping, a blanket will be brought to room 204. Anything else?"],
            ["system", "Request created: housekeeping, room 204"],
          ],
        },
        {
          title: "Room availability",
          lines: [
            ["guest", "Do you have a double room from 14 to 16 November?"],
            ["ai", "Let me check availability for those dates. How many guests, and would you like breakfast?"],
            ["system", "Availability is checked against hotel data"],
          ],
        },
        {
          title: "House rules",
          lines: [
            ["guest", "What time is check-in, and can I bring my dog?"],
            ["ai", "I answer according to hotel rules: check-in time and pet policy are in the property’s knowledge base."],
          ],
        },
        {
          title: "An unusual request",
          lines: [
            ["guest", "I want to set up a surprise proposal in the room. Can you help?"],
            ["ai", "What a lovely idea! Requests like this are best arranged with the front desk. I’m passing it on, and they’ll get in touch."],
            ["system", "Handed to the front desk"],
          ],
        },
      ],
    },
    checks: {
      title: "Verification and limitations",
      text: "We publish figures only with date, conditions and source",
      columns: ["Metric", "Where verified", "Date", "Scope and conditions", "Source"],
      envTest: "Test copy",
      envPilot: "Pilot hotel",
      empty: "Figures will appear after pilot measurements",
      limits: [
        "Refunds and exceptions are decided by staff",
        "If it doesn’t know, it hands over to a person",
        "Languages and connections set per property",
      ],
    },
    next: {
      title: "Next step",
      text: "We’ll show the product or discuss where to start at your hotel",
    },
  },

  workforce: {
    hero: {
      eyebrow: "AI Workforce",
      title: "Digital employees for routine work",
      lead: "AI takes on repetitive tasks and hands the hard ones to people",
    },
    rolesTitle: "Roles",
    labels: { tasks: "Tasks", systems: "Systems", result: "Result", limits: "Limits of autonomy" },
    systemsNote: "Systems are examples, connections are chosen per project",
    roles: [
      {
        name: "Sales",
        tasks: "Answers requests and prepares an offer",
        systems: "Website, messengers, CRM.",
        result: "No request is lost",
        limits: "Prices and discounts only with a manager",
      },
      {
        name: "Support",
        tasks: "Closes common questions from the knowledge base",
        systems: "Chat, email, knowledge base.",
        result: "Complex cases go to people with a summary",
        limits: "Deadlines and compensation decided by staff",
      },
      {
        name: "Bookings",
        tasks: "Checks availability and handles the booking",
        systems: "Booking system, sales channels.",
        result: "Booking done or handed over",
        limits: "Cancellations and rates need approval",
      },
      {
        name: "Service",
        tasks: "Turns requests into tasks",
        systems: "Task system, staff messengers.",
        result: "Every request has an owner",
        limits: "Unusual requests go to a person",
      },
      {
        name: "Reviews",
        tasks: "Collects reviews and drafts replies",
        systems: "Review platforms, internal surveys.",
        result: "Issue summary for the manager",
        limits: "Publishes after review",
      },
      {
        name: "Coordination",
        tasks: "Tracks deadlines and sends reminders",
        systems: "Task system, messengers.",
        result: "Tasks don’t get lost between teams",
        limits: "Works by your rules",
      },
      {
        name: "Reporting",
        tasks: "Gathers data into regular summaries",
        systems: "The client’s connected systems.",
        result: "Reports without manual work",
        limits: "Conclusions stay with the manager",
      },
    ],
    context: {
      title: "Context passes between roles",
      text: "Each role sees what has already been said and done",
      flow: ["Sales", "Bookings", "Service", "Reporting"],
    },
    human: {
      title: "The human role",
      items: [
        "You set the rules",
        "Money and reputation are decided by people",
        "Hard cases are handed over with context",
        "Any scenario can be stopped",
      ],
    },
    start: {
      title: "Start with one process",
      text: "We pilot one process and expand once the result is visible",
      link: "How implementation works",
    },
  },

  method: {
    hero: {
      eyebrow: "Methodology",
      title: "Step-by-step implementation",
      lead: "We start with one scenario and expand after the result",
    },
    clientLabel: "What we need from you",
    steps: [
      ["Process review", "We see how it works today", "Describe the process"],
      ["First scenario", "We pick where the benefit is clearest", "Agree on limits"],
      ["Metric", "We agree on what to measure", "Share baseline data"],
      ["Preparation", "We set up knowledge and connections", "Provide materials and access"],
      ["Pilot", "We launch and compare to baseline", "Give feedback"],
      ["Support", "We monitor quality and update", "Tell us about changes"],
      ["Expansion", "We add new scenarios", "Choose the next step"],
    ],
  },

  gov: {
    hero: {
      eyebrow: "Governance",
      title: "You decide what AI can and cannot do",
      lead: "AI works within limits set by people",
    },
    blocks: [
      ["Access rights", "Access only for the task"],
      ["Allowed and not", "An action list for each role"],
      ["Approval", "Important decisions are approved by a person"],
      ["Hard cases", "Go to staff with the history"],
      ["Knowledge base", "You decide what the assistant knows"],
      ["Action history", "See what was done and when"],
      ["Data", "View and delete at any time"],
      ["Responsibility", "Set out in the contract"],
    ],
    note: "We discuss your industry and country requirements before the project starts",
  },

  cases: {
    hero: {
      eyebrow: "Cases",
      title: "Practice, without embellishment",
      lead: "We show status, the human role and limits. No embellishment",
    },
    tiflis: {
      name: "AISI LAB at the TiFLiS pilot hotel",
      summary: "Guests, requests and summaries at a working hotel",
    },
    more: "New cases will appear after pilots finish",
  },

  tiflis: {
    hero: {
      eyebrow: "Case",
      title: "AISI LAB at the TiFLiS pilot hotel",
      lead: "The first hotel where AISI LAB works every day",
    },
    sections: [
      ["Property", "TiFLiS pilot hotel"],
      ["Problem", "Messages in many channels, requests by hand, the day in pieces"],
      ["What we built", "Guest assistant, department requests, manager screen"],
      ["Scenarios", "Hotel rules, rooms, guest requests, hard questions"],
      ["Human role", "Staff decide exceptions, payments and hard cases"],
      ["Status", "Pilot, scope growing as we go"],
    ],
    results: {
      title: "Confirmed results",
      text: "Figures will be published after measurement, with date and source",
    },
    limits: {
      title: "Limitations and next steps",
      items: [
        "One hotel’s results don’t carry over to others",
        "Connections are checked for each property",
        "Next: finish the pilot and add scenarios",
      ],
    },
  },

  company: {
    hero: {
      eyebrow: "Company",
      title: "AISI LAB, an artificial intelligence lab",
      lead: "We build AI that remembers, for business and for life",
    },
    mission: {
      title: "Mission",
      text: "AI that remembers, understands context and stays under human control",
    },
    own: {
      title: "Our own developments",
      items: [
        "NAL, neural memory architecture",
        "Assistant, translator, digital legacy",
        "Hotels, travel, security",
        "Digital employees and AI websites",
      ],
    },
    data: { title: "Data principles", link: "Data processing" },
    legal: { title: "Company details", entity: "Legal entity", location: "Location" },
  },

  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Let’s discuss your task",
      lead: "Tell us what you want to change and we’ll reply",
    },
    location: "Tbilisi, Georgia",
    emailLabel: "Email",
    emailPending: "Coming soon. For now, use the form",
  },

  mock: {
    label: "Demo interface, fictional data",
    app: "AISI LAB, Hotel",
    nav: ["Overview", "Requests", "Tasks", "Rooms", "Payments"],
    hello: "Today",
    stats: [["Open requests", "6"], ["Need a human decision", "2"], ["Arrivals today", "9"]],
    chatTitle: "Guest, room 204",
    chat: [
      ["guest", "Good evening! Could I get another blanket in 204?"],
      ["ai", "Good evening! Of course, I’m passing it to housekeeping. It will be brought shortly."],
      ["ai", "Anything else? Breakfast today is served until 10:30."],
    ],
    typing: "typing…",
    created: "Request created",
    requestsTitle: "Requests",
    requests: [
      ["Blanket, 204", "Housekeeping", "new", "New"],
      ["Late check-out, 112", "Front desk", "wait", "Needs decision"],
      ["Transfer, 301", "Concierge", "work", "In progress"],
      ["Cleaning, 215", "Housekeeping", "done", "Done"],
    ],
    memoryTitle: "Guest memory",
    memory: ["Prefers a high floor", "Speaks English and Georgian", "Feather allergy, confirm with staff"],
    handoff: "Handed to a person",
    widgetHello: "Hello! How can I help?",
    widgetQ: "How much is delivery?",
    widgetA: "It depends on the city. Where should we deliver?",
    widgetLead: "Request passed to the team",
  },
  privacy: {
    hero: {
      eyebrow: "Data processing",
      title: "What data the website collects and why",
      lead: "In short: what happens to your data",
    },
    sections: [
      ["Who processes the data", "DG Solution LLC, Tbilisi, Georgia. The company behind the AISI LAB laboratory and the OPERIVA website."],
      ["Contact form", "We receive your name, company (if given), contact details and task description. This data is used only to reply to your request and discuss cooperation."],
      ["Website chat", "The chat currently works as a demo: messages are processed in your browser and are not sent anywhere. This section will be updated when delivery is connected."],
      ["Cookies and analytics", "The website does not use advertising trackers. If we add analytics, this section will be updated before it is enabled."],
      ["Your rights", "You can ask what data we hold about you, and ask us to correct or delete it, via the contact form."],
      ["Changes", "We update this page whenever the way the website handles data changes."],
    ],
  },
};
