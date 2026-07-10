---
name: electrical-engineer-dashboard
description: Guidelines, best practices, and domain knowledge for building dashboards, analytics, and monitoring interfaces for Electrical Engineers (specifically for Transformer Load Monitoring and SCADA/IoT systems).
---

# Electrical Engineer Dashboard Guidelines

This skill provides domain intelligence and UI/UX best practices for creating monitoring dashboards and analytics interfaces tailored for **Electrical Engineers**, especially in the context of Transformer Load Monitoring (TLM), SCADA, and IoT energy systems.

## 1. Domain Knowledge & Key Metrics

When building features for electrical engineers, you must understand and properly display these key parameters:

### Core Electrical Metrics
- **Voltage (V)**: Usually per phase (Va, Vb, Vc). Requires high precision (e.g., 1-2 decimal places).
- **Current (A)**: Ampere per phase (Ia, Ib, Ic). Critical for detecting overloads.
- **Power**:
  - **Active Power (kW)**: Real power consumed.
  - **Reactive Power (kVAR)**: Power that oscillates between source and load.
  - **Apparent Power (kVA)**: Total power in the system. (Used for transformer capacity rating).
- **Power Factor (PF)**: Ratio of kW to kVA. Ideal is close to 1.0. Lower PF means inefficiency.
- **Energy (kWh)**: Accumulated energy consumption over time.

### Transformer Health Metrics
- **Load Utilization (%)**: Current load divided by rated capacity. 
  - `Normal: < 80%`
  - `Warning: 80% - 100%`
  - `Critical (Overload): > 100%`
- **Phase Unbalance (%)**: Difference in load across 3 phases. High unbalance causes neutral currents and overheating.
- **Temperature / Oil Level**: If sensors are available, critical for physical health monitoring.

## 2. UI/UX Best Practices for Engineering Dashboards

Engineers need **data density**, **accuracy**, and **quick anomaly detection**. Do not oversimplify the data; instead, organize it clearly.

### Visual Hierarchy & Layout
- **Top Level (Overview)**: System health, total offline/online transformers, active critical alerts.
- **Mid Level (Map/Grid)**: Geographical or list view of assets with color-coded status.
- **Detail Level (Drill-down)**: Real-time telemetry, historical trends, phase-by-phase breakdown.

### Typography for Numbers
- **CRITICAL**: Always use `tabular-nums` (Tailwind class) or `font-mono` for data tables and real-time metrics. Numbers must align vertically and not jitter when values change (e.g., 1 and 8 should take the same width).
- Include units (A, V, kW, kVA, %) explicitly, either in column headers or smaller text next to the value.
- Right-align numeric columns in tables.

### Color Coding Standards
Follow standard industrial color coding for status:
- **Green** (`bg-emerald-500` / `text-emerald-600`): Normal, Online, Healthy.
- **Yellow/Orange** (`bg-amber-500` / `text-amber-600`): Warning, High Load, Approaching Limits.
- **Red** (`bg-rose-500` / `text-rose-600`): Critical, Overload, Offline, Fault.
- **Gray** (`bg-slate-400` / `text-slate-500`): Unknown, Disconnected, No Data.

*Phase Color Standards (Thailand MEA/PEA typical):*
- **Phase A / R**: Brown (or Red in older standard)
- **Phase B / S**: Black (or Yellow in older standard)
- **Phase C / T**: Gray (or Blue in older standard)
*(Ensure colors used for phases in charts are distinguishable and consistent across the app).*

### Data Visualization & Charts
- **Time-Series Lines**: Use for Load Profile (kW/kVA over 24 hours). Show all 3 phases overlaid to spot unbalances.
- **Gauges / Bullet Charts**: Excellent for showing current utilization (%) against the rated capacity limits.
- **Heatmaps / Scatter Plots**: Good for showing peak load times or anomaly distribution across days/weeks.

## 3. Implementation Patterns (React / Next.js)

### Real-Time Data Handling
- Use **TanStack Query** with `refetchInterval` for polling (e.g., every 15-30 seconds) or WebSockets if available.
- Ensure data fetching does not block the UI. Use optimistic UI or keep previous data while fetching (`placeholderData: keepPreviousData`).

```tsx
// Example pattern for real-time polling
const { data, isFetching } = useQuery({
  queryKey: ['transformer-telemetry', id],
  queryFn: () => fetchTelemetry(id),
  refetchInterval: 15000, // 15 seconds
})
```

### Component Guidelines
- **Badges**: Use for status indicators (Online/Offline/Warning).
- **Cards**: Group related metrics (e.g., a "Power Quality" card containing PF, Harmonics, Unbalance).
- **Skeletons**: Use structured loading skeletons that match the shape of the data table or chart to avoid layout shifts.

## 4. How to Use This Skill

When an AI agent or developer is tasked to build a dashboard feature for electrical engineers:
1. Read this skill to understand the required domain terms (kW, kVA, Phase Unbalance).
2. Structure the UI to focus on technical accuracy and data density.
3. Select appropriate chart types (Line for profiles, Gauge for capacity).
4. Apply the strict typographic rules (`tabular-nums`) and standard industrial color-coding.
