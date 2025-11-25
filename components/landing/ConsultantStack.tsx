'use client';

import ConsultantCard, { Consultant } from './ConsultantCard';

const CONSULTANTS: Consultant[] = [
  { id: '1', name: 'Jasurbek', image: '/consultants/jasurbek.jpg', university: 'Harvard', major: 'Mechanical Engineering' },
  { id: '2', name: 'Azizbek', image: '/consultants/azizbek.jpg', university: 'Harvard', major: 'Public Admin & Economics' },
  { id: '3', name: 'Levsha', image: '/consultants/levsha.jpg', university: 'HKUST', major: 'Economics & Finance' },
  { id: '4', name: 'Ozodbek', image: '/consultants/ozodbek.jpg', university: 'Amherst', major: 'Econ & Political Science' },
  { id: '5', name: 'Jamshidbek', image: '/consultants/jamshidbek.jpg', university: 'Vanderbilt', major: 'Neuroscience' },
  { id: '6', name: 'Murod', image: '/consultants/murod.jpg', university: 'NYUAD', major: 'Mechanical Engineering' },
  { id: '7', name: 'Parviz', image: '/consultants/parviz.jpg', university: 'NYUAD', major: 'Economics & Politics' },
];

export default function ConsultantStack() {
  return (
    <div className="mt-12">
      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-4 gap-6 max-w-5xl mx-auto">
        {/* First row: 4 cards */}
        {CONSULTANTS.slice(0, 4).map((consultant) => (
          <ConsultantCard key={consultant.id} consultant={consultant} />
        ))}
      </div>

      {/* Second row: 3 cards centered */}
      <div className="hidden md:flex justify-center gap-6 mt-6">
        {CONSULTANTS.slice(4).map((consultant) => (
          <div key={consultant.id} className="w-[calc(25%-18px)]">
            <ConsultantCard consultant={consultant} />
          </div>
        ))}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {CONSULTANTS.map((consultant) => (
            <div key={consultant.id} className="w-48 flex-shrink-0">
              <ConsultantCard consultant={consultant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
