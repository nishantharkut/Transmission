import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionWeb1() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const stateARef = useRef<HTMLDivElement>(null);
  const stateBRef = useRef<HTMLDivElement>(null);
  const stateCRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: "top top",
          end: () => (window.innerWidth < 768 ? "+=190%" : "+=300%"),
          pin: true,
          scrub: 1,
        },
      });

      tl.to(stateARef.current, { opacity: 0, duration: 0.3 }, 0.3);
      tl.fromTo(stateBRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.33);

      tl.to(stateBRef.current, { opacity: 0, duration: 0.3 }, 0.63);
      tl.fromTo(stateCRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.66);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-era="web1">
      <div
        ref={pinnedRef}
        className="relative min-h-screen overflow-hidden"
        style={{ backgroundColor: "hsl(40 15% 94%)" }}
      >
        {/* Narrative label — positioned below navbar with solid background for legibility */}
        <div
          className="absolute left-0 z-10 max-w-[min(100vw-2rem,460px)] px-4 sm:px-6 md:px-10"
          style={{ top: "calc(3.5rem + env(safe-area-inset-top, 0px))" }}
        >
          <p
            className="font-serif-era text-[17px] font-light italic leading-[1.45] sm:text-[19px] md:text-[22px] md:leading-[1.5]"
            style={{ color: "hsl(0 0% 20%)" }}
          >
            In 1991, a scientist gave away the web for free. No patent. No royalties. Just the gift.
          </p>
        </div>

        {/* Era year indicator — bottom left */}
        <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-10 sm:bottom-8 sm:left-8">
          <span className="font-mono-era text-[8px] sm:text-[10px]" style={{ color: "hsl(0 0% 60%)", letterSpacing: "2px" }}>
            ERA 02 · THE WORLD WIDE WEB
          </span>
        </div>

        {/* Sub-state A: 1991 first website — actual recreation */}
        <div ref={stateARef} className="absolute inset-0 flex items-center justify-center px-3 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24">
          <div
            className="flex w-full max-w-[680px] min-h-[420px] flex-col p-4 sm:min-h-[560px] sm:p-8 md:p-12"
            style={{
              backgroundColor: "hsl(0 0% 96%)",
              border: "1px solid hsl(0 0% 82%)",
              fontFamily: "'Times New Roman', 'Crimson Pro', serif",
              color: "hsl(0 0% 8%)",
            }}
          >
            <div className="mb-6 pb-4" style={{ borderBottom: "1px solid hsl(0 0% 80%)" }}>
              <h1 className="text-[18px] font-bold leading-tight sm:text-[22px] md:text-[28px]">
                WorldWideWeb — Executive Summary
              </h1>
              <div className="mt-2 break-all text-[10px] sm:text-[12px]" style={{ color: "hsl(0 0% 55%)" }}>
                http://info.cern.ch/hypertext/WWW/TheProject.html
              </div>
            </div>

            <p className="text-[15px] md:text-[16px] leading-[1.9] mb-4" style={{ color: "hsl(0 0% 18%)" }}>
              The WorldWideWeb (W3) is a wide-area{" "}
              <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                hypermedia
              </span>{" "}
              information retrieval initiative aiming to give universal access to a large universe of documents.
            </p>

            <p className="text-[15px] md:text-[16px] leading-[1.9] mb-4" style={{ color: "hsl(0 0% 18%)" }}>
              Everything there is online about W3 is linked directly or indirectly to this document, including an{" "}
              <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                executive summary
              </span>{" "}
              of the project,{" "}
              <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                Mailing lists
              </span>
              ,{" "}
              <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                Policy
              </span>
              , and{" "}
              <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                details of the technical design
              </span>.
            </p>

            <ul className="text-[14px] leading-[2] ml-6 list-disc" style={{ color: "hsl(0 0% 25%)" }}>
              <li>
                <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                  What's out there?
                </span>
              </li>
              <li>
                <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                  Help
                </span>
              </li>
              <li>
                <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                  Software Products
                </span>
              </li>
              <li>
                <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                  Bibliography
                </span>
              </li>
            </ul>

            <div className="mt-auto flex justify-between items-center pt-4" style={{ borderTop: "1px solid hsl(0 0% 82%)" }}>
              <span className="font-mono-era text-[10px]" style={{ color: "hsl(0 0% 55%)" }}>
                Tim Berners-Lee · CERN
              </span>
              <span className="font-mono-era text-[11px] font-medium" style={{ color: "hsl(0 0% 40%)" }}>
                1991
              </span>
            </div>
          </div>
        </div>

        {/* Sub-state B: Netscape era ~1994 */}
        <div ref={stateBRef} className="absolute inset-0 flex items-center justify-center px-2 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-24" style={{ opacity: 0 }}>
          <div className="flex min-h-[420px] w-full max-w-[680px] min-w-0 flex-col sm:min-h-[560px]">
            {/* Window chrome */}
            <div
              className="flex shrink-0 items-center gap-2 px-3 py-2"
              style={{
                backgroundColor: "hsl(220 10% 78%)",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                borderBottom: "2px solid hsl(220 10% 65%)",
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0 60% 50%)", border: "1px solid hsl(0 60% 40%)" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(45 60% 55%)", border: "1px solid hsl(45 60% 40%)" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(120 50% 42%)", border: "1px solid hsl(120 50% 32%)" }} />
              </div>
              <span className="ml-1 min-w-0 truncate font-ui-era text-[9px] font-medium sm:ml-2 sm:text-[11px]" style={{ color: "hsl(0 0% 20%)" }}>
                Netscape Navigator — [Welcome to Netscape]
              </span>
            </div>

            {/* Toolbar */}
            <div
              className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 px-2 py-1.5 sm:gap-x-3 sm:px-3"
              style={{
                backgroundColor: "hsl(220 10% 82%)",
                borderBottom: "1px solid hsl(220 10% 70%)",
              }}
            >
              {["Back", "Forward", "Home", "Reload", "Images", "Print", "Find", "Stop"].map((btn) => (
                <span key={btn} className="whitespace-nowrap font-ui-era text-[8px] sm:text-[9px]" style={{ color: "hsl(0 0% 30%)" }}>{btn}</span>
              ))}
            </div>

            {/* Location bar */}
            <div
              className="flex min-w-0 shrink-0 items-center gap-2 px-2 py-1.5 sm:px-3"
              style={{
                backgroundColor: "hsl(220 10% 82%)",
                borderBottom: "2px solid hsl(220 10% 65%)",
              }}
            >
              <span className="shrink-0 font-ui-era text-[9px] font-medium sm:text-[10px]" style={{ color: "hsl(0 0% 30%)" }}>Location:</span>
              <div className="min-w-0 flex-1 px-2 py-0.5" style={{ backgroundColor: "hsl(0 0% 100%)", border: "1px inset hsl(220 10% 70%)" }}>
                <span className="block truncate font-mono-era text-[8px] sm:text-[10px]" style={{ color: "hsl(0 0% 20%)" }}>http://home.netscape.com/</span>
              </div>
            </div>

            {/* Content area */}
            <div
              className="min-h-0 flex-1 p-3 sm:p-6"
              style={{
                backgroundColor: "hsl(220 8% 88%)",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%23bbb'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                minHeight: 240,
              }}
            >
              <table className="block w-full md:table" style={{ fontFamily: "'Times New Roman', serif", fontSize: "14px", color: "hsl(0 0% 12%)" }}>
                <tbody className="block md:table-row-group">
                  <tr className="flex flex-col gap-4 md:table-row md:gap-0">
                    <td className="block w-full pb-0 align-top md:table-cell md:w-[35%] md:pb-4 md:pr-5 md:[border-right:2px_groove_hsl(220,10%,75%)]">
                      <div className="font-bold mb-3 text-[15px]">Navigation</div>
                      {["What's New", "What's Cool", "Handbook", "Net Search", "Net Directory", "Software"].map((link) => (
                        <div key={link} className="mb-1">
                          <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer", fontSize: "13px" }}>
                            {link}
                          </span>
                        </div>
                      ))}
                      <div className="mt-4">
                        <div
                          className="inline-block px-3 py-1 text-[11px] font-bold"
                          style={{
                            backgroundColor: "hsl(220 10% 78%)",
                            border: "2px outset hsl(220 10% 88%)",
                            cursor: "pointer",
                            color: "hsl(0 0% 10%)",
                          }}
                        >
                          DOWNLOAD NOW
                        </div>
                      </div>
                    </td>
                    <td className="block w-full align-top pb-4 pl-0 pt-0 md:table-cell md:pl-5 md:pt-0">
                      <div className="font-bold mb-2 text-[16px]">WELCOME TO NETSCAPE</div>
                      <p className="text-[13px] leading-[1.7] mb-3" style={{ color: "hsl(0 0% 20%)" }}>
                        You have just embarked on a journey through the information superhighway. Netscape Navigator lets you explore the Internet with ease.
                      </p>
                      <p className="text-[13px] leading-[1.7] mb-4" style={{ color: "hsl(0 0% 25%)" }}>
                        Explore the{" "}
                        <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                          Netscape Store
                        </span>{" "}
                        and the{" "}
                        <span style={{ color: "hsl(240 100% 40%)", textDecoration: "underline", cursor: "pointer" }}>
                          Internet Directory
                        </span>.
                      </p>

                      {/* Hit counter */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: "hsl(0 0% 45%)" }}>Visitors:</span>
                        <div className="flex">
                          {[0,1,4,7,8,3].map((d, i) => (
                            <span
                              key={i}
                              className="inline-block w-[14px] h-[18px] text-center text-[11px] font-mono-era leading-[18px] font-bold"
                              style={{
                                backgroundColor: "hsl(0 0% 10%)",
                                color: "hsl(120 80% 50%)",
                                border: "1px solid hsl(0 0% 30%)",
                              }}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-2 flex flex-col items-end gap-1 text-right sm:flex-row sm:items-baseline sm:justify-end sm:gap-0">
                <span className="max-w-full break-words text-right" style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: "9px", color: "hsl(0 0% 50%)" }}>
                  best viewed at 800×600 · 256 colors
                </span>
                <span className="font-mono-era text-[11px] font-medium sm:ml-3" style={{ color: "hsl(0 0% 40%)" }}>
                  1994
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-state C: 1999 portal era */}
        <div ref={stateCRef} className="absolute inset-0 flex items-center justify-center px-3 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24" style={{ opacity: 0 }}>
          <div
            className="flex min-h-[420px] w-full max-w-[680px] min-w-0 flex-col p-4 sm:min-h-[560px] sm:p-8"
            style={{
              backgroundColor: "hsl(215 50% 12%)",
              border: "1px solid hsl(200 40% 25%)",
              borderRadius: 6,
              boxShadow: "0 0 40px hsla(200, 80%, 40%, 0.15)",
            }}
          >
            {/* Portal header */}
            <div className="mb-6 shrink-0 text-center sm:mb-8">
              <h2
                className="font-display-era text-[26px] font-bold sm:text-[30px] md:text-[36px]"
                style={{
                  color: "hsl(45 90% 58%)",
                  fontStretch: "115%",
                  letterSpacing: "0.04em",
                  textShadow: "0 1px 8px hsla(45, 90%, 50%, 0.3)",
                }}
              >
                YAHOO!
              </h2>
              <div className="text-[11px] font-ui-era mt-1" style={{ color: "hsl(200 20% 50%)" }}>
                The Internet's Portal · Directory · Search
              </div>

              {/* Search bar */}
              <div className="mx-auto mt-4 flex max-w-[400px] min-w-0 items-center gap-2 px-1">
                <div
                  className="flex-1 h-8 px-3 flex items-center"
                  style={{
                    backgroundColor: "hsl(0 0% 100%)",
                    border: "2px inset hsl(0 0% 75%)",
                  }}
                >
                  <span className="text-[12px]" style={{ color: "hsl(0 0% 60%)" }}>Search the web...</span>
                </div>
                <div
                  className="px-4 h-8 flex items-center text-[12px] font-bold"
                  style={{
                    background: "linear-gradient(to bottom, hsl(0 0% 90%), hsl(0 0% 75%))",
                    border: "2px outset hsl(0 0% 85%)",
                    cursor: "pointer",
                    color: "hsl(0 0% 10%)",
                  }}
                >
                  Search
                </div>
              </div>
            </div>

            {/* Category grid */}
            <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-x-8 gap-y-2 pb-4">
              {[
                "Arts & Humanities", "News & Media",
                "Business & Economy", "Recreation & Sports",
                "Computers & Internet", "Reference",
                "Education", "Science",
                "Entertainment", "Social Science",
                "Government", "Society & Culture",
              ].map((cat) => (
                <div key={cat} className="py-1.5">
                  <span
                    className="text-[13px] font-ui-era"
                    style={{
                      color: "hsl(200 80% 65%)",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto shrink-0">
              <div className="flex flex-wrap justify-center gap-4 border-t pt-4" style={{ borderColor: "hsl(200 30% 22%)" }}>
                {["Yahoo! Mail", "Yahoo! Games", "Yahoo! Finance", "My Yahoo!"].map((link) => (
                  <span
                    key={link}
                    className="text-[11px] font-ui-era font-medium"
                    style={{ color: "hsl(180 60% 55%)", cursor: "pointer" }}
                  >
                    {link}
                  </span>
                ))}
              </div>
              <div className="pt-2 text-center font-mono-era text-[11px]" style={{ color: "hsl(200 15% 38%)" }}>
                1999
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
