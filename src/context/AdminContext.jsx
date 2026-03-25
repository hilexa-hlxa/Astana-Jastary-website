import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [team,     setTeam]     = useState([])
  const [projects, setProjects] = useState([])
  const [faqs,     setFaqs]     = useState([])
  const [whatsapp, setWhatsapp] = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function fetchAll() {
      const [{ data: t }, { data: p }, { data: f }, { data: s }] = await Promise.all([
        supabase.from('team').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('faqs').select('*').order('sort_order'),
        supabase.from('settings').select('*'),
      ])
      if (t) setTeam(t)
      if (p) setProjects(p)
      if (f) setFaqs(f)
      const ws = s?.find((r) => r.key === 'whatsapp')
      if (ws) setWhatsapp(ws.value)
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Strip id from payload — 'generated always as identity' columns can't be updated
  const strip = ({ id, ...fields }) => fields

  // ── Team ──────────────────────────────────────────────────────────────────
  const addMember = async (data) => {
    const { data: row, error } = await supabase
      .from('team').insert({ ...strip(data), sort_order: team.length + 1 }).select().single()
    if (!error) setTeam([...team, row])
    return { error }
  }

  const updateMember = async (data) => {
    const { error } = await supabase.from('team').update(strip(data)).eq('id', data.id)
    if (!error) setTeam(team.map((m) => (m.id === data.id ? data : m)))
    return { error }
  }

  const removeMember = async (id) => {
    const { error } = await supabase.from('team').delete().eq('id', id)
    if (!error) setTeam(team.filter((m) => m.id !== id))
    return { error }
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  const addProject = async (data) => {
    const { data: row, error } = await supabase
      .from('projects').insert({ ...strip(data), sort_order: projects.length + 1 }).select().single()
    if (!error) setProjects([...projects, row])
    return { error }
  }

  const updateProject = async (data) => {
    const { error } = await supabase.from('projects').update(strip(data)).eq('id', data.id)
    if (!error) setProjects(projects.map((p) => (p.id === data.id ? data : p)))
    return { error }
  }

  const removeProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) setProjects(projects.filter((p) => p.id !== id))
    return { error }
  }

  // ── FAQs ──────────────────────────────────────────────────────────────────
  const addFaq = async (data) => {
    const { data: row, error } = await supabase
      .from('faqs').insert({ ...strip(data), sort_order: faqs.length + 1 }).select().single()
    if (!error) setFaqs([...faqs, row])
    return { error }
  }

  const updateFaq = async (data) => {
    const { error } = await supabase.from('faqs').update(strip(data)).eq('id', data.id)
    if (!error) setFaqs(faqs.map((f) => (f.id === data.id ? data : f)))
    return { error }
  }

  const removeFaq = async (id) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (!error) setFaqs(faqs.filter((f) => f.id !== id))
    return { error }
  }

  // ── Settings ──────────────────────────────────────────────────────────────
  const saveWhatsapp = async (value) => {
    const { error } = await supabase.from('settings').upsert({ key: 'whatsapp', value })
    if (!error) setWhatsapp(value)
    return { error }
  }

  return (
    <AdminContext.Provider value={{
      team, projects, faqs, whatsapp, loading,
      addMember,   updateMember,  removeMember,
      addProject,  updateProject, removeProject,
      addFaq,      updateFaq,     removeFaq,
      saveWhatsapp,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
