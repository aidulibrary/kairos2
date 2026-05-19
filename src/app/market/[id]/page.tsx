import { WindLine } from '@/components/WindLine'
import { GlassCard } from '@/components/GlassCard'
import { TokenBadge } from '@/components/TokenBadge'
import db from '@/lib/db'
import type { Market } from '@/lib/data'

export async function generateStaticParams() {
  const markets = await db.findMany('market', { select: { id: true } })
  return (markets as Array<{ id: string }>).map((m) => ({ id: m.id }))
}

export default async function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const market = (await db.findUnique('market', {
    where: { id },
    include: { creator: true, booths: { include: { vendor: { include: { user: true } } } } },
  }) as unknown as Market | null)

  if (!market) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-32 gap-4">
        <h1 style={{ fontFamily: 'var(--font-chinese-heading)', fontSize: 'var(--text-h1)', fontWeight: 700, color: 'var(--kairo-speak)' }}>这个Kairos还没成形。</h1>
        <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-body)', color: 'var(--kairo-whisper)' }}>也许它还在暗中靠近。回广场看看。</p>
        <a href="/" className="px-6 py-3 rounded-[var(--radius-button)]" style={{ background: 'var(--kairo-between)', border: '1px solid var(--kairo-emerging)', color: 'var(--kairo-whisper)', fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-body)' }}>回到广场</a>
      </div>
    )
  }

  const booths = market.booths || []
  const occupied = booths.filter(b => b.status === 'occupied' || b.vendorId)

  return (
    <div className="flex flex-col flex-1 px-8 py-10 gap-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 style={{ fontFamily: 'var(--font-chinese-heading)', fontSize: 'var(--text-h1)', fontWeight: 700, color: 'var(--kairo-speak)' }}>{market.name}</h1>
          <div className="flex items-center gap-4">
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'var(--kairo-whisper)' }}>{market.date} · {market.location}</span>
            <span className="px-2 py-0.5 rounded-full" style={{ background: market.status === 'published' ? 'rgba(94,194,162,0.12)' : 'rgba(232,185,74,0.12)', border: `1px solid ${market.status === 'published' ? 'var(--kairo-facilitator)' : 'var(--kairo-glimmer)'}`, color: market.status === 'published' ? 'var(--kairo-facilitator)' : 'var(--kairo-glimmer)', fontFamily: 'var(--font-chinese-body)', fontSize: '11px' }}>
              {market.status === 'published' ? '召集中' : '成形中'}
            </span>
          </div>
        </div>
        <button className="px-6 py-3 rounded-[var(--radius-button)] transition-all duration-200 hover:-translate-y-[2px]"
          style={{ background: 'linear-gradient(135deg, var(--kairo-glimmer), var(--kairo-ember))', color: 'oklch(0.15 0.02 75)', fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-body)', fontWeight: 600 }}>
          召唤到来者
        </button>
      </div>

      {/* ── 描述 ── */}
      {market.description && (
        <GlassCard className="p-6">
          <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-body)', color: 'var(--kairo-speak)', lineHeight: 1.7 }}>{market.description}</p>
        </GlassCard>
      )}

      <div className="flex gap-8">
        {/* ── 场域布局 ── */}
        <div className="flex flex-col flex-1 gap-4">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--kairo-speak)' }}>场域</h2>
          <GlassCard className="p-6">
            <div className="flex flex-col gap-4">
              {booths.slice(0, 8).map((b, i) => {
                const isOccupied = b.status === 'occupied'
                const hasVendor = !!b.vendorId
                return (
                  <div key={b.id || i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: isOccupied ? 'rgba(232,185,74,0.06)' : 'transparent', border: `1px solid ${isOccupied ? 'var(--kairo-glimmer)' : 'var(--kairo-emerging)'}` }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: isOccupied ? 'var(--kairo-glimmer)' : 'var(--kairo-murmur)', minWidth: 40 }}>{b.number}</span>
                    <span style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '13px', color: hasVendor ? 'var(--kairo-speak)' : 'var(--kairo-murmur)', flex: 1 }}>
                      {hasVendor ? (b.vendor?.user?.name || '同行者') : (b.status === 'reserved' ? '已预留' : '空位——等待到来')}
                    </span>
                    {hasVendor && b.vendor && (
                      <TokenBadge level={b.vendor?.user?.tokenLevel as 'WALKER' | 'CRAFTER' | 'MASTER' | 'FLAMEKEEPER' || 'WALKER'} size="sm" />
                    )}
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        {/* ── 谁将到来 ── */}
        <div className="flex flex-col gap-4" style={{ width: 320 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--kairo-speak)' }}>谁将到来</h2>
          <div className="flex flex-col gap-2">
            {occupied.length > 0 ? (
              occupied.map((b) => (
                <GlassCard key={b.id} className="p-4 flex items-center gap-4">
                  <TokenBadge level={b.vendor?.user?.tokenLevel as 'WALKER' | 'CRAFTER' | 'MASTER' | 'FLAMEKEEPER' || 'WALKER'} size="sm" />
                  <div className="flex flex-col">
                    <span style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-body)', color: 'var(--kairo-speak)' }}>{b.vendor?.user?.name || '同行者'}</span>
                    <span style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '11px', color: 'var(--kairo-murmur)' }}>{b.vendor?.category || '手艺人'} · 信物分 {b.vendor?.creditScore}</span>
                  </div>
                </GlassCard>
              ))
            ) : (
              <GlassCard className="p-6 flex items-center justify-center">
                <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-murmur)' }}>还没有同行者到来。召唤他们。</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
