"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X, Sparkles, Zap, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

const API_BASE = "http://localhost:5000"

interface FileUploadProps {
  onSubjectAdded: () => void
}

export default function FileUpload({ onSubjectAdded }: FileUploadProps) {
  const [files, setFiles] = useState<FileList | null>(null)
  const [subject, setSubject] = useState("")
  const [handwritten, setHandwritten] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
    setUploadStatus("idle")
    setUploadProgress(0)
  }, [])

  const removeFile = useCallback(
    (indexToRemove: number) => {
      if (!files) return

      const dt = new DataTransfer()
      Array.from(files).forEach((file, index) => {
        if (index !== indexToRemove) {
          dt.items.add(file)
        }
      })
      setFiles(dt.files)
    },
    [files],
  )

  const handleUpload = async () => {
    if (!files || files.length === 0 || !subject.trim()) {
      toast({
        title: "Missing Information ⚠️",
        description: "Please select files and enter a subject name",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadStatus("idle")
    setUploadProgress(0)

    try {
      const totalFiles = files.length

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("subject", subject.trim())
        formData.append("handwritten", handwritten.toString())

        const response = await axios.post(`${API_BASE}/ingest`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const fileProgress = ((i + progressEvent.loaded / (progressEvent.total || 1)) / totalFiles) * 100
            setUploadProgress(Math.round(fileProgress))
          },
        })

        if (response.data.status !== "success") {
          throw new Error(response.data.detail || `Failed to upload ${file.name}`)
        }
      }

      setUploadStatus("success")
      setUploadProgress(100)
      toast({
        title: "Upload Successful! 🎉",
        description: `${totalFiles} file(s) uploaded to subject "${subject}"`,
      })

      // Reset form
      setFiles(null)
      setSubject("")
      setHandwritten(false)
      setUploadProgress(0)

      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      onSubjectAdded()
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      toast({
        title: "Upload Failed 💥",
        description: axios.isAxiosError(error)
          ? error.response?.data?.detail || error.message
          : "An error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
            >
              <Upload className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Upload Your Knowledge</h2>
            <p className="text-gray-300">Transform your documents into an intelligent knowledge base</p>
          </div>

          <div className="grid gap-8">
            {/* Subject Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <Label htmlFor="subject" className="text-white font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Subject Name
              </Label>
              <Input
                id="subject"
                placeholder="e.g., Advanced Mathematics, Quantum Physics, Machine Learning..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={uploading}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg backdrop-blur-sm focus:bg-white/20 focus:border-emerald-400 transition-all duration-300"
              />
              <p className="text-sm text-gray-400">Create a new subject or add to an existing one</p>
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Label htmlFor="file-upload" className="text-white font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Select Documents
              </Label>
<Input
  id="file-upload"
  type="file"
  multiple
  accept=".pdf,.txt,.doc,.docx"
  onChange={handleFileChange}
  disabled={uploading}
  className="bg-white/10 border-white/20 text-white file:bg-gradient-to-r file:from-emerald-500 file:to-emerald-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:leading-tight file:h-full h-12 backdrop-blur-sm hover:bg-white/20 focus:border-emerald-400 transition-all duration-300"
/>


              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  PDF
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  TXT
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  DOC/DOCX
                </div>
              </div>
            </motion.div>

            {/* Handwritten Checkbox */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-3"
            >
              <Checkbox
                id="handwritten"
                checked={handwritten}
                onCheckedChange={(checked) => setHandwritten(checked as boolean)}
                disabled={uploading}
                className="border-white/30 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-emerald-600"
              />
              <Label htmlFor="handwritten" className="text-white font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Handwritten Notes (OCR Processing)
              </Label>
            </motion.div>

            {/* Selected Files Display */}
            <AnimatePresence>
              {files && files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    Selected Files ({files.length})
                  </h4>
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {Array.from(files).map((file, index) => (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{file.name}</p>
                            <p className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Progress */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Uploading...</span>
                    <span className="text-gray-300">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Button
                onClick={handleUpload}
                disabled={uploading || !files || !subject.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {uploading ? (
                  <motion.div
                    
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 className="h-5 w-5" />
                    Processing Your Knowledge...
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5" />
                    Upload & Process Files
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Status Messages */}
            <AnimatePresence>
              {uploadStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl backdrop-blur-sm"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Files uploaded successfully! Your knowledge base has been updated.
                  </span>
                </motion.div>
              )}

              {uploadStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur-sm"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Upload failed. Please check your files and try again.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
