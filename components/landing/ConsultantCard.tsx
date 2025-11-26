import Image from 'next/image';

export interface Consultant {
  id: string;
  name: string;
  image: string;
  university: string;
  major: string;
}

interface ConsultantCardProps {
  consultant: Consultant;
}

export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  return (
    <div className="group relative">
      {/* Card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#E2E8F0] hover:border-[#FF6B4A]/30 hover:-translate-y-2">
        {/* Image container */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#E85537] rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
            <Image
              src={consultant.image}
              alt={consultant.name}
              fill
              sizes="112px"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <h4 className="font-bold text-[#0F172A] text-lg mb-1">{consultant.name}</h4>
          <p className="text-sm font-medium text-[#FF6B4A] mb-1">{consultant.university}</p>
          <p className="text-xs text-[#64748B] leading-tight">{consultant.major}</p>
        </div>
      </div>
    </div>
  );
}
