'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const experiences = [
  {
    company: 'Datadog',
    role: 'Software Engineer, Frontend - Infrastructure Management',
    period: 'Jan 2025 - Present',
    location: 'New York, NY',
    highlights: [
      'Building infrastructure management tools for monitoring and observability',
      'Developing scalable frontend solutions for enterprise customers',
    ],
  },
  {
    company: 'Opto Investments',
    role: 'Software Engineer, Frontend - CIO',
    period: 'Aug 2024 - Dec 2024',
    location: 'New York, NY',
    highlights: [
      'Led frontend development for Chief Investment Office platform',
      'Implemented data visualization tools for investment analytics',
    ],
  },
  {
    company: 'Peloton Interactive',
    role: 'Software Engineer - Developer Experience',
    period: 'Jun 2021 - May 2024',
    location: 'New York, NY',
    highlights: [
      'Built Developer Insights Platform featured in The Pragmatic Engineer (646K+ subscribers)',
      'Launched Peloton Developer Portal serving 4000+ employees',
      'Led scorecards product development for software health monitoring',
      'Reduced time to first commit from 27 to 6 days for new engineers',
    ],
  },
  {
    company: 'Paperspace',
    role: 'Front End Engineer',
    period: '2019 - 2021',
    location: 'Brooklyn, NY',
    highlights: [
      'Designed UI for Community Notebooks product serving 500K+ AI developers',
      'Built ML model deployment interfaces resulting in $250K+ enterprise contract',
      'Led migration from Redux to modern React patterns improving performance',
    ],
    note: 'Acquired by DigitalOcean',
  },
];

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
            Experience
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gray-300 dark:bg-gray-700" />

            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                }`}
              >
                <div
                  className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:ml-auto'
                  }`}
                >
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ml-6 md:ml-0">
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full" />

                    <div className="flex flex-wrap items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {exp.company}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                          {exp.role}
                        </p>
                      </div>
                      {exp.note && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                          {exp.note}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {exp.period} • {exp.location}
                    </p>

                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, hIndex) => (
                        <li
                          key={hIndex}
                          className="text-gray-700 dark:text-gray-300 text-sm flex items-start"
                        >
                          <span className="text-purple-600 dark:text-purple-400 mr-2">▸</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}