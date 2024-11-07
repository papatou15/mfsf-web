// components/SectionRenderer.js
import dynamic from 'next/dynamic';

// Dynamically import components based on section type
const components = {
  heroSection: dynamic(() => import('./MFHero')),
  card: dynamic(() => import('./Card')),
  stackBlock: dynamic(() => import('./StackBlock')),
  carousel: dynamic(() => import('./Carousel')),
  // Add other sections here as needed
};

export default function SectionRenderer({ section }) {
  // Select the component based on `_type`
  const Component = components[section._type];

  // If no matching component is found, return null or a fallback
  if (!Component) return null;

  // Render the matched component, passing `section` as props
  return <Component data={section} />;
}
