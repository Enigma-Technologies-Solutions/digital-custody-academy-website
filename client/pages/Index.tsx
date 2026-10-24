export default function Index() {
  return (
    <div className="min-h-screen bg-dca-navy-base text-white overflow-x-hidden">
      {/* Header/Navigation */}
      <header className="relative z-50 px-6 sm:px-10 md:px-20 py-8 md:py-12">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/dca-logo-white.png"
              alt="Digital Custody Academy"
              className="h-10 w-10 mr-4 rounded"
            />
            <span className="text-white font-space text-lg tracking-wide">
              Digital Custody Academy
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-12 text-sm font-inter">
            <a
              href="#about"
              className="text-white hover:text-dca-accent-blue transition-colors"
            >
              about us
            </a>
            <a
              href="#curriculum"
              className="text-white hover:text-dca-accent-blue transition-colors"
            >
              curriculum
            </a>
            <a
              href="#courses"
              className="text-white hover:text-dca-accent-blue transition-colors"
            >
              courses
            </a>
            <a
              href="#contact"
              className="text-white hover:text-dca-accent-blue transition-colors"
            >
              contact us
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-10 md:px-20 py-16 md:py-0 min-h-screen flex items-center" id="hero">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left - Hero Text */}
            <div>
              <h1 className="font-poppins font-bold text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-tight mb-6 md:mb-8">
                <span className="text-white">digital</span>
                <br />
                <span className="text-white">security</span>
                <br />
                <span className="text-white">training</span>
                <span className="text-dca-accent-blue">.</span>
              </h1>
            </div>

            {/* Right - Description */}
            <div className="space-y-4 md:space-y-6">
              <h2 className="font-poppins text-base md:text-lg font-bold text-white">
                Master Digital Asset Security
              </h2>
              <p className="font-space text-base md:text-xl text-white leading-relaxed">
                Digital Custody Academy provides comprehensive education in institutional-grade digital asset custody, security protocols, and best practices for teams managing crypto infrastructure.
              </p>
              <p className="font-space text-sm md:text-base text-white leading-relaxed">
                Learn from industry experts with decades of experience in custody, security, and blockchain infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About DCA Section */}
      <section className="relative bg-white text-dca-text-dark py-20" id="about">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left - Title and intro */}
            <div>
              <h2 className="font-poppins text-6xl md:text-8xl font-bold text-dca-text-dark leading-tight mb-8">
                <span className="text-dca-text-dark">about</span>
                <br />
                <span className="text-dca-text-dark">dca</span>
                <span className="text-dca-accent-blue">.</span>
              </h2>

              <div className="space-y-6">
                <p className="font-space text-base text-dca-text-dark leading-relaxed">
                  Digital Custody Academy was established to address the critical need for professional education in digital asset custody and security. As institutions and enterprises move into crypto infrastructure, understanding institutional-grade custody becomes essential.
                </p>

                <p className="font-space text-base text-dca-text-dark leading-relaxed">
                  Our curriculum is developed by security engineers, custody operators, and blockchain infrastructure specialists with combined experience across regulated institutions, exchange platforms, and enterprise deployments.
                </p>

                <p className="font-space text-base text-dca-text-dark leading-relaxed">
                  We provide rigorous, standards-aligned training that covers encryption, key management, cold storage architecture, disaster recovery, compliance frameworks, and operational security best practices.
                </p>

                <p className="font-space text-base text-dca-text-dark leading-relaxed">
                  DCA equips teams with practical knowledge and verified credentials to implement secure, auditable custody systems that protect digital assets at institutional scale.
                </p>
              </div>
            </div>

            {/* Right - Frameworks */}
            <div className="space-y-8">
              <h3 className="font-poppins text-2xl font-bold text-dca-text-dark mb-2">
                Security Frameworks
              </h3>
              <p className="font-space text-base text-dca-text-dark leading-relaxed mb-6">
                Security frameworks provide standardized methodologies and best practices for designing, implementing, and managing secure systems. They offer proven guidelines for risk management, compliance, and operational excellence. DCA teaches industry-leading frameworks that organizations worldwide trust for institutional-grade security.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <a href="https://cryptoconsortium.org/standards/ccss" rel="nofollow" target="_blank" className="flex-shrink-0">
                    <img src="/ccss-logo.png" alt="CCSS" className="h-12 w-auto" />
                  </a>
                  <div>
                    <a href="https://cryptoconsortium.org/standards/ccss" rel="nofollow" target="_blank" className="hover:text-dca-accent-blue transition-colors">
                      <h4 className="font-poppins text-xl font-bold text-dca-text-dark mb-2">
                        CCSS v9.0
                      </h4>
                    </a>
                    <p className="font-space text-base text-dca-grey-dark leading-relaxed">
                      Cryptocurrency Security Standard. Aligns our curriculum with industry best practices for secure digital asset infrastructure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <a href="https://cmta.ch/standards/digital-assets-custody-standard" rel="nofollow" target="_blank" className="flex-shrink-0">
                    <img src="/cmta-dacs-logo.png" alt="CMTA DACS" className="h-12 w-auto" />
                  </a>
                  <div>
                    <a href="https://cmta.ch/standards/digital-assets-custody-standard" rel="nofollow" target="_blank" className="hover:text-dca-accent-blue transition-colors">
                      <h4 className="font-poppins text-xl font-bold text-dca-text-dark mb-2">
                        CMTA DACS 2025
                      </h4>
                    </a>
                    <p className="font-space text-base text-dca-grey-dark leading-relaxed">
                      Capital Markets & Technology Association Digital Assets Custody Standard. Professional benchmarks for custody operations, risk management, and institutional compliance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <a href="https://www.nist.gov/cyberframework" rel="nofollow" target="_blank" className="flex-shrink-0">
                    <img src="/nist-csf-logo.png" alt="NIST CSF" className="h-12 w-auto" />
                  </a>
                  <div>
                    <a href="https://www.nist.gov/cyberframework" rel="nofollow" target="_blank" className="hover:text-dca-accent-blue transition-colors">
                      <h4 className="font-poppins text-xl font-bold text-dca-text-dark mb-2">
                        NIST CSF 2.0
                      </h4>
                    </a>
                    <p className="font-space text-base text-dca-grey-dark leading-relaxed">
                      National Institute of Standards & Technology Cybersecurity Framework 2.0. Foundation for our security architecture and controls, ensuring institutional-grade protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="relative bg-dca-grey-light text-dca-text-dark py-20" id="courses">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <h2 className="font-poppins text-6xl md:text-8xl font-bold mb-16">
            <span className="text-dca-text-dark">featured</span>
            <br />
            <span className="text-dca-text-dark">courses</span>
            <span className="text-dca-accent-blue">.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Course Card 1 */}
            <div className="bg-white p-8 rounded-lg">
              <h3 className="font-poppins text-2xl font-bold text-dca-text-dark mb-4">
                Foundations of Digital Custody
              </h3>
              <p className="font-space text-sm text-dca-grey-dark mb-4 uppercase tracking-wide">
                Beginner to Intermediate
              </p>
              <p className="font-space text-base text-dca-text-dark leading-relaxed mb-4">
                Introduction to cryptocurrency, blockchain architecture, key management fundamentals, hot and cold storage, and custody operational frameworks. Ideal for teams new to digital asset management.
              </p>
              <p className="font-space text-xs text-dca-grey-dark mb-6">
                <span className="font-medium">Ideal for:</span> Board members, institutional sales leads, compliance officers, operations managers
              </p>
              <span className="px-4 py-2 bg-dca-grey-dark text-white rounded font-space text-sm inline-block">
                Coming Soon
              </span>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white p-8 rounded-lg">
              <h3 className="font-poppins text-2xl font-bold text-dca-text-dark mb-4">
                Enterprise Key Management
              </h3>
              <p className="font-space text-sm text-dca-grey-dark mb-4 uppercase tracking-wide">
                Intermediate to Advanced
              </p>
              <p className="font-space text-base text-dca-text-dark leading-relaxed mb-4">
                Deep dive into cryptographic key generation, storage, rotation, and recovery. Covers HSM integration, multisig architectures, threshold schemas, and compliance-ready key management systems.
              </p>
              <p className="font-space text-xs text-dca-grey-dark mb-6">
                <span className="font-medium">Ideal for:</span> CTOs, security engineers, DevOps teams, infrastructure architects
              </p>
              <button className="px-4 py-2 bg-dca-grey-dark text-white rounded font-space text-sm hover:opacity-90 transition-opacity">
                Coming Soon
              </button>
            </div>

            {/* Course Card 3 */}
            <div className="bg-white p-8 rounded-lg">
              <h3 className="font-poppins text-2xl font-bold text-dca-text-dark mb-4">
                Security Architecture for Custody
              </h3>
              <p className="font-space text-sm text-dca-grey-dark mb-4 uppercase tracking-wide">
                Advanced
              </p>
              <p className="font-space text-base text-dca-text-dark leading-relaxed mb-4">
                Designing secure infrastructure for institutional custody: network segmentation, access controls, monitoring, incident response, disaster recovery, and audit trail implementation.
              </p>
              <p className="font-space text-xs text-dca-grey-dark mb-6">
                <span className="font-medium">Ideal for:</span> Security engineers, software architects, platform engineers, IT directors
              </p>
              <button className="px-4 py-2 bg-dca-grey-dark text-white rounded font-space text-sm hover:opacity-90 transition-opacity">
                Coming Soon
              </button>
            </div>

            {/* Course Card 4 */}
            <div className="bg-white p-8 rounded-lg">
              <h3 className="font-poppins text-2xl font-bold text-dca-text-dark mb-4">
                Compliance & Operational Security
              </h3>
              <p className="font-space text-sm text-dca-grey-dark mb-4 uppercase tracking-wide">
                Intermediate
              </p>
              <p className="font-space text-base text-dca-text-dark leading-relaxed mb-4">
                Regulatory frameworks, audit requirements, internal controls, and operational procedures for compliant custody operations. Prepares teams for regulatory examination and third-party audits.
              </p>
              <p className="font-space text-xs text-dca-grey-dark mb-6">
                <span className="font-medium">Ideal for:</span> Compliance officers, risk managers, legal counsel, operations leads
              </p>
              <button className="px-4 py-2 bg-dca-grey-dark text-white rounded font-space text-sm hover:opacity-90 transition-opacity">
                Coming Soon
              </button>
            </div>
          </div>

          {/* Tagline Section */}
          <div className="bg-dca-navy-base text-center py-16 px-8 rounded-lg">
            <h3 className="font-space text-3xl md:text-4xl font-bold text-white">
              Secure. Verified. Professional.
            </h3>
          </div>
        </div>
      </section>

      {/* Our Focus Section */}
      <section className="relative bg-dca-navy-dark py-20" id="focus">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Title */}
            <div>
              <h2 className="font-poppins text-6xl md:text-8xl font-bold text-white leading-tight">
                <span className="text-white">our</span>
                <br />
                <span className="text-white">focus</span>
                <span className="text-dca-accent-blue">.</span>
              </h2>
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              <h3 className="font-poppins text-base font-bold text-white">
                Comprehensive Digital Asset Security
              </h3>
              <p className="font-space text-base text-white leading-relaxed">
                We teach the foundations of cryptography, key management architecture, custody operations, and security engineering required to build and operate institutional-grade custody infrastructure.
              </p>
              <p className="font-space text-base text-white leading-relaxed">
                Each course combines theoretical knowledge with practical exercises, allowing teams to develop operational expertise, implement security controls, and understand compliance requirements for digital asset safeguarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Training Formats Section */}
      <section className="relative bg-white text-dca-text-dark pt-20 pb-20" id="curriculum">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <h2 className="font-poppins text-6xl md:text-8xl font-bold mb-16">
            <span className="text-dca-text-dark">training</span>
            <br />
            <span className="text-dca-text-dark">formats</span>
            <span className="text-dca-accent-blue">.</span>
          </h2>

          <div className="space-y-12">
            {/* Self-Paced Online */}
            <div className="space-y-4">
              <h3 className="font-poppins text-3xl md:text-4xl font-bold text-dca-text-dark">
                Self-Paced Online
              </h3>
              <h4 className="font-space text-xl md:text-2xl text-dca-text-dark font-normal">
                Learn at your own pace.
              </h4>
              <p className="font-space text-base text-dca-text-dark leading-relaxed max-w-4xl">
                Video lectures, reading materials, and interactive quizzes available on-demand. Complete at your own schedule with lifetime access to course materials and periodic updates.
              </p>
            </div>

            {/* Live Instructor-Led */}
            <div className="space-y-4">
              <h3 className="font-poppins text-3xl md:text-4xl font-bold text-dca-text-dark">
                Live Instructor-Led
              </h3>
              <h4 className="font-space text-xl md:text-2xl text-dca-text-dark font-normal">
                Interactive cohort learning.
              </h4>
              <p className="font-space text-base text-dca-text-dark leading-relaxed max-w-4xl">
                Real-time sessions with instructors, peer discussion, and hands-on labs. Cohort-based learning creates accountability and networking opportunities with other security professionals.
              </p>
            </div>

            {/* Enterprise & Certification */}
            <div className="space-y-4">
              <h3 className="font-poppins text-3xl md:text-4xl font-bold text-dca-text-dark">
                Enterprise & Certification
              </h3>
              <h4 className="font-space text-xl md:text-2xl text-dca-text-dark font-normal">
                Tailored programs & credentials.
              </h4>
              <p className="font-space text-base text-dca-text-dark leading-relaxed max-w-4xl">
                Custom curricula for organizations, on-site training options, and professional certification exams. Develop your team's expertise and earn industry-recognized credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative bg-dca-navy-base py-20" id="contact">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left - Title */}
            <div>
              <h2 className="font-poppins text-6xl md:text-8xl font-bold text-white">
                get in
                <br />
                touch
                <span className="text-dca-accent-blue">.</span>
              </h2>
            </div>

            {/* Right - Contact Info */}
            <div className="space-y-12">
              <div className="space-y-4">
                <p className="font-space text-sm text-dca-grey-medium uppercase tracking-wide">
                  inquiries & enrollment
                </p>
                <p className="font-space text-lg text-white">
                  hello[at]digitalcustody.academy
                </p>
                <p className="font-space text-base text-white leading-relaxed">
                  For course information, enterprise training requests, or general inquiries, contact us via email. We typically respond within 24 hours.
                </p>
              </div>

              <div className="border-t border-dca-grey-medium pt-12">
                <p className="font-space text-sm text-dca-grey-medium text-center">
                  Digital Custody Academy
                  <br />
                  www.digitalcustody.academy
                  <br />
                  Professional Education in Digital Asset Security
                  <br />
                  All rights reserved © 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
