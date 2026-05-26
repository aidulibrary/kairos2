import { WindLine } from '@/components/WindLine'
import { GlassCard } from '@/components/GlassCard'
import { TokenBadge } from '@/components/TokenBadge'
import { TokenDetail } from '@/components/TokenDetail'
import db from '@/lib/db'
import type { Vendor } from '@/lib/data'

export default async function ArriverPage() {
  const vendor = (await db.vendor.findMany({
    where: {},
    include: { user: true, booths: { include: { market: true } } },
    take: 1,
  }) as unknown as Vendor[])[0]

  const invitations = (vendor?.booths || []).filter(b => b.status === 'reserved')
  const history = (vendor?.booths || []).filter(b => b.status === 'occupied')
  const tokenLevel = vendor?.user?.tokenLevel || 'WALKER'
  const creditScore = vendor?.creditScore || 60

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center gap-8 px-8 py-10">
        <TokenBadge level={tokenLevel as 'WALKER' | 'CRAFTER' | 'MASTER' | 'FLAMEKEEPER'} size="lg" />
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', fontWeight: 600, color: 'var(--kairo-glimmer)', lineHeight: 1 }}>{creditScore}</span>
            <span style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-whisper)' }}>信物分</span>
          </div>
          <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-body)', color: 'var(--kairo-whisper)' }}>
            {vendor?.description || '你的信物正在被看见。'}
          </p>
          <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-murmur)' }}>
            {vendor?.user?.name || '到来者'} · {vendor?.category || '手艺人'} · {vendor?.city || ''}
          </p>
          <div className="mt-2 w-64">
            <TokenDetail score={creditScore} level={tokenLevel as 'WALKER' | 'CRAFTER' | 'MASTER' | 'FLAMEKEEPER'} expoCount={vendor?.expoCount || 0} goodRate={vendor?.goodRate || 0} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 px-8 pb-6" style={{ gap: 'var(--space-breath)' }}>
        <GlassCard className="flex flex-col gap-4 p-5 shrink-0" style={{ width: 280 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--kairo-speak)' }}>召集箱</h3>
          <WindLine />
          {invitations.length > 0 ? (
            <div className="flex flex-col gap-2">
              {invitations.map((inv) => (
                <div key={inv.id} className="p-3 rounded-lg" style={{ background: 'var(--kairo-between)', border: '1px solid var(--kairo-emerging)' }}>
                  <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '12px', color: 'var(--kairo-speak)' }}>{inv.market?.name || '一个Kairos'}</p>
                  <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '10px', color: 'var(--kairo-murmur)' }}>{inv.number}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2">
              <p className="text-center" style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-murmur)', lineHeight: 1.6 }}>还没有新的召唤抵达。</p>
            </div>
          )}
        </GlassCard>

        <div className="flex flex-col flex-1 gap-4">
          <div className="flex items-center justify-between">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--kairo-speak)' }}>信物墙</h3>
            <button className="px-3 py-1 rounded-[var(--radius-button)] transition-all duration-200" style={{ background: 'var(--kairo-between)', border: '1px solid var(--kairo-emerging)', color: 'var(--kairo-whisper)', fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)' }}>编辑</button>
          </div>
          <GlassCard className="flex-1 p-6 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--kairo-between)', border: '2px dashed var(--kairo-emerging)' }}>
              <span style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '24px', color: 'var(--kairo-murmur)' }}>+</span>
            </div>
            <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-whisper)' }}>添加你的手艺印记</p>
          </GlassCard>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--kairo-whisper)' }}>参展记录</span>
            <WindLine className="flex-1 max-w-32" />
          </div>
          {history.length > 0 ? (
            <div className="flex flex-col gap-2">
              {history.map((h) => (
                <GlassCard key={h.id} className="p-3 flex items-center gap-3">
                  <span style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '13px', color: 'var(--kairo-speak)' }}>{h.market?.name || '一个Kairos'}</span>
                  <span style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '11px', color: 'var(--kairo-murmur)' }}>{h.number}</span>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 gap-2"><p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-murmur)' }}>你的足迹即将开始延伸。</p></div>
          )}

          <GlassCard className="flex flex-col gap-4 p-5 shrink-0" style={{ width: 280 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--kairo-speak)' }}>到场历</h3>
            <WindLine />
            <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2">
              <p className="text-center" style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-murmur)', lineHeight: 1.6 }}>
                {history.length > 0 ? `已到场 ${history.length} 场Kairos。` : '你的到场历还是空的。'}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
