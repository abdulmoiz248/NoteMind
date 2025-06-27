"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, MessageCircle, Trash2, Sparkles, Brain, Zap, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import axios from "axios"

const API_BASE = "http://localhost:5000"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  subjects: string[]
  selectedSubject: string
  onSubjectChange: (subject: string) => void
}

export default function ChatInterface({ subjects, selectedSubject, onSubjectChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
      toast({
        title: "Copied! 📋",
        description: "Message copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedSubject) {
      toast({
        title: "Missing Information ⚠️",
        description: !selectedSubject ? "Please select a subject first" : "Please enter a message",
        variant: "destructive",
      })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("subject", selectedSubject)
      formData.append("query", userMessage.content)

      const response = await axios.post(`${API_BASE}/chat`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.status !== "success") {
        throw new Error(response.data.detail || "Failed to get response")
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.data.answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      toast({
        title: "Chat Error 💥",
        description: axios.isAxiosError(error)
          ? error.response?.data?.detail || error.message
          : "Failed to get response",
        variant: "destructive",
      })

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "I apologize, but I encountered an error while processing your request. Please try again or check your connection.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    toast({
      title: "Chat Cleared 🧹",
      description: "Conversation history has been cleared",
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
            >
              <MessageCircle className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">AI Chat Assistant</h2>
            <p className="text-gray-300">Have intelligent conversations with your knowledge base</p>
          </div>

          {/* Subject Selection */}
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1">
              <Select value={selectedSubject} onValueChange={onSubjectChange}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 backdrop-blur-sm focus:bg-white/20 focus:border-cyan-400 transition-all duration-300">
                  <SelectValue placeholder="🧠 Select a subject to chat with..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-cyan-400" />
                        {subject}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {messages.length > 0 && (
              <Button
                variant="outline"
                onClick={clearChat}
                className="bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/30 backdrop-blur-sm transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
            )}
          </div>

          {!selectedSubject ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <MessageCircle className="h-12 w-12 text-gray-300" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">Select a Subject to Begin</h4>
              <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                Choose from your uploaded subjects above to start having intelligent conversations with your notes.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex justify-center gap-2"
              >
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 font-medium">AI-powered insights await!</span>
                <Sparkles className="h-5 w-5 text-amber-400" />
              </motion.div>
            </motion.div>
          ) : (
            <>
              {/* Chat Messages */}
              <Card className="h-96 mb-6 bg-white/5 border-white/10">
                <ScrollArea className="h-full p-6">
                  {messages.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-gray-300 text-lg mb-2">
                        Ready to chat about <span className="text-cyan-400 font-semibold">{selectedSubject}</span>
                      </p>
                      <p className="text-gray-500">Ask me anything about your notes!</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <AnimatePresence>
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex gap-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                                  message.type === "user"
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                    : "bg-gradient-to-r from-cyan-500 to-cyan-600"
                                }`}
                              >
                                {message.type === "user" ? (
                                  <User className="h-5 w-5 text-white" />
                                ) : (
                                  <Bot className="h-5 w-5 text-white" />
                                )}
                              </motion.div>

                              <div
                                className={`rounded-2xl p-4 shadow-lg backdrop-blur-sm relative group ${
                                  message.type === "user"
                                    ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30"
                                    : "bg-white/10 border border-white/20"
                                }`}
                              >
                                {message.type === "bot" ? (
                                  <div className="prose prose-sm max-w-none text-white">
                                    <ReactMarkdown
                                      components={{
                                        p: ({ children }) => (
                                          <p className="mb-3 last:mb-0 text-gray-100 leading-relaxed">{children}</p>
                                        ),
                                        strong: ({ children }) => (
                                          <strong className="font-bold text-white">{children}</strong>
                                        ),
                                        em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
                                        ul: ({ children }) => (
                                          <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
                                        ),
                                        ol: ({ children }) => (
                                          <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
                                        ),
                                        li: ({ children }) => <li className="text-gray-100">{children}</li>,
                                        code: ({ children }) => (
                                          <code className="bg-black/30 px-2 py-1 rounded text-sm text-cyan-300 font-mono">
                                            {children}
                                          </code>
                                        ),
                                        h1: ({ children }) => (
                                          <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>
                                        ),
                                        h2: ({ children }) => (
                                          <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>
                                        ),
                                        h3: ({ children }) => (
                                          <h3 className="text-base font-bold mb-2 text-white">{children}</h3>
                                        ),
                                      }}
                                    >
                                      {message.content}
                                    </ReactMarkdown>
                                  </div>
                                ) : (
                                  <p className="text-white leading-relaxed">{message.content}</p>
                                )}

                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                                  <p className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(message.content, message.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-white h-6 w-6 p-0"
                                  >
                                    {copiedMessageId === message.id ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 justify-start"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                  <Loader2 className="h-4 w-4 text-cyan-400" />
                                </motion.div>
                                <span className="text-gray-300">AI is thinking...</span>
                                <Zap className="h-4 w-4 text-amber-400" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </Card>

              {/* Message Input */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`💭 Ask me anything about ${selectedSubject}...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 pr-12 backdrop-blur-sm focus:bg-white/20 focus:border-cyan-400 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0 shadow-xl disabled:opacity-50 transition-all duration-300"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Loader2 className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
