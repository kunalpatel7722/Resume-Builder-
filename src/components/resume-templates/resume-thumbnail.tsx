
import React from 'react';

interface ResumeThumbnailProps {
  templateId: 'modern' | 'classic' | 'creative' | 'professional' | 'minimalist' | 'executive' | 'simple' | 'technical' | 'academic' | 'sales' | 'marketing' | 'healthcare' | 'legal' | 'finance' | 'hospitality' | 'software-engineer' | 'graphic-designer' | 'customer-service' | 'it-professional' | 'project-manager' | 'creative-writer';
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

const ProfessionalThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-1/3 bg-gray-700 p-2 space-y-4">
            <div className="h-3 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-2/3 bg-gray-400 rounded-sm" />
            <div className="space-y-1 mt-4">
                <div className="h-1.5 w-full bg-gray-400 rounded-sm" />
                <div className="h-1.5 w-full bg-gray-400 rounded-sm" />
                <div className="h-1.5 w-full bg-gray-400 rounded-sm" />
            </div>
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="h-2.5 w-1/2 bg-gray-500 rounded-sm border-b border-gray-300 pb-1"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-gray-500 rounded-sm border-b border-gray-300 pb-1 mt-4"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const MinimalistThumbnail: React.FC = () => (
    <div className="p-3 space-y-3 bg-white h-full">
        <div className="h-5 w-3/5 bg-gray-400 rounded-sm" />
        <div className="h-1 w-full bg-gray-300 rounded-sm" />
        <div className="border-b border-gray-200 my-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mt-4" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
    </div>
);

const ExecutiveThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-1/3 bg-slate-100 p-2 space-y-4">
            <div className="h-3 w-full bg-gray-500 rounded-sm" />
            <div className="h-1.5 w-2/3 bg-primary rounded-sm" />
            <div className="space-y-1 mt-4">
                 <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
                 <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
                 <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            </div>
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="h-4 w-1/2 bg-gray-500 rounded-sm"/>
            <div className="h-1.5 w-3/4 bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/3 bg-gray-500 rounded-sm mt-4"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const SimpleThumbnail: React.FC = () => (
    <div className="p-2 space-y-2 bg-white h-full">
        <div className="h-4 w-1/2 bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-3/4 bg-gray-300 rounded-sm" />
        <div className="border-b border-gray-300 my-1" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
    </div>
);

const TechnicalThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-1/3 bg-gray-800 p-2 space-y-3">
            <div className="h-2.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-2/3 bg-primary rounded-sm" />
            <div className="border-b border-gray-600 my-1" />
            <div className="space-y-1 mt-2">
                <div className="h-1.5 w-full bg-gray-500 rounded-sm" />
                <div className="h-1.5 w-full bg-gray-500 rounded-sm" />
                <div className="h-1.5 w-full bg-gray-500 rounded-sm" />
            </div>
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="h-2.5 w-1/2 bg-gray-500 rounded-sm border-b border-gray-300 pb-1"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-gray-500 rounded-sm border-b border-gray-300 pb-1 mt-4"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const AcademicThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full font-serif">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-1 w-3/4 mx-auto bg-gray-300 rounded-sm" />
        <div className="border-b-2 border-gray-300 my-2" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mt-2 mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mt-2 mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const SalesThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full flex gap-2">
        <div className="w-2/3 space-y-2">
            <div className="h-4 w-full bg-gray-400 rounded-sm" />
            <div className="h-2 w-2/3 bg-primary rounded-sm" />
            <div className="border-b border-primary my-1" />
            <div className="h-2 w-1/3 bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm mt-1" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        </div>
        <div className="w-1/3 space-y-2">
            <div className="h-2 w-full bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2 w-full bg-gray-400 rounded-sm mt-2"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const MarketingThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-1/3 bg-primary/10 p-2 space-y-2">
            <div className="h-3 w-full bg-primary rounded-sm" />
            <div className="h-2 w-2/3 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/2 bg-gray-400 rounded-sm mt-4" />
            <div className="flex flex-wrap gap-1">
                <div className="h-2 w-1/4 bg-primary/20 rounded-full" />
                <div className="h-2 w-1/3 bg-primary/20 rounded-full" />
                <div className="h-2 w-1/4 bg-primary/20 rounded-full" />
            </div>
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="h-2.5 w-1/2 bg-gray-400 rounded-sm"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-gray-400 rounded-sm mt-2"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const HealthcareThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-primary rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-300 rounded-sm" />
        <div className="border-b border-gray-300 my-2" />
        <div className="h-2 w-1/4 bg-primary rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-primary rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const LegalThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full font-serif">
        <div className="h-4 w-2/3 mx-auto bg-gray-500 rounded-sm" />
        <div className="h-1.5 w-full mx-auto bg-gray-300 rounded-sm" />
        <div className="w-1/4 h-px bg-black mx-auto my-2" />
        <div className="h-2 w-1/3 mx-auto bg-gray-500 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm mt-2" />
    </div>
);

const FinanceThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-1/3 bg-gray-100 p-2 space-y-3">
            <div className="h-3 w-full bg-gray-400 rounded-sm" />
            <div className="h-2 w-2/3 bg-primary rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-400 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="h-2.5 w-1/2 bg-gray-500 rounded-sm border-b border-gray-200 pb-1"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-gray-500 rounded-sm border-b border-gray-200 pb-1 mt-2"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const HospitalityThumbnail: React.FC = () => (
    <div className="p-2 space-y-2 bg-white h-full font-serif">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-2 w-2/3 mx-auto bg-gray-300 rounded-sm" />
        <div className="border-t border-gray-300 my-1 pt-1">
            <div className="h-1.5 w-3/4 mx-auto bg-gray-300 rounded-sm" />
        </div>
        <div className="h-2.5 w-1/3 bg-gray-400 rounded-sm mt-2 border-b border-gray-300 pb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const SoftwareEngineerThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full space-y-2">
        <div className="flex justify-between">
            <div className="w-1/2 space-y-1">
                <div className="h-4 w-full bg-gray-400 rounded-sm" />
                <div className="h-2 w-2/3 bg-primary rounded-sm" />
            </div>
            <div className="w-1/3 h-4 bg-gray-300 rounded-sm" />
        </div>
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const GraphicDesignerThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-1/3 bg-gray-100 p-2 flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <div className="h-3 w-full bg-gray-400 rounded-sm mt-1" />
            <div className="h-2 w-2/3 bg-gray-300 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-400 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="h-3 w-full bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-primary rounded-sm mt-4 border-l-2 border-primary pl-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const CustomerServiceThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full flex flex-col">
        <div className="flex justify-between items-start">
            <div className="w-2/3 space-y-1">
                <div className="h-3 w-full bg-gray-400 rounded-sm" />
                <div className="h-2 w-2/3 bg-primary rounded-sm" />
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20" />
        </div>
        <div className="border-b border-primary my-2" />
        <div className="flex gap-2 flex-grow">
            <div className="w-2/3 space-y-2">
                <div className="h-2 w-1/3 bg-gray-400 rounded-sm" />
                <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
                <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
            </div>
            <div className="w-1/3 space-y-2">
                 <div className="h-2 w-full bg-gray-400 rounded-sm" />
                 <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
                 <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            </div>
        </div>
    </div>
);

const ItProfessionalThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full space-y-2 font-mono">
        <div className="h-3 w-2/3 bg-primary rounded-sm" />
        <div className="h-2 w-1/2 bg-gray-400 rounded-sm" />
        <div className="h-4 w-full bg-gray-200 rounded-sm" />
        <div className="h-2 w-1/3 bg-primary rounded-sm mt-2" />
        <div className="h-6 w-full bg-gray-200 rounded-sm" />
        <div className="h-2 w-1/3 bg-primary rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const ProjectManagerThumbnail: React.FC = () => (
     <div className="flex h-full bg-white">
        <div className="w-1/3 bg-gray-100 p-2 space-y-3">
            <div className="h-3 w-full bg-gray-400 rounded-sm" />
            <div className="h-2 w-2/3 bg-primary rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-400 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-2/3 p-2 space-y-2">
            <div className="h-2.5 w-1/2 bg-gray-500 rounded-sm border-b border-gray-200 pb-1"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-gray-500 rounded-sm border-b border-gray-200 pb-1 mt-2"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const CreativeWriterThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full flex flex-col items-center font-serif">
        <div className="h-6 w-6 rounded-full bg-primary/20" />
        <div className="h-3 w-2/3 bg-gray-400 rounded-sm mt-1" />
        <div className="h-2 w-1/2 bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm mt-4" />
        <div className="w-1/4 h-px bg-gray-300 my-2" />
        <div className="h-2 w-1/3 bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);


export const ResumeThumbnail: React.FC<ResumeThumbnailProps> = ({ templateId }) => {
    const templates = {
        modern: <ModernThumbnail />,
        classic: <ClassicThumbnail />,
        creative: <CreativeThumbnail />,
        professional: <ProfessionalThumbnail />,
        minimalist: <MinimalistThumbnail />,
        executive: <ExecutiveThumbnail />,
        simple: <SimpleThumbnail />,
        technical: <TechnicalThumbnail />,
        academic: <AcademicThumbnail />,
        sales: <SalesThumbnail />,
        marketing: <MarketingThumbnail />,
        healthcare: <HealthcareThumbnail />,
        legal: <LegalThumbnail />,
        finance: <FinanceThumbnail />,
        hospitality: <HospitalityThumbnail />,
        'software-engineer': <SoftwareEngineerThumbnail />,
        'graphic-designer': <GraphicDesignerThumbnail />,
        'customer-service': <CustomerServiceThumbnail />,
        'it-professional': <ItProfessionalThumbnail />,
        'project-manager': <ProjectManagerThumbnail />,
        'creative-writer': <CreativeWriterThumbnail />,
    };

    return (
        <div className="w-full aspect-[1/1.414] overflow-hidden rounded-md bg-muted border border-gray-300">
            {templates[templateId]}
        </div>
    );
};
