import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Shield,
  Sliders,
  Zap,
  Sparkles,
  Circle,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { BrandGuidelines } from "../app/api/analyze-brand/route";

interface Issue {
  category: string;
  description: string;
  status: "PASS" | "WARNING" | "FAIL";
  recommendation: string;
}

interface BrandAuditResult {
  overallScore: number;
  visualMetrics: {
    accessibility: number;
    colorConsistency: number;
    typography: number;
  };
  summary: string;
  issues: Issue[];
}

const ComplianceCard: React.FC<{ issue: Issue }> = ({ issue }) => {
  const getStatusColor = () => {
    switch (issue.status) {
      case "PASS":
        return "bg-emerald-50 border-emerald-200 text-emerald-800";
      case "WARNING":
        return "bg-amber-50 border-amber-200 text-amber-800";
      case "FAIL":
        return "bg-rose-50 border-rose-200 text-rose-800";
    }
  };

  const getStatusIcon = () => {
    switch (issue.status) {
      case "PASS":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "FAIL":
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (issue.status) {
      case "PASS":
        return "bg-emerald-100 text-emerald-700";
      case "WARNING":
        return "bg-amber-100 text-amber-700";
      case "FAIL":
        return "bg-rose-100 text-rose-700";
    }
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <h4 className="font-bold text-base">{issue.category}</h4>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge()}`}
        >
          {issue.status}
        </span>
      </div>
      <p className="text-sm mb-4 opacity-90">{issue.description}</p>
      <div className="bg-white/60 rounded-xl p-4 border border-white/40">
        <p className="text-xs font-bold mb-2 opacity-60 uppercase tracking-wider">
          Recommendation
        </p>
        <p className="text-sm font-medium">{issue.recommendation}</p>
      </div>
    </div>
  );
};

export default function BrandComplianceTab() {
  const [guidelines, setGuidelines] = useState<BrandGuidelines>({
    brandOverview: "sdfsf",
    missionVisionValues: "dsdsd",
    brandNarrative: "dsds",
    colorPalette: ["#4F46E5", "#1E293B"],
    typographyFonts: ["Inter", "system-ui"],
    toneOfVoice: "Professional, tech-savvy, and trustworthy.",
    logoGuidelines:
      "Logo must have 20px padding and should never be stretched.",
  });

  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<BrandAuditResult | null>(null);

  // Dummy data
  const dummyResult: BrandAuditResult = {
    overallScore: 73,
    visualMetrics: {
      accessibility: 85,
      colorConsistency: 68,
      typography: 66,
    },
    summary:
      "The page demonstrates strong accessibility practices and maintains proper header hierarchy. However, color consistency issues were detected with unauthorized use of #ff0000 in the CTA button, and typography deviates from brand standards with Comic Sans MS usage. Logo padding requirements are not met.",
    issues: [
      {
        category: "Unauthorized Color Usage",
        description:
          "Button element uses #ff0000 which is not part of the approved brand color palette (#4F46E5, #1E293B).",
        status: "FAIL",
        recommendation:
          "Replace button background color with primary brand color #4F46E5 to maintain brand consistency.",
      },
      {
        category: "Non-Compliant Typography",
        description:
          "Button text uses 'Comic Sans MS' font family instead of approved 'Inter' or 'system-ui'.",
        status: "FAIL",
        recommendation:
          "Update font-family CSS property to use 'Inter' as the primary typeface for all UI elements.",
      },
      {
        category: "Logo Padding Violation",
        description:
          "Logo image does not meet the required 20px padding specification in the header.",
        status: "WARNING",
        recommendation:
          "Add appropriate padding around the logo element to ensure breathing room and brand guideline compliance.",
      },
      {
        category: "Heading Structure",
        description:
          "Proper semantic HTML heading tags (h1) are used correctly for page hierarchy.",
        status: "PASS",
        recommendation:
          "Continue using semantic HTML structure for improved accessibility and SEO.",
      },
      {
        category: "Color Contrast",
        description:
          "Text color #1E293B on white background meets WCAG AA accessibility standards.",
        status: "PASS",
        recommendation:
          "Maintain current contrast ratios for optimal readability.",
      },
    ],
  };

  const updateGuideline = (
    field: keyof BrandGuidelines,
    value: string | string[]
  ) => {
    setGuidelines((prev) => ({ ...prev, [field]: value }));
  };

  const handleAudit = async () => {
    setLoading(true);
    setAuditResult(null);

    console.log(guidelines, "gggggggggggggggggg");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setAuditResult(dummyResult);
    setLoading(false);
  };

  const chartData = auditResult
    ? [
        {
          name: "Accessibility",
          value: auditResult.visualMetrics.accessibility,
        },
        { name: "Colors", value: auditResult.visualMetrics.colorConsistency },
        { name: "Typography", value: auditResult.visualMetrics.typography },
      ]
    : [];

  const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                  Brand Definition
                </h3>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                  Brand Overview
                </label>
                <textarea
                  rows={3}
                  value={guidelines.brandOverview}
                  onChange={(e) =>
                    updateGuideline("brandOverview", e.target.value)
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                  Mission, Vision and Values
                </label>
                <textarea
                  rows={3}
                  value={guidelines.missionVisionValues}
                  onChange={(e) =>
                    updateGuideline("missionVisionValues", e.target.value)
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                  Brand Narrative
                </label>
                <textarea
                  rows={3}
                  value={guidelines.brandNarrative}
                  onChange={(e) =>
                    updateGuideline("brandNarrative", e.target.value)
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                  Tone of Voice
                </label>
                <textarea
                  rows={3}
                  value={guidelines.toneOfVoice}
                  onChange={(e) =>
                    updateGuideline("toneOfVoice", e.target.value)
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                    Primary Colors
                  </label>
                  <input
                    type="text"
                    value={guidelines.colorPalette.join(", ")}
                    onChange={(e) =>
                      updateGuideline(
                        "colorPalette",
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                    Font Families
                  </label>
                  <input
                    type="text"
                    value={guidelines.typographyFonts.join(", ")}
                    onChange={(e) =>
                      updateGuideline(
                        "typographyFonts",
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">
                    Logo Guidelines
                  </label>
                  <textarea
                    rows={3}
                    value={guidelines.logoGuidelines}
                    onChange={(e) =>
                      updateGuideline("logoGuidelines", e.target.value)
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleAudit}
                disabled={loading}
                className={`w-full mt-8 py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Fetching Sitecore Content...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Run Compliance Audit
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-400 p-6 rounded-3xl border border-slate-800">
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">
                Pipeline Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span>Pages API Endpoint</span>
                  <span className="text-emerald-500 font-mono">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Audit Depth</span>
                  <span className="text-indigo-400">Structural + Copy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            {!auditResult && !loading && (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white p-12 text-center group">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Audit Desk Ready
                </h3>
                <p className="max-w-md text-slate-500">
                  Configure your brand guidelines on the left. Once triggered,
                  the engine will fetch the live DOM from Sitecore and evaluate
                  against your rules.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-spin border-t-indigo-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-xl font-bold text-slate-800 mb-2">
                  Analyzing Visual Integrity
                </p>
                <p className="text-slate-400 text-sm animate-pulse">
                  Scanning DOM trees and evaluating brand tone...
                </p>
              </div>
            )}

            {auditResult && !loading && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Score Widget */}
                  <div className="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <CheckCircle className="w-24 h-24" />
                    </div>
                    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="transparent"
                          stroke="#f1f5f9"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="transparent"
                          stroke={
                            auditResult.overallScore > 80
                              ? "#10b981"
                              : auditResult.overallScore > 60
                              ? "#f59e0b"
                              : "#ef4444"
                          }
                          strokeWidth="12"
                          strokeDasharray={351.8}
                          strokeDashoffset={
                            351.8 - (351.8 * auditResult.overallScore) / 100
                          }
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="text-4xl font-black text-slate-800 tracking-tighter">
                        {auditResult.overallScore}%
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Compliance Score
                    </p>
                  </div>

                  {/* Metrics Bar Chart */}
                  <div className="md:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase mb-8 tracking-[0.2em]">
                      Dimension Breakdown
                    </h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                          <XAxis type="number" hide domain={[0, 100]} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={100}
                            tick={{
                              fontSize: 11,
                              fontWeight: 800,
                              fill: "#64748b",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: "#f8fafc" }}
                            contentStyle={{
                              borderRadius: "16px",
                              border: "none",
                              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                              fontWeight: "bold",
                            }}
                          />
                          <Bar
                            dataKey="value"
                            radius={[0, 10, 10, 0]}
                            barSize={20}
                          >
                            {chartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-100">
                      Audit Narrative
                    </h3>
                  </div>
                  <p className="text-lg font-medium leading-relaxed">
                    {auditResult.summary}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Compliance Findings
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        {
                          auditResult.issues.filter((i) => i.status === "FAIL")
                            .length
                        }{" "}
                        Critical
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        {
                          auditResult.issues.filter(
                            (i) => i.status === "WARNING"
                          ).length
                        }{" "}
                        Warnings
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {auditResult.issues.map((issue, idx) => (
                      <ComplianceCard key={idx} issue={issue} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
