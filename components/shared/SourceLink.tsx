
import React from 'react';
import type { GroundingChunk } from '../../types';

interface SourceLinkProps {
    source: GroundingChunk;
    index: number;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source, index }) => {
    const linkData = source.web || source.maps;
    if (!linkData || !linkData.uri) return null;

    return (
        <a
            href={linkData.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-2 transition-colors duration-200 text-sm"
        >
            <span className="flex-shrink-0 bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2">{index + 1}</span>
            <span className="truncate text-blue-300 hover:text-blue-200">{linkData.title || linkData.uri}</span>
        </a>
    );
};

export default SourceLink;
