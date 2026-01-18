# OptiCore: AI-Powered Content Intelligence for Sitecore

**OptiCore** is a cutting-edge Sitecore Marketplace application designed to revolutionize content management through the power of Artificial Intelligence. By integrating seamlessly into the Sitecore ecosystem, OptiCore empowers content editors and marketers with real-time, intelligent insights to ensure content is optimized, compliant, and impactful.

## Key Features

OptiCore brings together four powerful AI-driven capabilities into a single, cohesive interface:

### 1. Automated SEO (AI-Powered)

Stop guessing with your SEO strategy. OptiCore analyzes your page content in real-time to maximize search engine visibility.

- **Deep Analysis:** Evaluates Title Tags, Meta Descriptions, Open Graph (OG) Tags, and Keywords against modern best practices.
- **Smart Suggestions:** Uses Generative AI to provide context-aware recommendations for fixing issues (e.g., rewriting a meta description to improve click-through rates).
- **Health Scoring:** Provides a clear visual "Status" (Pass, Warning, Fail) and an overall SEO score.

### 2. Link Healer (Broken Link Detection)

Maintain a pristine user experience by automatically detecting and surfacing dead ends before your users do.

- **Comprehensive Scanning:** Scans the rendered HTML structure for broken anchor links and missing image resources.
- **Severity Categorization:** Categorizes issues by severity (Critical, Warning, Info) to help prioritize fixes.
- **Quality Metrics:** Calculates a page connectivity quality score to track improvement over time.

### 3. Brand Guardian (Compliance Analysis)

Ensure every piece of content speaks with your brand's unique voice and adheres to corporate standards.

- **AI Tonal Analysis:** Leverages AI to read your page content and compare it against your specific **Brand Guidelines** (Voice, Tone, Mission, and Values).
- **Narrative & Structure:** Checks for narrative alignment and structural integrity to ensure consistency across the site.
- **Actionable Feedback:** Highlights specific areas where content deviates from brand standards and offers recommendations for alignment.

### 4. Content Hub Bridge (AI Content Generation)

Accelerate your creative workflow by generating on-brand assets without leaving the Sitecore environment.

- **Generative AI:** Simply describe your vision, and OptiCore's AI generates high-quality visual assets.
- **Context Awareness:** Generates assets that respect defined Brand definitions and aesthetics.
- **Seamless Integration:** Direct integration with **Sitecore Content Hub** allows you to upload and manage generated assets instantly.

## Technology Stack

- **Sitecore Marketplace SDK:** Deep integration with Sitecore Pages and Application context.
- **Generative AI:** Powering the intelligent analysis, suggestions, and content creation.
- **Next.js & React:** Delivering a responsive, tab-based user interface.
- **Tailwind CSS / Shadcn UI:** For a modern and accessible component design.

## Getting Started

### Prerequisites

- Sitecore XM Cloud environment.
- Access to Sitecore Marketplace.
- API Keys for configured AI services.

### Installation

1. **Clone the Repository:**
   `git clone <repository-url>
`

2. **Install Dependencies:**
   `npm install
`

3. **Run Development Server:**
   `npm run dev
`

4. **Integration:**

   Configure your app in the Sitecore App Studio to connect it with your XM Cloud environment:
   - **Create the App:**
     Navigate to the **App Studio** tab in the Sitecore Cloud Portal and create a new application.

   - **Configure Extension Point:**
     Open your newly created app and select the **Extension points** tab. Enable the **Pages Context Panel** extension point and set the **Route URL** to `/opticore`.

   - **Set Deployment URL:**
     In the **Deployment URL** field, enter the URL where your app is running.
     - For local development: `http://localhost:3000`
     - For production: Enter your publicly hosted application URL (e.g., Vercel, Netlify).

   For more detailed guidance, refer to the official [Sitecore Marketplace documentation](https://doc.sitecore.com/mp/en/developers/marketplace/introduction-to-sitecore-marketplace.html).
