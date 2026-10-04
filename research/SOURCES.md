# Research source catalog

Research date: October 3, 2026 (America/New_York).

These are primary sources describing the company's stated behavior, not an independent audit of its software. Links and short paraphrases are cataloged here rather than reproducing copyrighted pages. Exact weights, model internals, timing, and a guaranteed sequence of operations are not disclosed by these sources.

## S1 — How TikTok recommends content

- Publisher: TikTok Help Center. Publication date not shown.
- URL: https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content
- Retrieval: canonical page yielded no readable body; indexed versions of this same page supplied its general recommendations and For You sections.
- Findings: The For You system uses viewer actions (including watching or skipping), video details (sounds, hashtags, views, publication country), and viewer context (language, location, time, device). Viewer actions usually carry more weight. It ranks eligible content by predicted interest; influence can change. Some recommendation systems use patterns from people with similar interests. Controls include Not interested, topic preferences, keyword filters, and feed refresh.
- Use: signal groups, ranking, controls. Never present a fixed formula or treat these controls as guarantees.

## S2 — How TikTok recommends videos #ForYou

- Publisher: TikTok Newsroom.
- Date: regional page header October 26, 2020; body identifies the original explanation as June 19, 2020.
- URL: https://newsroom.tiktok.com/how-we-recommend-videos?lang=en-IE
- Findings: Selected interests can seed a new feed; popular videos provide a starting point otherwise. Watching through a longer video can be a stronger clue than sharing a country with its creator. Feedback informs later recommendations. This is a historical explanation, not a current specification of exact weights.
- Use: starting point, teaching example, feedback loop.

## S3 — An update on our work to safeguard and diversify recommendations

- Publisher: TikTok Newsroom. Date: December 16, 2021.
- URL: https://newsroom.tiktok.com/an-update-on-our-work-to-safeguard-and-diversify-recommendations?lang=en
- Findings: The company describes adding variety beyond established preferences and reducing repetitive patterns. Removal for rule violations and eligibility for broad recommendation are different decisions. Some measures described here were being tested at publication.
- Use: variety and eligibility; do not portray safeguards as perfect or historical tests as universal current behavior.

## S4 — Learn why a video is recommended For You

- Publisher: TikTok Newsroom. Date: December 20, 2022.
- URL: https://newsroom.tiktok.com/learn-why-a-video-is-recommended-for-you?lang=en
- Findings: Example explanations include viewing and other interactions, searches, followed accounts, and recent or popular regional content.
- Use: demonstrate that interest in a topic is only one reason for a recommendation. Do not infer a recency boost with a fixed size.

## S5 — Monolith: Real Time Recommendation System With Collisionless Embedding Table

- Authors: Zhuoran Liu and colleagues, ByteDance. Version reviewed: September 27, 2022.
- Paper: https://arxiv.org/html/2209.07663v2
- Official implementation: https://github.com/bytedance/monolith
- Findings: Online training consumes incoming behavior and periodically transfers changed parameters to the serving system. Section 2.2.3 describes minute-level updates for sparse parameters. The live A/B experiment in section 3.1.2 compares online and batch training on an advertising model.
- Decision: Explain fresh feedback as a useful mechanism. Do not identify Monolith as TikTok's complete current algorithm, claim every swipe retrains it instantly, or claim a measured speed advantage over Instagram or YouTube. The paper does not provide that head-to-head test.

## S6 — Revisiting Algorithmic Audits of TikTok: Poor Reproducibility and Short-term Validity of Findings

- Authors: Matej Mosnar and colleagues. April 25, 2025; SIGIR 2025.
- URL: https://arxiv.org/abs/2504.18140
- Finding: Reproducing personalization audits is difficult, and conclusions can depend on the methods and changing platform state.
- Decision: Avoid a universal number of minutes, swipes, or videos needed to learn someone's interests.

## Final-screen interpretation

The discussion of why recommendations can feel accurate is a teaching synthesis of S1, S2, and S5: viewing provides feedback; similarities offer clues; newer evidence can improve predictions. It is an explanation of mechanisms, not an independently measured ranking of competing apps. The feedback-loop animation is conceptual; its speed is not a measured system latency.

## Accuracy boundaries

- The animation is a teaching model, not a reconstruction or reverse engineering of production code.
- Fictional videos and viewer choices make the process visible. No actual viewer data is collected.
- Moving cards and clue labels explain concepts; they are not real scores, model features exposed by an API, or fixed pipelines.
- Avoid claims about listening through microphones, knowing private thoughts, rewarding every creator with a fixed initial audience, or using universal numerical weights.
- Scope: ordinary personalized video recommendations. Advertising, LIVE, Shop, and search ranking are separate systems and outside this lesson.
