# 🌦️ Climate Variability Analysis – India (2000–2023)

**Tools:** SQL · MySQL · MS Excel · Pivot Tables · Dynamic Charts

---

## Overview

A data analysis project examining 20+ years of climate trends across 5 Indian regions (North, South, East, West, Central). The goal was to build a structured analytical pipeline — from raw data ingestion into a normalized SQL database, through complex query-based analysis, to business-ready Excel dashboards — simulating the end-to-end workflow of a BI or data analyst role.

---

## Objectives

- Design and populate a normalized relational database for multi-region climate data
- Write advanced SQL queries to extract trends, anomalies, and cross-regional comparisons
- Build interactive Excel dashboards for non-technical stakeholder reporting
- Produce a variance analysis report linking climate patterns to agricultural output

---

## Key Features

### SQL / MySQL
- Designed a normalized schema (3NF) with tables for regions, parameters (rainfall, temperature, humidity), and annual records
- Wrote queries using:
  - **Window functions** (`RANK()`, `LAG()`, `LEAD()`) for year-over-year trend analysis
  - **CTEs** to modularize complex multi-step calculations
  - **Aggregations** (`AVG`, `MAX`, `MIN`, `STDDEV`) for regional summaries
  - **JOINs** across dimension and fact tables

### MS Excel
- Built Pivot Table dashboards aggregating data by region, year, and climate parameter
- Applied conditional formatting to surface above/below-average values at a glance
- Created dynamic charts (line, bar, combo) auto-updating with slicer selections
- Used `VLOOKUP` and `INDEX-MATCH` to cross-reference agricultural yield data

### Analytical Output
- Variance analysis report identifying seasons and regions with highest climate volatility
- Correlation findings between erratic monsoon patterns and crop yield dips in 3 key states
- Executive summary formatted for a non-technical decision-maker audience

---

## Project Structure

```
climate-analysis/
│
├── sql/
│   ├── schema.sql          # Table definitions and relationships
│   ├── insert_data.sql     # Sample data population scripts
│   └── analysis_queries.sql # Window functions, CTEs, aggregations
│
├── excel/
│   └── Climate_Dashboard.xlsx  # Pivot Tables, dynamic charts, slicers
│
├── reports/
│   └── Variance_Analysis_Report.pdf  # Final analytical findings
│
└── README.md
```

---

## Sample SQL Snippets

### Year-over-Year Rainfall Change by Region
```sql
SELECT
    region,
    year,
    avg_rainfall_mm,
    LAG(avg_rainfall_mm) OVER (PARTITION BY region ORDER BY year) AS prev_year,
    ROUND(avg_rainfall_mm - LAG(avg_rainfall_mm) OVER (PARTITION BY region ORDER BY year), 2) AS yoy_change
FROM climate_data
ORDER BY region, year;
```

### Top 3 Anomaly Years per Region (CTE + RANK)
```sql
WITH ranked AS (
    SELECT
        region,
        year,
        avg_temperature_c,
        RANK() OVER (PARTITION BY region ORDER BY ABS(avg_temperature_c - AVG(avg_temperature_c) OVER (PARTITION BY region)) DESC) AS anomaly_rank
    FROM climate_data
)
SELECT * FROM ranked WHERE anomaly_rank <= 3;
```

---

## Key Findings

| Region   | Highest Anomaly Year | Avg Rainfall Deviation | Ag. Impact |
|----------|----------------------|------------------------|------------|
| North    | 2009                 | –23%                   | Wheat –18% |
| Central  | 2015                 | –31%                   | Soy –22%   |
| South    | 2004                 | +27%                   | Rice +11%  |

---

## Skills Demonstrated

- Relational database design and SQL query optimization
- Excel-based BI dashboarding and MIS reporting
- Variance and trend analysis
- Analytical storytelling for non-technical audiences

---

## Author

**Gautam Nath** · [LinkedIn](https://linkedin.com/in/gautam-nath-230574139) · gautamnath715@gmail.com
