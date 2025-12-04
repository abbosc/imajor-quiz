'use client';

import ConsultantCard, { Consultant, ClipPosition } from './ConsultantCard';

const CONSULTANTS: Consultant[] = [
  { id: '1', name: 'Jasurbek', image: '/consultants/jasurbek.jpg', university: 'Harvard', major: 'Mechanical Engineering' },
  { id: '2', name: 'Ozodbek', image: '/consultants/ozodbek.jpg', university: 'Amherst', major: 'Econ & Political Science' },
  { id: '3', name: 'Jamshidbek', image: '/consultants/jamshidbek.jpg', university: 'Vanderbilt', major: 'Neuroscience' },
  { id: '4', name: 'Murod', image: '/consultants/murod.jpg', university: 'NYUAD', major: 'Mechanical Engineering' },
  { id: '5', name: 'Parviz', image: '/consultants/parviz.jpg', university: 'NYUAD', major: 'Economics & Politics' },
];

// Determine clip position based on index
function getClipPosition(index: number, total: number): ClipPosition {
  if (total === 1) return 'single';
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'middle';
}

export default function ConsultantStack() {
  const total = CONSULTANTS.length;

  return (
    <div className="mt-12">
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:overflow-visible">
        <div
          className="flex justify-start md:justify-center"
          style={{
            // Negative margin to make diagonal cuts overlap
            marginLeft: '-8px',
            marginRight: '-8px',
          }}
        >
          {CONSULTANTS.map((consultant, index) => (
            <div
              key={consultant.id}
              style={{
                // Negative margin to overlap diagonal cuts
                marginLeft: index === 0 ? '0' : '-24px',
              }}
            >
              <ConsultantCard
                consultant={consultant}
                clipPosition={getClipPosition(index, total)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint for mobile */}
      <div className="flex justify-center mt-2 md:hidden">
        <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Swipe to see all</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
