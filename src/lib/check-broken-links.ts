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
export function validateHtmlContent(html: string) {
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
  // HELPER: Check if position is inside header or footer
  // ============================================================================
  function isInExcludedSection(position: number): boolean {
    // Find all header and footer sections
    const headerRegex = /<header\b[^>]*>[\s\S]*?<\/header>/gi;
    const footerRegex = /<footer\b[^>]*>[\s\S]*?<\/footer>/gi;

    // Check headers
    let match;
    headerRegex.lastIndex = 0;
    while ((match = headerRegex.exec(html)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (position >= start && position < end) {
        return true;
      }
    }

    // Check footers
    footerRegex.lastIndex = 0;
    while ((match = footerRegex.exec(html)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (position >= start && position < end) {
        return true;
      }
    }

    return false;
  }

  // ============================================================================
  // CHECK <a> TAGS (ANCHORS)
  // ============================================================================
  const anchorRegex = /<a\s+([^>]*)>/gi;
  let match;
  let anchorIndex = 0;

  while ((match = anchorRegex.exec(html)) !== null) {
    // Skip if inside header or footer
    if (isInExcludedSection(match.index)) {
      continue;
    }

    breakdown.anchors.total++;
    anchorIndex++;

    const fullTag = match[0];
    const attributes = match[1];
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
    // Skip if inside header or footer
    if (isInExcludedSection(match.index)) {
      continue;
    }

    breakdown.images.total++;
    imgIndex++;

    const fullTag = match[0];
    const attributes = match[1];
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
    }
  }

  const totalElements = breakdown.anchors.total + breakdown.images.total;
  const totalIssues = issues.length;
  const critical = issues.filter((i) => i.severity === "critical").length;
  const warning = issues.filter((i) => i.severity === "warning").length;
  const info = issues.filter((i) => i.severity === "info").length;

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
