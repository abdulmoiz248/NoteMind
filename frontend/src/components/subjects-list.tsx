"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, RefreshCw, Folder, Sparkles, Brain, Zap } from "lucide-react"

interface SubjectsListProps {
  subjects: string[]
  loading: boolean
  onRefresh: () => void
}

export default function SubjectsList({ subjects, loading, onRefresh }: SubjectsListProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
            >
              <BookOpen className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Knowledge Base</h2>
            <p className="text-gray-300">Your organized collection of intelligent subjects</p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white">Available Subjects</h3>
              <div className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-full">
                <span className="text-amber-300 text-sm font-medium">{subjects.length} subjects</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-amber-400 backdrop-blur-sm transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-gray-300 text-lg">Scanning your knowledge base...</p>
              </motion.div>
            ) : subjects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Folder className="h-12 w-12 text-gray-300" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">No Subjects Yet</h4>
                <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                  Start building your knowledge base by uploading your first documents. Transform your notes into an
                  intelligent assistant!
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <span className="text-amber-400 font-medium">Ready to get started?</span>
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="subjects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group"
                  >
                    <Card className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300 shadow-xl backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <Brain className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-400 font-medium">Active</span>
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300">
                          {subject}
                        </h4>

                        <p className="text-gray-400 text-sm mb-4">Ready for intelligent conversations</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-400" />
                            <span className="text-xs text-gray-400">AI-Powered</span>
                          </div>
                          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
                            <BookOpen className="h-4 w-4 text-gray-400 group-hover:text-amber-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
