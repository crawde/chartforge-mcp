#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = process.env.CHARTFORGE_API_URL || "https://chartforgeai.com";
const API_KEY = process.env.CHARTFORGE_API_KEY || "";

const TEMPLATE_IDS = [
  "stacked-ledger",
  "stacked-pillars",
  "pillar-cadence",
  "point-compass",
  "dot-parade",
  "bubble-orbit",
  "bubble-compass",
  "layered-curves",
  "chart-mosaic",
  "line-cadence",
  "atlas-tiers",
  "atlas-mosaic",
  "bar-cadence",
] as const;

const THEME_IDS = [
  "executive-navy",
  "emerald-slate",
  "editorial-burgundy",
  "amber-charcoal",
  "indigo-violet",
  "midnight-dark",
] as const;

const server = new McpServer({
  name: "chartforge",
  version: "0.1.5",
});

server.tool(
  "generate_chart",
  "Generate a publication-quality 2x retina chart or diagram from plain English, CSV/JSON data, or one of 13 editorial templates (Sankey, Waffle Matrix, Stacked Ledger, Stacked Pillars, Bubble Orbit, World/US Choropleths, Layered Curves, and more). Returns a PNG image.",
  {
    prompt: z
      .string()
      .optional()
      .describe(
        "Description of the chart or diagram to generate (or customization notes when using templateId)."
      ),
    templateId: z
      .enum(TEMPLATE_IDS)
      .optional()
      .describe(
        "Optional primary editorial template ID (call list_templates to see all 13 templates)."
      ),
    themePreset: z
      .enum(THEME_IDS)
      .optional()
      .describe("Color theme preset when using templateId. Default: executive-navy."),
    csvData: z
      .string()
      .optional()
      .describe("Optional CSV or JSON dataset for ChartForge to map accurately into the chart."),
    style: z
      .enum(["corporate", "light", "minimal", "frost", "ember", "midnight", "neon"])
      .optional()
      .describe("Visual style preset for freeform charts. Default: corporate (clean light)."),
    width: z.number().optional().describe("Width in pixels. Default: 1200"),
    height: z.number().optional().describe("Height in pixels. Default: 800"),
  },
  async ({ prompt, templateId, themePreset, csvData, style, width, height }) => {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ChartForge-Client": "mcp",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({ prompt, templateId, themePreset, csvData, style, width, height }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Request failed" }));
      const errMsg = error.error || res.statusText;
      const signupUrl = error.signupUrl || "https://chartforgeai.com/pricing";

      if (res.status === 402 || /limit/i.test(errMsg)) {
        return {
          content: [
            {
              type: "text",
              text: `${errMsg}\n\nSubscribe at ${signupUrl} (Starter $35/mo · Pro $69/mo · Ultra $149/mo) for 50–500 watermark-free charts/day, SVG/PDF exports, and API access.\nSetup: Add CHARTFORGE_API_KEY to your MCP config env vars.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [{ type: "text", text: `Error: ${errMsg}` }],
        isError: true,
      };
    }

    const data = await res.json();

    const content: Array<
      { type: "text"; text: string } | { type: "image"; data: string; mimeType: string }
    > = [
      {
        type: "image" as const,
        data: data.image,
        mimeType: "image/png",
      },
      {
        type: "text" as const,
        text: `Chart generated successfully. Chart ID: ${data.chartId} · View/export: https://chartforgeai.com/c/${data.chartId}`,
      },
    ];

    if (data.notice) {
      content.push({ type: "text" as const, text: data.notice });
    }

    return { content };
  }
);

server.tool(
  "refine_chart",
  "Apply finishing touches to an existing chart. Provide the chart ID from a previous generation and describe what to change.",
  {
    chartId: z.string().describe("The chart ID from a previous generate_chart call"),
    modification: z
      .string()
      .describe(
        "What to change about the chart, e.g. 'highlight top row in amber', 'enlarge labels', 'switch to midnight theme'"
      ),
  },
  async ({ chartId, modification }) => {
    const res = await fetch(`${API_BASE}/api/refine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ChartForge-Client": "mcp",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({ chartId, modification }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Request failed" }));
      return {
        content: [
          {
            type: "text",
            text:
              res.status === 402
                ? `${error.error || "Limit reached"}\n\nUpgrade at https://chartforgeai.com/pricing for unlimited watermark-free refinements.`
                : `Error: ${error.error || res.statusText}`,
          },
        ],
        isError: true,
      };
    }

    const data = await res.json();

    return {
      content: [
        {
          type: "image",
          data: data.image,
          mimeType: "image/png",
        },
        {
          type: "text",
          text: `Chart refined successfully. New Chart ID: ${data.chartId} · View/export: https://chartforgeai.com/c/${data.chartId}`,
        },
      ],
    };
  }
);

server.tool(
  "list_templates",
  "List all 13 primary editorial chart templates and 6 color theme presets.",
  {},
  async () => {
    const templates = [
      "stacked-ledger: Ranked horizontal stacked bars with totals & YoY delta column",
      "stacked-pillars: Seven 100% stacked vertical columns with direct inside labels",
      "pillar-cadence: Executive two-stage Sankey / alluvial flow diagram",
      "point-compass: Multi-panel 10x10 dot waffle matrix for exact percentages",
      "dot-parade: Packed dot-cluster timeline for observed vs. forecast milestones",
      "bubble-orbit: Circular radial bubble ring comparing proportional magnitudes",
      "bubble-compass: Four-quadrant bubble scatter with size legend & callouts",
      "layered-curves: 100% stacked area transition chart with circular CAGR badges",
      "chart-mosaic: Multi-series executive trend line chart with clean right legend",
      "line-cadence: Annotated step-line timeline with shaded event band & average line",
      "atlas-tiers: 3-tier world choropleth with hotspot pins & global average box",
      "atlas-mosaic: Proportional bilateral flow network map connecting regional hubs",
      "bar-cadence: High-detail US county choropleth with diverging top scale bar",
    ];
    return {
      content: [
        {
          type: "text",
          text: `Primary Templates:\n- ${templates.join("\n- ")}\n\nTheme Presets: ${THEME_IDS.join(", ")}`,
        },
      ],
    };
  }
);

server.tool(
  "list_styles",
  "List available freeform chart style presets with descriptions.",
  {},
  async () => {
    const styles = [
      { key: "corporate", desc: "Clean white boardroom-ready editorial default" },
      { key: "light", desc: "Pure white background, print-friendly" },
      { key: "minimal", desc: "Maximum whitespace, restrained editorial color" },
      { key: "frost", desc: "Cool ice-tinted canvas with cyan & steel accents" },
      { key: "ember", desc: "Warm ivory canvas with terracotta & crimson accents" },
      { key: "midnight", desc: "Dark obsidian canvas with luminous accents" },
      { key: "neon", desc: "Deep dark canvas with vivid cyan & violet highlights" },
    ];

    return {
      content: [
        {
          type: "text",
          text: styles.map((s) => `**${s.key}**: ${s.desc}`).join("\n"),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
