#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = process.env.CHARTFORGE_API_URL || "https://chartforgeai.com";
const API_KEY = process.env.CHARTFORGE_API_KEY || "";

const server = new McpServer({
  name: "chartforge",
  version: "0.1.1",
});

server.tool(
  "generate_chart",
  "Generate a stunning, publication-quality chart or diagram from a natural language description. Returns a PNG image.",
  {
    prompt: z.string().describe("Description of the chart or diagram to generate. Be specific about data, labels, and what you want to visualize."),
    style: z.enum(["midnight", "frost", "ember", "minimal", "corporate", "neon", "light"]).optional().describe("Visual style preset. Default: auto (AI chooses best style)."),
    width: z.number().optional().describe("Width in pixels. Default: 1200"),
    height: z.number().optional().describe("Height in pixels. Default: 800"),
  },
  async ({ prompt, style, width, height }) => {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({ prompt, style, width, height }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Request failed" }));
      return {
        content: [{ type: "text", text: `Error: ${error.error || res.statusText}` }],
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
          text: `Chart generated successfully. Chart ID: ${data.chartId}`,
        },
      ],
    };
  }
);

server.tool(
  "refine_chart",
  "Modify an existing chart. Provide the chart ID from a previous generation and describe what to change.",
  {
    chartId: z.string().describe("The chart ID from a previous generate_chart call"),
    modification: z.string().describe("What to change about the chart, e.g. 'make the bars blue', 'add a title', 'remove the legend'"),
  },
  async ({ chartId, modification }) => {
    const res = await fetch(`${API_BASE}/api/refine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({ chartId, modification }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Request failed" }));
      return {
        content: [{ type: "text", text: `Error: ${error.error || res.statusText}` }],
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
          text: `Chart refined successfully. New Chart ID: ${data.chartId}`,
        },
      ],
    };
  }
);

server.tool(
  "list_styles",
  "List available chart style presets with descriptions.",
  {},
  async () => {
    const styles = [
      { key: "midnight", desc: "Dark luxurious canvas with glowing accents" },
      { key: "frost", desc: "Cool blues and whites, icy feel" },
      { key: "ember", desc: "Warm ambers and crimsons" },
      { key: "minimal", desc: "Maximum whitespace, restrained color" },
      { key: "corporate", desc: "Clean professional, boardroom-ready" },
      { key: "neon", desc: "Cyberpunk, vivid glow effects" },
      { key: "light", desc: "White background, print-friendly" },
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
