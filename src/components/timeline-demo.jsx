import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function TimelineDemo() {
  const data = [
    {
      title: "2024",
      content: (
        <div className="space-y-4">
          <p className="text-sm md:text-base font-normal text-neutral-600 leading-relaxed max-w-xl">
            Foundational student bootcamps, technical workshops, and community mentoring sessions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl pt-2">
            <div className="overflow-hidden border border-neutral-200 bg-white">
              <img
                src="/landing_page/IMG20260214102643.jpg"
                alt="2024 Bootcamp"
                className="h-44 sm:h-56 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden border border-neutral-200 bg-white">
              <img
                src="/landing_page/IMG20260214102944.jpg"
                alt="2024 Workshop"
                className="h-44 sm:h-56 w-full object-cover"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div className="space-y-4">
          <p className="text-sm md:text-base font-normal text-neutral-600 leading-relaxed max-w-xl">
            Annual 24-hour hackathons, competitive programming circuits, and collaborative builds.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl pt-2">
            <div className="overflow-hidden border border-neutral-200 bg-white">
              <img
                src="/landing_page/IMG_2573.JPG"
                alt="2025 Hackathon"
                className="h-44 sm:h-56 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden border border-neutral-200 bg-white">
              <img
                src="/landing_page/IMG_3783.jpg"
                alt="2025 Technical Sessions"
                className="h-44 sm:h-56 w-full object-cover"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2026",
      content: (
        <div className="space-y-4">
          <p className="text-sm md:text-base font-normal text-neutral-600 leading-relaxed max-w-xl">
            Centenary celebrations, AI incubation tracks, and forward-looking student technology initiatives.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl pt-2">
            <div className="overflow-hidden border border-neutral-200 bg-white">
              <img
                src="/landing_page/PXL_20260214_055018849.MP.jpg"
                alt="2026 Conclave"
                className="h-44 sm:h-56 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden border border-neutral-200 bg-white">
              <img
                src="/landing_page/a32ce3c3-589d-4146-a7d5-89f03edbd825.JPG"
                alt="2026 Showcase"
                className="h-44 sm:h-56 w-full object-cover"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white">
      <Timeline
        data={data}
        sectionNumber="03 / Timeline"
        title="Journey & Milestones"
        description="A chronicle of innovation, technical workshops, and student growth."
      />
    </div>
  );
}
