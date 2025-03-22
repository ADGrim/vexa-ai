import { z } from 'zod';

export interface ReferenceLink {
  title: string;
  url: string;
}

export const referenceLinkSchema = z.object({
  title: z.string(),
  url: z.string().url()
});

export const referenceLinks: Record<string, ReferenceLink[]> = {
  quantum: [
    { 
      title: "Quantum Mechanics Overview", 
      url: "https://en.wikipedia.org/wiki/Quantum_mechanics" 
    },
    { 
      title: "Quantum Entanglement Explained", 
      url: "https://www.scientificamerican.com/article/what-is-quantum-entanglement/" 
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
  // Replace URLs with clickable links
  let enhancedText = text.replace(
    /(https?:\/\/[^\s]+)/g, 
    (url) => `<a href="${url}" target="_blank" class="text-purple-400 hover:text-purple-300 underline transition-colors">${url}</a>`
  );

  // Add reference links if topic markers are found
  Object.keys(referenceLinks).forEach(topic => {
    if (text.toLowerCase().includes(topic)) {
      const topicLinks = getLinksForTopic(topic);
      if (topicLinks.length > 0) {
        enhancedText += '\n\nRelevant resources:\n';
        topicLinks.forEach(link => {
          enhancedText += `• <a href="${link.url}" target="_blank" class="text-purple-400 hover:text-purple-300 underline transition-colors">${link.title}</a>\n`;
        });
      }
    }
  });

  return enhancedText;
};
