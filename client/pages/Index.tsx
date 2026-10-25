const CONTACT = "jjpa@digitalcustody.academy";
const SANCTUM = "https://sanctum.enigma.sh";

const Arrow = () => (
  <span className="arrow" aria-hidden="true">
    →
  </span>
);

const Stop = () => <span className="pd" aria-hidden="true" />;

const NAV = [
  { href: "#about", label: "About" },
  { href: "#modules", label: "Modules" },
  { href: "#how", label: "How it works" },
  { href: "#instructors", label: "Instructors" },
  { href: "/blog/", label: "Blog" },
];

const FRAMEWORKS = [
  {
    name: "CCSS v9.0",
    desc: "CryptoCurrency Security Standard. Controls for key generation, storage, use and audit.",
    logo: "/ccss-logo.png",
    href: "https://cryptoconsortium.org/standards/ccss",
  },
  {
    name: "CMTA DACS",
    desc: "Capital Markets and Technology Association Digital Assets Custody Standard. Custody operations and governance.",
    logo: "/cmta-dacs-logo.png",
    href: "https://cmta.ch/standards/digital-assets-custody-standard",
  },
  {
    name: "NIST CSF 2.0",
    desc: "NIST Cybersecurity Framework. The structure for risk, controls and response across the curriculum.",
    logo: "/nist-csf-logo.png",
    href: "https://www.nist.gov/cyberframework",
  },
];

const MODULES = [
  {
    code: "M1",
    title: "Foundations of Digital Custody",
    level: "Beginner to Intermediate",
    body: "Blockchain architecture, key management fundamentals, hot and cold storage, and custody operating frameworks.",
    who: "Board members, institutional sales leads, compliance officers, operations managers",
  },
  {
    code: "M2",
    title: "Enterprise Key Management",
    level: "Intermediate to Advanced",
    body: "Key generation, storage, rotation and recovery. HSM integration, multisig and threshold schemes, and key management that stands up to audit.",
    who: "CTOs, security engineers, DevOps teams, infrastructure architects",
  },
  {
    code: "M3",
    title: "Security Architecture for Custody",
    level: "Advanced",
    body: "Network segmentation, access control, monitoring, incident response, disaster recovery and audit trails for institutional custody.",
    who: "Security engineers, software architects, platform engineers, IT directors",
  },
  {
    code: "M4",
    title: "Compliance and Operational Security",
    level: "Intermediate",
    body: "Regulatory frameworks, audit requirements, internal controls and operating procedures for custody teams preparing for examination.",
    who: "Compliance officers, risk managers, legal counsel, operations leads",
  },
];

const STEPS = [
  {
    title: "Learn online",
    body: "Work through the lessons and assessments in your browser, at your own pace.",
  },
  {
    title: "Go hands-on",
    body: "Lessons that use a hardware wallet, a smart card or another native interface run in Sanctum, installed from the DCA registry on your own machine.",
  },
  {
    title: "Complete",
    body: "Pass the final assessment to receive the completion record for the module.",
  },
  {
    title: "Sign",
    body: "Sign the record through an identity provider. The signature ties the certificate to the person who completed the course.",
  },
];

export default function Index() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <nav className="nav" aria-label="Primary">
        <div className="wrap nav__inner">
          <a className="wordmark" href="#top" aria-label="Digital Custody Academy home">
            <span className="tile tile--sm" aria-hidden="true">
              <span>
                DCA<i />
              </span>
            </span>
            <span className="wordmark__full">Digital Custody Academy</span>
          </a>
          <div className="nav__links">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </div>
          <div className="nav__cta">
            <a className="btn btn--accent btn--sm" href="#contact">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* Hero */}
        <header className="hero" id="top">
          <div className="wrap hero__grid">
            <div>
              <p className="eyebrow">Digital Custody Academy</p>
              <h1>
                digital
                <br />
                custody
                <br />
                training
                <Stop />
              </h1>
              <p className="hero__sub">
                Standards-aligned modules for the teams who hold other people's keys. Learn
                online, with hands-on lessons in Sanctum on your own machine, and finish with a{" "}
                <span className="em">completion record you sign yourself</span>.
              </p>
              <div className="btn-row">
                <a className="btn btn--accent" href="#modules">
                  See the modules <Arrow />
                </a>
                <a className="btn btn--ghost" href="#how">
                  How it works
                </a>
              </div>
            </div>

            <div className="card record" aria-label="Example module record">
              <div className="record__head">
                <span className="tile" aria-hidden="true">
                  <span>
                    M1<i />
                  </span>
                </span>
                <span className="record__title">
                  <b>Foundations of Digital Custody</b>
                  <span>Module 01 · Beginner to Intermediate</span>
                </span>
                <span className="tag">Example</span>
              </div>
              <ol className="record__steps">
                <li>
                  <span className="record__n">1</span>
                  Lessons
                  <span className="tag">Done</span>
                </li>
                <li className="is-next">
                  <span className="record__n">2</span>
                  Final assessment
                  <span className="tag tag--live">Next</span>
                </li>
                <li className="is-locked">
                  <span className="record__n">3</span>
                  Signed completion record
                  <span className="tag">Locked</span>
                </li>
              </ol>
              <div className="record__foot">
                <span className="fine">Credential ID · DCA-2026-000123</span>
                <span className="fine">UAE PASS signature</span>
              </div>
            </div>
          </div>
        </header>

        <div className="strip">
          <div className="wrap strip__inner">
            <span className="strip__label">How DCA works</span>
            <ul>
              <li>Aligned to CCSS, CMTA DACS and NIST CSF</li>
              <li>Online, and on your own machine</li>
              <li>Completion signed by the learner</li>
            </ul>
          </div>
        </div>

        {/* About */}
        <section className="section" id="about">
          <div className="wrap">
            <div className="shead">
              <div>
                <p className="eyebrow">01 · About</p>
                <h2 className="h2">
                  about dca
                  <Stop />
                </h2>
              </div>
              <p className="lede">
                Professional education in digital asset security, for board members, compliance
                officers, security engineers and custody operators.
              </p>
            </div>

            <div className="about">
              <div className="prose">
                <p>
                  Institutions moving into digital assets need people who understand how keys are
                  generated, stored, used and recovered, and how an auditor checks each step.
                  Digital Custody Academy teaches that work.
                </p>
                <p>
                  The curriculum covers encryption, key management, cold storage architecture,
                  disaster recovery, compliance frameworks and operational security. Every module
                  maps its lessons to the controls of a recognised standard.
                </p>
                <p>
                  DCA is <b>an Enigma Technologies Solutions initiative</b>. The modules are built
                  by the team behind ETS's custody, signing and key-management work for regulated
                  firms.
                </p>
              </div>

              <div>
                <h3 className="fw-h">Standards referenced</h3>
                <div className="fws">
                  {FRAMEWORKS.map((f) => (
                    <a
                      key={f.name}
                      className="card fw"
                      href={f.href}
                      rel="nofollow noopener"
                      target="_blank"
                    >
                      <img src={f.logo} alt="" width={88} height={52} />
                      <span className="fw__text">
                        <span className="fw__name">
                          {f.name} <Arrow />
                        </span>
                        <span className="fw__desc">{f.desc}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="section section--alt" id="modules">
          <div className="wrap">
            <div className="shead">
              <div>
                <p className="eyebrow">02 · Modules</p>
                <h2 className="h2">
                  the modules
                  <Stop />
                </h2>
              </div>
              <p className="lede">
                Four modules are in preparation. Each one is published when it is ready, online,
                with its hands-on lessons in the DCA registry in Sanctum.
              </p>
            </div>

            <div className="modules">
              {MODULES.map((m) => (
                <article key={m.code} className="card module">
                  <div className="module__head">
                    <span className="tile tile--ghost" aria-hidden="true">
                      <span>
                        {m.code}
                        <i />
                      </span>
                    </span>
                    <div>
                      <h3>{m.title}</h3>
                      <p className="module__level">{m.level}</p>
                    </div>
                  </div>
                  <p className="module__body">{m.body}</p>
                  <p className="module__for">
                    <b>For:</b> {m.who}
                  </p>
                  <div className="module__foot">
                    <span className="tag">Coming soon</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section" id="how">
          <div className="wrap">
            <div className="shead">
              <div>
                <p className="eyebrow">03 · How it works</p>
                <h2 className="h2">
                  signed, not
                  <br />
                  clicked through
                  <Stop />
                </h2>
              </div>
              <p className="lede">
                Completion is a document you sign, not a checkbox. The record stays with you, and
                anyone you show it to can check the signature.
              </p>
            </div>

            <div className="flow">
              {STEPS.map((s) => (
                <div key={s.title} className="card flow__step">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
            <p className="flow__note">
              The first supported courses will be in the UAE, signed with UAE PASS.
            </p>
          </div>
        </section>

        {/* Instructors */}
        <section className="section section--alt" id="instructors">
          <div className="wrap">
            <div className="shead">
              <div>
                <p className="eyebrow">04 · Instructors</p>
                <h2 className="h2">
                  your instructors
                  <Stop />
                </h2>
              </div>
              <p className="lede">
                The modules are written and taught by practitioners who have built custody and
                signing systems.
              </p>
            </div>

            <article className="card person">
              <img
                className="person__photo"
                src="/instructor-jjpa.jpg"
                alt="José J. Pérez Aguinaga"
                width={760}
                height={950}
                loading="lazy"
              />
              <div className="person__body">
                <p className="eyebrow">Lead instructor</p>
                <h3 className="person__name">José J. Pérez Aguinaga</h3>
                <p className="person__bio">
                  Cryptography engineer and educator focused on digital asset custody for retail
                  and institutional markets. VP of Solutions Engineering at Dfns, former co-founder
                  and CTO of Tungsten, and founder of conFIEL, self-sovereign identity for digital
                  signatures in Latin America. Writes and runs workshops on blockchain technology
                  and passkeys.
                </p>
                <ul className="person__tags">
                  <li className="tag">Digital custody</li>
                  <li className="tag">Self-sovereign identity</li>
                  <li className="tag">Passkeys</li>
                </ul>
                <div className="person__links">
                  <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
                  <a href="https://jjperezaguinaga.com" rel="noopener" target="_blank">
                    jjperezaguinaga.com <Arrow />
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Contact */}
        <section className="section section--band" id="contact">
          <div className="wrap">
            <div className="band">
              <div>
                <p className="eyebrow">Contact</p>
                <h2 className="h2">
                  get in touch
                  <Stop />
                </h2>
                <p>
                  For module availability, team enrolment or questions about the curriculum,
                  write to us.
                </p>
                <a className="band__mail" href={`mailto:${CONTACT}`}>
                  {CONTACT}
                </a>
              </div>
              <div className="btn-row">
                <a className="btn btn--accent" href={SANCTUM}>
                  Get Sanctum <Arrow />
                </a>
                <a className="btn btn--ghost" href="https://enigma.sh">
                  enigma.sh
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot__grid">
            <div>
              <a className="wordmark" href="#top">
                <span className="tile" aria-hidden="true">
                  <span>
                    DCA<i />
                  </span>
                </span>
                <span>Digital Custody Academy</span>
              </a>
              <p className="foot__blurb">
                Professional education in digital asset security. Secure. Verified. Professional.
              </p>
              <nav className="foot__links" aria-label="Footer">
                <a href="/blog/">Blog</a>
              </nav>
            </div>
            <a className="foot__by" href="https://enigma.sh">
              An initiative of <span className="ets">ETS</span> Enigma Technologies Solutions
            </a>
          </div>
          <div className="foot__bar">
            <span>© 2026 Enigma Technologies Solutions Limited · Ras Al Khaimah, UAE</span>
            <span>digitalcustody.academy</span>
          </div>
        </div>
      </footer>
    </>
  );
}
