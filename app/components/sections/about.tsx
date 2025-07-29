'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            About Me
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              I&apos;m a <span className="text-purple-600 dark:text-purple-400 font-semibold">Software Engineer</span> currently 
              building infrastructure management tools at{' '}
              <span className="font-semibold">Datadog</span>. With a passion for creating 
              elegant solutions to complex problems, I specialize in frontend engineering, 
              developer experience, and emerging Web3 technologies.
            </p>
            
            <p>
              My journey in tech has taken me from building ML platforms at Paperspace 
              (acquired by DigitalOcean) to revolutionizing developer experience at Peloton, 
              where my work on the Developer Insights Platform was featured in{' '}
              <span className="italic">The Pragmatic Engineer</span> newsletter.
            </p>
            
            <p>
              When I&apos;m not coding, you&apos;ll find me following economic trends, exploring 
              new technologies, playing basketball, or diving deep into human psychology. 
              I believe in building products that not only solve problems but also create 
              delightful experiences for users.
            </p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 h-1 bg-gradient-to-r from-purple-600 to-purple-400 origin-left"
          />
        </motion.div>
      </div>
    </section>
  );
}