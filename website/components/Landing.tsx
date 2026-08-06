import type { LandingStrings, Locale } from '@/content/types';
import { USAGE_EXAMPLES } from '@/content/code';
import { GITHUB_URL, NPM_URL, buildJsonLd } from '@/lib/seo';
import CodeBlock from './CodeBlock';
import DeviceShowcase from './DeviceShowcase';
import InstallTabs from './InstallTabs';
import LiveDemo from './LiveDemo';

interface LandingProps {
  locale: Locale;
  strings: LandingStrings;
}

interface SectionHeadProps {
  id: string;
  overline: string;
  title: string;
}

function SectionHead({ id, overline, title }: SectionHeadProps) {
  return (
    <div className="section-head">
      <p className="overline">{overline}</p>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

// The entire landing markup lives here once; locale only swaps strings and link targets
export default function Landing({ locale, strings: s }: LandingProps) {
  const readmeUrl =
    locale === 'ko'
      ? `${GITHUB_URL}/blob/main/README.ko.md`
      : `${GITHUB_URL}#readme`;
  const homePath = locale === 'en' ? '/' : '/ko';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(locale)),
        }}
      />

      <header className="site-header">
        <div className="container header-inner">
          <a href={homePath} className="brand">
            <span className="brand-mark" aria-hidden="true" />
            react-device-check
          </a>
          <nav className="header-nav" aria-label="Site">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            <a href={NPM_URL} target="_blank" rel="noreferrer noopener">
              npm
            </a>
            {/* Plain anchor: crossing root layouts is a full page load by design */}
            <a
              href={s.header.langHref}
              className="lang-switch"
              hrefLang={locale === 'en' ? 'ko' : 'en'}
              rel="alternate"
            >
              {s.header.langLabel}
            </a>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-badges">
            {s.hero.badges.map((badge) => (
              <span key={badge} className="chip">
                {badge}
              </span>
            ))}
          </div>
          <h1>
            {s.hero.titlePre}
            <span className="gradient-text">{s.hero.titleAccent}</span>
            {s.hero.titlePost}
          </h1>
          <p className="hero-tagline">{s.hero.tagline}</p>
          <div className="hero-ctas">
            <a href="#demo-title" className="btn btn-primary">
              {s.hero.ctaDemo}
            </a>
            <a
              href={GITHUB_URL}
              className="btn btn-ghost"
              target="_blank"
              rel="noreferrer noopener"
            >
              {s.hero.ctaGithub}
            </a>
          </div>
          <InstallTabs strings={s.install} />
        </section>

        <section className="section" aria-labelledby="showcase-title">
          <SectionHead
            id="showcase-title"
            overline={s.showcase.overline}
            title={s.showcase.title}
          />
          <p className="section-intro">{s.showcase.intro}</p>
          <div style={{ height: '3rem' }} aria-hidden="true" />
          <DeviceShowcase strings={s.showcase} />
        </section>

        <section className="section" aria-labelledby="demo-title">
          <SectionHead
            id="demo-title"
            overline={s.demo.overline}
            title={s.demo.title}
          />
          <p className="section-intro">{s.demo.intro}</p>
          <div style={{ height: '2rem' }} aria-hidden="true" />
          <LiveDemo strings={s.demo} />
          <p className="demo-hint">{s.demo.hint}</p>
        </section>

        <section className="section" aria-labelledby="usage-title">
          <SectionHead
            id="usage-title"
            overline={s.usage.overline}
            title={s.usage.title}
          />
          <p className="section-intro">{s.usage.body}</p>
          <div className="usage-list">
            {s.usage.examples.map((example, index) => (
              <article className="usage-item" key={example.title}>
                <div>
                  <span className="usage-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{example.title}</h3>
                  <p className="usage-body">{example.body}</p>
                </div>
                <CodeBlock
                  code={USAGE_EXAMPLES[index].code}
                  filename={USAGE_EXAMPLES[index].filename}
                />
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="features-title">
          <SectionHead
            id="features-title"
            overline={s.features.overline}
            title={s.features.title}
          />
          <div className="features-grid">
            {s.features.items.map((item) => (
              <article key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="compare-title">
          <SectionHead
            id="compare-title"
            overline={s.compare.overline}
            title={s.compare.title}
          />
          <p className="prose">{s.compare.body}</p>
        </section>

        <section className="section" aria-labelledby="api-title">
          <SectionHead
            id="api-title"
            overline={s.api.overline}
            title={s.api.title}
          />
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th scope="col">API</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {s.api.rows.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="api-docs-link">
            {s.api.docsLead}{' '}
            <a href={readmeUrl} target="_blank" rel="noreferrer noopener">
              {s.api.docsLinkText}
            </a>
            .
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>{s.footer.tagline}</span>
          <nav className="footer-links" aria-label="Footer">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            <a href={NPM_URL} target="_blank" rel="noreferrer noopener">
              npm
            </a>
            <a
              href={s.header.langHref}
              hrefLang={locale === 'en' ? 'ko' : 'en'}
              rel="alternate"
            >
              {s.header.langLabel}
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
