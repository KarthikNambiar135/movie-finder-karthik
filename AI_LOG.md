# AI Workflow Log

## Tools Used
- Gemini 3.5 Flash, GPT OSS 120B
- Next.js documentation
- TMDB API documentation

## Best Prompts

**Prompt 1:**
> [Review Apple TV, Netflix, Letterboxd and IMDb.
Focus on:
- Hero sections
- Movie cards
- Hover interactions
- Detail modals
- Typography hierarchy
- Spacing
- Motion design
- Mobile responsiveness
- Visual hierarchy
Deliver:
- UX Architecture
- Visual Design Direction
- Component Blueprint
- Motion Guidelines
- Responsive Design Strategy
- Visual Polish Checklist
Do not generate code.
Only provide design guidance suitable for a one-day movie discovery project.]

*Why it worked / How I refined it:*
Started with broad UI research requests but the recommendations were too generic. Refining the prompt around specific streaming and movie platforms produced more actionable guidance for card design, hero layouts, motion, and content presentation.

**Prompt 2:**
> [The application is functionally complete.
Do not modify:
- Search behavior
- Pagination behavior
- Favorites functionality
- Assignment requirements
Focus only on UI improvements.
Requirements:
- Premium hero carousel
- Cinematic loading experience
- Better movie card interactions
- Better detail modal
- Improved navigation
- Better empty states
- Consistent motion system
- Improved mobile experience
Inspiration:
- Apple TV
- Netflix
- Letterboxd
Avoid:
- Dashboard styling
- Generic Tailwind appearance
- Overly flashy animations
The application should feel like a real movie discovery product.]

*Why it worked / How I refined it:*
Initially, UI improvement requests resulted in unnecessary architectural changes. Adding explicit constraints ensured the existing functionality remained intact while focusing the output on visual polish, motion, and user experience improvements.

**Prompt 3:**
> [Investigate the following issues.
Do not propose fixes immediately.
Verify:
- API responses
- State updates
- Cache behavior
- localStorage persistence
- Component lifecycle
- Rendering conditions
- Framer Motion interactions
For each issue provide:
- Root cause
- Why it occurs
- Related edge cases
- Recommended fix
Issues:
- Pagination rendering
- Favorites rendering
- Splash screen timing
- Scroll position behavior
- Hero carousel timing
Do not assume the cause.
Trace the full flow before making changes.]

*Why it worked / How I refined it:*
Earlier debugging prompts led directly to code changes without sufficient investigation. This version forced a root-cause-first approach, helping isolate rendering and animation lifecycle issues before implementing fixes.

## What I Fixed Manually

**The 12-Item Pagination Dilemma**
The AI initially failed the R1 requirement. When prompted to display exactly 12 items per page, the AI attempted to append `&page_size=12` to the TMDB API request. However, TMDB rigidly enforces exactly 20 items per page and completely ignores `page_size` parameters. 

If left uncorrected, the AI's code either displayed 20 items (failing the spec) or sliced the first 12 items and discarded the remaining 8, meaning items 13-20 from the TMDB database were permanently lost to the user when they clicked "Next" to fetch API page 2.

**My Manual Fix:**
I manually engineered a client-side buffer mechanism (`useMoviesManager.ts`) to decouple the API state from the UI state. I built a system where the application fetches 20 items from TMDB, accumulates them into a rolling `cache` array, and then safely serves exactly 12-item slices to the UI layer. When the user clicks "Next", the system checks if the cache holds enough items for the next slice; if not, it seamlessly fetches the next 20-item block in the background. This ensures zero dropped items and strict adherence to the R1 constraint.
