import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  FileText,
  FolderOpen,
  Calculator,
  Link2,
  ClipboardCheck,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    title: 'Know What They\'re Looking For',
    description: 'Access DBQ forms and rating criteria the VA uses to evaluate your conditions. Know exactly what evidence you need before you file.',
    icon: FileText,
    gradient: 'from-[#D6B25E] to-cyan-500'
  },
  {
    title: 'Build Your Evidence Package',
    description: 'Track medical records, service records, and buddy statements in one organized place. Export everything when you\'re ready to file.',
    icon: FolderOpen,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Calculate Your True Rating',
    description: 'Our VA math calculator handles bilateral factors and combined ratings so you know exactly what to expect.',
    icon: Calculator,
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    title: 'Discover Secondary Conditions',
    description: 'Find hidden connections between your conditions. 800+ conditions with 775+ secondary connections to support your claim.',
    icon: Link2,
    gradient: 'from-[#D6B25E] to-[#D6B25E]'
  },
  {
    title: 'Dominate Your C&P Exam',
    description: 'Generate personalized exam preparation guides. Know what questions to expect and how to describe your worst days.',
    icon: ClipboardCheck,
    gradient: 'from-rose-500 to-pink-500'
  },
  {
    title: 'Document Your Worst Days',
    description: 'Log symptoms daily to build a compelling record. The VA needs to see how your conditions affect your life on bad days.',
    icon: BookOpen,
    gradient: 'from-[#8A5A16] to-[#D6B25E]'
  }
];

export function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#000000] mb-4">
            Everything You Need to Win
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
            Professional-grade claim preparation. No consultant required.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#000000] mb-2 group-hover:text-[#0a0a0a] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Hover arrow indicator */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
