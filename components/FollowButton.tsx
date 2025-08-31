'use client'
import { useState } from 'react'
export default function FollowButton({ targetId, initialFollowing }: { targetId: string; initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing)
  const [busy, setBusy] = useState(false)
  const toggle = async () => { if (busy) return; setBusy(true); const action = following ? 'unfollow' : 'follow'; const res = await fetch('/api/follow', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ targetId, action }) }); if (res.ok) setFollowing(!following); setBusy(false) }
  return <button onClick={toggle} disabled={busy} className={`btn ${following ? 'btn-primary' : ''}`}>{following ? 'Følger' : 'Følg'}</button>
}
