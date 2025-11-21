"use client"
import { createReport } from "@/src/services/report"
import { useState } from "react"
import { useSession } from "next-auth/react"
export default function ReportForm() {
    const { data: session } = useSession()
    console.log("Session in ReportForm:", session)

    
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return alert("Please select a photo")

    setLoading(true)
    try {
      await createReport({ file, description, location })
      setSuccess(true)
      setDescription("")
      setLocation("")
      setFile(null)
      alert("Report submitted successfully!")
    } catch (err: any) {
      alert("Error: " + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  if (!session?.accessToken) return <p>Not logged in</p>


  return (
    <div>
    <div className="bg-gray-900 text-green-400 p-4 rounded">
      <p className="font-bold">REAL KEYCLOAK TOKEN (sent to backend):</p>
      <textarea
        readOnly
        value={session.accessToken}
        className="w-full h-32 text-xs bg-black"
      />
      <p className="mt-2">
        Paste this in <a href="https://jwt.io" target="_blank" className="underline">jwt.io</a> → it decodes perfectly
      </p>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />
      <input
        type="text"
        placeholder="Description (ex: Poubelle déborde à La Marsa)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location (ex: 36.8800,10.3300)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Sending..." : "Report Waste"}
      </button>
      {success && <p className="text-green-600">Report sent!</p>}
    </form>
    </div>
  )
}