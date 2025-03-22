import { z } from 'zod';

export interface ReferenceLink {
  title: string;
  url: string;
  isPdf?: boolean;
}

export const referenceLinkSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  isPdf: z.boolean().optional()
});

export const referenceLinks: Record<string, ReferenceLink[]> = {
  quantum: [
    { 
      title: "Quantum Mechanics Overview", 
      url: "https://en.wikipedia.org/wiki/quantum_mechanics" 
    },
    { 
      title: "Quantum Entanglement Explained", 
      url: "https://www.scientificamerican.com/article/what-is-quantum-entanglement/" 
    },
    {
      title: "Quantum Physics Guide (PDF)",
      url: "https://yourapp.com/resources/quantum_physics_guide.pdf",
      isPdf: true
    },
    {
      title: "Quantum Entanglement Visual (PDF)",
      url: "https://yourapp.com/resources/entanglement_visual.pdf",
      isPdf: true
    }
  ],
  physics: [
    { 
      title: "Wave-Particle Duality", 
      url: "https://en.wikipedia.org/wiki/Wave%E2%80%93particle_duality" 
    }
  ],
  technology: [
    { 
      title: "Latest Tech Trends", 
      url: "https://www.technologyreview.com/" 
    }
  ]
};

export const getLinksForTopic = (topic: string): ReferenceLink[] => {
  return referenceLinks[topic.toLowerCase()] || [];
};

export const generateGoogleSearchLink = (query: string): string => {
  const encodedQuery = encodeURIComponent(query);
  return `https://www.google.com/search?q=${encodedQuery}`;
};

export const enhanceVexaReply = (text: string): string => {
  // Replace URLs with clickable links using vexa-link class
  let enhancedText = text.replace(
    /(https?:\/\/[^\s]+)/g, 
    (url) => {
      const isPdf = url.toLowerCase().endsWith('.pdf');
      return `<a href="${url}" ${isPdf ? 'download' : ''} target="_blank" class="vexa-link">${url}</a>`;
    }
  );

  // Add reference links if topic markers are found
  Object.keys(referenceLinks).forEach(topic => {
    if (text.toLowerCase().includes(topic)) {
      const topicLinks = getLinksForTopic(topic);
      if (topicLinks.length > 0) {
        enhancedText += '\n\nRelevant resources:\n';
        topicLinks.forEach(link => {
          enhancedText += `• <a href="${link.url}" ${link.isPdf ? 'download' : ''} target="_blank" class="vexa-link">${link.title}${link.isPdf ? ' (PDF)' : ''}</a>\n`;
        });
      }
    }
  });

  return enhancedText;
};