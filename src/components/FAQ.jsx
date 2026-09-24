import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, MessageCircle, Sparkles } from 'lucide-react'
import { faqs } from '../data/faqData'

const FAQ = () => {
  const [openId, setOpenId] = useState(1) // El primer elemento abierto por defecto

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white via-primary-50/30 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} />
            <span>Resolvemos tus dudas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Todo lo que necesitas saber antes y durante tu viaje a Cabañas Anyely en Icalma
          </p>
        </motion.div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-primary-500/50 bg-white dark:bg-gray-800 shadow-md ring-1 ring-primary-500/20'
                    : 'border-gray-200 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center justify-center">
                      {faq.id}
                    </span>
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-primary-600 dark:text-primary-400"
                  >
                    <ChevronDown size={22} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-1 text-gray-600 dark:text-gray-300 text-base leading-relaxed border-t border-gray-100 dark:border-gray-750">
                        <div className="pl-11">
                          <p>{faq.answer}</p>
                          <span className="inline-block mt-3 text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2.5 py-1 rounded">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* WhatsApp CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary-600 to-emerald-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">¿Tienes alguna pregunta especial?</h3>
            <p className="text-emerald-100 text-base max-w-xl">
              Escríbenos directamente por WhatsApp y te ayudamos a resolver cualquier detalle sobre tu estadía o el viaje a Icalma.
            </p>
          </div>
          <a
            href="https://wa.me/56938780736?text=Hola,%20tengo%20una%20consulta%20sobre%20Cabañas%20Anyely"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3.5 rounded-full font-bold text-base transition-all shadow hover:shadow-lg transform hover:scale-105"
          >
            <MessageCircle size={20} className="text-green-600" />
            <span>Consultar por WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
