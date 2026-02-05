import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { XCircle, DollarSign, Clock, HelpCircle } from 'lucide-react';

const stats = [
  {
    value: '73%',
    label: 'of initial claims are denied or underrated',
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100'
  },
  {
    value: '$15,000+',
    label: 'average cost for claim consultant "help"',
    icon: DollarSign,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100'
  },
  {
    value: '4.5 years',
    label: 'average wait for appeals',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100'
  },
  {
    value: 'Zero',
    label: 'training given to veterans on how to file',
    icon: HelpCircle,
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-100'
  }
];

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A1628] mb-4">
            The VA Claims System Is Broken
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
            Veterans deserve better than this.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`relative p-6 sm:p-8 rounded-2xl ${stat.bgColor} border ${stat.borderColor} text-center`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xl sm:text-2xl text-gray-700 font-medium max-w-3xl mx-auto">
            You served. You shouldn't need a lawyer to get what's yours.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
