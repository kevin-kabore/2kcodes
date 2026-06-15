# Using AI to Build a Banana Bread Business

There is a particular kind of tired you only earn standing up. Not the screen-tired of a long debugging session, but the kind that settles into your lower back after fourteen hours of weighing batter into pans, one loaf at a time. That is the tired that taught me the most this year.

This is the story of Brekkie Bakery, a protein banana bread company I co-founded with three friends, and what it taught me about where AI actually helps, where it quietly lies to you, and why I have become slightly obsessed with the machines that software still hasn't reached.

## Four people and a really good loaf

We started talking seriously last November. The four of us each brought something different. One had a protein banana bread recipe that the rest of us couldn't stop eating, the kind of thing that has no business being good for you. One ran a coffee business and already worked with the distributors who supply Manhattan's bodegas and corner stores, so he understood the channel. One had spent years in sales in exactly this domain. And I brought the operational structure and the technical instincts, the part of me that wants to turn a messy process into a system.

The idea was simple on paper: make a clean, high-protein banana bread people actually crave, and get it onto shelves where New Yorkers already buy their morning food.

Simple on paper is where this story begins.

## AI as the world's fastest research analyst

Before we spent a dollar, we used AI to map the terrain. What licenses does a food business legally need in New York? What entity structure lets us open wholesale accounts and order ingredients in bulk? Is it even realistic for four people to produce at the scale we wanted?

This is where AI was genuinely incredible. Questions that would have meant days of searching forums and government PDFs came back in minutes, organized and mostly correct. We set an ambitious goal: 500 loaves per bake. We asked whether four people could do that, and the answer was an optimistic yes, roughly twelve hours of work.

We were skeptical enough to cut the target in half to 250. That instinct to play it safe saved us. It still wasn't safe enough.

Here is the thing I underrated: the bottlenecks were never the parts AI touched. Sourcing was faster than ever. Research was faster than ever. What was slow was everything human. Commercial kitchens taking weeks to return an email. License processing. Getting the business entity set up so we could even open a vendor account. We finally locked a commercial kitchen in Harlem in December, pooled our money for the equipment we were missing, bags, a heat sealer, and ordered every ingredient.

We even used AI to help with the recipe itself, balancing shelf life against keeping the ingredient list clean and natural. That tradeoff is much harder than it sounds, and it is a good preview of what was coming.

## The estimate meets the oven

Then we baked.

The first bake took three days. Fourteen hours the first day, six the next, four the day after. At the end of it we had about 180 good loaves. The model had told us 250 in twelve hours.

It wasn't lying, exactly. It was reasoning about the recipe, not the reality, and it had no way to tell the difference. A model with no feedback loop to the physical world is exactly as confident when it's right as when it's wrong. It had no model of the time it takes to weigh dry ingredients before you can even start mixing. Or weighing the batter to load each pan accurately, one pan at a time, so every loaf is consistent. Or that a large commercial oven behaves nothing like the convection oven you tested at home, so your temperatures and timing are suddenly wrong. Or the sheer manual labor of slicing and packaging at the end.

The estimate captured the chemistry. It missed the physics, and the hands doing the work.

## My engineering brain kicks in

We left exhausted but, strangely, motivated. And somewhere in the fog my software brain started running its usual loop: how do you make a slow process faster?

The classic move is to trade space for time. Precompute what you can. Cache the expensive work so you don't repeat it under load.

So we went back to AI to pressure-test a plan, and this time the logic held up because we were finally asking about the real bottlenecks. We bought bins and pre-mixed everything we could in advance, the dry ingredients and some of the wet. We recruited friends to help with slicing and packaging, the other choke point. We were ready for round two.

Round two: we started at 10 in the morning and left the kitchen at 6 the next morning. It then took two more evenings to finish slicing and packaging. The yield was about 131 good loaves, against a target of 250.

We had gotten smarter and the numbers got worse. The problem was not our process. The problem was that the process itself, done by four people and their hands, does not scale. No amount of clever pre-computation fixes a fundamentally manual pipeline.

You need different machines.

## The co-packer, or: meeting the future

So we stepped back, did our research, and started talking to co-packers, the facilities that manufacture food at scale. Visiting one made us laugh out loud at our own humility.

They had a machine that measures batter to an exact target weight and pours it perfectly, in seconds, the task that had cost us minutes per loaf and most of our sanity. Rotating walk-in ovens that could bake our entire 500-loaf goal in a single pass. A slicer that cut a loaf into clean one-inch slices in seconds. And at the end of the line, every loaf came out perfectly wrapped and sealed.

Standing there, watching a problem that had broken our backs get solved in seconds by purpose-built steel, I finally got the joke.

## Where this leaves me

I came away from this with a conviction that has started to shape what I want to build.

We talk about AI mostly as something that lives on a screen. It writes, it reasons, it answers. And that version of AI was a phenomenal research partner for us. But the gap between the estimate and the oven is exactly the gap between software that thinks and systems that act in the physical world. The most exciting frontier I can see is closing that gap: bringing intelligence into the machines, the ovens, the lines, the physical processes that still run on human labor and rough guesses.

My back is fine now. The conviction it left behind isn't going anywhere. The next wave of this technology won't just be smarter chat. It will be intelligence that reaches off the screen and into the physical world, into the ovens and the lines and the machinery the digital revolution mostly skipped. I want to help build that.

We're still baking, by the way.
