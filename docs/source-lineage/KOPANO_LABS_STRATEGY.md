# Source clone: Kopano Labs Strategy

> Provenance: `Kopano-Labs/Introduction-to-MCP/Schematics/02-Strategy/Kopano Labs Strategy.md` (source authority; cloned into the dedicated website repo so the production project is self-describing).

# Kopano Labs Strategy

Kopano Labs is an added layer on top of kopano-core. kopano-core remains the engine. Kopano Labs is the visible experiment studio.

## Model
- **kopano-core:** orchestration, moderation, memory, auditability, APIs
- **Kopano Labs:** a gallery of experiments and AI tools
- **SA impact tools:** tools built to improve South African lives

## Labs Standard
The target is a Google-Labs-style experience:
- visible tool gallery
- experiment categories
- fast test-and-iterate workflow
- clear explanation of what each tool does
- ability to graduate experiments into real impact products

## South Africa Tool Focus
| Tool | Focus | Criticality |
|------|-------|-------------|
| Gig Matcher | Jobs and income | Critical |
| Loadshedding Planner | Utilities and resilience | Critical |
| Youth Opportunity Finder | Education and youth | Critical |
| Community Services Navigator | Civic access | High |
| SME Assistant | Small business growth | High |
| SA Language Engine | All SA languages | Critical |
| Speech Access Assistant | Speech impairment support | Critical |
| Kopano Forge | Collaborative execution + canvas workflow | High |
| Kopano Code | Coding acceleration and craft learning | Critical |

## Accessibility Rule
Kopano Labs must explicitly plan for:
- all 11 official South African languages
- multilingual prompting and response generation
- speech-impairment-aware interaction
- text and voice fallback flows
- inclusion as a design requirement, not a later enhancement

## Launch Surface Direction
The Labs launch surface should combine:
- Anthropic-style workspace clarity and artifact review
- Codex-style command-center execution and coding focus
- Stitch-style fast concept-to-interface iteration inside Kopano Forge

## Website implementation consequence
This document is now a direct implementation input to `RobynAwesome/Kopano-Labs-Website`. The website must expose experiments as usable/inspectable product surfaces rather than decorative portfolio cards.
