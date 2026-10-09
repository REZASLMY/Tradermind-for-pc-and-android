import { useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    category: 'Research',
    title: 'The interview question that breaks every persona',
    excerpt:
      "We stopped asking users what they want. Here's the single prompt that surfaced more product truth in six weeks than two years of surveys.",
    author: 'Mara Lindqvist',
    role: 'Head of Research',
    date: 'Feb 12, 2025',
    read: '9 min',
    img: '/__mockup/images/apertura-dark-journal-interview.jpg',
  },
  {
    id: 2,
    category: 'Craft',
    title: 'Density is a feature: designing for power users without apology',
    excerpt:
      'Whitespace became a religion and our dashboards got worse. A case for information-dense interfaces, with receipts from three enterprise redesigns.',
    author: 'Tomas Reuter',
    role: 'Design Director',
    date: 'Feb 4, 2025',
    read: '12 min',
    img: '/__mockup/images/apertura-dark-journal-density.jpg',
  },
  {
    id: 3,
    category: 'Process',
    title: 'We killed the design handoff. Nobody misses it.',
    excerpt:
      'How pairing designers with engineers from kickoff cut our shipping time by 40% — and what we lost in the trade.',
    author: 'Anaïs Dupont',
    role: 'Principal Designer',
    date: 'Jan 28, 2025',
    read: '7 min',
    img: '/__mockup/images/apertura-dark-journal-handoff.jpg',
  },
  {
    id: 4,
    category: 'Research',
    title: 'Usability testing with eleven users: when the rule of five fails',
    excerpt:
      "Nielsen's heuristic holds — until your product spans three regulated markets. Notes from testing a fintech onboarding flow in Berlin, Lagos, and São Paulo.",
    author: 'Mara Lindqvist',
    role: 'Head of Research',
    date: 'Jan 21, 2025',
    read: '11 min',
    img: '/__mockup/images/apertura-dark-journal-testing.jpg',
  },
  {
    id: 5,
    category: 'Opinion',
    title: 'Your design system is not the product',
    excerpt:
      'Component libraries are infrastructure, not strategy. A gentle intervention for teams that spend more time on tokens than on customers.',
    author: 'Tomas Reuter',
    role: 'Design Director',
    date: 'Jan 14, 2025',
    read: '6 min',
    img: '/__mockup/images/apertura-dark-journal-system.jpg',
  },
  {
    id: 6,
    category: 'Craft',
    title: 'Motion that earns its render budget',
    excerpt:
      "Every animation is a promise about causality. The framework we use to decide what moves, what doesn't, and what gets cut at 60fps.",
    author: 'Jun Park',
    role: 'Senior Product Designer',
    date: 'Jan 7, 2025',
    read: '8 min',
    img: '/__mockup/images/apertura-dark-journal-motion.jpg',
  },
  {
    id: 7,
    category: 'Process',
    title: "The 90-minute critique format we've run for four years",
    excerpt:
      'No vibes, no "I like it." A structured critique agenda that protects the work, the maker, and the meeting.',
    author: 'Anaïs Dupont',
    role: 'Principal Designer',
    date: 'Dec 17, 2024',
    read: '10 min',
    img: '/__mockup/images/apertura-dark-journal-critique.jpg',
  },
];

const FEATURED = {
  category: 'Field Notes',
  title: 'Nobody reads onboarding. Design for the second session instead.',
  excerpt:
    "After instrumenting 14 products across our client portfolio, one pattern kept repeating: activation doesn't happen during onboarding — it happens when users return. Here's how we restructured first-week experiences around the comeback, not the welcome.",
  author: 'Jun Park',
  role: 'Senior Product Designer',
  date: 'Feb 19, 2025',
  read: '14 min read',
  img: '/__mockup/images/apertura-dark-journal-feature.jpg',
};

const CATEGORIES = ['All', 'Research', 'Craft', 'Process', 'Opinion'];

export default function AperturaDarkJournal() {
  const [filter, setFilter] = useState('All');
  const [subscribed, setSubscribed] = useState(false);
  const visible = filter === 'All' ? POSTS : POSTS.filter((post) => post.category === filter);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="apertura-journal min-h-[100dvh] bg-[#191919] text-[#eeeae3] antialiased">
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .apertura-journal {
          --ink: #191919;
          --surface: #222220;
          --muted: #aaa69e;
          --orange: #ef6037;
          --line: rgba(238, 234, 227, .15);
          font-family: 'DM Sans', sans-serif;
        }
        .apertura-journal ::selection { background: #ef6037; color: #191919; }
        .apertura-display { font-family: 'Instrument Serif', Georgia, serif; }
        .apertura-condensed { font-family: 'Barlow Condensed', sans-serif; }
        .apertura-marquee { animation: apertura-scroll 32s linear infinite; }
        @keyframes apertura-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .apertura-masonry { columns: 3; column-gap: 20px; }
        .apertura-tile { break-inside: avoid; margin: 0 0 20px; }
        .apertura-tile:nth-child(3n + 1) .apertura-tile-image { aspect-ratio: 4 / 4.6; }
        .apertura-tile:nth-child(3n + 2) .apertura-tile-image { aspect-ratio: 4 / 3.6; }
        .apertura-tile:nth-child(3n) .apertura-tile-image { aspect-ratio: 4 / 5.1; }
        @media (max-width: 900px) { .apertura-masonry { columns: 2; column-gap: 14px; } .apertura-tile { margin-bottom: 14px; } }
        @media (max-width: 600px) { .apertura-masonry { columns: 1; } .apertura-tile:nth-child(n) .apertura-tile-image { aspect-ratio: 4 / 3.2; } }
        @media (prefers-reduced-motion: reduce) { .apertura-marquee { animation: none; } }
      `}</style>

      <header className="relative z-20 border-b border-white/10 bg-[#191919]/95">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="apertura-display text-[26px] tracking-[-0.04em] text-[#f0ece5]">
            Apertura<span className="text-[#ef6037]">*</span>
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
            {[
              ['Work', '#journal'],
              ['Studio', '#about'],
              ['Journal', '#journal'],
              ['Careers', 'mailto:careers@apertura.studio'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className={`apertura-condensed text-[15px] font-semibold uppercase tracking-[0.13em] transition-colors hover:text-white ${
                  label === 'Journal' ? 'text-[#f0ece5]' : 'text-[#aaa69e]'
                }`}
              >
                {label}
                {label === 'Journal' && <span className="ml-1.5 text-[#ef6037]">•</span>}
              </a>
            ))}
          </nav>
          <a
            href="mailto:hello@apertura.studio"
            className="apertura-condensed rounded-full border border-white/60 px-4 py-[9px] text-[14px] font-semibold uppercase tracking-[0.08em] text-[#f0ece5] transition-colors hover:border-[#ef6037] hover:bg-[#ef6037] hover:text-[#191919] sm:px-5"
          >
            Start a project <ArrowUpRight className="ml-1 inline-block" size={14} />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate flex min-h-[620px] items-center justify-center overflow-hidden sm:min-h-[720px] lg:min-h-[780px]">
          <img
            src={FEATURED.img}
            alt="A product designer working in a softly lit studio"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,15,14,.17)_3%,rgba(15,15,14,.38)_36%,rgba(15,15,14,.88)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,15,14,.1)_0%,rgba(15,15,14,.38)_100%)]" />
          <div className="relative mx-auto flex w-full max-w-[1150px] flex-col items-center px-6 pb-4 pt-14 text-center sm:px-10">
            <p className="apertura-condensed mb-7 text-[13px] font-semibold uppercase tracking-[0.28em] text-[#ff8a64] sm:text-[15px]">
              The Apertura Journal <span className="mx-2 text-white/50">/</span> Field Notes
            </p>
            <h1 className="apertura-display max-w-[1040px] text-[clamp(3.25rem,8vw,7.6rem)] leading-[.91] tracking-[-0.025em] text-[#fffdf8] [text-shadow:0_3px_28px_rgba(0,0,0,.24)]">
              {FEATURED.title}
            </h1>
            <p className="mt-7 max-w-[650px] text-[14px] leading-[1.75] text-white/80 sm:text-[16px]">
              Essays, research dispatches, and process autopsies from a 19-person UX studio in Copenhagen &amp; New York.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] text-white/70 sm:text-[13px]">
              <span className="font-semibold text-white">{FEATURED.author}</span>
              <span>{FEATURED.role}</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/60 sm:block" />
              <span>{FEATURED.date}</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/60 sm:block" />
              <span>{FEATURED.read}</span>
            </div>
            <a
              href="#journal"
              className="apertura-condensed mt-9 inline-flex items-center gap-2 border-b border-white/50 pb-1 text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-[#ef6037] hover:text-[#ff8a64]"
            >
              Explore the journal <ArrowRight size={15} />
            </a>
          </div>
          <div className="absolute bottom-7 left-6 hidden text-[10px] uppercase tracking-[0.2em] text-white/55 sm:left-10 sm:block">
            Copenhagen &nbsp;·&nbsp; New York
          </div>
          <div className="absolute bottom-7 right-6 text-[10px] uppercase tracking-[0.2em] text-white/55 sm:right-10">
            55°40′ N &nbsp; 12°34′ E
          </div>
        </section>

        <section id="journal" className="mx-auto max-w-[1440px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pb-32">
          <div className="mb-10 flex flex-col justify-between gap-7 border-b border-white/15 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="apertura-condensed mb-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#ef6037]">
                Published most Tuesdays · No paywall, ever
              </p>
              <h2 className="apertura-display text-[46px] leading-none tracking-[-0.025em] text-[#f0ece5] sm:text-[60px]">
                The latest thinking<span className="text-[#ef6037]">.</span>
              </h2>
            </div>
            <p className="max-w-[300px] text-[13px] leading-relaxed text-[#aaa69e]">
              Research, craft, and honest opinions from the people doing the work.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter stories by category">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={filter === category}
                  onClick={() => setFilter(category)}
                  className={`apertura-condensed rounded-full border px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    filter === category
                      ? 'border-[#ef6037] bg-[#ef6037] text-[#191919]'
                      : 'border-white/20 text-[#c6c1b8] hover:border-white/60 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#8e8a83]">
              {visible.length.toString().padStart(2, '0')} {visible.length === 1 ? 'story' : 'stories'}
            </p>
          </div>

          <div className="apertura-masonry" aria-live="polite">
            {visible.map((post) => (
              <article key={post.id} className="apertura-tile group relative">
                <div className="relative isolate overflow-hidden bg-[#2d2c29] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-focus-within:-translate-y-1.5">
                  <img
                    src={post.img}
                    alt=""
                    className="apertura-tile-image block w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111110]/95 via-[#111110]/25 to-[#111110]/0" />
                  <span className="apertura-condensed absolute right-4 top-4 rounded-full bg-[#ef6037] px-3 py-[6px] text-[11px] font-bold uppercase tracking-[0.1em] text-[#201713]">
                    {post.category}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-white/65">
                      {post.date} <span className="mx-1 text-[#ef6037]">·</span> {post.read}
                    </p>
                    <h3 className="apertura-display max-w-[440px] text-[27px] leading-[1.02] tracking-[-0.015em] text-white sm:text-[32px]">
                      {post.title}
                    </h3>
                    <p className="max-h-0 translate-y-2 overflow-hidden pt-0 text-[13px] leading-[1.6] text-white/80 opacity-0 transition-all duration-300 group-hover:max-h-28 group-hover:translate-y-0 group-hover:pt-3 group-hover:opacity-100 group-focus-within:max-h-28 group-focus-within:translate-y-0 group-focus-within:pt-3 group-focus-within:opacity-100">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/25 pt-3 text-[11px] text-white/65">
                      <span>{post.author} <span className="text-white/40">/ {post.role}</span></span>
                      <ArrowUpRight size={15} className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                  <a href="#newsletter" className="absolute inset-0 z-0" aria-label={`Read ${post.title}`} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="border-y border-white/10 bg-[#222220]">
          <div className="overflow-hidden border-b border-white/10 py-5">
            <div className="apertura-marquee flex w-max whitespace-nowrap text-[13px] uppercase tracking-[0.18em] text-[#aaa69e]">
              {[0, 1].map((loop) => (
                <span key={loop} className="flex">
                  {['Research dispatches', 'Process autopsies', 'Craft essays', 'Honest opinions'].map((item) => (
                    <span key={`${loop}-${item}`} className="mx-8 flex items-center gap-8">
                      {item} <span className="text-[#ef6037]">✳</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:px-12 lg:py-24">
            <div>
              <p className="apertura-condensed mb-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#ef6037]">
                An open notebook
              </p>
              <h2 className="apertura-display max-w-[760px] text-[42px] leading-[.98] tracking-[-0.02em] text-[#f0ece5] sm:text-[58px]">
                One essay, every Tuesday. <span className="text-[#817d76]">Read by 22,400 designers.</span>
              </h2>
            </div>
            <div id="newsletter">
              <form onSubmit={handleSubscribe} className="flex items-center border-b border-white/35 pb-3 focus-within:border-[#ef6037]">
                <label className="sr-only" htmlFor="apertura-email">Email address</label>
                <input
                  id="apertura-email"
                  required
                  type="email"
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-[#f0ece5] outline-none placeholder:text-[#77736d]"
                />
                <button type="submit" className="apertura-condensed flex shrink-0 items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-[#ef6037]">
                  {subscribed ? 'You’re on the list' : 'Subscribe'} <ArrowRight size={16} />
                </button>
              </form>
              <p className="mt-4 text-[12px] leading-relaxed text-[#88847d]">
                {subscribed ? 'Thanks for reading. Look for the next dispatch on Tuesday.' : 'No product updates, no sponsor reads. Unsubscribe anytime.'}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#191919]">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 py-9 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <a href="#top" className="apertura-display text-[22px] tracking-[-0.04em] text-[#eeeae3]">
            Apertura<span className="text-[#ef6037]">*</span>
          </a>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#aaa69e]">
            {['Work', 'Studio', 'Journal', 'Contact', 'LinkedIn', 'Are.na'].map((link) => (
              <a
                key={link}
                href={link === 'Contact' ? 'mailto:hello@apertura.studio' : '#journal'}
                className="transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
          <span className="text-[11px] text-[#77736d]">© 2025 Apertura Studio ApS</span>
        </div>
      </footer>
    </div>
  );
}
