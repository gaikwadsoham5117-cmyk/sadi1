import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  saree: string;
  rating: number;
  text: string;
  date: string;
}

export const ReviewSection: React.FC = () => {
  const reviews: ReviewItem[] = [
    {
      id: 'rev-1',
      name: 'Priyanka Patil',
      location: 'Pune, Maharashtra',
      saree: 'Royal Yeola Paithani Saree',
      rating: 5,
      text: 'Wore this for my brother\'s wedding reception. The peacock pallu is breathtakingly fine and the silk drape falls royally. Everyone asked where I bought it! Customer service was also very helpful over WhatsApp.',
      date: 'August 2026'
    },
    {
      id: 'rev-2',
      name: 'Sunita Ramanathan',
      location: 'Bengaluru, Karnataka',
      saree: 'Kanchipuram Bridal Silk Saree',
      rating: 5,
      text: 'An authentic heirloom treasure. The weight of the silk and the tightness of the korvai weave prove its uncompromised authenticity. Delivered safely in a protective wooden-finish silk box.',
      date: 'July 2026'
    },
    {
      id: 'rev-3',
      name: 'Aishwarya Deshmukh',
      location: 'Kolhapur, Maharashtra',
      saree: 'Heritage Yeola Muniya Border Paithani',
      rating: 5,
      text: 'Having visited their physical showroom near Mahalakshmi Temple earlier, ordering online was equally seamless. The tested zari shines with vintage grace without any harsh glitter.',
      date: 'September 2026'
    }
  ];

  return (
    <section className="py-16 bg-[#FDF9F2] border-y border-[#2C1B16]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5A1022] mb-1">
            Words of Devotion
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1B16] font-normal">
            Heirloom Stories from Our Brides
          </h2>
          <div className="w-16 h-0.5 bg-[#C9A227] mx-auto mt-3 mb-3" />
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#2C1B16]/80">
            <div className="flex text-[#C9A227]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className="fill-current" />
              ))}
            </div>
            <span className="font-semibold text-sm">4.9 / 5.0</span>
            <span className="text-[#2C1B16]/40">·</span>
            <span>Over 2,400+ Verified Orders Delivered</span>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative"
            >
              <Quote className="text-[#C9A227]/30 absolute top-4 right-4" size={32} />

              <div className="space-y-3">
                <div className="flex text-[#C9A227]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>

                <p className="text-sm text-[#2C1B16]/80 font-light leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#2C1B16]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#2C1B16] flex items-center gap-1.5">
                      {rev.name}
                      <span title="Verified Customer" className="inline-flex items-center">
                        <CheckCircle size={13} className="text-emerald-700" />
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#2C1B16]/60">{rev.location}</p>
                  </div>
                  <span className="text-[11px] text-[#2C1B16]/50">{rev.date}</span>
                </div>
                <p className="text-[11px] text-[#5A1022] mt-1 font-medium truncate">
                  Draped: {rev.saree}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
