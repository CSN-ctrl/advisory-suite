import portraitImg from "@/assets/portrait.jpg";

const Mission = () => (
  <main className="pt-20">
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8">The Mission</h1>
            <div className="space-y-6 text-muted-foreground font-body leading-relaxed">
              <p>
                Meridian was founded on a simple conviction: the most consequential decisions
                deserve the most thoughtful guidance. Not templates. Not frameworks borrowed
                from a textbook. Real strategic partnership, built on experience and trust.
              </p>
              <p>
                After two decades advising founders, executives, and investors across industries,
                I've seen the same pattern repeat: talented leaders surrounded by noise, pressed
                for time, and isolated at the moment they need clarity most.
              </p>
              <p>
                This firm exists to change that. Every engagement is personal, confidential,
                and designed around a single objective — helping you see clearly when the
                stakes are highest.
              </p>
              <p>
                I don't take on many clients. I don't delegate to junior staff. And I don't
                offer advice I wouldn't follow myself. This is advisory built on conviction,
                not volume.
              </p>
            </div>
          </div>
          <div className="order-first lg:order-last">
            <img
              src={portraitImg}
              alt="Portrait of the founder and principal advisor"
              className="w-full max-w-md mx-auto lg:mx-0 object-cover"
              loading="lazy"
            />
            <p className="text-xs text-muted-foreground font-body mt-4 tracking-wide uppercase">
              Founder & Principal Advisor
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default Mission;
