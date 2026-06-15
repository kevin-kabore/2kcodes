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
              I&apos;m a <span className="text-purple-600 dark:text-purple-400 font-semibold">Software Engineer</span> at{' '}
              <span className="font-semibold">Datadog</span>, on the Event Signal Processing team, where I
              architect scalable event-driven systems that turn massive, high-frequency machine data into
              something genuinely useful, for people and AI agents alike. I&apos;m guided by two
              convictions: that the best technology makes complex things feel simple, and that its real
              purpose is to help people and societies live, learn and create.
            </p>

            <p>
              My focus is <span className="text-purple-600 dark:text-purple-400 font-semibold">architecting scalable event-driven and AI systems</span> for
              enterprise, making data and products genuinely useful to both the people and the AI agents
              that increasingly rely on them. Recently that&apos;s meant leveraging large language models to cut infrastructure alert noise
              by over <span className="font-semibold">98%</span>, and building systems that enrich raw
              change events with the context humans and agents actually need to act.
            </p>

            <p>
              My path has taken me from building ML platforms at Paperspace
              (acquired by DigitalOcean) to reimagining developer experience at Peloton,
              where my work on the Developer Insights Platform was featured in{' '}
              <span className="italic">The Pragmatic Engineer</span> newsletter.
            </p>

            <p>
              Outside of Datadog, I co-founded{' '}
              <a
                href="https://www.brekkiebakery.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Brekkie Bakery
              </a>
              , a protein banana bread company in New York City that I build on nights and weekends.
              Hauling bags of flour and hand-weighing batter loaf by loaf gave me a new obsession:
              bringing AI and intelligent automation into the physical systems and machinery that
              software hasn&apos;t fully reached yet.
            </p>

            <p>
              When I&apos;m not shipping code or loaves, you&apos;ll find me following economic trends,
              playing basketball, and thinking about how the next wave of technology can broaden
              access and opportunity for everyone.
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