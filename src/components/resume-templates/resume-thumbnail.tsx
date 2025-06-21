import React from 'react';

interface ResumeThumbnailProps {
  templateId: 'modern' | 'classic' | 'creative' | 'professional' | 'minimalist' | 'executive' | 'simple' | 'technical' | 'academic' | 'sales' | 'marketing' | 'healthcare' | 'legal' | 'finance' | 'hospitality' | 'software-engineer' | 'graphic-designer' | 'customer-service' | 'it-professional' | 'project-manager' | 'creative-writer';
}

const ModernThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-[18rem] bg-gray-100 p-2 space-y-3 flex-shrink-0">
            <div className="h-3 w-full bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-2/3 bg-blue-500 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-400 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[4px] bg-blue-500 flex-shrink-0" />
        <div className="p-2 space-y-2 flex-grow">
            <div className="h-2.5 w-1/4 bg-gray-400 rounded-sm" />
            <div className="h-6 w-full bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/4 bg-gray-400 rounded-sm mt-3" />
            <div className="h-6 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const ClassicThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full font-serif">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-300 rounded-sm" />
        <div className="w-full h-px bg-gray-300 my-2" />
        <div className="h-2 w-1/3 mx-auto bg-gray-400 rounded-sm mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-gray-400 rounded-sm mt-2 mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
    </div>
);

const CreativeThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-[40%] bg-pink-500 p-2 space-y-2 flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-white/50" />
            <div className="h-2.5 w-full bg-white/80 rounded-sm" />
            <div className="h-1.5 w-2/3 bg-white/50 rounded-sm" />
            <div className="h-2 w-1/2 bg-white/80 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-white/50 rounded-sm" />
        </div>
        <div className="w-[60%] p-2 space-y-2">
            <div className="h-3 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-3 w-1/2 bg-gray-400 rounded-sm mt-2" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const ProfessionalThumbnail: React.FC = () => (
    <div className="p-2 space-y-2 bg-white h-full font-sans">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-teal-500 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-300 rounded-sm mb-2" />
        <div className="h-2 w-1/4 bg-teal-500 rounded-sm" />
        <div className="flex justify-between items-center"><div className="h-1.5 w-1/3 bg-gray-300 rounded-sm" /><div className="h-1.5 w-1/4 bg-gray-300 rounded-sm" /></div>
        <div className="flex justify-between items-center"><div className="h-1.5 w-1/3 bg-gray-300 rounded-sm" /><div className="h-1.5 w-1/4 bg-gray-300 rounded-sm" /></div>
    </div>
);

const MinimalistThumbnail: React.FC = () => (
    <div className="p-3 space-y-3 bg-white h-full font-mono">
        <div className="h-4 w-3/5 bg-gray-500 rounded-sm" />
        <div className="h-1 w-2/3 bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm mt-4" />
        <div className="h-2 w-1/4 bg-gray-500 rounded-sm mt-4" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const ExecutiveThumbnail: React.FC = () => (
    <div className="flex h-full bg-white font-serif">
        <div className="w-[72%] p-2 space-y-2">
            <div className="h-4 w-2/3 mx-auto bg-gray-400 rounded-sm" />
            <div className="h-2.5 w-1/3 bg-amber-800 rounded-sm border-b-2 border-amber-800 pb-1 mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[28%] bg-amber-800/10 p-2 space-y-3">
            <div className="h-2 w-full bg-amber-800 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-2/3 bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const SimpleThumbnail: React.FC = () => (
    <div className="p-2 space-y-2 bg-white h-full">
        <div className="h-4 w-1/2 bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-3/4 bg-gray-300 rounded-sm border-t border-gray-300 pt-1 mt-1" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const TechnicalThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-[35%] p-2 space-y-2 bg-gray-800">
            <div className="h-8 w-8 rounded-full bg-teal-500" />
            <div className="h-2 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-400 rounded-sm" />
        </div>
        <div className="w-[65%] p-2 space-y-2">
            <div className="h-3 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const AcademicThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full font-serif">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/3 bg-blue-900 rounded-sm mt-2 border-b border-blue-900 pb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const SalesThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full flex gap-2">
        <div className="w-[70%] space-y-2">
            <div className="h-4 w-full bg-gray-400 rounded-sm" />
            <div className="h-2 w-2/3 bg-red-700 rounded-sm" />
            <div className="border-b-2 border-red-700 my-1" />
            <div className="h-2 w-1/3 bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[30%] space-y-2">
            <div className="h-2 w-full bg-gray-400 rounded-sm" />
            <div className="h-6 w-full bg-red-700/10 rounded-sm" />
            <div className="h-2 w-full bg-gray-400 rounded-sm mt-2"/>
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const MarketingThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-[62%] p-2 space-y-2">
            <div className="h-5 w-2/3 bg-pink-500 rounded-sm" />
            <div className="h-2 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2.5 w-1/3 bg-gray-400 rounded-sm mt-4 border-b border-gray-200 pb-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[38%] bg-pink-500/10 p-2 space-y-2">
            <div className="h-2 w-full bg-pink-500 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2 w-full bg-pink-500 rounded-sm mt-2" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const HealthcareThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full">
        <div className="h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-green-500 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-300 rounded-sm" />
        <div className="w-full h-px bg-gray-200 my-2" />
        <div className="h-2 w-1/4 bg-green-500 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const LegalThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-2 bg-blue-900" />
        <div className="p-2 space-y-1 flex-1 font-serif">
            <div className="h-4 w-2/3 bg-gray-500 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-500 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const FinanceThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full grid grid-cols-3 gap-2">
        <div className="col-span-3 h-4 w-1/2 mx-auto bg-gray-400 rounded-sm" />
        <div className="col-span-3 h-2.5 w-full bg-blue-800 rounded-sm border-b-2 border-blue-800 pb-1" />
        <div className="col-span-2 space-y-2">
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        </div>
        <div className="col-span-1 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const HospitalityThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-[30%] bg-gray-100 p-2 space-y-2">
            <div className="h-3 w-full bg-gray-400 rounded-sm" />
            <div className="h-2 w-2/3 bg-amber-500 rounded-sm" />
            <div className="h-2 w-1/3 bg-amber-500 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[70%] p-2 space-y-2">
            <div className="h-2.5 w-1/2 bg-gray-400 rounded-sm border-b-2 border-amber-500 pb-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const SoftwareEngineerThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full space-y-2">
        <div className="flex justify-between items-center">
            <div className="w-1/2 space-y-1">
                <div className="h-4 w-full bg-gray-400 rounded-sm" />
                <div className="h-2 w-2/3 bg-indigo-500 rounded-sm" />
            </div>
            <div className="w-1/3 h-2 bg-gray-300 rounded-sm" />
        </div>
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm" />
        <div className="grid grid-cols-4 gap-2">
          <div className="h-1.5 bg-gray-300 rounded-sm" />
          <div className="h-1.5 bg-gray-300 rounded-sm" />
          <div className="h-1.5 bg-gray-300 rounded-sm" />
          <div className="h-1.5 bg-gray-300 rounded-sm" />
        </div>
        <div className="h-2 w-1/4 bg-gray-400 rounded-sm mt-2" />
        <div className="h-6 w-full bg-gray-200 rounded-sm" />
    </div>
);

const GraphicDesignerThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-[36%] bg-gray-100 p-2 flex flex-col items-center space-y-2">
            <div className="h-8 w-8 rounded-full bg-gray-300" />
            <div className="h-2 w-1/3 bg-fuchsia-500 rounded-sm border-b-2 border-fuchsia-500 pb-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[64%] p-2 space-y-2">
            <div className="h-5 w-2/3 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/2 bg-fuchsia-500 rounded-sm" />
            <div className="h-3 w-full bg-fuchsia-500 rounded-sm mt-2 p-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const CustomerServiceThumbnail: React.FC = () => (
    <div className="flex h-full bg-white">
        <div className="w-[33%] bg-cyan-500/10 p-2 space-y-2">
            <div className="h-3 w-full bg-gray-400" />
            <div className="h-2 w-2/3 bg-cyan-500" />
            <div className="h-2 w-1/2 bg-gray-400 mt-4" />
            <div className="h-4 w-full bg-white rounded-sm border" />
        </div>
        <div className="w-[67%] p-2 space-y-2">
            <div className="h-2.5 w-1/2 bg-cyan-500" />
            <div className="h-1.5 w-full bg-gray-300" />
            <div className="h-2.5 w-1/2 bg-cyan-500 mt-2" />
            <div className="h-1.5 w-full bg-gray-300" />
        </div>
    </div>
);

const ItProfessionalThumbnail: React.FC = () => (
    <div className="p-2 bg-gray-900 h-full font-mono grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-2">
            <div className="h-3 w-full bg-purple-500" />
            <div className="h-1.5 w-full bg-gray-400" />
            <div className="h-1.5 w-full bg-gray-400" />
            <div className="h-1.5 w-full bg-gray-400" />
        </div>
        <div className="col-span-1 space-y-2">
            <div className="h-2.5 w-full bg-purple-500" />
            <div className="h-1.5 w-full bg-gray-400" />
            <div className="h-2.5 w-full bg-purple-500 mt-2" />
            <div className="h-1.5 w-full bg-gray-400" />
        </div>
    </div>
);

const ProjectManagerThumbnail: React.FC = () => (
     <div className="flex h-full bg-white">
        <div className="w-[72%] p-2 space-y-2">
            <div className="h-3 w-2/3 bg-gray-400" />
            <div className="h-2 w-1/2 bg-rose-600" />
            <div className="h-2 w-1/3 bg-gray-400 border-b-2 border-rose-600 pb-1 mt-2" />
            <div className="h-1.5 w-full bg-gray-300" />
        </div>
        <div className="w-[28%] bg-rose-600/10 p-2 space-y-2">
            <div className="h-2 w-full bg-rose-600" />
            <div className="h-1.5 w-full bg-gray-300" />
            <div className="h-1.5 w-2/3 bg-gray-300" />
        </div>
    </div>
);

const CreativeWriterThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full flex flex-col items-center font-serif">
        <div className="h-4 w-2/3 bg-gray-400 mt-1" />
        <div className="h-2 w-1/2 bg-gray-300" />
        <div className="h-1.5 w-full bg-orange-700/80 rounded-full my-4" />
        <div className="h-2 w-1/3 bg-gray-400" />
        <div className="h-1.5 w-full bg-gray-300" />
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
