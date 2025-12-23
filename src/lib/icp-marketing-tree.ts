/**
 * ICP Marketing 101 - File Tree Structure
 * Hierarchical content organization for exploring ICP Marketing concepts
 */

export const icpMarketingTree: Record<
  string,
  { name: string; type: "file" | "dir" }[]
> = {
  "/": [
    { name: "/1-what-is-icp", type: "dir" },
    { name: "/2-finding-your-icp", type: "dir" },
    { name: "/3-activating-icp", type: "dir" },
    { name: "/4-best-practices", type: "dir" },
    { name: "/5-examples", type: "dir" },
    { name: "/README.md", type: "file" }
  ],
  "/1-what-is-icp": [
    { name: "/1-what-is-icp/overview.md", type: "file" },
    { name: "/1-what-is-icp/definition.md", type: "file" },
    { name: "/1-what-is-icp/icp-vs-persona.md", type: "file" },
    { name: "/1-what-is-icp/examples", type: "dir" }
  ],
  "/1-what-is-icp/examples": [
    { name: "/1-what-is-icp/examples/saas-marketing.md", type: "file" },
    { name: "/1-what-is-icp/examples/cs-leader.md", type: "file" },
    { name: "/1-what-is-icp/examples/startup-founder.md", type: "file" }
  ],
  "/2-finding-your-icp": [
    { name: "/2-finding-your-icp/overview.md", type: "file" },
    { name: "/2-finding-your-icp/1-analyze-best-customers.md", type: "file" },
    { name: "/2-finding-your-icp/2-firmographics-technographics.md", type: "file" },
    { name: "/2-finding-your-icp/3-behavioral-analysis.md", type: "file" },
    { name: "/2-finding-your-icp/4-customer-feedback.md", type: "file" },
    { name: "/2-finding-your-icp/5-scoring-model.md", type: "file" }
  ],
  "/3-activating-icp": [
    { name: "/3-activating-icp/overview.md", type: "file" },
    { name: "/3-activating-icp/messaging", type: "dir" },
    { name: "/3-activating-icp/channels", type: "dir" },
    { name: "/3-activating-icp/onboarding", type: "dir" },
    { name: "/3-activating-icp/upsells", type: "dir" }
  ],
  "/3-activating-icp/messaging": [
    { name: "/3-activating-icp/messaging/align-with-pain-points.md", type: "file" },
    { name: "/3-activating-icp/messaging/paddle-example.md", type: "file" },
    { name: "/3-activating-icp/messaging/survey-techniques.md", type: "file" }
  ],
  "/3-activating-icp/channels": [
    { name: "/3-activating-icp/channels/channel-selection.md", type: "file" },
    { name: "/3-activating-icp/channels/b2b-saas.md", type: "file" },
    { name: "/3-activating-icp/channels/startups.md", type: "file" },
    { name: "/3-activating-icp/channels/dropbox-case.md", type: "file" }
  ],
  "/3-activating-icp/onboarding": [
    { name: "/3-activating-icp/onboarding/segment-based.md", type: "file" },
    { name: "/3-activating-icp/onboarding/smb-vs-enterprise.md", type: "file" },
    { name: "/3-activating-icp/onboarding/slack-example.md", type: "file" },
    { name: "/3-activating-icp/onboarding/personalization.md", type: "file" }
  ],
  "/3-activating-icp/upsells": [
    { name: "/3-activating-icp/upsells/product-signals.md", type: "file" },
    { name: "/3-activating-icp/upsells/hashicorp-example.md", type: "file" },
    { name: "/3-activating-icp/upsells/behavioral-triggers.md", type: "file" }
  ],
  "/4-best-practices": [
    { name: "/4-best-practices/overview.md", type: "file" },
    { name: "/4-best-practices/1-proven-fits.md", type: "file" },
    { name: "/4-best-practices/2-avoid-aspirational.md", type: "file" },
    { name: "/4-best-practices/3-refresh-quarterly.md", type: "file" },
    { name: "/4-best-practices/4-behavioral-data.md", type: "file" },
    { name: "/4-best-practices/5-balance-definition.md", type: "file" }
  ],
  "/5-examples": [
    { name: "/5-examples/overview.md", type: "file" },
    { name: "/5-examples/impala.md", type: "file" },
    { name: "/5-examples/attention-insight.md", type: "file" },
    { name: "/5-examples/paddle.md", type: "file" },
    { name: "/5-examples/dropbox.md", type: "file" },
    { name: "/5-examples/slack.md", type: "file" },
    { name: "/5-examples/hashicorp.md", type: "file" }
  ]
} as const;

/**
 * ICP Marketing Content Map
 * Maps file paths to their actual content
 */
export const icpMarketingContent: Record<string, string> = {
  "/README.md": `# ICP Marketing 101

**How to Find, Define, & Activate Your Ideal Customer Profile**

This guide provides a comprehensive overview of ICP (Ideal Customer Profile) marketing, helping you identify, define, and activate your best-fit customers for sustainable growth.

## Contents

1. **What is ICP Marketing?** - Understanding the fundamentals
2. **Finding Your ICP** - Step-by-step process to identify your ideal customers
3. **Activating Your ICP** - Practical strategies to engage and convert
4. **Best Practices** - Proven guidelines for ICP success
5. **Examples** - Real-world case studies from successful companies

## Quick Start

Start with the "What is ICP" section to understand the basics, then move through finding and activating your ICP.

Source: [Userpilot Blog](https://userpilot.com/blog/icp-marketing/)`,

  "/1-what-is-icp/overview.md": `# What is ICP Marketing?

ICP marketing means promoting and selling your product specifically to your ideal customer profile; the audience segment most likely to see value, stick around, and drive long-term revenue.

## Two Core Concepts

1. **ICP (Ideal Customer Profile)**: A data-backed description of the type of customer who benefits the most from your product and delivers the highest lifetime value.

2. **Marketing**: Promoting, selling, or delivering products or services to a target audience to generate profit for a business.

Together, they focus your efforts on best-fit customers and cut resource wastage on unqualified leads.`,

  "/1-what-is-icp/definition.md": `# ICP Definition

An ideal customer profile (ICP) is a data-backed description of the type of customer who:
- Benefits the most from your product
- Delivers the highest lifetime value
- Has the best retention rates
- Expands usage over time
- Champions your product

## Key Characteristics

- **Data-driven**: Based on actual customer performance, not assumptions
- **Specific**: Clearly defines who IS and ISN'T a fit
- **Actionable**: Guides sales, marketing, and product decisions
- **Evolving**: Updates as your product and market mature`,

  "/1-what-is-icp/icp-vs-persona.md": `# ICP vs. Buyer Persona

While related, ICPs and personas serve different purposes:

## Buyer Personas are Descriptive
- Capture demographics, pain points, and motivations
- Focus on individual buyers
- Humanize prospects
- Answer "who they are"

## ICPs are Prescriptive
- Define strategic fit criteria
- Focus on company/account level
- Guide targeting decisions
- Answer "who you should target"

Think of personas as the universal set "who they are," and an ICP as the subset "who you should target."

## Quick Test
**Can you clearly state who isn't a fit?**

If you struggle to exclude non-ideal customer segments, your ICP is too vague. A well-defined ICP should sharpen focus, not expand it.

Example:
- ❌ "Any company with sales teams" (too broad)
- ✅ "B2B SaaS firms with SDRs struggling to convert inbound leads" (specific)`,

  "/1-what-is-icp/examples/saas-marketing.md": `# Example: SaaS Marketing Manager

**Persona**: Marketing Manager at a mid-market company

**ICP**: Marketing managers at 200–500 person SaaS companies with:
- >$10M ARR
- 3-person operations team
- Adoption challenges
- Active use of complementary tools (HubSpot, Salesforce)

The ICP adds strategic qualifiers that help identify the best-fit accounts.`,

  "/1-what-is-icp/examples/cs-leader.md": `# Example: Customer Success Lead

**Persona**: Customer Success Lead looking for retention solutions

**ICP**: CS leaders in B2B SaaS firms with:
- Churn above 8%
- 50+ seats
- No formal playbooks
- Dedicated CS team
- Budget for CS tools

This ICP focuses on companies with clear retention pain points and resources to solve them.`,

  "/1-what-is-icp/examples/startup-founder.md": `# Example: Startup Founder

**Persona**: Startup founder wearing many hats

**ICP**: Seed-funded SaaS founders with:
- <20 employees
- Piloting product-led growth
- Seeking scalable onboarding
- $1M+ in funding
- Growing user base (100+ active users)

This ICP targets startups at the right stage to benefit from the product.`,

  "/2-finding-your-icp/overview.md": `# How to Find Your ICP

Your best customers already succeed with you. They renew consistently, expand usage, and champion your product. They're the clearest blueprint for who you should target.

## 5-Step Process

1. **Analyze Best Customers**: Identify patterns in top accounts
2. **Firmographics & Technographics**: Add structural data
3. **Behavioral Analysis**: Understand how they use your product
4. **Customer Feedback**: Validate with qualitative and quantitative data
5. **Create Scoring Model**: Build a consistent evaluation framework`,

  "/2-finding-your-icp/1-analyze-best-customers.md": `# Step 1: Analyze Your Best Customers

## How to Find Best Customers

1. **Run a report** of your top 10–20 accounts by retention and expansion
2. **Look for patterns** in company size, industry, job titles, and buying triggers
3. **Talk to CSMs and sales** to spot the common thread: Who's easiest to close, easiest to keep, hardest to lose?
4. **Compare "good fit" vs. "bad fit"** accounts

## Sample Comparison Table

| Criteria | Good Fit | Bad Fit |
|----------|----------|---------|
| Company size | 200–500 employee SaaS | <20 employee agency |
| Onboarding support | Dedicated CS team | No onboarding resources |
| Growth potential | Expands usage in 6 months | Churns after trial |
| Tech maturity | Uses complementary SaaS stack | Reliant on manual tools |
| Budget alignment | >$10M ARR | <$1M ARR |

## Validation Tip

Segment power users and run in-app surveys asking "What do you like most about us?" to confirm what drives adoption and expansion.`,

  "/2-finding-your-icp/2-firmographics-technographics.md": `# Step 2: Firmographics & Technographics

Once you've identified your best customers, add structure with firmographic and technographic data.

## Firmographics
Measurable company traits:
- Revenue/ARR
- Employee count
- Geography
- Industry
- Company stage

## Technographics
Tools and technology stack:
- CRM systems (Salesforce, HubSpot)
- Communication tools (Slack, Teams)
- Analytics platforms
- Existing integrations

## Sample ICP Checklist

| Factor | Fit Signal | No-Go Signal |
|--------|-----------|--------------|
| Company size | 200–500 employees | <20 employees |
| Revenue | $10M+ ARR | <$1M ARR |
| Industry | B2B SaaS | Offline services |
| Geography | North America, W. Europe | Unsupported regions |
| Tech stack | Salesforce, HubSpot, Slack | No CRM, legacy tools |`,

  "/2-finding-your-icp/3-behavioral-analysis.md": `# Step 3: Behavioral Analysis

Beyond firmographics, your ICP should include behavioral analysis: Why do customers behave the way they do? What problems are they trying to solve?

## Why Include Behavior?

You need to identify not only *who* is a fit, but also *why* they buy and *how* they use your product.

## Key Signals

**Behavioral signals** (the *how*):
- Product usage frequency
- Number of active team members
- Feature adoption rate
- Willingness to upgrade

**Pain points** (the *why*):
- Missed project deadlines
- Poor adoption of internal tools
- Lack of visibility across teams

## Behavior-Trigger Mapping

| Behavior Pattern | Underlying Pain Point | ICP Insight |
|-----------------|----------------------|-------------|
| Users abandon setup after step 3 | Setup is complex/unclear | ICP prefers intuitive onboarding |
| Teams log in daily with 20+ active users | Projects require heavy collaboration | ICP = agencies managing multiple clients |
| Frequent upgrades to premium features | Current tools lack functionality | ICP values robust features |
| Low engagement from smaller accounts | Product is advanced for small teams | ICP excludes <10-person teams |

## Implementation

Use event tracking and lifecycle filters to group users by behaviors and connect usage signals with pain points to shape a sharper, data-driven ICP.`,

  "/2-finding-your-icp/4-customer-feedback.md": `# Step 4: Validate with Customer Feedback

Combine quantitative and qualitative feedback to confirm your ICP is grounded in real-world results.

## Quantitative Feedback
Shows which segments are truly profitable:
- Retention rates by cohort
- CAC/LTV ratios
- Feature adoption metrics
- Expansion revenue
- Time to value

## Qualitative Feedback
Explains the *why* behind the numbers:
- "Why did you choose us?" interviews
- "What would make you switch?" surveys
- Pain point discovery calls
- Feature request analysis

## Example Validation

A SaaS analytics company found:
- **Quantitative**: Mid-market users (50–200 employees) have highest retention and fastest feature adoption
- **Qualitative**: They chose the product for "team collaboration features" and "ease of setup"
- **Insight**: Smaller companies churn quickly despite high trial sign-ups—volume ≠ fit

## Testing Approach

Run "mini ICP experiments":
1. Segment users by size or behavior
2. Invite them to interviews through targeted modals
3. Offer incentives to boost participation
4. Analyze patterns in responses`,

  "/2-finding-your-icp/5-scoring-model.md": `# Step 5: Create a Scoring Model

Create a consistent, central scoring model to help marketing target the right accounts and sales avoid poor-fit leads.

## Goal
Increase close rates and reduce churn.

## How to Create It

1. Choose 3–5 key factors (company size, pain point urgency, tech compatibility)
2. Assign "fit" or "misfit" signals for each
3. Score new leads accordingly

## Example: Lead Scoring

### Lead A: Strong ICP Fit
350-employee SaaS, HubSpot user, struggling with onboarding

| Factor | Fit Signal | Misfit Signal | Score |
|--------|-----------|---------------|-------|
| Company size | 200–500 employees | <20 employees | 1/0 |
| Tech compatibility | Uses Salesforce + HubSpot | No CRM | 1/0 |
| Pain urgency | Struggles with adoption | "Nice-to-have" | 1/0 |

✅ **Total: 3/0 = Strong ICP fit**

### Lead B: Poor ICP Fit
15-employee startup, no CRM, low urgency

| Factor | Fit Signal | Misfit Signal | Score |
|--------|-----------|---------------|-------|
| Company size | 200–500 employees | <20 employees | 0/1 |
| Tech compatibility | Uses Salesforce + HubSpot | No CRM | 0/1 |
| Pain urgency | Struggles with adoption | "Nice-to-have" | 0/1 |

❌ **Total: 0/3 = Poor ICP fit**

## Borderline Cases (2/1 Score)

A 2/1 score means the lead is a **cautious ICP fit**:
- Meets most criteria but has one weak spot
- May be worth pursuing as secondary priority
- Don't overload pipeline with these
- Watch CAC/LTV data for validation`,

  "/3-activating-icp/overview.md": `# How to Activate Your ICP

When your entire go-to-market motion speaks directly to your best-fit audience, you:
- Cut wasted spend
- Improve lead quality
- Boost expansion revenue

## Key Activation Strategies

1. **Align Messaging with Pain Points**: Speak their language
2. **Choose the Right Channels**: Go where they are
3. **Tailor Onboarding by Segment**: Personalize the experience
4. **Use Product Signals for Upsells**: Trigger timely offers

The key is translating ICP insights into actionable strategies across marketing, sales, and product.`,

  "/3-activating-icp/messaging/align-with-pain-points.md": `# Align Messaging with Pain Points

Your ICP clarity should start with messaging—it's one of the first things potential customers notice.

## Don't vs. Do

❌ **Don't**: "Simplify your workflow" (generic, vague)
✅ **Do**: "Cut onboarding time by 40% for mid-market SaaS teams" (specific, urgent)

## How to Get It Right

1. **Interview or survey your ICP** to capture exact words they use
2. **Run in-app surveys** asking:
   - "What's your biggest challenge right now?"
   - "Why did you choose us over alternatives?"
3. **Feed those phrases** directly into:
   - Website copy
   - Ads
   - Onboarding flows
   - Email campaigns

## Result

Messaging that feels like it was written for your ICP, not for everyone.`,

  "/3-activating-icp/messaging/paddle-example.md": `# Example: Paddle's Messaging

Paddle, a SaaS revenue platform, is a prime example of ICP-focused messaging.

## Their Approach

Instead of chasing all businesses, they spoke directly to software founders frustrated with tax compliance.

**Message**: "We handle sales tax, VAT, and invoicing so you can focus on building."

## Why It Works

- **Specific**: Targets software companies, not all businesses
- **Pain-focused**: Addresses a real, urgent problem
- **Clear value**: Immediately shows what they solve
- **Exclusive**: Makes non-software companies self-select out

## Key Lesson

Perfect ICP messaging makes your ideal customers think "This is exactly what I need" while making poor fits realize "This isn't for me."

Source: [Paddle.com](https://www.paddle.com/)`,

  "/3-activating-icp/messaging/survey-techniques.md": `# Survey Techniques for Better Messaging

Use in-app surveys to capture your ICP's exact language and pain points.

## Effective Survey Questions

1. **"What's your biggest challenge right now?"**
   - Open-ended
   - Captures current pain
   - Uses their words

2. **"Why did you choose us over alternatives?"**
   - Reveals differentiators
   - Highlights value props
   - Shows decision factors

3. **"What would make you switch to a competitor?"**
   - Identifies risks
   - Reveals must-haves
   - Shows vulnerabilities

4. **"How would you describe us to a colleague?"**
   - Captures positioning
   - Uses customer language
   - Tests clarity

## Best Practices

- Target power users and promoters
- Offer incentives for completion
- Keep surveys short (2-3 questions)
- Follow up for deeper insights
- Segment by ICP fit level`,

  "/3-activating-icp/channels/channel-selection.md": `# Choose the Right Channels

One of the biggest mistakes SaaS teams make is spreading acquisition dollars across too many channels. ICP insights prevent this waste.

## How ICP Guides Channel Selection

Your ICP shows you exactly where your best-fit customers hang out, so you can:
- Focus budget on high-ROI channels
- Avoid broad, expensive platforms
- Reduce wasted spend
- Improve lead quality

## Channel Mapping Framework

| ICP Segment | Best Channels | Avoid |
|-------------|---------------|-------|
| Mid-market SaaS (200-500) | LinkedIn, G2, Capterra | Google Display, Facebook |
| Early-stage startups | Indie Hackers, Product Hunt, Twitter | Traditional print, TV |
| Enterprise (1000+) | Industry conferences, direct sales | Mass-market social |

## Key Principle

**Go where your ICP already is, not where everyone else is marketing.**`,

  "/3-activating-icp/channels/b2b-saas.md": `# Channels for Mid-Market B2B SaaS

If your ICP is mid-market SaaS teams with 200–500 employees:

## High-ROI Channels

1. **LinkedIn**
   - Precise targeting by company size, role
   - Decision-makers active
   - Professional context

2. **Review Platforms**
   - G2, Capterra, Software Advice
   - High purchase intent
   - Comparison stage

3. **Industry Communities**
   - SaaStr, SaaS Mag
   - Niche forums
   - Slack/Discord communities

4. **Content Marketing**
   - SEO-optimized guides
   - Comparison pages
   - Case studies

## Lower-ROI Channels

- Google Display ads (too broad)
- Facebook/Instagram (B2C focused)
- Mass email lists (poor targeting)`,

  "/3-activating-icp/channels/startups.md": `# Channels for Early-Stage Startups

If your ICP is early-stage startup founders:

## High-ROI Channels

1. **Indie Hackers**
   - Founder community
   - High engagement
   - Product launches

2. **Product Hunt**
   - Early adopters
   - Tech-savvy
   - Launch momentum

3. **Twitter/X**
   - Founder networks
   - Real-time engagement
   - Community building

4. **Founder Communities**
   - YC forums
   - Startup Slack groups
   - Reddit (r/startups, r/SaaS)

## Lower-ROI Channels

- Traditional advertising
- Enterprise conferences
- LinkedIn (unless targeting B2B)`,

  "/3-activating-icp/channels/dropbox-case.md": `# Case Study: Dropbox's Channel Strategy

Dropbox grew their initial user base by releasing a demo video on Hacker News rather than mass-market channels.

## Their Approach

**ICP**: Tech-savvy early adopters, developers, startup founders

**Channel**: Hacker News (not TV, print, or broad digital ads)

**Format**: Demo video showing the product in action

## Results

- Overnight waitlist surge from 5,000 to 75,000
- Perfect ICP fit (technical, early adopters)
- Organic viral growth through community
- Minimal marketing spend

## Key Lesson

They went where their ICP already congregated, with content their ICP valued (technical demo), instead of mass-market channels.

Source: [Dropbox Demo Video](https://www.youtube.com/watch?v=iAnJjXriIcw)`,

  "/3-activating-icp/onboarding/segment-based.md": `# Segment-Based Onboarding

Defining ICP cohorts helps you shape onboarding so each segment gets exactly what they need to succeed.

## Why Segment Onboarding?

Instead of a one-size-fits-all flow, tailor the experience to:
- Customer size (SMB vs Enterprise)
- Use case (Marketing vs Sales vs CS)
- Technical maturity
- Urgency level

## Result

Better retention and faster time-to-value.

## Key Segments

1. **SMBs**: Fast setup, templates, automation
2. **Mid-market**: Balance of guidance and customization
3. **Enterprise**: Integrations, SSO, security, training`,

  "/3-activating-icp/onboarding/smb-vs-enterprise.md": `# SMB vs. Enterprise Onboarding

Different ICP segments need different onboarding experiences.

## SMBs Want:
- **Fast setup**: Get value in hours, not weeks
- **Templates**: Pre-built workflows
- **Automation**: Minimal configuration
- **Self-service**: No sales calls required
- **Quick wins**: Immediate ROI

## Enterprises Need:
- **Integrations**: SSO, CRM, data connections
- **Security reviews**: Compliance, data handling
- **Training**: Multi-user onboarding
- **Customization**: Tailored to their processes
- **Support**: Dedicated CSM

## Key Difference

SMBs optimize for speed, enterprises optimize for scale and security.`,

  "/3-activating-icp/onboarding/slack-example.md": `# Case Study: Slack's Segmented Onboarding

Slack tailors its onboarding to different ICP segments while maintaining the same core product.

## SMB Onboarding
- Quick-start templates
- Pre-built channels
- Integration suggestions
- 5-minute setup
- Self-service resources

## Enterprise Onboarding
- Enterprise plan emphasis
- Compliance features
- SSO setup
- Admin training
- Security documentation
- Migration support

## Result

Both paths support the same vision but meet different ICP needs, leading to:
- Higher activation rates
- Better retention
- Faster expansion`,

  "/3-activating-icp/onboarding/personalization.md": `# Personalized Onboarding Implementation

How to build personalized onboarding flows for different ICP segments.

## Step 1: Collect Segmentation Data

Ask during signup:
- Company size
- Role/department
- Primary use case
- Technical maturity
- Goals

## Step 2: Route to Appropriate Flow

**Startups** might see:
- Quick setup tour
- Template gallery
- Basic features
- Growth tips

**Enterprises** might see:
- Advanced analytics
- Integration setup
- Multi-user training
- Security features
- Admin dashboard

## Step 3: Adapt Messaging

Use segment-specific language:
- SMB: "Set up in 5 minutes"
- Enterprise: "Configure for your organization"

## Implementation Tip

No code needed—use product adoption platforms to create flows based on user properties and behaviors.`,

  "/3-activating-icp/upsells/product-signals.md": `# Use Product Signals for Upsells

Your ICP already reveals which customers are the best long-term fit. Combine that clarity with behavioral signals for precise upsells.

## Key Product Signals

1. **Usage frequency**
   - Daily vs. weekly logins
   - Time spent in product
   - Feature engagement

2. **Team expansion**
   - Adding new users
   - Creating new workspaces
   - Cross-department adoption

3. **Feature limits**
   - Approaching plan limits
   - Trying locked features
   - Advanced feature requests

4. **Success milestones**
   - Completing workflows
   - Achieving goals
   - Positive outcomes

## Why This Works

When customers see additional features as valuable accelerators rather than pushy sales pitches, you:
- Reduce friction
- Shorten sales cycles
- Improve conversion rates`,

  "/3-activating-icp/upsells/hashicorp-example.md": `# Case Study: HashiCorp's Upsell Strategy

HashiCorp combines ICP data with usage behavior for timely, relevant upsells.

## Their Approach

**Track behaviors** like:
- Creating new workspaces
- Building more infrastructure
- Team growth
- Advanced feature usage

**Trigger upsells** when customers show scaling signals:
- Prompt with advanced features
- Offer higher-tier options
- Provide infrastructure scaling tools

**Segment experiences**:
- Light users stay on entry-level tools
- Scaling users get upgrade prompts
- Enterprise users get custom solutions

## Result

Upsells feel like a timely solution to real needs, not a blanket promotion.

## Key Lesson

Marry ICP data with product usage to trigger contextual, valuable upsells.

Source: [Mutiny Playbooks](https://www.mutinyhq.com/playbooks/never-miss-an-upsell-with-real-time-product-signals)`,

  "/3-activating-icp/upsells/behavioral-triggers.md": `# Behavioral Triggers for Upsells

Specific product behaviors that signal upsell readiness.

## High-Intent Triggers

1. **Hitting Limits**
   - Approaching seat limits
   - Storage capacity warnings
   - API rate limits
   - Feature usage caps

2. **Advanced Usage**
   - Using premium features in trial
   - Exporting data frequently
   - Creating complex workflows
   - Power user behaviors

3. **Team Expansion**
   - Inviting 5+ new users
   - Creating multiple workspaces
   - Cross-team adoption

4. **Success Signals**
   - Completing onboarding
   - Achieving key milestones
   - High engagement scores
   - Positive NPS responses

## Upsell Timing

**Too Early**: User hasn't seen value yet
**Just Right**: User hitting limits or expanding usage
**Too Late**: User already frustrated or churning

## Implementation

Set up automated triggers that:
1. Detect behavior signals
2. Segment by ICP fit
3. Trigger contextual upgrade prompts
4. Personalize messaging by use case`,

  "/4-best-practices/overview.md": `# ICP Best Practices

Your ICP should be a tool that drives marketing strategy, not a static slide buried in a deck.

## 5 Core Practices

1. **Build on Proven Fits**: Use actual customer data
2. **Avoid Aspirational ICPs**: Don't chase logos, chase fit
3. **Refresh Quarterly**: ICPs evolve with your product
4. **Layer in Behavioral Data**: Combine firmographics with usage
5. **Balance Narrow vs. Broad**: Specific enough to exclude, broad enough to grow

Each practice ensures your ICP stays practical and effective.`,

  "/4-best-practices/1-proven-fits.md": `# Build on Specific Accounts That Already Succeed

Don't guess—use data from customers who already succeed with your product.

## Focus On

Customers who:
- Retain longest
- Expand fastest
- Show high adoption
- Champion your product
- Renew reliably

## Avoid

- Aspirational "dream" customers
- One-off outliers
- Recently churned accounts
- Customers still in trial

## Process

1. Analyze your **top 20 accounts** for:
   - Retention metrics
   - Expansion revenue
   - Adoption patterns
   - Engagement scores

2. **Find commonalities**:
   - Company size
   - Industry
   - Tech stack
   - Team structure
   - Use cases

3. **Use these as foundation** for your ICP

## Key Insight

Your best customers are the blueprint for finding more customers like them.`,

  "/4-best-practices/2-avoid-aspirational.md": `# Avoid Aspirational ICPs

It's tempting to target logos that look impressive on paper, but this wastes resources and slows growth.

## The Problem

**Aspirational ICPs** focus on:
- Big-name companies
- Large enterprise deals
- Impressive logos for investor decks
- Companies you *wish* were customers

## The Reality

These often result in:
- Long, costly sales cycles
- Poor product fit
- High churn
- Misaligned features
- Team frustration

## The Solution

**Balance ambition with evidence:**
1. Define ICP around **today's wins**
2. Expand gradually into new segments
3. Test new segments before going all-in
4. Measure fit, not just size

## Example

❌ "Target Fortune 500" (aspirational)
✅ "Target mid-market SaaS scaling to enterprise" (evidence-based growth path)

## Key Principle

Chase fit, not logos.`,

  "/4-best-practices/3-refresh-quarterly.md": `# Refresh Your ICP Quarterly

Markets shift, customer needs evolve, and product capabilities expand. A well-maintained ICP adapts to these changes.

## Why Quarterly?

- **Products mature**: New features unlock new segments
- **Markets evolve**: Competitive landscape changes
- **Customer needs shift**: What worked last year may not work now
- **Your data grows**: More customers = better insights

## What to Review

Every quarter, check:

1. **Revenue trends**: Which segments are growing/declining?
2. **Retention data**: Any shifts in churn patterns?
3. **Expansion rates**: Which customers are upgrading?
4. **Competitive losses**: Where are you losing deals?
5. **Feature adoption**: What's driving success?

## Update Process

1. Run reports on key metrics
2. Interview recent wins and losses
3. Gather sales/CS feedback
4. Update ICP criteria
5. Communicate changes to teams

## Warning

A "set it and forget it" ICP quickly loses value. Don't wait for churn to reveal when your ICP is outdated.`,

  "/4-best-practices/4-behavioral-data.md": `# Layer in Behavioral Data

Firmographics show who might be a fit, but behavior reveals why they buy and how they engage.

## Why Combine Both?

**Firmographics alone** can be misleading:
- High-profile company might churn quickly
- Perfect size but wrong use case
- Right industry but poor engagement

**Behavioral data** reveals:
- Actual product usage
- Team engagement
- Feature adoption
- Success patterns

## Example Insight

You might notice that customers with **10+ active users** adopt features faster and renew more reliably than smaller teams, even if the company size is similar.

## What to Track

1. **Usage frequency**: Daily, weekly, monthly?
2. **Team activity**: How many users active?
3. **Feature adoption**: Which features drive retention?
4. **Time to value**: How quickly do they succeed?
5. **Expansion signals**: When do they upgrade?

## Implementation

Segment customers by:
- Usage patterns
- Team activity
- Adoption milestones
- Success metrics

Then validate firmographics with engagement data.

## Key Rule

If adoption lags, revisit your ICP assumptions—even if firmographics look perfect.`,

  "/4-best-practices/5-balance-definition.md": `# Balance Narrow vs. Broad Definition

A clear ICP sharpens focus while leaving room to grow. The right balance makes your ICP a filter, not a cage.

## Too Narrow

**Signs:**
- Tiny addressable market
- Pipeline dries up
- Excluding viable opportunities
- Over-optimization on edge cases

**Example:**
"Only 500+ employee fintech SaaS companies in NYC using Salesforce Enterprise with >$50M ARR"

## Too Broad

**Signs:**
- Can't clearly say who *isn't* a fit
- Sales pursues poor-fit leads
- High churn rates
- Inconsistent messaging

**Example:**
"All SaaS companies"

## Just Right

**Characteristics:**
- Specific enough to exclude bad fits
- Broad enough for natural expansion
- Clear decision criteria
- Room for adjacent segments

**Example:**
"200–500 person SaaS companies with adoption challenges and established tech stack"

## The Test

**Ask: "Who isn't a fit?"**

If exclusions outnumber inclusions, your ICP is too narrow.

If you can't name clear exclusions, your ICP is too broad.

## Key Principle

Define narrowly enough to focus, broadly enough to grow.`,

  "/5-examples/overview.md": `# Real-World ICP Examples

Companies that paired refined ICPs with tailored product experiences saw measurable impact.

## Featured Examples

1. **Impala**: Doubled activation
2. **Attention Insight**: 47% boost in trial conversions
3. **Paddle**: Spoke directly to software founders
4. **Dropbox**: Targeted tech-savvy early adopters
5. **Slack**: Segmented onboarding for SMB vs Enterprise
6. **HashiCorp**: Used product signals for upsells

## Common Success Factors

- Clear ICP definition
- ICP-aligned messaging
- Segmented experiences
- Behavioral triggers
- Continuous refinement`,

  "/5-examples/impala.md": `# Case Study: Impala

**Product**: Hotel management SaaS

## ICP Definition

- Independent hotels and small chains
- 10-50 rooms
- Limited tech resources
- Need simple PMS (Property Management System)
- Want quick setup and training

## Activation Strategy

1. **Simplified onboarding**: 30-minute setup
2. **Pre-built templates**: Common hotel workflows
3. **Video tutorials**: Self-service training
4. **Mobile-first**: On-the-go management
5. **Integration ready**: Connect to booking platforms

## Results

**Doubled activation rates** by focusing on:
- ICP-specific pain points
- Fast time-to-value
- Self-service resources
- Mobile accessibility

## Key Lesson

Narrowing focus to a specific ICP segment allowed them to build exactly what that segment needed.`,

  "/5-examples/attention-insight.md": `# Case Study: Attention Insight

**Product**: AI-powered design analysis

## ICP Definition

- UX/UI designers at tech companies
- Running A/B tests
- Need data-driven design decisions
- Working on web/mobile products
- Value quick insights

## Activation Strategy

1. **Design-focused messaging**: "See what users see first"
2. **Instant previews**: Upload design, get heatmap
3. **Designer-friendly UI**: Familiar workflows
4. **Integration**: Works with Figma, Sketch
5. **Fast results**: Analysis in seconds

## Results

**47% boost in trial conversions** through:
- ICP-aligned value proposition
- Removal of friction (instant results)
- Designer-centric experience
- Clear, immediate value

## Key Lesson

Understanding their ICP's workflow (designers need quick validation) shaped the product experience to deliver instant value.`,

  "/5-examples/paddle.md": `# Case Study: Paddle (Detailed)

**Product**: SaaS revenue platform

## ICP Definition

- Software/SaaS companies
- Selling globally
- Struggling with tax compliance
- Need billing infrastructure
- Want to focus on product, not payments

## Messaging Strategy

**Before (generic):**
"Complete payments solution for businesses"

**After (ICP-focused):**
"We handle sales tax, VAT, and invoicing so you can focus on building"

## Why It Worked

1. **Specific**: Clearly targets software companies
2. **Pain-focused**: Addresses real compliance headaches
3. **Exclusive**: Makes non-software companies self-select out
4. **Value-clear**: Immediate understanding of benefit

## Channel Strategy

- Product Hunt (software founders)
- Indie Hackers (SaaS builders)
- SaaS communities
- Developer conferences
- Content on SaaS metrics

## Results

- Clear positioning in crowded payments market
- High-fit inbound leads
- Strong product-market fit
- Efficient marketing spend

Source: [Paddle.com](https://www.paddle.com/)`,

  "/5-examples/dropbox.md": `# Case Study: Dropbox (Detailed)

**Product**: Cloud storage and collaboration

## Early ICP Definition

- Tech-savvy professionals
- Early adopters
- Developers and startup founders
- Value simplicity and automation
- Active in tech communities

## Channel Strategy

**Instead of**: TV ads, print media, mass marketing

**They chose**: Hacker News demo video

## What They Did

1. Created a **demo video** showing the product in action
2. Posted it on **Hacker News** (where their ICP congregates)
3. Offered **referral incentives** (extra storage for invites)

## Results

- Waitlist surged from **5,000 to 75,000 overnight**
- Perfect ICP fit (technical, early adopters)
- Organic viral growth through community
- Minimal marketing spend
- Strong product-market fit validation

## Key Lessons

1. Go where your ICP already is
2. Use content formats your ICP values
3. Enable viral growth within ICP networks
4. Don't follow conventional marketing playbooks

Source: [Dropbox Demo Video](https://www.youtube.com/watch?v=iAnJjXriIcw)`,

  "/5-examples/slack.md": `# Case Study: Slack (Detailed)

**Product**: Team communication platform

## Multiple ICP Segments

Slack serves different ICPs with tailored experiences:

### SMB ICP
- Small teams (5-50 people)
- Need quick setup
- Limited IT resources
- Want immediate value
- Self-service preference

### Enterprise ICP
- Large organizations (1000+ employees)
- Complex security needs
- Integration requirements
- Compliance demands
- Dedicated support needs

## Segmented Approach

### SMB Onboarding
- **Quick-start templates**: Pre-built channels
- **5-minute setup**: Instant value
- **Integration suggestions**: Connect tools easily
- **Self-service**: No sales calls
- **Simple pricing**: Transparent, per-user

### Enterprise Onboarding
- **Enterprise plan emphasis**: Advanced features
- **Compliance features**: SOC 2, HIPAA
- **SSO setup**: Integration with identity providers
- **Admin training**: Multi-user management
- **Security docs**: Detailed compliance info
- **Migration support**: From existing tools

## Results

- **High activation** in both segments
- **Better retention** through tailored experiences
- **Faster expansion** from SMB to Enterprise
- **Clear upgrade path** as companies grow

## Key Lessons

1. Same product, different experiences
2. Meet each ICP where they are
3. Create clear upgrade paths
4. Don't force one-size-fits-all`,

  "/5-examples/hashicorp.md": `# Case Study: HashiCorp (Detailed)

**Product**: Infrastructure automation tools

## ICP Definition

- DevOps teams at tech companies
- Managing cloud infrastructure
- Scaling rapidly
- Need automation and consistency
- Have existing infrastructure

## Upsell Strategy

### Track Behavioral Signals

**Scaling signals:**
- Creating new workspaces
- Building more infrastructure
- Adding team members
- Increased usage frequency

**Advanced usage:**
- Using complex workflows
- Multi-cloud deployments
- Advanced features
- Integration expansion

### Trigger Contextual Upsells

**For light users:**
- Stay on entry-level tools
- Self-service resources
- Community support

**For scaling users:**
- Prompt with advanced features
- Offer higher-tier options
- Infrastructure scaling tools
- Priority support

**For enterprise:**
- Custom solutions
- Dedicated support
- Advanced security
- SLA guarantees

## Results

- Upsells feel like **timely solutions**, not pushy sales
- Higher **conversion rates** on upgrades
- Better **customer satisfaction**
- More **predictable revenue**

## Key Lessons

1. Combine ICP data with product usage
2. Trigger upsells at the right moment
3. Make upsells feel helpful, not salesy
4. Segment experiences by need level

Source: [Mutiny Playbooks](https://www.mutinyhq.com/playbooks/never-miss-an-upsell-with-real-time-product-signals)`
};
