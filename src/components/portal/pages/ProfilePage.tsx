import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import {
  User,
  Building2,
  Phone,
  Mail,
  Briefcase,
  BarChart3,
  Shield,
  Crown,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Pencil,
  X,
  Save,
  RefreshCw,
  Camera,
  Lock,
  Calendar,
  Target,
  TrendingUp,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type InvestorStatus = 'registered' | 'verified' | 'premium' | 'admin'

// Exactly the columns that exist in your profiles table (screenshot-verified)
interface Profile {
  id: string
  full_name: string | null
  title: string | null
  organisation: string | null
  phone: string | null
  aum: string | null
  investment_focus: string | null
  investor_status: InvestorStatus
  avatar_url: string | null
  created_at: string
  updated_at: string
  email: string | null
  verification_notes: string | null
  verified_at: string | null
  verified_by: string | null
}

type EditableFields = Pick<
  Profile,
  'full_name' | 'title' | 'organisation' | 'phone' | 'aum' | 'investment_focus'
>

// ─── Status Config ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  InvestorStatus,
  {
    label: string
    description: string
    color: string
    bg: string
    border: string
    icon: React.ElementType
    perks: string[]
  }
> = {
  registered: {
    label: 'Registered',
    description: 'Basic portal access',
    color: 'text-forest/60',
    bg: 'bg-forest/5',
    border: 'border-forest/20',
    icon: Clock,
    perks: ['Public publications', 'Portal access', 'Newsletter'],
  },
  verified: {
    label: 'Verified Investor',
    description: 'Full investment access',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: UserCheck,
    perks: ['All publications', 'Investment briefs', 'Verified deal flow', 'Priority support'],
  },
  premium: {
    label: 'Premium Investor',
    description: 'Exclusive off-market access',
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    icon: Crown,
    perks: [
      'All verified benefits',
      'Off-market deals',
      'NDA-gated opportunities',
      'Dedicated advisor',
      'Early access',
    ],
  },
  admin: {
    label: 'Administrator',
    description: 'Full platform access',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    icon: Shield,
    perks: ['Full admin console', 'User management', 'Content management', 'All investor access'],
  },
}

const AUM_OPTIONS = [
  'Under $100K',
  '$100K – $500K',
  '$500K – $1M',
  '$1M – $5M',
  '$5M – $20M',
  '$20M – $50M',
  'Above $50M',
]

const FOCUS_OPTIONS = [
  'Residential',
  'Commercial',
  'Mixed-Use',
  'Industrial',
  'Land & Development',
  'REITs',
  'Private Equity RE',
  'Hospitality',
  'Infrastructure',
]

// ─── Field Components ─────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  icon: Icon,
  editing,
  children,
}: {
  label: string
  value: string | null
  icon: React.ElementType
  editing: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="group flex items-start gap-4 py-4 border-b border-forest/[0.06] last:border-0">
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm bg-forest/[0.04] mt-0.5">
        <Icon className="h-3.5 w-3.5 text-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] uppercase tracking-[0.18em] text-forest/40 mb-1">{label}</p>
        {editing && children ? (
          children
        ) : (
          <p className={`text-sm ${value ? 'text-forest' : 'text-forest/25 italic'}`}>
            {value || 'Not provided'}
          </p>
        )}
      </div>
    </div>
  )
}

function InputField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm bg-white border border-forest/20 px-3 py-2 text-forest placeholder:text-forest/25 focus:outline-none focus:border-gold transition-colors"
    />
  )
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm bg-white border border-forest/20 px-3 py-2 text-forest focus:outline-none focus:border-gold transition-colors appearance-none"
    >
      <option value="">{placeholder || 'Select…'}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

// ─── Avatar Upload ────────────────────────────────────────────────────────────

function AvatarSection({
  profile,
  avatarSrc,
  onUpload,
  uploading,
}: {
  profile: Profile
  avatarSrc: string | null
  onUpload: (file: File) => Promise<void>
  uploading: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const initials = (profile.full_name || profile.email || 'I')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const statusCfg = STATUS_CONFIG[profile.investor_status]
  const StatusIcon = statusCfg.icon

  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar ring with status color */}
      <div
        className={`relative p-1 rounded-full border-2 ${statusCfg.border}`}
        style={{ background: 'white' }}
      >
        <div className="relative h-24 w-24 rounded-full overflow-hidden">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={profile.full_name ?? ''}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={`h-full w-full flex items-center justify-center text-2xl font-light tracking-wider ${statusCfg.bg} ${statusCfg.color}`}
            >
              {initials}
            </div>
          )}

          {/* Upload overlay */}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 bg-forest/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            {uploading ? (
              <RefreshCw className="h-5 w-5 text-white animate-spin" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        {/* Status badge on avatar */}
        <div
          className={`absolute -bottom-1 -right-1 h-7 w-7 rounded-full border-2 border-white flex items-center justify-center ${statusCfg.bg}`}
        >
          <StatusIcon className={`h-3.5 w-3.5 ${statusCfg.color}`} />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
        }}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-3 text-[10px] uppercase tracking-[0.15em] text-forest/40 hover:text-gold transition-colors disabled:opacity-40"
      >
        {uploading ? 'Uploading…' : 'Change Photo'}
      </button>
    </div>
  )
}

// ─── Tier Card ────────────────────────────────────────────────────────────────

function TierCard({ profile }: { profile: Profile }) {
  const cfg = STATUS_CONFIG[profile.investor_status]
  const Icon = cfg.icon

  return (
    <div className={`border ${cfg.border} bg-white overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 ${cfg.bg} border-b ${cfg.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon className={`h-5 w-5 ${cfg.color}`} />
            <div>
              <p className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</p>
              <p className="text-[10px] text-forest/40 uppercase tracking-wider mt-0.5">
                {cfg.description}
              </p>
            </div>
          </div>
          {profile.verified_at && (
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.15em] text-forest/35">Since</p>
              <p className="text-xs text-forest/60 mt-0.5">
                {new Date(profile.verified_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Perks */}
      <div className="px-5 py-4">
        <p className="text-[9px] uppercase tracking-[0.18em] text-forest/35 mb-3">
          Access Includes
        </p>
        <ul className="space-y-2">
          {cfg.perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-xs text-forest/70">
              <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${cfg.color}`} />
              {perk}
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade CTA — only for registered */}
      {profile.investor_status === 'registered' && (
        <div className="px-5 pb-4 pt-0">
          <div className="border border-gold/30 bg-gold/5 px-4 py-3">
            <p className="text-[10px] text-forest/60 leading-relaxed">
              To upgrade your investor tier, please contact our office directly at{' '}
               <a
                 href="mailto:office@murivest.com"
                 className="text-gold hover:underline"
               >
                 office@murivest.com
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Verification notes if present */}
      {profile.verification_notes && (
        <div className="px-5 pb-4 border-t border-forest/8 pt-4">
          <p className="text-[9px] uppercase tracking-[0.15em] text-forest/35 mb-1.5">
            Verification Notes
          </p>
          <p className="text-xs text-forest/50 leading-relaxed italic">
            {profile.verification_notes}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function InvestorProfilePage() {
  const queryClient = useQueryClient()
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Local edit state — only editable fields
  const [draft, setDraft] = useState<EditableFields>({
    full_name: null,
    title: null,
    organisation: null,
    phone: null,
    aum: null,
    investment_focus: null,
  })

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(
          `id, full_name, title, organisation, phone, aum, investment_focus,
           investor_status, avatar_url, created_at, updated_at,
           email, verification_notes, verified_at, verified_by`
        )
        .eq('id', user.id)
        .single()

      if (error) {
        setError(error.message)
      } else if (data) {
        // Fill email from auth if not on profile
        const merged: Profile = {
          ...data,
          email: data.email ?? user.email ?? null,
        }
        setProfile(merged)
        if (merged.avatar_url) {
          if (/^https?:\/\//.test(merged.avatar_url)) {
            setAvatarSrc(merged.avatar_url)
          } else {
            const { data: signed } = await supabase.storage.from('user-uploads').createSignedUrl(merged.avatar_url, 3600)
            setAvatarSrc(signed?.signedUrl ?? null)
          }
        }
        setDraft({
          full_name: merged.full_name,
          title: merged.title,
          organisation: merged.organisation,
          phone: merged.phone,
          aum: merged.aum,
          investment_focus: merged.investment_focus,
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...draft,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      setProfile((prev) => (prev ? { ...prev, ...draft } : prev))
      queryClient.invalidateQueries({ queryKey: ['portal'] })
      setEditing(false)
      showToast('success', 'Profile updated successfully')
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (!profile) return
    setDraft({
      full_name: profile.full_name,
      title: profile.title,
      organisation: profile.organisation,
      phone: profile.phone,
      aum: profile.aum,
      investment_focus: profile.investment_focus,
    })
    setEditing(false)
  }

  // ── Avatar Upload ─────────────────────────────────────────────────────────

  const handleAvatarUpload = async (file: File) => {
    if (!profile) return
    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'Image must be under 2MB')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${profile.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const avatarUrl = path

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', profile.id)

      if (updateError) throw updateError

      setProfile((prev) => (prev ? { ...prev, avatar_url: avatarUrl } : prev))
      const { data: signed } = await supabase.storage.from('user-uploads').createSignedUrl(path, 3600)
      setAvatarSrc(signed?.signedUrl ? `${signed.signedUrl}&t=${Date.now()}` : null)
      queryClient.invalidateQueries({ queryKey: ['portal'] })
      showToast('success', 'Photo updated')
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // ── Toast ─────────────────────────────────────────────────────────────────

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  const setField = (key: keyof EditableFields) => (value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value || null }))
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-forest/30">
        <RefreshCw className="h-5 w-5 animate-spin mr-3" />
        <span className="text-sm uppercase tracking-widest">Loading profile…</span>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 text-red-700">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">{error || 'Profile not found'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-forest/10">
        <div>
          <h2 className="font-serif text-3xl text-forest tracking-wide">My Profile</h2>
          <p className="mt-1 text-sm text-forest/50 tracking-wide">
            Manage your personal information and investment preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-forest/20 text-[11px] uppercase tracking-[0.12em] text-forest/60 hover:border-forest/40 hover:text-forest transition-all"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-forest text-ivory text-[11px] uppercase tracking-[0.12em] hover:bg-gold transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-forest/20 text-[11px] uppercase tracking-[0.12em] text-forest/60 hover:border-gold hover:text-gold transition-all"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">

        {/* ── Left Column ── */}
        <div className="space-y-6">

          {/* Avatar + Name Card */}
          <div className="bg-white border border-forest/10 p-6 flex flex-col items-center text-center">
            <AvatarSection
              profile={profile}
              avatarSrc={avatarSrc}
              onUpload={handleAvatarUpload}
              uploading={uploading}
            />
            <div className="mt-4 space-y-1">
              <h3 className="font-serif text-xl text-forest tracking-wide">
                {profile.full_name || 'Your Name'}
              </h3>
              {profile.title && (
                <p className="text-xs text-forest/50 uppercase tracking-wider">
                  {profile.title}
                </p>
              )}
              {profile.organisation && (
                <p className="text-xs text-gold/80">{profile.organisation}</p>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-5 w-full pt-5 border-t border-forest/8 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.15em] text-forest/35 mb-1">Member Since</p>
                <p className="text-xs text-forest/70">
                  {new Date(profile.created_at).toLocaleDateString('en-GB', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.15em] text-forest/35 mb-1">Last Updated</p>
                <p className="text-xs text-forest/70">
                  {new Date(profile.updated_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Tier Card */}
          <TierCard profile={profile} />

          {/* Security Info */}
          <div className="bg-white border border-forest/10 p-5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-forest/35 mb-4">
              Account Security
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 flex items-center justify-center bg-forest/5 rounded-sm flex-shrink-0">
                  <Mail className="h-3.5 w-3.5 text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-wider text-forest/35">Email</p>
                  <p className="text-xs text-forest/70 truncate">{profile.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 flex items-center justify-center bg-forest/5 rounded-sm flex-shrink-0">
                  <Lock className="h-3.5 w-3.5 text-gold" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-forest/35">Password</p>
                  <p className="text-xs text-forest/50">••••••••••</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 flex items-center justify-center bg-emerald-50 rounded-sm flex-shrink-0">
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-forest/35">Portal</p>
                  <p className="text-xs text-emerald-600">Secure · Encrypted</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-forest/35 leading-relaxed">
              To change your email or password, contact{' '}
               <a href="mailto:office@murivest.com" className="text-gold hover:underline">
                 office@murivest.com
              </a>
            </p>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">

          {/* Personal Information */}
          <div className="bg-white border border-forest/10">
            <div className="px-6 py-4 border-b border-forest/8 flex items-center gap-3">
              <User className="h-4 w-4 text-gold" />
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-forest/60 font-medium">
                Personal Information
              </h3>
              {editing && (
                <span className="ml-auto text-[9px] uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5">
                  Editing
                </span>
              )}
            </div>
            <div className="px-6">
              <FieldRow label="Full Name" value={profile.full_name} icon={User} editing={editing}>
                <InputField
                  value={draft.full_name ?? ''}
                  onChange={setField('full_name')}
                  placeholder="Your full name"
                />
              </FieldRow>

              <FieldRow label="Title / Role" value={profile.title} icon={Briefcase} editing={editing}>
                <InputField
                  value={draft.title ?? ''}
                  onChange={setField('title')}
                  placeholder="e.g. Managing Director"
                />
              </FieldRow>

              <FieldRow label="Organisation" value={profile.organisation} icon={Building2} editing={editing}>
                <InputField
                  value={draft.organisation ?? ''}
                  onChange={setField('organisation')}
                  placeholder="Company or firm name"
                />
              </FieldRow>

              <FieldRow label="Phone" value={profile.phone} icon={Phone} editing={editing}>
                <InputField
                  value={draft.phone ?? ''}
                  onChange={setField('phone')}
                  placeholder="+254 7XX XXX XXX"
                />
              </FieldRow>

              {/* Email — read only, always */}
              <FieldRow label="Email Address" value={profile.email} icon={Mail} editing={false} />
            </div>
          </div>

          {/* Investment Profile */}
          <div className="bg-white border border-forest/10">
            <div className="px-6 py-4 border-b border-forest/8 flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-gold" />
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-forest/60 font-medium">
                Investment Profile
              </h3>
            </div>
            <div className="px-6">
              <FieldRow
                label="Assets Under Management (AUM)"
                value={profile.aum}
                icon={BarChart3}
                editing={editing}
              >
                <SelectField
                  value={draft.aum ?? ''}
                  onChange={setField('aum')}
                  options={AUM_OPTIONS}
                  placeholder="Select AUM range"
                />
              </FieldRow>

              <FieldRow
                label="Primary Investment Focus"
                value={profile.investment_focus}
                icon={Target}
                editing={editing}
              >
                <SelectField
                  value={draft.investment_focus ?? ''}
                  onChange={setField('investment_focus')}
                  options={FOCUS_OPTIONS}
                  placeholder="Select focus area"
                />
              </FieldRow>
            </div>

            {/* Investment profile note */}
            <div className="mx-6 mb-5 mt-1 bg-forest/[0.03] border border-forest/8 px-4 py-3">
              <p className="text-[10px] text-forest/50 leading-relaxed">
                Your investment profile helps us surface the most relevant opportunities and 
                publications for your strategy. This information is kept strictly confidential.
              </p>
            </div>
          </div>

          {/* Account Status Overview */}
          <div className="bg-white border border-forest/10">
            <div className="px-6 py-4 border-b border-forest/8 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gold" />
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-forest/60 font-medium">
                Account Timeline
              </h3>
            </div>

            <div className="px-6 py-4">
              <div className="relative pl-6">
                {/* Timeline line */}
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-forest/10" />

                {/* Registered */}
                <div className="relative mb-5">
                  <div className="absolute -left-6 top-0.5 h-3 w-3 rounded-full bg-forest/20 border-2 border-white ring-1 ring-forest/20" />
                  <p className="text-[9px] uppercase tracking-[0.15em] text-forest/35">Account Created</p>
                  <p className="text-sm text-forest/70 mt-0.5">
                    {new Date(profile.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Verified/Premium */}
                {profile.verified_at ? (
                  <div className="relative mb-5">
                    <div
                      className={`absolute -left-6 top-0.5 h-3 w-3 rounded-full border-2 border-white ring-1 ${
                        profile.investor_status === 'premium'
                          ? 'bg-gold ring-gold/40'
                          : 'bg-emerald-500 ring-emerald-200'
                      }`}
                    />
                    <p className="text-[9px] uppercase tracking-[0.15em] text-forest/35">
                      {STATUS_CONFIG[profile.investor_status].label} Status Granted
                    </p>
                    <p className="text-sm text-forest/70 mt-0.5">
                      {new Date(profile.verified_at).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="relative mb-5 opacity-40">
                    <div className="absolute -left-6 top-0.5 h-3 w-3 rounded-full bg-forest/10 border-2 border-white border-dashed ring-1 ring-forest/10" />
                    <p className="text-[9px] uppercase tracking-[0.15em] text-forest/35">
                      Verification Pending
                    </p>
                    <p className="text-xs text-forest/40 mt-0.5 italic">
                      Contact office to upgrade tier
                    </p>
                  </div>
                )}

                {/* Last updated */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 h-3 w-3 rounded-full bg-gold/60 border-2 border-white ring-1 ring-gold/30" />
                  <p className="text-[9px] uppercase tracking-[0.15em] text-forest/35">
                    Profile Last Updated
                  </p>
                  <p className="text-sm text-forest/70 mt-0.5">
                    {new Date(profile.updated_at).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confidentiality Notice */}
          <div className="flex items-start gap-4 px-5 py-4 bg-forest/[0.03] border border-forest/10">
            <Lock className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-forest/50 leading-relaxed">
              All information held in your profile is strictly confidential and protected under 
              256-bit encryption. Murivest will never share your personal data with third parties 
              without your explicit consent.
            </p>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 text-sm shadow-lg border
            ${toast.type === 'success'
              ? 'bg-forest text-ivory border-gold/30'
              : 'bg-red-600 text-white border-red-500'
            }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-gold" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {toast.msg}
        </div>
      )}
    </div>
  )
}