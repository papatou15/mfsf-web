import React from 'react';
import SectionRenderer from '../components/SectionRenderer';
import { SectionProps } from '../components/SectionRenderer';
import { queryFetcher, servicesPagesQuery } from '../queries';

interface ServicesPageProps {
    sections: SectionProps[];
}

export default async function ServicesPage() {
    const servicesPage: ServicesPageProps = await queryFetcher(servicesPagesQuery);

    return (
        <div>
            {servicesPage.sections.map((section) => (
                <SectionRenderer key={section._key} section={section} {...section} />
            ))}
        </div>
    );
}