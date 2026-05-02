# 📈 Executive KPI Reporting Deck – Retail Sector Performance

**Tools:** MS PowerPoint · MS Excel

---

## Overview

A simulated Quarterly Business Review (QBR) presentation for a mid-size retail company, built to C-suite presentation standards. This project demonstrates the ability to transform raw Excel data models into a polished, decision-ready PowerPoint deck — a core deliverable in analyst, administrative assistant, and business operations roles.

---

## Objectives

- Design a QBR deck structure aligned with how leadership teams consume performance data
- Build the underlying Excel data model with dynamic formulas and Pivot Tables
- Link Excel charts directly to PowerPoint for one-click refresh capability
- Translate raw numbers into a narrative that drives business decisions

---

## Deck Structure (10 Slides)

| Slide | Title | Key Content |
|---|---|---|
| 1 | Cover | Quarter, company name, date |
| 2 | Executive Summary | 3 key wins, 2 risks, 1 action item |
| 3 | Revenue Overview | Total revenue vs. target, QoQ, YoY |
| 4 | Regional Breakdown | North / South / East / West performance map |
| 5 | Category Performance | Top 5 categories by revenue and margin |
| 6 | KPI Scorecard | 8 KPIs: green / amber / red RAG status |
| 7 | Customer Metrics | Footfall, basket size, repeat purchase rate |
| 8 | Cost & Margin Analysis | Gross margin %, OPEX variance |
| 9 | Variance Analysis | Actuals vs. budget, root cause flags |
| 10 | Outlook & Actions | Q+1 targets, recommended actions |

---

## Excel Data Model

### Sheet: `Raw_Data`
- Monthly revenue, units sold, returns, and cost data by region and category
- Source columns: `Region | Category | Month | Revenue_Actual | Revenue_Budget | Units | COGS | OPEX`

### Sheet: `Pivot_Summary`
- Pivot Tables aggregating by:
  - Region × Quarter
  - Category × Month
  - KPI × Status

### Sheet: `Chart_Data`
- Cleaned, formula-driven output feeding into charts
- Uses `VLOOKUP`, `SUMIFS`, `IF`, and named ranges for clean references

### Key Excel Formulas Used
```excel
-- YoY Revenue Growth
= (Revenue_Q_Current - Revenue_Q_PY) / Revenue_Q_PY

-- RAG Status Logic
= IF(Actual/Target >= 0.95, "Green", IF(Actual/Target >= 0.80, "Amber", "Red"))

-- Variance from Budget
= Actual - Budget

-- Regional Share %
= SUMIF(Region_Column, "North", Revenue_Column) / SUM(Revenue_Column)
```

---

## PowerPoint Design Principles Applied

- **One message per slide** — each slide has a clear headline insight, not just a chart title
- **RAG indicators** — red/amber/green status visuals on the KPI scorecard for at-a-glance reading
- **Consistent colour palette** — corporate blue/grey with red for alerts, green for targets met
- **Data-ink ratio** — removed chart gridlines, borders, and legend clutter; kept only what aids comprehension
- **Executive summary first** — BLUF (Bottom Line Up Front) structure so leadership can stop after slide 2 if needed

---

## Project Structure

```
kpi-reporting-deck/
│
├── excel/
│   └── Retail_KPI_Model.xlsx       # Raw data, Pivot Tables, chart source data
│
├── powerpoint/
│   └── Retail_QBR_Q4_2023.pptx     # Final presentation deck
│
├── screenshots/
│   ├── slide_kpi_scorecard.png
│   ├── slide_revenue_overview.png
│   └── slide_variance_analysis.png
│
└── README.md
```

---

## Skills Demonstrated

- Executive-level presentation design (QBR / MIS reporting)
- Excel data modelling: Pivot Tables, VLOOKUP, SUMIFS, dynamic charts
- Linking Excel data to PowerPoint for live-refresh reporting
- Variance analysis and KPI performance monitoring
- Analytical storytelling: translating data into management insights

---

## Use Case Relevance

This project directly mirrors deliverables expected in:
- **Business Analyst** roles: KPI tracking, variance reporting, management decks
- **Administrative Analyst** roles: executive reporting, document management
- **MIS / Reporting Analyst** roles: dashboard-to-deck pipeline, data consolidation

---

## Author

**Gautam Nath** · [LinkedIn](https://linkedin.com/in/gautam-nath-230574139) · gautamnath715@gmail.com
