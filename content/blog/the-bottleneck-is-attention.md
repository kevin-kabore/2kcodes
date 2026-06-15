# The Bottleneck Is Attention

For most of computing history, the scarce thing was the machine. Compute was expensive, storage was precious, and good engineering meant being frugal with both. We are not in that world anymore. Compute is abundant and getting cheaper, storage is effectively free, and our systems now generate data faster than any human could ever hope to read it.

When the constraint moves, the interesting work moves with it. And the constraint has moved decisively to a single place: attention. Human attention has always been finite. What's new is that machine attention is now finite too, and just as worth designing around.

I spend my days inside this problem. I work on event signal processing, the systems that take enormous, high-frequency streams of machine events and try to make them mean something. It has quietly become one of the best vantage points I know for seeing where technology is headed.

## Abundance creates a new kind of poverty

A modern software system emits an astonishing volume of events. Every deploy, every config change, every scaling action, every blip. In isolation each one is a fact. In aggregate they are a fog.

This is the paradox of abundance. We solved the problem of capturing what happens, and in doing so we created a harder one: almost none of it matters at any given moment, but the few things that do are buried. More data did not produce more understanding. It produced more noise to wade through on the way to the few things that matter.

Anyone who has been paged at 3am for something that didn't matter already knows this. The cost of noise isn't abstract. It is trust, and time, and the slow erosion of anyone's willingness to look at all.

## Curation as the high-leverage act

The instinct of the last decade was to throw more dashboards at the problem. Give people every chart and let them figure it out. That is the equivalent of responding to information overload by printing more newspapers.

The work that actually moves the needle is the opposite: aggressive, intelligent curation. On one recent effort, we used large language models to evaluate the risk and significance of changes flowing through a system, and cut the noise reaching humans by more than 98 percent, measured against what engineers later confirmed actually mattered. We didn't hide anything. We weighed it, and made the judgment call that turns a firehose into a signal.

The interesting part isn't the percentage. It's what it implies. If 98 percent of what a system surfaced didn't deserve a human's attention, then the bottleneck was never the data. It was the absence of judgment between the data and the person. AI is unusually good at supplying that judgment at scale, and that, more than anything I can produce in a chat window, is where I think it earns its keep over the next few years.

## Context is what makes data legible

Cutting noise is half the job. The other half is making what survives actually legible.

A raw event, "this resource changed," is nearly useless on its own. The same event enriched with context, which services depend on it, who owns them, what is likely to break, becomes something a person can act on in seconds. A lot of my work is exactly this kind of enrichment: taking a bare signal and wrapping it in the context that turns it from a fact into a decision.

I have come to think of legibility as the real product. The goal isn't to show people more. It's to let them understand more with less, to compress a sprawling system down to the few things a human mind can hold at once. It lets someone who isn't a domain expert reason about a system that would otherwise be closed to them.

## The second reader is not human

Here is the shift that I think changes the shape of everything. For my entire career, the consumer of all this curated, enriched information was a person. That assumption is now wrong.

Increasingly the thing reading the event stream is an agent, a piece of software acting with autonomy on behalf of a person or a business. And agents, it turns out, are subject to the same economics of attention we are. Flood an agent with noise and it makes worse decisions, just as we do. Hand it the same well-curated, well-contextualized signal a good engineer would want, and it acts well.

This reframes the work. The systems I build are no longer designed for human readers alone. They are designed for a new kind of user that is part human, part autonomous agent, and the discipline that serves one turns out to serve the other. Good curation and rich context are not nice-to-haves for the agentic web. They are the substrate it runs on. The teams that learn to make a machine-scale system legible to a human and an agent at the same time are working on something that matters.

## Why I think this is a frontier worth betting on

I try to hold a measured view of AI. A lot of what gets sold as revolution is autocomplete with good marketing, and we have all watched a hype cycle confuse motion with progress before. So I look for the parts that survive the skepticism.

The part that survives, for me, is this: as machines produce more of the world's information, the scarce and valuable skill becomes deciding what deserves attention and giving it the context to be understood. That is durable. It does not depend on any single model or any particular wave of enthusiasm. It follows directly from the fact that attention is finite and data is not.

It also points somewhere humane. The optimistic version of this technology is not one where machines drown us in their output. It is one where they hand us, and the agents working on our behalf, exactly the few things that matter, in a form we can actually use.

The bottleneck is attention. Almost everything interesting starts the moment you treat it as the scarce resource it has quietly become.
