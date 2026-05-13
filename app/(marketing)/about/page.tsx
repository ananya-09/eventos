import Image from 'next/image'

export const metadata = {
  title: 'About – Eventos',
  description: 'Learn more about the Eventos event management platform.',
}

export default function About() {
  return (
    <section id="about" className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Row 1: Text Left, Image Right */}
        <div className="glass-surface rounded-3xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                  What Makes Our Event Special
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Our event brings together industry leaders, innovators, and enthusiasts from around the world. With diverse workshops, keynote speakers, and networking opportunities, Eventos provides the perfect platform to learn, grow, and connect.
                </p>
              </div>

              <ul className="space-y-3">
                {['Expert-led workshops and training', 'Networking with industry leaders', 'Cutting-edge technology showcases', 'Community-driven initiatives'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg ring-1 ring-border/60">
              <Image
                src="/about-image-1.jpg"
                alt="Event showcase"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Image Left, Text Right */}
        <div className="glass-surface rounded-3xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg order-2 lg:order-1 ring-1 ring-border/60">
              <Image
                src="/about-image-2.jpg"
                alt="Community engagement"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                  Fostering Community Through Connection
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  At Eventos, we believe that great events create lasting connections. Our mission is to empower organizers with tools and insights to create meaningful, memorable experiences that resonate with their attendees.
                </p>
              </div>

              <ul className="space-y-3">
                {['Dedicated event support team', 'Advanced analytics and reporting', 'Seamless attendee experience', 'Continuous innovation and updates'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
