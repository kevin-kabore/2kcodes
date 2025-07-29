'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

// Placeholder data - will be replaced with real posts from database
const featuredPosts = [
  {
    id: '1',
    title: 'Building Developer Insights at Scale',
    excerpt: 'How we built a platform to track developer productivity metrics across thousands of engineers at Peloton.',
    category: 'Engineering',
    readTime: '8 min read',
    date: 'Dec 2023',
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    id: '2',
    title: 'The Future of Web3 Authentication',
    excerpt: 'Exploring decentralized identity solutions and how they can revolutionize user authentication on the web.',
    category: 'Web3',
    readTime: '6 min read',
    date: 'Jan 2024',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: '3',
    title: 'From ML Platform to IPO: Paperspace Journey',
    excerpt: 'Reflections on building machine learning infrastructure that served 500K+ developers before acquisition.',
    category: 'Career',
    readTime: '10 min read',
    date: 'Nov 2023',
    gradient: 'from-cyan-600 to-green-600',
  },
];

export function FeaturedPostsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured Posts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Thoughts on engineering, Web3, and building great products
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group cursor-pointer"
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="h-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Gradient top border */}
                    <div className={`h-1 bg-gradient-to-r ${post.gradient}`} />
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {post.date}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.readTime}
                        </span>
                        <span className="text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform duration-200">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              View All Posts
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}