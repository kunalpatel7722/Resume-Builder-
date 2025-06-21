
import React from 'react';

interface ResumeThumbnailProps {
  templateId: 'modern' | 'classic' | 'creative';
}

const ModernThumbnail: React.FC = () => (
    <div className="p-2 space-y-2 bg-white h-full">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-300 rounded-sm" />
        <div className="border-b border-gray-400 my-1" />
        <div className="h-2.5 w-1/4 bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        <div className="h-2.5 w-1/4 bg-gray-400 rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
    </div>
);

const ClassicThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-300 rounded-sm" />
        <div className="border-b-2 border-gray-400 my-2" />
        <div className="h-2 w-1/3 mx-auto bg-gray-400 rounded-sm mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-gray-400 rounded-sm mt-2 mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const CreativeThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-1/3 bg-gray-200 p-2 space-y-2">
            <div className="h-8 w-8 mx-auto rounded-full bg-gray-400" />
            <div className="h-2.5 w-full bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-2/3 bg-gray-300 rounded-sm" />
            <div className="h-2 w-1/2 bg-gray-400 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="h-3 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
            <div className="h-3 w-1/2 bg-gray-400 rounded-sm mt-2" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

export const ResumeThumbnail: React.FC<ResumeThumbnailProps> = ({ templateId }) => {
    return (
        <div className="w-full aspect-[1/1.414] overflow-hidden rounded-md bg-muted border border-gray-300">
            {templateId === 'modern' && <ModernThumbnail />}
            {templateId === 'classic' && <ClassicThumbnail />}
            {templateId === 'creative' && <CreativeThumbnail />}
        </div>
    );
};
