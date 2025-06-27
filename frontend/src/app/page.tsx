"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Sparkles, Zap } from "lucide-react"
import FileUpload from "@/components/file-upload"
import ChatInterface from "@/components/chat-interface"
import SubjectsList from "@/components/subjects-list"
import axios from "axios"

const API_BASE = "http://localhost:5000"

export default function NoteMindApp() {
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [keys,setkeys]=useState(1)

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/subjects`)
      if (response.data.status === "success") {
        setSubjects(response.data.subjects || [])
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
    setkeys(keys+1)
  }, [])

  const handleSubjectAdded = () => {
    fetchSubjects()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="relative"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-amber-900" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                NoteMind
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-emerald-300 font-medium">AI-Powered Knowledge Assistant</span>
                <Zap className="h-4 w-4 text-amber-400" />
              </div>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your notes into intelligent conversations. Upload, organize, and chat with your knowledge base
            using advanced AI.
          </motion.p>
        </motion.div>

        {/* Navigation Tabs - Fixed alignment */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl h-16">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-300 font-medium rounded-xl transition-all duration-300 h-12"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                  <span className="text-sm font-semibold">Upload Notes</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-300 font-medium rounded-xl transition-all duration-300 h-12"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                  <span className="text-sm font-semibold">Knowledge Base</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-300 font-medium rounded-xl transition-all duration-300 h-12"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                  <span className="text-sm font-semibold">AI Chat</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <div key={keys} className="mt-8">
              <AnimatePresence key={keys+10} mode="wait">
                <TabsContent value="upload" className="mt-0">
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FileUpload onSubjectAdded={handleSubjectAdded} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="subjects" className="mt-0">
                  <motion.div
                    key="subjects"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SubjectsList subjects={subjects} loading={loading} onRefresh={fetchSubjects} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="chat" className="mt-0">
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ChatInterface
                      subjects={subjects}
                      selectedSubject={selectedSubject}
                      onSubjectChange={setSelectedSubject}
                    />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
