# The Bottleneck Is Attention

For most of computing history, the scarce thing was the machine. Compute cost money. Storage cost money. Good engineering meant being careful with both. That world is gone. Compute keeps getting cheaper, storage is basically free, and our systems now produce data far faster than anyone can read it.

When the scarce resource changes, the interesting work follows it. Right now the scarce resource is attention. Human attention was always limited. The newer problem is that machine attention is limited too, and we have to design around it the same way.

I spend my days on this. I work on event signal processing, the systems that take huge, high-frequency streams of machine events and try to make them mean something. It's a good place to watch where things are heading.

## Abundance creates a new kind of poverty

A modern software system emits a staggering number of events. Every deploy, every config change, every scaling action, every blip. One at a time, each one is a fact. All of them together, fog.

We got very good at capturing what happens. Doing that created a worse problem. Almost none of it matters in any given moment, and the few things that do are buried under everything that doesn't. More data didn't give us more understanding, just more to dig through.

Anyone who's been paged at 3am for nothing already knows this in their gut. The cost of noise isn't abstract. It burns trust and it burns time, and eventually people just stop looking at the alerts.

## Curation is the high-leverage act

The reflex for the last decade was to add dashboards. Give everyone every chart and let them sort it out. That's like answering information overload by printing more newspapers.

The thing that actually helps is the opposite. You curate, hard, and you do it intelligently. On one project we used large language models to judge the risk and significance of changes moving through a system. We cut the noise reaching humans by more than 98 percent, measured against what engineers later confirmed had actually mattered. Nothing was hidden. We weighed it and made a call. That judgment is most of the work.

The percentage isn't the interesting part. What's interesting is what it says. If 98 percent of what a system showed people didn't deserve their attention, the bottleneck was never the data. It was that nothing stood between the data and the person to make a judgment. AI is good at making that judgment at scale. I think that's where it earns its keep over the next few years, more than anything I can get out of a chat window.

## Context is what makes data legible

Cutting noise gets you halfway. You also have to make what's left readable.

"This resource changed" is close to useless by itself. Enrich it with the things around it, which services depend on it, who owns them, what's likely to break, and suddenly a person can act on it in seconds. A lot of my work is exactly that. You take a bare signal and wrap it in enough context to turn it into a decision.

I've started to think of legibility as the actual product. Showing people more of the system was never the goal. Letting them act on less of it is. Get a sprawling thing down to the few parts a person can hold in their head at once, and someone who isn't an expert can still reason about it.

## The second reader isn't human

Here's the shift I keep coming back to. For my whole career, the reader at the end of all this curated, enriched information was a person. That's no longer a safe assumption.

More and more, the thing reading the event stream is an agent. Software acting on its own on behalf of a person or a business. And agents turn out to have the same attention economics we do. Flood one with noise and it makes worse decisions, the same way we do. Hand it the clean, well-contextualized signal a good engineer would want, and it does better work.

So the work changes shape. The systems I build aren't designed only for human readers anymore. They're designed for a human and an agent at the same time, and it turns out the discipline that serves one serves the other. Good curation and context end up being the foundation the agentic web runs on.

## Why I think this is worth betting on

I try to stay measured about AI. A lot of what gets sold as revolution is autocomplete with a marketing budget, and we've all watched a hype cycle mistake motion for progress. So I look for the part that survives the skepticism.

For me, the part that survives is this. As machines generate more of the world's information, the valuable skill becomes deciding what's worth attention and giving it the context to be understood. That doesn't depend on any one model or any particular wave of excitement. It follows from a simple fact: attention is finite and data isn't.

It also points somewhere I actually like. In the good version of this, machines don't bury us in their output. They hand us, and the agents working on our behalf, the few things that matter, and they do it in a form we can actually use.
