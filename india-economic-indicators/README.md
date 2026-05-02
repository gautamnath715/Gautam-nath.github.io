# 📊 India Economic Indicators Analysis (2000–2023)

**Tools:** Python · pandas · matplotlib · seaborn

---

## Overview

A Python-based data analysis project examining 20+ years of Indian macroeconomic data — covering GDP growth, inflation (CPI/WPI), FDI inflows, and employment across 5 economic sectors. The project simulates a business analyst's workflow: ingesting messy multi-source data, cleaning it rigorously, running trend and variance analysis, and presenting findings through publication-quality charts.

---

## Objectives

- Ingest and consolidate multi-source economic datasets into a clean analytical dataframe
- Perform data quality checks: null handling, type normalization, outlier detection
- Conduct trend analysis and variance decomposition across indicators and sectors
- Generate annotated visualizations for non-technical stakeholder reporting
- Produce a structured analytical report linking economic patterns to policy milestones

---

## Data Sources

| Indicator | Source |
|---|---|
| GDP Growth Rate | World Bank / RBI Annual Reports |
| CPI Inflation | Ministry of Statistics (MoSPI) |
| FDI Inflows | DPIIT FDI Statistics |
| Unemployment Rate | CMIE / ILO India Data |
| Sector Output | CSO National Accounts |

> **Note:** This project uses publicly available data. All datasets are restructured and cleaned as part of the pipeline.

---

## Project Structure

```
india-economic-indicators/
│
├── data/
│   ├── raw/                    # Original source CSVs
│   └── cleaned/                # Post-processing outputs
│
├── notebooks/
│   ├── 01_data_ingestion.ipynb     # Load + inspect raw data
│   ├── 02_cleaning_pipeline.ipynb  # Null handling, normalization
│   ├── 03_eda_trends.ipynb         # Trend and variance analysis
│   └── 04_visualizations.ipynb     # Final charts + annotations
│
├── src/
│   ├── clean.py                # Reusable cleaning functions
│   ├── analyze.py              # Variance + trend utilities
│   └── plot.py                 # Chart generation functions
│
├── outputs/
│   ├── charts/                 # Exported PNG/SVG visualizations
│   └── Economic_Analysis_Report.pdf
│
├── requirements.txt
└── README.md
```

---

## Key Analysis Steps

### 1. Data Ingestion & Cleaning
```python
import pandas as pd

# Load multi-source data
gdp = pd.read_csv('data/raw/gdp_growth.csv')
cpi = pd.read_csv('data/raw/cpi_inflation.csv')
fdi = pd.read_csv('data/raw/fdi_inflows.csv')

# Standardize year column and merge
gdp['year'] = pd.to_datetime(gdp['year'], format='%Y')
merged = gdp.merge(cpi, on='year').merge(fdi, on='year')

# Null handling
merged.fillna(merged.mean(numeric_only=True), inplace=True)
print(merged.isnull().sum())  # Verify clean
```

### 2. Variance & Trend Analysis
```python
# Rolling 3-year average to smooth noise
merged['gdp_rolling_avg'] = merged['gdp_growth'].rolling(window=3).mean()

# Year-over-year change
merged['gdp_yoy_change'] = merged['gdp_growth'].pct_change() * 100

# Standard deviation by decade
merged['decade'] = (merged['year'].dt.year // 10) * 10
volatility = merged.groupby('decade')['gdp_growth'].std().reset_index()
volatility.columns = ['decade', 'gdp_volatility']
```

### 3. Visualization
```python
import matplotlib.pyplot as plt
import seaborn as sns

fig, ax = plt.subplots(figsize=(12, 5))
ax.plot(merged['year'], merged['gdp_growth'], color='#1a5276', linewidth=2, label='GDP Growth %')
ax.plot(merged['year'], merged['gdp_rolling_avg'], color='#e67e22', linestyle='--', label='3-yr Rolling Avg')

# Annotate key policy events
ax.axvline(pd.Timestamp('2008-01-01'), color='red', alpha=0.4, linestyle=':')
ax.text(pd.Timestamp('2008-06-01'), 9, 'Global\nFinancial Crisis', fontsize=8, color='red')

ax.set_title('India GDP Growth Rate (2000–2023)', fontsize=14, fontweight='bold')
ax.set_xlabel('Year')
ax.set_ylabel('Growth Rate (%)')
ax.legend()
plt.tight_layout()
plt.savefig('outputs/charts/gdp_trend.png', dpi=150)
```

---

## Key Findings

| Period | Avg GDP Growth | Key Driver | Notable Shock |
|---|---|---|---|
| 2000–2007 | 7.1% | IT boom, reforms | Dot-com (2001) |
| 2008–2013 | 6.4% | Infra push | GFC (2008–09) |
| 2014–2019 | 6.8% | GST, FDI reform | Demonetisation (2016) |
| 2020–2023 | 3.2% | Recovery phase | COVID-19 (2020) |

---

## Requirements

```
pandas>=1.5.0
matplotlib>=3.6.0
seaborn>=0.12.0
numpy>=1.23.0
jupyter>=1.0.0
```

Install with:
```bash
pip install -r requirements.txt
```

---

## Skills Demonstrated

- Python data pipeline design (ingest → clean → analyze → visualize)
- pandas: merging, groupby, rolling windows, pct_change
- matplotlib + seaborn: annotated time-series, multi-panel charts
- Variance analysis and trend decomposition
- Structured report writing for business audiences

---

## Author

**Gautam Nath** · [LinkedIn](https://linkedin.com/in/gautam-nath-230574139) · gautamnath715@gmail.com
