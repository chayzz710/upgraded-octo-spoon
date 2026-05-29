import { motion } from 'framer-motion'
import Navbar from './Navbar'
import FrogEasterEgg from '../motifs/FrogEasterEgg'
import { DinoPerPage } from '../motifs/DinoEasterEgg'

interface PageWrapperProps {
  children: React.ReactNode
  pageKey: string
  className?: string
}

export default function PageWrapper({ children, pageKey, className = '' }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <motion.main
        key={pageKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`pb-16 px-3 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full ${className}`}
        style={{ paddingTop: 'clamp(16px, 3vw, 40px)' }}
      >
        {children}
      </motion.main>
      <FrogEasterEgg pageKey={pageKey} />
      <DinoPerPage pageKey={pageKey} />
    </div>
  )
}