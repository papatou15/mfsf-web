/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SectionRenderer.js
import dynamic from 'next/dynamic';
import Typography from './Typography/Typography';
import typographyTheme from './theme/Typography';

// Define the type for the section prop
export interface SectionProps {
  _type: 'heroSection' | 'card' | 'carousel' | 'stackBlock' | 'textOnPicture' | 'hero' | 'button' | 'columnBlock' | 'largeTitle' | 'mediumTitle' | 'smallTitle' | 'textInput' | 'image' | 'stringText';
  title?: string;
  text?: string;
  _key?: string
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
  largeTitle: dynamic(() => import('./Typography/Typography')),
  mediumTitle: dynamic(() => import('./Typography/Typography')),
  smallTitle: dynamic(() => import('./Typography/Typography')),
  textInput: dynamic(() => import('./Typography/Typography')),
  image: null,
  stringText: dynamic(() => import('./Typography/Typography'))
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

  // Handle title components
  if (section._type === 'largeTitle') {
    return <Typography as="h1" className={typographyTheme({ size: 'h1' })}>{section.title}</Typography>;
  }
  if (section._type === 'mediumTitle') {
    return <Typography as="h2" className={typographyTheme({ size: 'h3' })}>{section.title}</Typography>;
  }
  if (section._type === 'smallTitle') {
    return <Typography as="h3" className={typographyTheme({ size: 'h5' })}>{section.title}</Typography>;
  }
  if (section._type === 'textInput' || section._type === 'stringText') {
    return <Typography as="p" className={typographyTheme({ size: 'paragraph' })}>{section.text}</Typography>;
  }

  return <Component {...section} {...props} />;
}
