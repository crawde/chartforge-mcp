# ChartForge MCP Server

Generate stunning, publication-quality charts and diagrams from natural language — directly inside Claude.

## Setup

### Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "chartforge": {
      "command": "npx",
      "args": ["chartforge-mcp"],
      "env": {
        "CHARTFORGE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CHARTFORGE_API_KEY` | Yes | Your API key from [chartforgeai.com](https://chartforgeai.com) |
| `CHARTFORGE_API_URL` | No | Custom API URL (default: `https://chartforgeai.com`) |

## Tools

### `generate_chart`
Generate a chart from a natural language description.

**Parameters:**
- `prompt` (required): Description of the chart
- `style` (optional): Style preset — `midnight`, `frost`, `ember`, `minimal`, `corporate`, `neon`, `light`
- `width` (optional): Width in pixels (default: 1200)
- `height` (optional): Height in pixels (default: 800)

### `refine_chart`
Modify a previously generated chart.

**Parameters:**
- `chartId` (required): Chart ID from a previous generation
- `modification` (required): What to change

### `list_styles`
List available style presets with descriptions.

## Examples

> "Create a bar chart showing quarterly revenue from $2M to $18M over 3 years"

> "System architecture diagram for a microservices backend"

> "Sankey diagram of marketing budget flow through channels to conversions"
