'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

type FeaturedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  publishedAt: Date | null;
  viewCount: number;
  tags: string[];
  nftNetwork: string | null;
};

interface FeaturedPostsClientProps {
  posts: FeaturedPost[];
}

// Helper function to get gradient based on category
const getGradientForCategory = (category: string) => {
  const gradients: { [key: string]: string } = {
    'Engineering': 'from-purple-600 to-blue-600',
    'Web3': 'from-blue-600 to-cyan-600',
    'Career': 'from-cyan-600 to-green-600',
    'AI': 'from-green-600 to-yellow-600',
    'Blockchain': 'from-orange-600 to-red-600',
    'Uncategorized': 'from-gray-600 to-gray-800',
  };
  return gradients[category] || 'from-purple-600 to-blue-600';
};

// Helper function to format date
const formatDate = (date: Date | null) => {
  if (!date) return 'Draft';
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 48) return '1 day ago';
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
  if (diffInHours < 720) return `${Math.floor(diffInHours / 168)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Helper function to estimate reading time
const getReadTime = (excerpt: string) => {
  const wordsPerMinute = 200;
  const wordCount = excerpt.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime < 1 ? '1 min read' : `${readTime} min read`;
};

export function FeaturedPostsClient({ posts }: FeaturedPostsClientProps) {
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

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No posts available yet. Check back soon!
              </p>
              <Link
                href="/blog/write"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Write First Post
              </Link>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="group cursor-pointer"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="h-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Gradient top border */}
                      <div className={`h-1 bg-gradient-to-r ${getGradientForCategory(post.category)}`} />
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                              {post.category}
                            </span>
                            {post.nftNetwork && (
                              <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                                🎨 NFT
                              </span>
                            )}
                            {post.nftNetwork && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                on {post.nftNetwork}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            By {post.author}
                          </span>
                          {post.viewCount > 0 && (
                            <>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mx-1">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {post.viewCount} views
                              </span>
                            </>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {getReadTime(post.excerpt)}
                          </span>
                          <span className="text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform duration-200">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}

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