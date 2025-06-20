// pages/about.tsx or components/AboutPage.tsx
import { 
  Users, 
  Target, 
  BookOpen, 
  Lightbulb, 
  Code, 
  Globe, 
  Award,
  Calendar,
  MapPin,
  Building,
  Wrench,
  ArrowRight,
  ExternalLink
} from 'lucide-react'


const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Grid Background */}
      <div 
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,191,99,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,191,99,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10">
        {/* Header Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#00bf63]/10 border border-[#00bf63]/20 rounded-full px-4 py-2 text-sm">
              <span className="w-2 h-2 bg-[#00bf63] rounded-full animate-pulse"></span>
              <span className="text-[#00bf63] font-medium">About the Program</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-white to-[#00bf63] bg-clip-text text-transparent">
              About the LoopingBinary Junior Dev Program
            </h1>
            
            <p className="text-xl text-[#888] leading-relaxed max-w-3xl mx-auto">
              A bold initiative designed to train, mentor, and launch the careers of Africa's next generation of software developers. 
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Introduction */}
            <div className="space-y-6">
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#00bf63] rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                </div>
                
                <p className="text-[#ccc] leading-relaxed">
                  The LoopingBinary Junior Dev Program (LB JDP) is a bold initiative by <strong className="text-white">Tatoh Modest Wilton</strong>, founder and CEO of LoopingBinary, designed to train, mentor, and launch the careers of Africa's next generation of software developers.
                </p>
                
                <p className="text-[#ccc] leading-relaxed">
                  Founded with a clear mission — to bridge the gap between raw talent and real-world tech expertise — LB JDP provides structured, hands-on training in full stack web and mobile development, empowering learners to build meaningful, monetizable projects while mastering modern technologies. 
                </p>
                
                <p className="text-[#ccc] leading-relaxed">
                  Whether you're a complete beginner, an inspired self-learner, or an aspiring professional, LB JDP equips you with the tools, mentorship, and community you need to grow into a world-class developer.
                </p>
              </div>
            </div>

            {/* What Makes Us Different */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00bf63] rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">What Makes Us Different</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Real-World Learning",
                    description: "We don't just teach concepts. We build live projects, solve real problems, and prepare our students for industry-grade execution.",
                    icon: Code
                  },
                  {
                    title: "Community & Collaboration", 
                    description: "Our learners work in teams, network with mentors, and contribute to impactful group projects that go beyond tutorials.",
                    icon: Users
                  },
                  {
                    title: "Monetization-Oriented",
                    description: "We train developers to build things they can ship, sell, or scale — not just to code for fun.",
                    icon: Target
                  },
                  {
                    title: "Long-Term Vision",
                    description: "We're not a coding bootcamp. We're building a pipeline of future CTOs, founders, and digital builders with substance.",
                    icon: Award
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6 space-y-4 hover:border-[#00bf63]/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#00bf63]/20 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[#00bf63]" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-[#888] text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00bf63] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">What You'll Learn</h2>
              </div>
              
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Full Stack Web & Mobile Development",
                    "Git, GitHub & Modern Collaboration Tools", 
                    "Deployment, Hosting & CI/CD",
                    "Industry Workflows (Agile, PR Reviews, Team Sprints)",
                    "Monetization Strategies (e.g., SaaS, freelance-ready products)",
                    "Optional Tracks: Cybersecurity, AI, UI/UX, and more"
                  ].map((skill, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#00bf63] rounded-full"></div>
                      <span className="text-[#ccc] text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Who Should Join */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00bf63] rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Who Should Join</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Beginners looking for structure",
                  "Self-taught coders wanting accountability", 
                  "Tech enthusiasts curious about real development",
                  "Students looking for portfolio-ready experience",
                  "Dreamers who want to build and get paid for it"
                ].map((type, index) => (
                  <div key={index} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4 text-center hover:border-[#00bf63]/30 transition-colors">
                    <span className="text-[#ccc] text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About the Founder */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00bf63] rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">About the Founder</h2>
              </div>
              
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00bf63] to-[#00a855] rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xl">TM</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Tatoh Modest Wilton</h3>
                    <p className="text-[#888] text-sm">Founder & CEO, LoopingBinary</p>
                  </div>
                </div>
                
                <p className="text-[#ccc] leading-relaxed">
                  Tatoh Modest Wilton is a full stack software engineer, tech entrepreneur, and the visionary behind LoopingBinary — a company focused on building platforms, empowering digital growth, and redefining education through tools like Intellex and LB JDP. Modest is passionate about using tech to uplift lives, create opportunities, and cultivate leadership across the continent. 
                </p>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#00bf63] rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Quick Facts</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Calendar, label: "Started", value: "2025" },
                  { icon: Users, label: "Members", value: "100+ active participants" },
                  { icon: MapPin, label: "Based", value: "Douala, Cameroon" },
                  { icon: Building, label: "Backed by", value: "LoopingBinary" },
                  { icon: Wrench, label: "Tech Stack", value: "React, Next.js, Node.js, NestJS" },
                  { icon: Globe, label: "Mission", value: "Empowering African Tech Talent" }
                ].map((fact, index) => (
                  <div key={index} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <fact.icon className="w-5 h-5 text-[#00bf63]" />
                      <span className="text-[#888] text-sm font-medium">{fact.label}</span>
                    </div>
                    <p className="text-white font-semibold">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">Join the Movement</h2>
                <p className="text-[#888] text-lg max-w-2xl mx-auto">
                  LB JDP is more than a program. It's a brotherhood of builders, a network of change-makers, and a launchpad for African tech talent. 
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#join"
                  className="inline-flex items-center justify-center space-x-2 bg-[#00bf63] hover:bg-[#00a855] text-black font-semibold px-8 py-4 rounded-lg transition-colors group"
                >
                  <span>Ready to build? Join Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href="https://www.linkedin.com/company/looping-binary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold px-8 py-4 rounded-lg border border-[#2a2a2a] transition-colors group"
                >
                  <span>Learn More</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}

export default AboutPage
