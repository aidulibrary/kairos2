import { WindLine } from '@/components/WindLine'
import { GlassCard } from '@/components/GlassCard'
import db from '@/lib/db'
import type { Service } from '@/lib/data'

export default async function FacilitatorPage() {
  const services = await db.service.findMany({
    include: { user: true },
  }) as unknown as Service[]

  const hasServices = services.length > 0
  // Seed has 1 service, no cases/orders yet
  const hasCases = false
  const hasOrders = false

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between px-8 py-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--kairo-between)', border: '2px solid var(--kairo-facilitator)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--kairo-facilitator)' }}>F</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 style={{ fontFamily: 'var(--font-chinese-heading)', fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--kairo-speak)' }}>助成者</h1>
              <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(94, 194, 162, 0.15)', border: '1px solid var(--kairo-facilitator)', color: 'var(--kairo-facilitator)', fontFamily: 'var(--font-chinese-body)', fontSize: '10px' }}>已验证</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ color: i <= 4 ? 'var(--kairo-glimmer)' : 'var(--kairo-emerging)' }}>★</span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-whisper)' }}>
              {services[0]?.user?.name || '助成者'} · {services[0]?.projectCount || 0} 场完成
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-[var(--radius-button)]" style={{ background: 'var(--kairo-between)', border: '1px solid var(--kairo-emerging)', color: 'var(--kairo-whisper)', fontFamily: 'var(--font-chinese-body)', fontSize: '13px' }}>编辑资料</button>
          <button className="px-4 py-2 rounded-[var(--radius-button)]" style={{ background: 'linear-gradient(135deg, var(--kairo-glimmer), var(--kairo-ember))', color: 'oklch(0.15 0.02 75)', fontFamily: 'var(--font-chinese-body)', fontSize: '13px', fontWeight: 600 }}>添加服务</button>
        </div>
      </div>

      <div className="flex gap-8 px-8">
        <div className="flex flex-col flex-1 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--kairo-speak)' }}>服务清单</h2>
              <button className="px-3 py-1 rounded-[var(--radius-button)] transition-all duration-200" style={{ background: 'linear-gradient(135deg, var(--kairo-glimmer), var(--kairo-ember))', color: 'oklch(0.15 0.02 75)', fontFamily: 'var(--font-chinese-body)', fontSize: '13px', fontWeight: 600 }}>添加服务</button>
            </div>
            {hasServices ? (
              <div className="grid grid-cols-1 gap-3">
                {services.map((s) => (
                  <GlassCard key={s.id} className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: 'var(--font-chinese-heading)', fontSize: '16px', fontWeight: 600, color: 'var(--kairo-speak)' }}>{s.category}</span>
                      <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(94,194,162,0.12)', border: '1px solid var(--kairo-facilitator)', color: 'var(--kairo-facilitator)', fontFamily: 'var(--font-chinese-body)', fontSize: '11px' }}>
                        ★ {s.rating.toFixed(1)}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '13px', color: 'var(--kairo-whisper)', lineHeight: 1.6 }}>{s.description}</p>
                    <div className="flex items-center gap-4">
                      <span style={{ fontFamily: 'var(--font-chinese-body)', fontSize: '11px', color: 'var(--kairo-murmur)' }}>{s.projectCount} 场合作</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="flex items-center justify-center py-12">
                <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-murmur)' }}>你还没有写下你能做什么。</p>
              </GlassCard>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--kairo-speak)' }}>合作案例</h2>
            {hasCases ? (
              <div className="grid grid-cols-1 gap-3">{}</div>
            ) : (
              <GlassCard className="flex items-center justify-center py-12">
                <p style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-murmur)' }}>第一场合作即将成形。</p>
              </GlassCard>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-4 shrink-0" style={{ width: 260 }}>
          <GlassCard className="p-5 flex flex-col gap-3">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--kairo-speak)' }}>手艺标签</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <span key={s.id} className="px-3 py-1 rounded-full" style={{ background: 'rgba(94,194,162,0.08)', border: '1px solid var(--kairo-facilitator)', color: 'var(--kairo-facilitator)', fontFamily: 'var(--font-chinese-body)', fontSize: '12px' }}>{s.category}</span>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-5 flex flex-col gap-3">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--kairo-speak)' }}>合作请求</h3>
            <WindLine />
            {hasOrders ? null : (
              <div className="flex flex-col items-center py-6 gap-2">
                <p className="text-center" style={{ fontFamily: 'var(--font-chinese-body)', fontSize: 'var(--text-small)', color: 'var(--kairo-murmur)', lineHeight: 1.6 }}>还没有创造者向你发出邀请。</p>
              </div>
            )}
          </GlassCard>
        </aside>
      </div>
    </div>
  )
}
