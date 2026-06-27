import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  Map, Users, Plus, Bookmark, User, MapPin, Heart, MessageCircle,
  MoreHorizontal, Mountain, Navigation, Clock, Bell, Search, Crown,
  Check, ImagePlus, X, ChevronDown, Minus, ZoomIn, ZoomOut
} from 'lucide-react'

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  white: '#FFFFFF', offWhite: '#F8F9F6', surface: '#F2F4F0',
  sageLight: '#E8EDE4', sageMid: '#C5D4BC', sage: '#8AAF7E',
  forest: '#4A7C59', forestDeep: '#2D5A3D',
  textPrimary: '#1A1A1A', textSecondary: '#6B7280', textMuted: '#9CA3AF',
  border: '#E5E9E2', gold: '#C9A84C', danger: '#E05555',
}
const shadow = {
  card: '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
  pin: '0 4px 12px rgba(74,124,89,0.35)',
  md: '0 4px 16px rgba(0,0,0,0.10)',
  lg: '0 8px 32px rgba(0,0,0,0.14)',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEED_POSTS = [
  { id: 1, title: 'Half Dome Summit', location: 'Yosemite National Park', user: 'Sarah M.', avatar: 42, photo: 11, caption: 'Nothing prepares you for that view. The cables at sunrise, the drop on both sides — you just have to be there.', dist: '4.2mi', elev: '2,693ft', dur: '8h 32m', likes: 47, comments: 14 },
  { id: 2, title: 'Lost Coast Backpack', location: 'King Range, CA', user: 'Jake R.', avatar: 53, photo: 22, caption: 'Three days of zero cell service. Needed it. Black sand beaches as far as you can see.', dist: '24.1mi', elev: '3,100ft', dur: '3 days', likes: 89, comments: 31 },
  { id: 3, title: 'Enchantments Traverse', location: 'Alpine Lakes Wilderness', user: 'Mia C.', avatar: 64, photo: 33, caption: 'Lottery win = best September of my life. Larches were glowing gold the entire traverse.', dist: '18.6mi', elev: '4,400ft', dur: '11h', likes: 134, comments: 52 },
  { id: 4, title: 'Mt. Tallac at Sunrise', location: 'Lake Tahoe', user: 'Alex P.', avatar: 75, photo: 44, caption: 'Left the car at 4am. Worth every step. Lake Tahoe spread out below like a mirror.', dist: '9.4mi', elev: '3,200ft', dur: '6h 15m', likes: 62, comments: 23 },
]

const MAP_PINS = [
  { id: 1, x: '22%', y: '28%', seed: 11, title: 'Half Dome Summit', location: 'Yosemite NP' },
  { id: 2, x: '58%', y: '18%', seed: 22, title: 'Lost Coast', location: 'King Range, CA' },
  { id: 3, x: '72%', y: '52%', seed: 33, title: 'Enchantments', location: 'Alpine Lakes' },
  { id: 4, x: '38%', y: '68%', seed: 44, title: 'Mt. Tallac', location: 'Lake Tahoe' },
  { id: 5, x: '14%', y: '58%', seed: 55, title: 'Muir Woods', location: 'Marin County, CA' },
]

const WISHLIST_ITEMS = [
  { id: 1, title: 'Havasupai Falls', subtitle: 'Supai, Arizona', tags: ['National Park', 'Permit Required'], seed: 101 },
  { id: 2, title: 'The Wave', subtitle: 'Coyote Buttes, Utah', tags: ['Lottery', 'Sandstone'], seed: 102 },
  { id: 3, title: 'Laugavegur Trail', subtitle: 'Iceland', tags: ['Multi-day', 'International'], seed: 103 },
  { id: 4, title: 'Fitz Roy Trek', subtitle: 'Patagonia, Argentina', tags: ['International', 'Technical'], seed: 104 },
  { id: 5, title: 'Wonderland Trail', subtitle: 'Mt. Rainier, WA', tags: ['93 miles', 'Permit Required'], seed: 105 },
]

const PREMIUM_BENEFITS = [
  { title: 'Up to 10 photos per adventure', sub: 'Free includes 1 photo' },
  { title: 'Wishlist map toggle', sub: 'See your dream destinations on your life map' },
  { title: 'Heatmap overlay', sub: 'Visualize everywhere you've ever explored' },
  { title: '3D topo map toggle', sub: 'See terrain in stunning relief' },
  { title: 'Unlimited wishlist saves', sub: 'Free includes up to 10 saved places' },
  { title: 'Organize wishlist into lists', sub: "Create lists like 'Next summer' or 'With family'" },
  { title: 'Priority customer support', sub: 'Get help from real humans, fast' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pic = (w, h, seed) => `https://picsum.photos/${w}/${h}?random=${seed}`

// ─── Micro-components ─────────────────────────────────────────────────────────
function StatusBar({ dark = false }) {
  const color = dark ? 'rgba(255,255,255,0.9)' : C.textPrimary
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 54,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px 0', zIndex: 50, pointerEvents: 'none',
    }}>
      <span style={{ fontWeight: 600, fontSize: 15, color }}> 9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {[4, 3, 2].map(h => (
          <div key={h} style={{ width: 3, height: h * 3, borderRadius: 1, background: color, opacity: 0.9 }} />
        ))}
        <div style={{ width: 15, height: 11, borderRadius: 2, border: `1.5px solid ${color}`, marginLeft: 2, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 2, left: 2, right: 3, bottom: 2, background: color, borderRadius: 1 }} />
          <div style={{ position: 'absolute', right: -4, top: 3, width: 2.5, height: 5, background: color, borderRadius: '0 1px 1px 0', opacity: 0.5 }} />
        </div>
      </div>
    </div>
  )
}

function LocationPill({ name }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
      borderRadius: 10, padding: '4px 10px',
    }}>
      <MapPin size={12} color={C.forest} strokeWidth={2.5} />
      <span style={{ fontSize: 11, fontWeight: 600, color: C.textPrimary }}>{name}</span>
    </div>
  )
}

function Tag({ label }) {
  return (
    <span style={{
      background: C.sageLight, color: C.forest, borderRadius: 20,
      padding: '3px 10px', fontSize: 11, fontWeight: 600,
    }}>{label}</span>
  )
}

// ─── Postcard Component ───────────────────────────────────────────────────────
function Postcard({ post, compact = false, likedPosts, onLike }) {
  const [pressed, setPressed] = useState(false)
  const liked = likedPosts.has(post.id)
  const photoH = compact ? 160 : 220

  const handleLike = useCallback(() => {
    onLike(post.id)
  }, [post.id, onLike])

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden', background: C.white,
      boxShadow: shadow.card,
    }}>
      {/* Photo */}
      <div style={{ position: 'relative', height: photoH, overflow: 'hidden' }}>
        <img
          src={pic(400, photoH, post.seed ?? post.photo)}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
        }} />
        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
          <LocationPill name={post.location} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        {/* User row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={pic(32, 32, post.avatar)} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{post.user}</span>
          </div>
          <span style={{ fontSize: 11, color: C.textMuted, marginRight: 8 }}>2h ago</span>
          <MoreHorizontal size={16} color={C.textMuted} />
        </div>

        {/* Caption */}
        <p style={{
          fontSize: 13, color: '#4B5563', lineHeight: 1.5,
          marginTop: 8, display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{post.caption}</p>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <Mountain size={12} color={C.textSecondary} />
          <span style={{ fontSize: 11, color: C.textSecondary, fontWeight: 500 }}>{post.elev}</span>
          <span style={{ color: C.textMuted, fontSize: 11 }}>·</span>
          <Navigation size={12} color={C.textSecondary} />
          <span style={{ fontSize: 11, color: C.textSecondary, fontWeight: 500 }}>{post.dist}</span>
          <span style={{ color: C.textMuted, fontSize: 11 }}>·</span>
          <Clock size={12} color={C.textSecondary} />
          <span style={{ fontSize: 11, color: C.textSecondary, fontWeight: 500 }}>{post.dur}</span>
        </div>

        {/* Interaction */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 12, paddingTop: 12, borderTop: `1px solid #F0F2EE`,
        }}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              transform: pressed ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
          >
            <Heart
              size={20}
              color={liked ? C.danger : C.textMuted}
              fill={liked ? C.danger : 'none'}
              strokeWidth={2}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: liked ? C.danger : C.textMuted }}>
              {post.likes + (liked ? 1 : 0)}
            </span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageCircle size={20} color={C.textMuted} strokeWidth={2} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted }}>{post.comments}</span>
            </div>
            <Bookmark size={20} color={C.textMuted} strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Map Screen ───────────────────────────────────────────────────────────────
function MapScreen({ likedPosts, onLike }) {
  const [mapToggle, setMapToggle] = useState('visited')
  const [selectedPin, setSelectedPin] = useState(null)
  const [sheetVisible, setSheetVisible] = useState(false)

  const handlePin = useCallback((pin) => {
    setSelectedPin(pin)
    setTimeout(() => setSheetVisible(true), 10)
  }, [])

  const handleClose = useCallback(() => {
    setSheetVisible(false)
    setTimeout(() => setSelectedPin(null), 350)
  }, [])

  const sheetPost = useMemo(() => {
    if (!selectedPin) return null
    return FEED_POSTS.find(p => p.seed === selectedPin.seed) ?? {
      id: selectedPin.id, title: selectedPin.title, location: selectedPin.location,
      user: 'You', avatar: 99, seed: selectedPin.seed,
      caption: 'An unforgettable adventure on this trail.',
      dist: '6.2mi', elev: '1,800ft', dur: '4h 10m', likes: 12, comments: 3,
    }
  }, [selectedPin])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Map background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #E8F0E4 0%, #D4E6CA 30%, #C8DBC0 60%, #B8D0AF 100%)',
      }}>
        {/* Terrain SVG */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          {/* Contour rings */}
          {[
            { cx: 160, cy: 240, rx: 80, ry: 50 }, { cx: 160, cy: 240, rx: 120, ry: 75 },
            { cx: 160, cy: 240, rx: 160, ry: 100 }, { cx: 280, cy: 380, rx: 70, ry: 45 },
            { cx: 280, cy: 380, rx: 110, ry: 70 }, { cx: 280, cy: 380, rx: 150, ry: 95 },
            { cx: 80, cy: 480, rx: 60, ry: 38 }, { cx: 80, cy: 480, rx: 95, ry: 60 },
            { cx: 330, cy: 160, rx: 50, ry: 32 }, { cx: 330, cy: 160, rx: 80, ry: 50 },
          ].map((e, i) => (
            <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}
              fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
          ))}
          {/* Trail paths */}
          <path d="M 30 200 C 80 180, 140 220, 190 260 C 240 300, 280 280, 340 310"
            fill="none" stroke={C.forest} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          <path d="M 60 400 C 100 360, 160 340, 220 370 C 280 400, 300 430, 370 450"
            fill="none" stroke={C.forest} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          <path d="M 200 100 C 230 150, 260 200, 280 260 C 300 320, 310 380, 330 430"
            fill="none" stroke={C.forest} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        </svg>

        {/* Adventure pins */}
        {MAP_PINS.map(pin => (
          <button
            key={pin.id}
            onClick={() => handlePin(pin)}
            style={{
              position: 'absolute', left: pin.x, top: pin.y,
              width: 44, height: 44, borderRadius: 12, overflow: 'hidden',
              border: '2.5px solid white', boxShadow: shadow.pin,
              cursor: 'pointer', padding: 0,
              transform: selectedPin?.id === pin.id ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 0.2s ease',
              zIndex: 10,
            }}
          >
            <img src={pic(80, 80, pin.seed)} alt={pin.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>

      {/* Status bar overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54,
        background: 'rgba(248,249,246,0.7)', backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)', zIndex: 20,
      }} />
      <StatusBar />

      {/* Map toggle (top-left) */}
      <div style={{
        position: 'absolute', top: 64, left: 16, zIndex: 30,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderRadius: 20,
        padding: 4, display: 'flex',
        border: '1px solid rgba(229,233,226,0.8)',
      }}>
        {['visited', 'wishlist'].map(opt => (
          <button key={opt} onClick={() => setMapToggle(opt)} style={{
            borderRadius: 16, padding: '6px 14px', fontSize: 12, fontWeight: 600,
            background: mapToggle === opt ? C.forest : 'transparent',
            color: mapToggle === opt ? 'white' : C.textSecondary,
            transition: 'all 0.2s ease',
          }}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>

      {/* Zoom controls (top-right) */}
      <div style={{
        position: 'absolute', top: 64, right: 16, zIndex: 30,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderRadius: 14, padding: 4,
        border: '1px solid rgba(229,233,226,0.8)',
        display: 'flex', flexDirection: 'column',
      }}>
        {[{ icon: Plus, key: 'in' }, { icon: Minus, key: 'out' }].map(({ icon: Icon, key }) => (
          <button key={key} style={{
            width: 36, height: 36, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.forest,
          }}>
            <Icon size={18} strokeWidth={2.5} />
          </button>
        ))}
      </div>

      {/* Postcard bottom sheet */}
      {selectedPin && (
        <>
          <div
            onClick={handleClose}
            style={{
              position: 'absolute', inset: 0, zIndex: 40,
              background: 'rgba(0,0,0,0.2)',
              opacity: sheetVisible ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 82, left: 0, right: 0, zIndex: 41,
            background: C.white, borderRadius: '20px 20px 0 0',
            boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
            transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: '12px auto 0' }} />
            <div style={{ padding: '12px 16px 16px' }}>
              <Postcard post={sheetPost} compact likedPosts={likedPosts} onLike={onLike} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Friends Screen ───────────────────────────────────────────────────────────
function FriendsScreen({ likedPosts, onLike, onNotifications }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.white }}>
      {/* Header */}
      <div style={{ padding: '64px 20px 16px', background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary }}>Friends</h1>
            <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>12 adventures this week</p>
          </div>
          <button onClick={onNotifications} style={{ marginTop: 4, padding: 4 }}>
            <Bell size={22} color={C.forest} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Feed */}
      <div style={{ overflowY: 'auto', height: 'calc(100% - 130px)', padding: '16px 20px', paddingBottom: 100 }}>
        {FEED_POSTS.map((post, i) => (
          <div key={post.id} style={{ marginBottom: i < FEED_POSTS.length - 1 ? 16 : 0 }}>
            <Postcard post={post} likedPosts={likedPosts} onLike={onLike} />
          </div>
        ))}
      </div>
      <StatusBar />
    </div>
  )
}

// ─── Create Screen ────────────────────────────────────────────────────────────
function CreateScreen({ onClose }) {
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')

  return (
    <div style={{
      position: 'absolute', inset: 0, background: C.white, zIndex: 100,
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '54px 20px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, background: C.white, zIndex: 10,
        paddingBottom: 12, borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <X size={16} color={C.textPrimary} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 700, color: C.textPrimary }}>New Adventure</span>
        <button style={{
          background: `linear-gradient(135deg, ${C.forest}, ${C.forestDeep})`,
          color: 'white', borderRadius: 20, padding: '8px 18px',
          fontSize: 14, fontWeight: 600,
        }}>Share</button>
      </div>

      <div style={{ padding: '0 0 100px' }}>
        {/* Photo upload area */}
        <div style={{
          margin: '20px 20px 0', borderRadius: 20, height: 240,
          background: C.surface, border: `2px dashed ${C.sageMid}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <ImagePlus size={40} color={C.sage} strokeWidth={1.5} />
          <span style={{ fontSize: 16, fontWeight: 600, color: C.forest, marginTop: 10 }}>Add photos</span>
          <span style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Up to 10 with Premium</span>
        </div>

        {/* Thumbnail row */}
        <div style={{ display: 'flex', gap: 10, padding: '14px 20px', overflowX: 'auto' }}>
          {[201, 202, 203].map(seed => (
            <img key={seed} src={pic(80, 80, seed)} alt="" style={{
              width: 72, height: 72, borderRadius: 12, objectFit: 'cover', flexShrink: 0,
              boxShadow: shadow.card,
            }} />
          ))}
          <div style={{
            width: 72, height: 72, borderRadius: 12, flexShrink: 0,
            background: C.surface, border: `2px dashed ${C.sageMid}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plus size={20} color={C.sage} />
          </div>
        </div>

        {/* Form fields */}
        <div style={{ padding: '4px 20px 0' }}>
          {/* Location */}
          <div style={{
            background: C.offWhite, borderRadius: 14, padding: '14px 16px',
            marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <MapPin size={18} color={C.forest} />
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Where did you go?"
              style={{ flex: 1, fontSize: 15, color: location ? C.textPrimary : C.textMuted }}
            />
          </div>

          {/* Caption */}
          <div style={{
            background: C.offWhite, borderRadius: 14, padding: '14px 16px',
            marginBottom: 12, minHeight: 80,
          }}>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Tell the story of this adventure…"
              style={{
                width: '100%', fontSize: 15, color: caption ? C.textPrimary : C.textMuted,
                fontStyle: caption ? 'normal' : 'italic', lineHeight: 1.5,
                minHeight: 52,
              }}
            />
          </div>

          {/* Preview label */}
          <div style={{
            fontSize: 12, fontWeight: 700, color: C.textSecondary,
            letterSpacing: '0.6px', textTransform: 'uppercase', margin: '16px 0 10px',
          }}>Live Preview</div>

          {/* Mini postcard preview */}
          <div style={{ transform: 'scale(0.92)', transformOrigin: 'top left', width: '108%' }}>
            <Postcard
              post={{
                id: 0, title: location || 'Your adventure', location: location || 'Somewhere amazing',
                user: 'You', avatar: 99, seed: 201,
                caption: caption || 'Tell the story of this adventure…',
                dist: '—', elev: '—', dur: '—', likes: 0, comments: 0,
              }}
              likedPosts={new Set()}
              onLike={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Wishlist Screen ──────────────────────────────────────────────────────────
function WishlistScreen({ onPremium }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.offWhite }}>
      {/* Header */}
      <div style={{ padding: '64px 20px 16px', background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary }}>Wishlist</h1>
            <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>8 places to explore</p>
          </div>
          <Search size={22} color={C.forest} style={{ marginTop: 4 }} />
        </div>
      </div>

      <div style={{ overflowY: 'auto', height: 'calc(100% - 130px)', paddingBottom: 100 }}>
        {/* Mini map strip */}
        <div style={{
          margin: '16px 20px', borderRadius: 16, height: 160, overflow: 'hidden',
          background: 'linear-gradient(160deg, #E8F0E4 0%, #C8DBC0 100%)',
          position: 'relative',
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
            {[{ cx: 100, cy: 80, rx: 60, ry: 35 }, { cx: 250, cy: 100, rx: 50, ry: 30 }, { cx: 180, cy: 50, rx: 40, ry: 24 }].map((e, i) => (
              <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            ))}
          </svg>
          {/* Gold wishlist pins */}
          {[{ x: '18%', y: '45%' }, { x: '38%', y: '25%' }, { x: '55%', y: '60%' }, { x: '72%', y: '35%' }, { x: '85%', y: '55%' }].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', left: pos.x, top: pos.y,
              width: 12, height: 12, borderRadius: '50%',
              background: C.gold, border: '2px solid white',
              boxShadow: '0 2px 6px rgba(201,168,76,0.5)',
            }} />
          ))}
        </div>

        {/* Items */}
        {WISHLIST_ITEMS.map(item => (
          <div key={item.id} style={{
            background: C.white, borderRadius: 16, margin: '0 20px 12px',
            display: 'flex', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <img src={pic(88, 88, item.seed)} alt={item.title} style={{ width: 88, height: 88, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ padding: '12px 14px', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{item.subtitle}</p>
                </div>
                <Bookmark size={18} color={C.gold} fill={C.gold} style={{ flexShrink: 0, marginLeft: 8 }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {item.tags.map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
          </div>
        ))}

        {/* Upgrade banner */}
        <div style={{
          margin: '8px 20px 16px',
          background: `linear-gradient(135deg, ${C.forest} 0%, ${C.forestDeep} 100%)`,
          borderRadius: 16, padding: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Crown size={20} color={C.gold} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>Unlimited saves with Premium</span>
          </div>
          <button onClick={onPremium} style={{
            background: C.white, color: C.forestDeep, borderRadius: 20,
            padding: '6px 14px', fontSize: 12, fontWeight: 700,
          }}>Upgrade</button>
        </div>
      </div>
      <StatusBar />
    </div>
  )
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({ onPremium }) {
  const [profileTab, setProfileTab] = useState('adventures')

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.offWhite }}>
      <div style={{ overflowY: 'auto', height: '100%', paddingBottom: 100 }}>
        {/* Header */}
        <div style={{ background: C.white }}>
          {/* Cover */}
          <div style={{
            height: 120, paddingTop: 54,
            background: 'linear-gradient(160deg, #C5D4BC, #8AAF7E)',
            position: 'relative',
          }}>
            <img src={pic(80, 80, 99)} alt="avatar" style={{
              position: 'absolute', bottom: -40, left: 20,
              width: 80, height: 80, borderRadius: '50%',
              border: '3px solid white', objectFit: 'cover',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }} />
          </div>

          {/* Name & bio */}
          <div style={{ padding: '50px 20px 16px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary }}>Jack McAndrew</h2>
            <p style={{ fontSize: 14, color: C.textSecondary, marginTop: 2 }}>@jackmcandrew</p>
            <p style={{ fontSize: 13, color: '#4B5563', marginTop: 8, lineHeight: 1.5 }}>
              PNW → everywhere. 47 summits. 12 states. Still counting. 🌲
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button style={{
                border: `1.5px solid ${C.sageMid}`, borderRadius: 20,
                padding: '7px 20px', fontSize: 13, fontWeight: 600, color: C.forest,
              }}>Edit Profile</button>
              <button onClick={onPremium} style={{
                background: `linear-gradient(135deg, ${C.forest}, ${C.forestDeep})`,
                color: C.white, borderRadius: 20, padding: '7px 16px',
                fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Crown size={14} color={C.gold} /> Go Premium
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', padding: '12px 20px 16px',
            borderTop: `1px solid ${C.border}`,
          }}>
            {[{ val: '47', label: 'Adventures' }, { val: '134', label: 'Friends' }, { val: '312', label: 'Miles' }].map((s, i) => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center',
                borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
              }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary }}>{s.val}</p>
                <p style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Sub-tabs */}
          <div style={{
            display: 'flex', gap: 24, padding: '0 20px',
            borderBottom: `1px solid ${C.border}`,
          }}>
            {['adventures', 'map', 'wishlist'].map(tab => (
              <button key={tab} onClick={() => setProfileTab(tab)} style={{
                fontSize: 14,
                fontWeight: profileTab === tab ? 700 : 500,
                color: profileTab === tab ? C.forest : C.textMuted,
                paddingBottom: 10, paddingTop: 4,
                borderBottom: profileTab === tab ? `2px solid ${C.forest}` : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {profileTab === 'adventures' && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2, padding: 2,
          }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', cursor: 'pointer' }}>
                <img
                  src={pic(130, 130, 300 + i)}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(0.97)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>
        )}
        {profileTab === 'map' && (
          <div style={{ margin: 20, borderRadius: 16, overflow: 'hidden', height: 320, background: 'linear-gradient(160deg, #E8F0E4, #B8D0AF)', position: 'relative' }}>
            <svg width="100%" height="100%" style={{ opacity: 0.3 }}>
              {[{ cx: 160, cy: 160, rx: 100, ry: 65 }, { cx: 160, cy: 160, rx: 140, ry: 90 }].map((e, i) => (
                <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              ))}
              <path d="M 30 160 C 100 130, 180 180, 280 160 C 320 150, 340 170, 370 160"
                fill="none" stroke={C.forest} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            </svg>
            <p style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', fontSize: 13, color: C.forest, fontWeight: 600 }}>Your adventure map</p>
          </div>
        )}
        {profileTab === 'wishlist' && (
          <div style={{ padding: '16px 20px' }}>
            {WISHLIST_ITEMS.slice(0, 3).map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                <img src={pic(56, 56, item.seed)} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{item.subtitle}</p>
                </div>
                <Bookmark size={18} color={C.gold} fill={C.gold} style={{ marginLeft: 'auto' }} />
              </div>
            ))}
          </div>
        )}
      </div>
      <StatusBar />
    </div>
  )
}

// ─── Premium Screen ───────────────────────────────────────────────────────────
function PremiumScreen({ onClose }) {
  const [pricing, setPricing] = useState('annual')

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'linear-gradient(180deg, #1A2E20 0%, #0D1A10 100%)',
      overflowY: 'auto',
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 58, left: 20, zIndex: 10,
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <X size={16} color="white" />
      </button>

      <div style={{ padding: '54px 24px 40px', textAlign: 'center' }}>
        <Crown size={48} color={C.gold} strokeWidth={1.5} style={{ marginTop: 12 }} />
        <h1 style={{ fontSize: 32, fontWeight: 900, color: C.white, marginTop: 12, letterSpacing: '-0.5px' }}>
          Mout Premium
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>The complete outdoor life</p>

        {/* Pricing toggle */}
        <div style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 4,
          display: 'inline-flex', margin: '28px auto 0',
        }}>
          {[
            { key: 'monthly', label: 'Monthly' },
            { key: 'annual', label: 'Annual', badge: 'Save 50%' },
          ].map(opt => (
            <button key={opt.key} onClick={() => setPricing(opt.key)} style={{
              borderRadius: 16, padding: '8px 20px', fontSize: 13, fontWeight: 600,
              background: pricing === opt.key ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: pricing === opt.key ? C.white : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {opt.label}
              {opt.badge && (
                <span style={{
                  background: C.gold, color: '#1A1A1A', borderRadius: 10,
                  padding: '2px 8px', fontSize: 10, fontWeight: 800,
                }}>{opt.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Price */}
        <div style={{ margin: '24px 0 4px' }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: C.white }}>
            {pricing === 'annual' ? '$4.99' : '$9.99'}
          </span>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>
            /{pricing === 'annual' ? 'mo' : 'month'}
          </span>
        </div>
        {pricing === 'annual' && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Billed $59.99/year</p>
        )}
      </div>

      {/* Benefits */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px 20px 0 0', margin: '0 0' }}>
        {PREMIUM_BENEFITS.map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            padding: '14px 24px',
            borderBottom: i < PREMIUM_BENEFITS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(138,175,126,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={13} color={C.sage} strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.white }}>{b.title}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{b.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 40px' }}>
        <button style={{
          display: 'block', width: '100%', marginTop: 28,
          background: `linear-gradient(135deg, ${C.sage}, ${C.forest})`,
          borderRadius: 16, padding: 18, textAlign: 'center',
          fontSize: 17, fontWeight: 700, color: C.white,
          boxShadow: '0 8px 24px rgba(74,124,89,0.4)',
        }}>Start Free 7-Day Trial</button>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 12 }}>
          Cancel anytime · No commitment · Billed annually
        </p>
        <button style={{ display: 'block', margin: '12px auto 0', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          Restore Purchases
        </button>
      </div>
    </div>
  )
}

// ─── Notifications Screen ─────────────────────────────────────────────────────
function NotificationsScreen({ onClose }) {
  const [accepted, setAccepted] = useState(new Set())

  const requests = [
    { id: 1, name: 'Taylor W.', avatar: 81 },
    { id: 2, name: 'Chris L.', avatar: 82 },
  ]
  const activity = [
    { id: 1, emoji: '❤️', text: 'Sarah M.', action: 'liked your Half Dome adventure', time: '2m', seed: 11, avatar: 42 },
    { id: 2, emoji: '💬', text: 'Jake R.', action: "commented: 'Insane! Did you use the cables?'", time: '15m', seed: 22, avatar: 53 },
    { id: 3, emoji: '❤️', text: 'Mia C.', action: 'liked your Lost Coast post', time: '1h', seed: 33, avatar: 64 },
    { id: 4, emoji: '👥', text: 'Alex P.', action: 'accepted your friend request', time: '3h', seed: null, avatar: 75 },
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.white, zIndex: 150 }}>
      {/* Header */}
      <div style={{
        padding: '64px 20px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary }}>Notifications</h1>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: '50%', background: C.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <X size={16} color={C.textPrimary} />
        </button>
      </div>

      <div style={{ overflowY: 'auto', height: 'calc(100% - 130px)', paddingBottom: 100 }}>
        {/* Friend Requests */}
        <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: '0.8px', textTransform: 'uppercase', padding: '16px 20px 8px' }}>
          Friend Requests
        </p>
        {requests.map(req => (
          <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}>
            <img src={pic(40, 40, req.avatar)} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <p style={{ flex: 1, fontSize: 13, color: C.textPrimary }}>
              <strong>{req.name}</strong> wants to follow you
            </p>
            {accepted.has(req.id) ? (
              <span style={{ fontSize: 12, color: C.forest, fontWeight: 600 }}>Following</span>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setAccepted(s => new Set([...s, req.id]))} style={{
                  background: C.forest, color: C.white, borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                }}>Accept</button>
                <button style={{
                  background: C.surface, color: C.textSecondary, borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                }}>Decline</button>
              </div>
            )}
          </div>
        ))}

        {/* Activity */}
        <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: '0.8px', textTransform: 'uppercase', padding: '16px 20px 8px' }}>
          Activity
        </p>
        {activity.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}>
            <img src={pic(40, 40, item.avatar)} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <p style={{ flex: 1, fontSize: 13, color: C.textPrimary, lineHeight: 1.4 }}>
              <span style={{ marginRight: 4 }}>{item.emoji}</span>
              <strong>{item.text}</strong> {item.action}
              <span style={{ color: C.textMuted, marginLeft: 4 }}>· {item.time}</span>
            </p>
            {item.seed && (
              <img src={pic(40, 40, item.seed)} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
      <StatusBar />
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const NAV_TABS = [
  { key: 'map', label: 'Map', Icon: Map },
  { key: 'friends', label: 'Friends', Icon: Users },
  { key: 'create', label: '', Icon: null },
  { key: 'wishlist', label: 'Wishlist', Icon: Bookmark },
  { key: 'profile', label: 'Profile', Icon: User },
]

function BottomNav({ active, onChange }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 82,
      paddingBottom: 20,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: '1px solid rgba(229,233,226,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 40,
    }}>
      {NAV_TABS.map(tab => {
        if (tab.key === 'create') {
          return (
            <button key="create" onClick={() => onChange('create')} style={{
              width: 52, height: 52, borderRadius: 16,
              background: `linear-gradient(135deg, ${C.forest}, ${C.forestDeep})`,
              boxShadow: '0 4px 16px rgba(74,124,89,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}>
              <Plus size={24} strokeWidth={2.5} />
            </button>
          )
        }
        const isActive = active === tab.key
        return (
          <button key={tab.key} onClick={() => onChange(tab.key)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            minWidth: 44,
          }}>
            <tab.Icon size={22} color={isActive ? C.forest : C.textMuted} strokeWidth={isActive ? 2.2 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.4px', color: isActive ? C.forest : C.textMuted }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('map')
  const [showCreate, setShowCreate] = useState(false)
  const [showPremium, setShowPremium] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [prevTab, setPrevTab] = useState('map')

  const handleLike = useCallback((id) => {
    setLikedPosts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }, [])

  const handleTabChange = useCallback((tab) => {
    if (tab === 'create') { setShowCreate(true); return }
    setPrevTab(activeTab)
    setActiveTab(tab)
  }, [activeTab])

  const screens = {
    map: <MapScreen likedPosts={likedPosts} onLike={handleLike} />,
    friends: <FriendsScreen likedPosts={likedPosts} onLike={handleLike} onNotifications={() => setShowNotifications(true)} />,
    wishlist: <WishlistScreen onPremium={() => setShowPremium(true)} />,
    profile: <ProfileScreen onPremium={() => setShowPremium(true)} />,
  }

  return (
    <div style={{
      width: 390, height: 844,
      borderRadius: 48, overflow: 'hidden',
      position: 'relative',
      background: C.offWhite,
      boxShadow: '0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.15)',
      flexShrink: 0,
    }}>
      {/* Active screen */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 1, transform: 'translateY(0)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        {screens[activeTab]}
      </div>

      {/* Modals */}
      {showCreate && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)',
        }}>
          <CreateScreen onClose={() => setShowCreate(false)} />
        </div>
      )}
      {showPremium && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 200,
          animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)',
        }}>
          <PremiumScreen onClose={() => setShowPremium(false)} />
        </div>
      )}
      {showNotifications && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 150,
          animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)',
        }}>
          <NotificationsScreen onClose={() => setShowNotifications(false)} />
        </div>
      )}

      {/* Bottom nav (always on top unless modal) */}
      {!showCreate && !showPremium && (
        <BottomNav active={activeTab} onChange={handleTabChange} />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
