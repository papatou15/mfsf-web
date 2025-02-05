/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SectionRenderer.js
import dynamic from 'next/dynamic';

// Define the type for the section prop
export interface SectionProps {
  _type: 'heroSection' | 'card' | 'carousel' | 'stackBlock' | 'textOnPicture' | 'hero' | 'button' | 'columnBlock';
}

// Dynamically import components based on section type
const components: { [key in SectionProps['_type']]: any } = {
  heroSection: dynamic(() => import('./MFHero')),
  card: dynamic(() => import('./Card')),
  carousel: dynamic(() => import('./Carousel')),
  stackBlock: dynamic(() => import('./ContentBlock')),
  textOnPicture: dynamic(() => import('./TextOverImage')),
  hero: dynamic(() => import('./MFHero')),
  button: dynamic(() => import('./MFButton')),
  columnBlock: dynamic(() => import('./Columns')),
};

interface SectionRendererProps {
  section: SectionProps;
  [key: string]: any;
}

export default function SectionRenderer({ section, ...props }: SectionRendererProps) {
  // Select the component based on `_type`
  const Component = components[section._type];

  // If no matching component is found, return null or a fallback
  if (!Component) return null;

  return <Component {...section} {...props} />;
}
