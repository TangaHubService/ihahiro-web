import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Link } from '@/i18n/navigation'
import { CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'

type Highlight = {
  title: string
  body: string
}

export type AuthPageShellProps = {
  badge: string
  title: string
  subtitle: string
  sideTitle: string
  sideBody: string
  highlights: Highlight[]
  alternatePrompt: string
  alternateLabel: string
  alternateHref: string
  children: ReactNode
}

export function AuthPageShell({
  badge,
  title,
  subtitle,
  sideTitle,
  sideBody,
  highlights,
  alternatePrompt,
  alternateLabel,
  alternateHref,
  children,
}: AuthPageShellProps) {
  return (
    <main className="flex-1 bg-[#f7fbf2] py-10 md:py-14">
      <Container className="grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:items-start">
         <aside className="rounded-[2rem] bg-primary p-6 text-white shadow-[0_20px_55px_rgba(21,45,25,0.12)] md:p-8">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.045em]">
            {sideTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-white/84">
            {sideBody}
          </p>

          <div className="mt-7 grid gap-4">
            {highlights.map((item) => (
              <article
                key={item.title}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-white" />
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {item.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
        <Card className="rounded-[2rem] border-[#dce8da] p-6 shadow-[0_20px_55px_rgba(21,45,25,0.05)] md:p-8">
          <h1 className="text-md font-black leading-tight tracking-[-0.045em] text-[#173b1b] sm:text-xl">
            {title}
          </h1>
          <div className="mt-8">{children}</div>

          <p className="mt-6 text-sm text-[#5b695d]">
            {alternatePrompt}{' '}
            <Link
              href={alternateHref}
              className="font-bold text-primary hover:underline"
            >
              {alternateLabel}
            </Link>
          </p>
        </Card>
      </Container>
    </main>
  )
}
