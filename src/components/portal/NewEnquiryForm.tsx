import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { enquiriesQuery } from "@/lib/portal-data";

export default function NewEnquiryForm({ defaultSubject = "" }: { defaultSubject?: string | undefined }) {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!subject.trim() || !message.trim()) {
      setStatus({ type: "error", text: "Please add a subject and a message." });
      return;
    }
    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setStatus({ type: "error", text: "Please sign in again." });
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("enquiries").insert({
      investor_id: user.id,
      subject: subject.trim().slice(0, 200),
      message: message.trim().slice(0, 4000),
    });
    setSubmitting(false);
    if (error) {
      setStatus({ type: "error", text: "Your enquiry could not be sent. Please try again." });
      return;
    }
    setSubject("");
    setMessage("");
    setStatus({ type: "success", text: "Enquiry sent. Your advisor will respond shortly." });
    queryClient.invalidateQueries({ queryKey: enquiriesQuery.queryKey });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] uppercase tracking-[0.15em] text-forest/60 mb-2">Subject</label>
        <input
          className="w-full bg-ivory border border-forest/20 text-forest px-4 py-3 text-sm focus:border-gold focus:outline-none"
          value={subject}
          maxLength={200}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Westlands office — request for data room"
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-[0.15em] text-forest/60 mb-2">Message</label>
        <textarea
          className="w-full bg-ivory border border-forest/20 text-forest px-4 py-3 text-sm focus:border-gold focus:outline-none min-h-32"
          value={message}
          maxLength={4000}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {status && (
        <div
          className={`p-4 text-sm border-l-4 ${
            status.type === "error" ? "bg-red-50 border-red-500 text-red-700" : "bg-green-50 border-green-500 text-green-700"
          }`}
        >
          {status.text}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 bg-forest text-ivory px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-forest-soft transition-colors disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
