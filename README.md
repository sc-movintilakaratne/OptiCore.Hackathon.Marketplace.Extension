# OptiCore: AI-Powered Assistant for Sitecore AI

**OptiCore** is an innovative AI-powered solution designed to revolutionize how Sitecore Sales Engineers manage and maintain demo environments within XM Cloud. By automating tedious and time
consuming tasks, OptiCore allows engineers to focus on high-value selling activities, ultimately enhancing the 
demo experience for prospects and increasing sales conversion rates

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
- API Keys for configured AI services and Sitecore APIs.

### Installation

1. **Clone the Repository:**
   `git clone <repository-url>
`

2. **Install Dependencies:**
   `npm install
`

3. **Configure Environment Variables:**

- Before you run the project add all the env variables. Please follow below steps.

- Create a `.env` file in the root of the project.
- Copy the contents from .env.example or use the template below and replace the placeholder values with your actual credentials:
```bash
   # Google AI Key
   NEXT_PUBLIC_GEMINI_API_KEY=your_google_ai_api_key
   GEMINI_API_KEY=your_google_ai_api_key

   # Sitecore Content Hub Credentials
   CH_URL=https://your-instance.sitecoresandbox.cloud/en-us
   CH_CLIENT_ID=your_content_hub_client_id
   CH_CLIENT_SECRET=your_content_hub_client_secret

   # Basic Sitecore Auth Credentials
   NEXT_PUBLIC_SITECORE_CLIENT_ID=your_sitecore_client_id
   NEXT_PUBLIC_SITECORE_CLIENT_SECRET=your_sitecore_client_secret
   NEXT_PUBLIC_SITECORE_ENVIRONMENT_ID=dev
   NEXT_PUBLIC_TOKEN=your_sitecore_token
```  
There is a file called `.env.example`. You can use that template also. ⚠️ Do not commit the `.env` file. It contains sensitive credentials.

- You have to generate value for the `NEXT_PUBLIC_TOKEN` variable. For that run this command via bash terminal (include / replace your secrets)
```bash
curl -X POST 'https://auth.sitecorecloud.io/oauth/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \ 
  --data-urlencode 'client_id={YOUR_CLIENT_ID}' \
  --data-urlencode 'client_secret={YOUR_CLIENT_SECRET}' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'audience=https://api.sitecorecloud.io'
```

**Athentication Note:**
<br/>
OptiCore currently uses a JWT-based authentication approach for accessing Sitecore services. While the platform is capable of handling authentication internally via the Agent API, this method is not yet adopted in the current implementation. We plan to migrate to the Agent API in the near future to leverage built-in authentication handling and simplify credential management.

- You have to generate `NEXT_PUBLIC_SITECORE_CLIENT_ID` and `NEXT_PUBLIC_SITECORE_CLIENT_SECRET` before you generate `NEXT_PUBLIC_TOKEN` from the deploy portal.

```markdown
In the Sitecore Cloud Portal, open SitecoreAI Deploy.
Click `Credentials` > `Environment` > `Create credentials` > `Automation`.
Fill out the automation client details, then click Create.
Copy the client ID and the client secret because you won't be able to view them again in SitecoreAI Deploy. You'll use them to request a JWT.
```

After you generate `CLIENT_ID`, it will automatically generate `CLIENT_SECRET`.

Please refer [Agent API Documentation](https://api-docs.sitecore.com/ai-capabilities/agent-api/section/authorization/create-an-automation-client) for more information.

4. **Run Development Server:**
   `npm run dev
`

5. **Integration:**

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
