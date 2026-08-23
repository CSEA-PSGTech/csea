import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import BackgroundGrid from "./components/background/BackgroundGrid";
import TelescopeSection from "./components/landing/TelescopeSection/TelescopeSection";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function App() {
  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: ".wrapper",
      content: ".content",
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
    });

    // Let React/browser finish layout, then
    // calculate ALL ScrollTriggers.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (<>
  
   <BackgroundGrid/>
    <div className="wrapper">
      <div className="content">
        <TelescopeSection />

        <section className="test-section">
          <h2>ABOUT CSEA</h2>
        </section>
      </div>
    </div>
    </>
  );
}

export default App;