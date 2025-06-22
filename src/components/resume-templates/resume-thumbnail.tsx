import React from 'react';

interface ResumeThumbnailProps {
  templateId: keyof typeof templates;
}

const ModernThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[30%] bg-blue-100 rounded-l-sm p-1.5 space-y-2.5">
            <div className="h-2 w-1/2 bg-blue-500 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2 w-1/2 bg-blue-500 rounded-sm mt-3" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[4px] bg-blue-500" />
        <div className="w-[70%] p-1.5 space-y-2">
            <div className="h-4 w-3/4 bg-blue-500 rounded-sm" />
            <div className="h-2 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-500 rounded-sm mt-3" />
            <div className="h-8 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const ClassicThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full font-serif border border-gray-300">
        <div className="h-4 w-1/2 mx-auto bg-gray-600 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-400 rounded-sm" />
        <div className="w-full h-px bg-gray-300 my-2" />
        <div className="h-2 w-1/3 mx-auto bg-gray-700 rounded-sm mb-1" />
        <div className="h-1 w-full bg-gray-300 rounded-sm" />
        <div className="h-1 w-full bg-gray-300 rounded-sm" />
        <div className="h-1 w-5/6 bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-gray-700 rounded-sm mt-2 mb-1" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
    </div>
);

const CreativeThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[40%] bg-orange-100 rounded-l-sm p-1.5 space-y-2 flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-white shadow-md border-2 border-orange-200" />
            <div className="h-2 w-full bg-orange-500 text-white p-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-2 w-full bg-orange-500 text-white mt-2 p-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[60%] p-1.5 space-y-2">
            <div className="h-4 w-3/4 bg-orange-500 rounded-sm" />
            <div className="h-2 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-gray-400 rounded-sm mt-2 border-b-2 border-orange-500 pb-1" />
            <div className="h-8 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const ProfessionalThumbnail: React.FC = () => (
    <div className="p-2 space-y-2 bg-white h-full font-sans border border-gray-300">
        <div className="h-4 w-1/2 mx-auto bg-gray-600 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-teal-800 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-400 rounded-sm mb-2" />
        <hr className="my-1 border-gray-300"/>
        <div className="h-2.5 w-1/4 bg-teal-800 rounded-sm" />
        <div className="flex justify-between items-center"><div className="h-1.5 w-1/3 bg-gray-500 rounded-sm" /><div className="flex-grow border-b border-dotted mx-2 border-gray-400"></div><div className="h-1.5 w-1/4 bg-gray-400 rounded-sm" /></div>
        <div className="flex justify-between items-center"><div className="h-1.5 w-1/3 bg-gray-500 rounded-sm" /><div className="flex-grow border-b border-dotted mx-2 border-gray-400"></div><div className="h-1.5 w-1/4 bg-gray-400 rounded-sm" /></div>
    </div>
);

const MinimalistThumbnail: React.FC = () => (
    <div className="p-3 space-y-3 bg-white h-full font-mono border border-gray-300">
        <div className="h-4 w-3/5 bg-gray-600 rounded-sm" />
        <div className="h-1 w-2/3 bg-gray-500 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm mt-4" />
        <div className="h-2 w-1/4 bg-gray-700 rounded-sm mt-4" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const ExecutiveThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[72%] p-1.5 space-y-2">
            <div className="h-4 w-2/3 bg-yellow-900 rounded-sm" />
            <div className="h-2.5 w-1/3 bg-yellow-900 rounded-sm border-b-2 border-yellow-900 pb-1 mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
            <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[28%] p-1.5 space-y-3 bg-yellow-50 rounded-r-sm">
            <div className="h-2 w-full bg-gray-500 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-400 rounded-sm" />
            <div className="h-1.5 w-2/3 bg-gray-400 rounded-sm" />
        </div>
    </div>
);

const SimpleThumbnail: React.FC = () => (
    <div className="p-2 space-y-2 bg-white h-full border border-gray-300">
        <div className="h-4 w-1/2 mx-auto bg-gray-500 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-gray-500 rounded-sm" />
        <div className="h-2 w-1/4 bg-gray-600 rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-1.5 w-5/6 bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-gray-600 rounded-sm mt-2" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
    </div>
);

const TechnicalThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-2">
        <div className="w-[60%] p-1.5 space-y-2">
            <div className="h-4 w-2/3 bg-teal-600 rounded-sm" />
            <div className="h-8 w-full bg-gray-200 rounded-sm" />
            <div className="pl-2 relative"><div className="absolute left-0 top-0 h-full w-0.5 bg-teal-600"></div><div className="h-6 w-full bg-gray-300 rounded-sm"></div></div>
        </div>
        <div className="w-[40%] p-1.5 space-y-2">
            <div className="h-2 w-1/2 bg-teal-600 rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
            <div className="h-2 w-1/2 bg-teal-600 rounded-sm mt-2" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const AcademicThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full font-serif border border-gray-300">
        <div className="h-4 w-1/2 mx-auto bg-gray-500 rounded-sm" />
        <div className="h-1.5 w-3/4 mx-auto bg-gray-400 rounded-sm" />
        <div className="h-2 w-1/3 bg-blue-900 rounded-sm mt-2 border-b border-blue-900 pb-1" />
        <div className="h-1 w-full bg-gray-300 rounded-sm" />
        <div className="h-1 w-5/6 bg-gray-300 rounded-sm" />
    </div>
);

const SalesThumbnail: React.FC = () => (
    <div className="p-1 bg-white h-full flex gap-1">
        <div className="w-[73%] p-1.5 space-y-2">
            <div className="h-4 w-full bg-red-700 rounded-sm border-b-2 border-red-700 pb-1" />
            <div className="h-2 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/3 bg-red-700 mt-2" />
            <div className="h-6 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[27%] p-1.5 space-y-2 bg-red-50 rounded-r-sm">
            <div className="h-2 w-full bg-gray-400 rounded-sm" />
            <div className="h-6 w-full bg-white shadow rounded-sm" />
            <div className="h-2 w-full bg-gray-400 rounded-sm mt-2"/>
            <div className="h-4 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const MarketingThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[62%] p-1.5 space-y-2">
            <div className="h-5 w-2/3 bg-pink-500 rounded-sm" />
            <div className="h-2 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2.5 w-1/3 bg-gray-400 rounded-sm mt-4 border-b border-pink-200 pb-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[38%] p-1.5 space-y-2 bg-pink-50 rounded-r-sm">
            <div className="h-2 w-full bg-pink-500 rounded-sm" />
            <div className="h-4 w-full bg-white rounded-sm shadow" />
            <div className="h-2 w-full bg-pink-500 rounded-sm mt-2" />
            <div className="h-6 w-full bg-white rounded-sm shadow" />
        </div>
    </div>
);

const HealthcareThumbnail: React.FC = () => (
    <div className="p-2 space-y-1 bg-white h-full border border-gray-300">
        <div className="h-4 w-1/2 mx-auto bg-gray-500 rounded-sm" />
        <div className="h-2 w-1/3 mx-auto bg-green-600 rounded-sm" />
        <hr className="my-2 border-gray-300" />
        <div className="h-2 w-1/4 bg-green-600 rounded-sm" />
        <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        <div className="h-2 w-1/4 bg-green-600 rounded-sm mt-2" />
        <div className="h-4 w-full bg-gray-200 rounded-sm" />
    </div>
);

const LegalThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1">
        <div className="w-1 bg-blue-900 rounded-l-sm" />
        <div className="p-1.5 space-y-1 flex-1 font-serif">
            <div className="h-4 w-2/3 bg-gray-600 rounded-sm" />
            <div className="h-1.5 w-full bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-600 rounded-sm mt-4" />
            <div className="h-6 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const FinanceThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full grid grid-cols-3 gap-2 border border-gray-300">
        <div className="col-span-3 h-4 w-1/2 mx-auto bg-gray-500 rounded-sm" />
        <div className="col-span-3 h-2.5 w-full bg-blue-800 rounded-sm border-b-2 border-blue-800 pb-1" />
        <div className="col-span-2 space-y-2">
            <div className="h-6 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="col-span-1 space-y-2">
            <div className="h-4 w-full bg-blue-100 rounded-sm" />
            <div className="h-4 w-full bg-blue-100 rounded-sm" />
        </div>
    </div>
);

const HospitalityThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[30%] bg-amber-50 rounded-l-sm p-1.5 space-y-2">
            <div className="h-3 w-full bg-gray-400 rounded-sm" />
            <div className="h-2 w-2/3 bg-amber-500 rounded-sm" />
            <div className="h-2 w-1/3 bg-amber-500 rounded-sm mt-4" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[70%] p-1.5 space-y-2">
            <div className="h-2.5 w-1/2 bg-gray-400 rounded-sm border-b-2 border-amber-500 pb-1" />
            <div className="h-6 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const SoftwareEngineerThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[35%] p-1.5 space-y-2 bg-indigo-50 rounded-l-sm">
             <div className="h-4 w-full bg-gray-400 rounded-sm" />
             <div className="h-2 w-2/3 bg-indigo-500 rounded-sm" />
             <div className="h-2 w-1/2 bg-gray-400 mt-3" />
             <div className="h-4 w-full bg-white shadow-inner" />
        </div>
        <div className="w-[65%] p-1.5 space-y-2">
            <div className="h-2 w-1/4 bg-gray-500 rounded-sm" />
            <div className="h-6 w-full bg-gray-200 rounded-sm" />
            <div className="h-2 w-1/4 bg-gray-500 rounded-sm mt-2" />
            <div className="h-6 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const GraphicDesignerThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[36%] bg-gray-100 rounded-l-sm p-1.5 flex flex-col items-center space-y-2">
            <div className="h-8 w-8 rounded-full bg-gray-300" />
            <div className="h-2 w-1/3 bg-pink-500 rounded-sm border-b-2 border-pink-500 pb-1" />
            <div className="h-1.5 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[64%] p-1.5 space-y-2">
            <div className="h-5 w-2/3 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/2 bg-pink-500 rounded-sm" />
            <div className="h-3 w-full bg-pink-500 rounded-sm mt-2 p-1" />
            <div className="h-4 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const CustomerServiceThumbnail: React.FC = () => (
    <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[33%] p-1.5 space-y-2 bg-cyan-50 rounded-l-sm">
            <div className="h-3 w-full bg-gray-400" />
            <div className="h-2 w-2/3 bg-cyan-700" />
            <div className="h-2 w-1/2 bg-cyan-700 mt-4" />
            <div className="h-4 w-full bg-white rounded-sm border border-gray-200" />
        </div>
        <div className="w-[67%] p-1.5 space-y-2">
            <div className="h-2.5 w-1/2 bg-cyan-700" />
            <div className="h-6 w-full bg-gray-300 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-cyan-700 mt-2" />
            <div className="h-6 w-full bg-gray-300 rounded-sm" />
        </div>
    </div>
);

const ItProfessionalThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full grid grid-cols-5 gap-2 border border-gray-300">
        <div className="col-span-3 space-y-2">
            <div className="h-3 w-full bg-purple-700 rounded-sm" />
            <div className="h-6 w-full bg-gray-200 rounded-sm" />
            <div className="h-3 w-full bg-purple-700 mt-2 rounded-sm" />
            <div className="h-6 w-full bg-gray-200 rounded-sm" />
        </div>
        <div className="col-span-2 space-y-2">
            <div className="h-2.5 w-full bg-purple-700 rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
            <div className="h-2.5 w-full bg-purple-700 mt-2 rounded-sm" />
            <div className="h-4 w-full bg-gray-200 rounded-sm" />
        </div>
    </div>
);

const ProjectManagerThumbnail: React.FC = () => (
     <div className="flex h-full bg-white p-1 gap-1">
        <div className="w-[72%] p-1.5 space-y-2">
            <div className="h-3 w-2/3 bg-rose-600 rounded-sm" />
            <div className="h-2 w-1/2 bg-gray-400 rounded-sm" />
            <div className="h-2 w-1/3 bg-gray-400 border-b-2 border-rose-600 pb-1 mt-2" />
            <div className="h-6 w-full bg-gray-300 rounded-sm" />
        </div>
        <div className="w-[28%] p-1.5 space-y-2 bg-rose-50 rounded-r-sm">
            <div className="h-2 w-full bg-rose-600 rounded-sm" />
            <div className="h-4 w-full bg-white rounded-sm shadow-inner" />
            <div className="h-2 w-full bg-rose-600 mt-2 rounded-sm" />
            <div className="h-4 w-full bg-white rounded-sm shadow-inner" />
        </div>
    </div>
);

const CreativeWriterThumbnail: React.FC = () => (
    <div className="p-2 bg-white h-full flex flex-col items-center font-serif border border-gray-300">
        <div className="h-4 w-2/3 bg-gray-500 mt-1 rounded-sm" />
        <div className="h-2 w-1/2 bg-gray-400 rounded-sm" />
        <div className="h-2 w-full my-3 border-y-4 border-orange-200 py-1" />
        <div className="h-2 w-1/3 bg-orange-800 rounded-sm" />
        <div className="h-6 w-full bg-gray-300 rounded-sm" />
    </div>
);

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

export const ResumeThumbnail: React.FC<ResumeThumbnailProps> = ({ templateId }) => {
    return (
        <div className="w-full aspect-[1/1.414] overflow-hidden rounded-md bg-muted border border-gray-300 shadow-inner">
            {templates[templateId]}
        </div>
    );
};
