import React from 'react';
import { ColumnBlock } from '@/sanity.types';
import SectionRenderer from './SectionRenderer';

const Columns: React.FC<ColumnBlock> = ({ layout, column1, column2, column3, _type }) => {
    const columns = layout === 'three' ? [column1, column2, column3] : [column1, column2];

    return (
        <div className={`${_type} ${layout === 'three' ? 'three-columns xl:grid-cols-3' : 'two-columns lg:grid-cols-2'} grid w-full grid-cols-1 items-stretch gap-6`}>
            {columns.map((column, columnIndex) => (
                <div key={columnIndex} className="column flex min-w-0 w-full flex-col items-center justify-start gap-6">
                    {column?.map((item, itemIndex) => (
                        <SectionRenderer key={item._key || itemIndex} section={item} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Columns;
