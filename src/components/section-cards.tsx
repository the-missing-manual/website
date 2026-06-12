"use client";

import { Cards, Card } from "fumadocs-ui/components/card";
import {
  GraduationCapIcon,
  CodeIcon,
  UsersThreeIcon,
  RocketIcon,
  BookOpenIcon,
} from "@phosphor-icons/react";

export function SectionCards() {
  return (
    <Cards>
      <Card
        icon={<GraduationCapIcon weight="duotone" size={22} />}
        title="College Admissions"
        href="/college"
        description="How to evaluate CSE colleges in India honestly , rankings, accreditation, coding culture, placements, and what brochures won't tell you."
      />
      <Card
        icon={<CodeIcon weight="duotone" size={22} />}
        title="Learning to Program"
        href="/programming"
        description="Where to start, which language to pick first, what resources are actually worth your time, and the mistakes most beginners make."
      />
      <Card
        icon={<UsersThreeIcon weight="duotone" size={22} />}
        title="Communities & Events"
        href="/communities"
        description="Hackathons, technical communities, student programs, open source , where to find people who are building things and how to get involved."
      />
      <Card
        icon={<RocketIcon weight="duotone" size={22} />}
        title="Careers & Opportunities"
        href="/careers"
        description="Internships, student developer programs, resume resources, and how to build a track record before you graduate."
      />
      <Card
        icon={<BookOpenIcon weight="duotone" size={22} />}
        title="Resources"
        href="/resources"
        description="Documentation, books, courses, roadmaps, and websites worth bookmarking , curated, not exhaustive."
      />
    </Cards>
  );
}
