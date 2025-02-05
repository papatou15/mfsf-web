import React from 'react';
import { ColumnBlock } from '@/sanity.types';
import SectionRenderer from './SectionRenderer';

const Columns: React.FC<ColumnBlock> = ({ layout, column1, column2, column3, _type }) => {
    const columns = layout === 'three' ? [column1, column2, column3] : [column1, column2];

    return (
        <div className={`${_type} ${layout === 'three' ? 'three-columns' : 'two-columns'} flex flex-row`}>
            {columns.map((column, columnIndex) => (
                <div key={columnIndex} className="column flex flex-row">
                    {column?.map((item, itemIndex) => (
                        <SectionRenderer key={item._key || itemIndex} section={item} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Columns;