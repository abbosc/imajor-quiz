import Image from 'next/image';

export interface Consultant {
  id: string;
  name: string;
  image: string;
  university: string;
  major: string;
}

export type ClipPosition = 'first' | 'middle' | 'last' | 'single';

interface ConsultantCardProps {
  consultant: Consultant;
  clipPosition?: ClipPosition;
}

// Clip-path styles for diagonal cuts
const clipPaths: Record<ClipPosition, string> = {
  first: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',      // Cut on right
  middle: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)',   // Cut on both sides
  last: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',    // Cut on left
  single: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',    // No cuts
};

export default function ConsultantCard({ consultant, clipPosition = 'single' }: ConsultantCardProps) {
  return (
    <div className="relative flex-shrink-0 w-44 md:w-52">
      {/* Big Photo with diagonal clip */}
      <div
        className="relative h-52 md:h-64 overflow-hidden"
        style={{ clipPath: clipPaths[clipPosition] }}
      >
        <Image
          src={consultant.image}
          alt={consultant.name}
          fill
          sizes="(max-width: 768px) 176px, 208px"
          className="object-cover"
          loading="lazy"
        />
        {/* Subtle gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Info below photo */}
      <div className="text-center py-3 px-2">
        <h4 className="font-bold text-[#0F172A] text-base md:text-lg mb-0.5">
          {consultant.name}
        </h4>
        <p className="text-sm font-medium text-[#FF6B4A] mb-0.5">
          {consultant.university}
        </p>
        <p className="text-xs text-[#64748B] leading-tight">
          {consultant.major}
        </p>
      </div>
    </div>
  );
}
