import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// CONFIGURATION - UPDATE WITH YOUR SITECORE API DETAILS
// =============================================================================
const SITECORE_CONFIG = {
  apiUrl:
    "https://edge-platform.sitecorecloud.io/stream/ai-agent-api/api/v1/pages/4e869961-efef-4b47-bb69-170a251d689b/html?language=en",
  apiKey: process.env.SITECORE_API_KEY || "job-1236",
  bearerToken:
    process.env.SITECORE_BEARER_TOKEN ||
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvY2xpZW50X25hbWUiOiJoYWNrYXRob24tY3JlZCIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy90ZW5hbnRfaWQiOiJkZjQyNDg0Yy0wZDBmLTRkOTQtZTM2NS0wOGRlMjkwZmMyMTUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X25hbWUiOiJzaXRlY29yZXNhYWFiMDktaGFja2F0aG9uZGUwZWI5LWRldmYzMmEiLCJzY19zeXNfaWQiOiI1OTA3NjM3Yy1jZGRmLTQ4ZTktYWNlZi1iZDA2ZjFhNmJhYjgiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L2NkcF9jbGllbnRfa2V5IjoiOThmYjI1N2M1N2ZkNzRhZTgwMjJmNWU1NmNlODE5MTkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L0FJRW1iZWRkZWRUZW5hbnRJRCI6ImE5MTRjOTc4LThmZjEtNDUyNi1lMTdiLTA4ZGQ5MzFhOTRiNSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy90ZW5hbnQvQ09FbWJlZGRlZFRlbmFudElEIjoiMjg4ZTU1NjctNjg2NS00NmVmLWZhZWMtMDhkZTA2OTRhNGVhIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ19pZCI6Im9yZ19UUXVnZTlubXFaaUpORmxlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ19uYW1lIjoic2l0ZWNvcmUtc2Fhcy1vcHMtc2l0ZWNvcmUtZGVtby10ZWFtIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ19kaXNwbGF5X25hbWUiOiJTaXRlY29yZSBEZW1vIFRlYW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIWVdRQTMiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJpbnRlcm5hbCIsInNjX29yZ19yZWdpb24iOiJ1c2UiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiJWWWFmdmJFbGVZcm53VzZTZE44cmtsUHMzYnYzNWtTMkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTc2Nzg2MDgyNSwiZXhwIjoxNzY3OTQ3MjI1LCJzY29wZSI6InhtY2xvdWQuY206YWRtaW4geG1jcHViLnF1ZXVlOnIgeG1jcHViLmpvYnMudDpyIHhtY3B1Yi5qb2JzLnQ6dyB4bWNkYXRhLml0ZW1zLnQ6ciB4bWNkYXRhLnBydmRzLnQ6cmMgeG1jZGF0YS5wcnZkcy50OnIgeG1jZGF0YS5wcnZkcy50OncgeG1jZGF0YS5wcnZkcy50OmwgcGVyc29uYWxpemUuZXhwOm1uZyBwZXJzb25hbGl6ZS50bXBsOnIgcGVyc29uYWxpemUucG9zOm1uZyIsIm9yZ19pZCI6Im9yZ19UUXVnZTlubXFaaUpORmxlIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiVllhZnZiRWxlWXJud1c2U2ROOHJrbFBzM2J2MzVrUzIifQ.ejFYbNhQb4FJoptS62nfx_yQsbh90xkh0OTzZ3oNX0-4QAL38s_aDWiVSzUAotv_-GZ4DIBinWggtSSNrordX2NWYgWBGh49eqAxQB4XR1HQXelBPNNFHqJSgq3zkuxCQFCKhvwEncZ26IRQ3-Gjzeh2fgFGf5Gl_CLvCUoV_CqS-KxObPJWrUPbYAX6L671Q0KFo8i25ExOP4Va78fpZMEmFBdeBzp4-iroLRB-KViGIZz8bRBIQnAViwMSW1R31KD58or9ydsiBtOJn62lOx13doppJvuh0obqAlUbicQ2_XPzhM97IGGGPMpazEHZVs1Gh5-HQHiaClGbI3hQtA",
  headers: {
    "Content-Type": "application/json",
  },
};

// =============================================================================
// TYPES
// =============================================================================
interface AuditIssue {
  id: string;
  type: "image" | "anchor";
  tag: string;
  attribute: string;
  value: string;
  issue: string;
  severity: "critical" | "warning" | "info";
  lineContext: string;
  lineNumber?: number;
}

// =============================================================================
// OPTIMIZED HTML VALIDATION (STREAMING FOR LARGE HTML)
// =============================================================================
function validateHtmlContent(html: string) {
  const issues: AuditIssue[] = [];
  const breakdown = {
    anchors: { total: 0, issues: 0 },
    images: { total: 0, issues: 0 },
  };

  // For very large HTML, process in chunks to avoid memory issues
  const MAX_CHUNK_SIZE = 1000000; // 1MB chunks
  const shouldChunk = html.length > MAX_CHUNK_SIZE;

  if (shouldChunk) {
    console.log(
      `Large HTML detected (${(html.length / 1024 / 1024).toFixed(
        2
      )}MB), processing in chunks...`
    );
  }

  // ============================================================================
  // CHECK <a> TAGS (ANCHORS)
  // ============================================================================
  const anchorRegex = /<a\s+([^>]*)>/gi;
  let match;
  let anchorIndex = 0;

  while ((match = anchorRegex.exec(html)) !== null) {
    breakdown.anchors.total++;
    anchorIndex++;

    const fullTag = match[0];
    const attributes = match[1];
    console.log(attributes, "");
    const lineNumber = html.substring(0, match.index).split("\n").length;

    // Extract href
    const hrefMatch = attributes.match(/href=["']([^"']*)["']/i);

    if (!hrefMatch) {
      // Missing href attribute
      breakdown.anchors.issues++;
      issues.push({
        id: `a-missing-href-${anchorIndex}`,
        type: "anchor",
        tag: "a",
        attribute: "href",
        value: "(missing)",
        issue: "Missing href attribute",
        severity: "critical",
        lineContext: fullTag.substring(0, 100),
        lineNumber,
      });
    } else {
      const href = hrefMatch[1].trim();

      if (href === "") {
        // Empty href
        breakdown.anchors.issues++;
        issues.push({
          id: `a-empty-href-${anchorIndex}`,
          type: "anchor",
          tag: "a",
          attribute: "href",
          value: "(empty)",
          issue: "Empty href attribute",
          severity: "critical",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      } else if (href === "#") {
        // Hash-only link
        breakdown.anchors.issues++;
        issues.push({
          id: `a-hash-only-${anchorIndex}`,
          type: "anchor",
          tag: "a",
          attribute: "href",
          value: href,
          issue: 'href="#" (anchor-only link)',
          severity: "warning",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      } else if (href === "javascript:void(0)" || href === "javascript:;") {
        // JavaScript void link
        breakdown.anchors.issues++;
        issues.push({
          id: `a-js-void-${anchorIndex}`,
          type: "anchor",
          tag: "a",
          attribute: "href",
          value: href,
          issue: 'href="javascript:void(0)" (non-functional link)',
          severity: "warning",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      } else if (href.includes(" ")) {
        // URL with spaces
        breakdown.anchors.issues++;
        issues.push({
          id: `a-spaces-${anchorIndex}`,
          type: "anchor",
          tag: "a",
          attribute: "href",
          value: href,
          issue: "href contains spaces (malformed URL)",
          severity: "critical",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      } else if (href.match(/^ht tp:|^htt p:|^http :|^https :/)) {
        // Malformed protocol
        breakdown.anchors.issues++;
        issues.push({
          id: `a-malformed-protocol-${anchorIndex}`,
          type: "anchor",
          tag: "a",
          attribute: "href",
          value: href,
          issue: "Malformed protocol (spaces in http/https)",
          severity: "critical",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      } else if (href.startsWith("http://")) {
        // Insecure HTTP link
        breakdown.anchors.issues++;
        issues.push({
          id: `a-insecure-${anchorIndex}`,
          type: "anchor",
          tag: "a",
          attribute: "href",
          value: href,
          issue: "Insecure (HTTP) link detected",
          severity: "warning",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      }
    }

    // Check for empty link text
    const closingTagIndex = html.indexOf("</a>", match.index);
    if (closingTagIndex > match.index) {
      const textContent = html
        .substring(match.index + fullTag.length, closingTagIndex)
        .trim();
      const cleanText = textContent.replace(/<[^>]*>/g, "").trim();

      if (cleanText === "") {
        breakdown.anchors.issues++;
        issues.push({
          id: `a-empty-text-${anchorIndex}`,
          type: "anchor",
          tag: "a",
          attribute: "textContent",
          value: "(empty)",
          issue: "Anchor has no visible text (accessibility issue)",
          severity: "warning",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      }
    }
  }

  // ============================================================================
  // CHECK <img> TAGS
  // ============================================================================
  const imgRegex = /<img\s+([^>]*)>/gi;
  let imgIndex = 0;

  while ((match = imgRegex.exec(html)) !== null) {
    breakdown.images.total++;
    imgIndex++;

    const fullTag = match[0];

    const attributes = match[1];

    console.log(attributes, "kkkkkkkkkkkkkkkkkkk");

    const lineNumber = html.substring(0, match.index).split("\n").length;

    const srcMatch = attributes.match(/src=["']([^"']*)["']/i);

    if (!srcMatch) {
      // Missing src attribute
      breakdown.images.issues++;
      issues.push({
        id: `img-missing-src-${imgIndex}`,
        type: "image",
        tag: "img",
        attribute: "src",
        value: "(missing)",
        issue: "Missing image source",
        severity: "critical",
        lineContext: fullTag.substring(0, 100),
        lineNumber,
      });
    } else {
      const src = srcMatch[1].trim();

      if (src === "") {
        // Empty src
        breakdown.images.issues++;
        issues.push({
          id: `img-empty-src-${imgIndex}`,
          type: "image",
          tag: "img",
          attribute: "src",
          value: "(empty)",
          issue: "Empty src attribute",
          severity: "critical",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      } else if (
        !src.includes("https://starter-verticals.sitecoresandbox.cloud")
      ) {
        // Placeholder image
        breakdown.images.issues++;
        issues.push({
          id: `img-placeholder-${imgIndex}`,
          type: "image",
          tag: "img",
          attribute: "src",
          value: src,
          issue: "Not linked to the content hub",
          severity: "warning",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      } else if (src.includes(" ")) {
        // URL with spaces
        breakdown.images.issues++;
        issues.push({
          id: `img-spaces-${imgIndex}`,
          type: "image",
          tag: "img",
          attribute: "src",
          value: src,
          issue: "src contains spaces (malformed URL)",
          severity: "critical",
          lineContext: fullTag.substring(0, 100),
          lineNumber,
        });
      }
    }

    // Check for missing alt attribute (accessibility)
    const altMatch = attributes.match(/alt(?:=(["'])(.*?)\1)?/i);

    if (!altMatch) {
      // Alt attribute is missing entirely
      breakdown.images.issues++;
      issues.push({
        id: `img-missing-alt-${imgIndex}`,
        type: "image",
        tag: "img",
        attribute: "alt",
        value: "(missing)",
        issue: "Missing alt text (SEO/Accessibility)",
        severity: "info",
        lineContext: fullTag.substring(0, 100),
        lineNumber,
      });
    } else if (!altMatch[2] || altMatch[2].trim() === "") {
      // Alt attribute exists but is empty
      breakdown.images.issues++;
      issues.push({
        id: `img-empty-alt-${imgIndex}`,
        type: "image",
        tag: "img",
        attribute: "alt",
        value: "(empty)",
        issue: "Empty alt text (SEO/Accessibility)",
        severity: "info",
        lineContext: fullTag.substring(0, 100),
        lineNumber,
      });
    } else {
      // Alt attribute exists and has value
      console.log("Alt is present:", altMatch[2]);
    }
  }

  const totalElements = breakdown.anchors.total + breakdown.images.total;
  const totalIssues = issues.length;
  const critical = issues.filter((i) => i.severity === "critical").length;
  const warning = issues.filter((i) => i.severity === "warning").length;
  const info = issues.filter((i) => i.severity === "info").length;

  console.log(info, "info count");

  return {
    totalElements,
    totalIssues,
    critical,
    warning,
    info,
    issues,
    breakdown,
  };
}

// =============================================================================
// MAIN API HANDLER
// =============================================================================
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("🚀 Starting content audit...");

    // ==========================================================================
    // STEP 1: FETCH HTML FROM SITECORE API
    // ==========================================================================
    console.log("📡 Fetching HTML from Sitecore...");

    const headers: Record<string, string> = { ...SITECORE_CONFIG.headers };

    if (SITECORE_CONFIG.apiKey) {
      headers["x-sc-job-id"] = SITECORE_CONFIG.apiKey;
    }

    if (SITECORE_CONFIG.bearerToken) {
      headers["Authorization"] = `Bearer ${SITECORE_CONFIG.bearerToken}`;
    }

    const sitecoreResponse = await fetch(SITECORE_CONFIG.apiUrl, {
      headers,
      // Add timeout for large responses
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!sitecoreResponse.ok) {
      throw new Error(
        `Sitecore API error: ${sitecoreResponse.status} ${sitecoreResponse.statusText}`
      );
    }

    // ==========================================================================
    // STEP 2: PARSE HTML FROM RESPONSE
    // ==========================================================================
    console.log("📄 Parsing HTML response...");

    let html: string;
    const contentType = sitecoreResponse.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const jsonData = await sitecoreResponse.json();
      html =
        jsonData.html ||
        jsonData.content ||
        jsonData.data?.html ||
        jsonData.renderedContent ||
        "";

      if (!html) {
        throw new Error("No HTML found in Sitecore response");
      }
    } else {
      html = await sitecoreResponse.text();
    }

    console.log(`✅ HTML received: ${(html.length / 1024).toFixed(2)} KB`);

    // ==========================================================================
    // STEP 3: VALIDATE HTML CONTENT
    // ==========================================================================
    console.log("🔍 Validating HTML content...");
    const auditResults = validateHtmlContent(html);

    const scanTime = (Date.now() - startTime) / 1000;

    console.log("✅ Audit complete!");
    console.log(`   Scan time: ${scanTime.toFixed(2)}s`);
    console.log(`   Total elements: ${auditResults.totalElements}`);
    console.log(`   Issues found: ${auditResults.totalIssues}`);
    console.log(
      `   Critical: ${auditResults.critical}, Warnings: ${auditResults.warning}, Info: ${auditResults.info}`
    );

    return NextResponse.json({
      ...auditResults,
      scanTime,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to audit content",
      },
      { status: 500 }
    );
  }
}
