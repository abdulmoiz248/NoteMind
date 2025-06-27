"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain,  Zap } from "lucide-react"
import FileUpload from "@/components/file-upload"
import ChatInterface from "@/components/chat-interface"
import SubjectsList from "@/components/subjects-list"
import axios from "axios"
import Image from "next/image"

const API_BASE = "http://localhost:5000"

export default function NoteMindApp() {
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

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
  }, [])

  const handleSubjectAdded = () => {
    fetchSubjects()
  }

  // Component to render tab content with animation
  const TabContentWithAnimation = ({ value, children }: { value: string; children: React.ReactNode }) => (
    <TabsContent value={value} className="mt-0">
      <AnimatePresence mode="wait">
        {activeTab === value && (
          <motion.div
            key={value}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsContent>
  )

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
             
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="relative"
            >
              <Image src='/logo-2.png' width={100} height={100} alt='logo'/>
             
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

            <div className="mt-8">
              <TabContentWithAnimation value="upload">
                <FileUpload onSubjectAdded={handleSubjectAdded} />
              </TabContentWithAnimation>

              <TabContentWithAnimation value="subjects">
                <SubjectsList subjects={subjects} loading={loading} onRefresh={fetchSubjects} />
              </TabContentWithAnimation>

              <TabContentWithAnimation value="chat">
                <ChatInterface
                  subjects={subjects}
                  selectedSubject={selectedSubject}
                  onSubjectChange={setSelectedSubject}
                />
              </TabContentWithAnimation>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
