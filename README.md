# ChartForge MCP Server

**Generate McKinsey & Financial Times–caliber charts, diagrams, and 13 editorial SVG templates directly inside Claude Desktop, Cursor, Windsurf, or any MCP client.**

Powered by [ChartForge](https://chartforgeai.com) — turn plain English, CSV, or JSON into crisp **2× Retina PNG, vector SVG, PDF, and standalone HTML** charts in ~15 seconds.

| Sankey Flow (`pillar-cadence`) | Waffle Matrix (`point-compass`) |
|---|---|
| ![Sankey Flow](https://chartforgeai.com/samples/charter/pillar-cadence.png) | ![Waffle Matrix](https://chartforgeai.com/samples/charter/point-compass.png) |

| Stacked Pillars (`stacked-pillars`) | World Choropleth (`atlas-tiers`) |
|---|---|
| ![Stacked Pillars](https://chartforgeai.com/samples/charter/stacked-pillars.png) | ![Atlas Tiers](https://chartforgeai.com/samples/charter/atlas-tiers.png) |

---

## Quick Setup

### Option A — Remote Streamable HTTP MCP (Zero Install)
Point any Streamable HTTP MCP client directly to:
```
https://chartforgeai.com/api/mcp
```

### Option B — Local Stdio MCP (`npx`)
Add to your Claude Desktop (`claude_desktop_config.json`) or Cursor MCP config:
```json
{
  "mcpServers": {
    "chartforge": {
      "command": "npx",
      "args": ["-y", "chartforge-mcp"],
      "env": {
        "CHARTFORGE_API_KEY": ""
      }
    }
  }
}
```
> Leave `CHARTFORGE_API_KEY` blank for **7 free preview charts/day**. Subscribe at [chartforgeai.com/pricing](https://chartforgeai.com/pricing) (`Starter $35/mo` · `Pro $69/mo` · `Ultra $149/mo`) for 50–500 watermark-free charts/day, SVG/PDF export, and API keys.

---

## Available Tools

* **`list_templates`** — Lists all **13 primary editorial templates** and **6 color themes**.
* **`generate_chart`** — Generates a 2× Retina chart from `prompt`, optional `templateId`, `themePreset`, and raw `csvData` (CSV or JSON).
* **`refine_chart`** — Applies surgical finishing touches (`chartId`, `modification`) while preserving exact layout geometry.
* **`list_styles`** — Lists freeform visual styles (`corporate`, `light`, `minimal`, `frost`, `ember`, `midnight`, `neon`).

### All 13 Primary Editorial Templates (`templateId`)
1. `stacked-ledger` — Ranked horizontal stacked bars + YoY delta column ([Try live](https://chartforgeai.com/templates/mckinsey-stacked-bar-chart))
2. `stacked-pillars` — 100% stacked vertical columns + total bracket ([Try live](https://chartforgeai.com/templates/100-percent-stacked-column-chart))
3. `pillar-cadence` — Executive two-stage Sankey / alluvial flow diagram ([Try live](https://chartforgeai.com/templates/sankey-diagram-generator))
4. `point-compass` — Multi-panel 10×10 dot waffle matrix ([Try live](https://chartforgeai.com/templates/waffle-chart-maker))
5. `dot-parade` — Packed dot-cluster timeline (Observed vs. Forecast) ([Try live](https://chartforgeai.com/templates/dot-cluster-timeline-maker))
6. `bubble-orbit` — Circular radial proportional bubble ring ([Try live](https://chartforgeai.com/templates/radial-bubble-chart-maker))
7. `bubble-compass` — 4-quadrant bubble scatter matrix ([Try live](https://chartforgeai.com/templates/quadrant-bubble-chart-maker))
8. `layered-curves` — 100% stacked area transition + circular CAGR badges ([Try live](https://chartforgeai.com/templates/stacked-area-cagr-chart))
9. `chart-mosaic` — Multi-series executive trend lines ([Try live](https://chartforgeai.com/templates/multi-line-trend-chart-maker))
10. `line-cadence` — Annotated step-line event timeline ([Try live](https://chartforgeai.com/templates/annotated-event-timeline-chart))
11. `atlas-tiers` — 190-country 3-tier world choropleth ([Try live](https://chartforgeai.com/templates/world-choropleth-map-maker))
12. `atlas-mosaic` — Bilateral flow network bubble map ([Try live](https://chartforgeai.com/templates/bilateral-flow-network-map))
13. `bar-cadence` — US county diverging choropleth atlas ([Try live](https://chartforgeai.com/templates/us-county-choropleth-map-maker))

### 6 Color Theme Presets (`themePreset`)
`executive-navy` · `emerald-slate` · `editorial-burgundy` · `amber-charcoal` · `indigo-violet` · `midnight-dark`

---

## Links
* **Web Studio & 1-Click Sample CSVs:** [chartforgeai.com](https://chartforgeai.com)
* **Free AI Vision Chart Audit (Upload Any Slide Screenshot):** [chartforgeai.com/audit](https://chartforgeai.com/audit)
* **Think-cell & Legacy Tool Comparisons:** [chartforgeai.com/alternatives/think-cell-alternative](https://chartforgeai.com/alternatives/think-cell-alternative)
* **OpenAPI 3.1 Spec (ChatGPT Actions):** [chartforgeai.com/openapi.yaml](https://chartforgeai.com/openapi.yaml)
