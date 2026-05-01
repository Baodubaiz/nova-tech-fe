import { env } from './env.config';

export const siteConfig = {
  name: 'Nova Tech',
  description: 'Premium Technology Store for Laptops and Gadgets.',
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  links: {
    twitter: 'https://twitter.com/novatech',
    github: 'https://github.com/novatech',
  },
  keywords: [
    'Laptop',
    'Technology',
    'E-commerce',
    'Nova Tech',
    'Store'
  ],
  author: {
    name: 'Nova Tech Team',
    url: env.NEXT_PUBLIC_APP_URL,
  }
};

export type SiteConfig = typeof siteConfig;
