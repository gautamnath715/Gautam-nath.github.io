# 🎓 Student Database Management System

**Tools:** SQL · MySQL

---

## Overview

A relational database project designed to manage student academic records — simulating the kind of enterprise data pipeline used in institutional MIS systems. The focus was on schema design, query optimization, and producing dashboard-ready data extracts. Directly applicable to administrative reporting and data analyst roles requiring structured data management.

---

## Objectives

- Design a normalized relational schema to store and manage student data at scale
- Write optimized SQL queries for data retrieval, aggregation, and reporting
- Produce MIS-style summary outputs for academic administration use cases
- Demonstrate query efficiency through indexing and join optimization

---

## Database Schema

### Tables

**`students`**
| Column | Type | Description |
|---|---|---|
| student_id | INT (PK) | Unique identifier |
| name | VARCHAR | Full name |
| dob | DATE | Date of birth |
| gender | ENUM | M / F / Other |
| department_id | INT (FK) | Linked to departments |
| enrollment_year | YEAR | Year of admission |

**`departments`**
| Column | Type | Description |
|---|---|---|
| dept_id | INT (PK) | Unique identifier |
| dept_name | VARCHAR | Department name |
| hod | VARCHAR | Head of Department |

**`courses`**
| Column | Type | Description |
|---|---|---|
| course_id | INT (PK) | Unique identifier |
| course_name | VARCHAR | Name of course |
| credits | INT | Credit weightage |
| dept_id | INT (FK) | Offering department |

**`enrollments`**
| Column | Type | Description |
|---|---|---|
| enrollment_id | INT (PK) | Unique identifier |
| student_id | INT (FK) | Linked to students |
| course_id | INT (FK) | Linked to courses |
| semester | VARCHAR | e.g., 2023-Odd |
| grade | CHAR | A / B / C / D / F |

---

## Key SQL Queries

### Department-wise Average GPA
```sql
SELECT
    d.dept_name,
    COUNT(DISTINCT s.student_id) AS total_students,
    ROUND(AVG(
        CASE e.grade
            WHEN 'A' THEN 10
            WHEN 'B' THEN 8
            WHEN 'C' THEN 6
            WHEN 'D' THEN 4
            ELSE 0
        END
    ), 2) AS avg_gpa
FROM students s
JOIN departments d ON s.department_id = d.dept_id
JOIN enrollments e ON s.student_id = e.student_id
GROUP BY d.dept_name
ORDER BY avg_gpa DESC;
```

### Students At Risk (Failed 2+ Courses)
```sql
SELECT
    s.student_id,
    s.name,
    d.dept_name,
    COUNT(*) AS failed_courses
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN departments d ON s.department_id = d.dept_id
WHERE e.grade = 'F'
GROUP BY s.student_id, s.name, d.dept_name
HAVING failed_courses >= 2
ORDER BY failed_courses DESC;
```

### Semester-wise Enrollment Trend
```sql
SELECT
    semester,
    COUNT(DISTINCT student_id) AS enrolled_students,
    COUNT(DISTINCT course_id) AS active_courses
FROM enrollments
GROUP BY semester
ORDER BY semester;
```

### Top Performer per Department
```sql
WITH ranked_students AS (
    SELECT
        s.student_id,
        s.name,
        d.dept_name,
        AVG(CASE e.grade WHEN 'A' THEN 10 WHEN 'B' THEN 8 WHEN 'C' THEN 6 WHEN 'D' THEN 4 ELSE 0 END) AS gpa,
        RANK() OVER (PARTITION BY d.dept_name ORDER BY AVG(CASE e.grade WHEN 'A' THEN 10 WHEN 'B' THEN 8 WHEN 'C' THEN 6 WHEN 'D' THEN 4 ELSE 0 END) DESC) AS dept_rank
    FROM students s
    JOIN departments d ON s.department_id = d.dept_id
    JOIN enrollments e ON s.student_id = e.student_id
    GROUP BY s.student_id, s.name, d.dept_name
)
SELECT * FROM ranked_students WHERE dept_rank = 1;
```

---

## Project Structure

```
student-db/
│
├── sql/
│   ├── schema.sql          # CREATE TABLE statements, constraints, indexes
│   ├── sample_data.sql     # INSERT statements for testing
│   └── queries.sql         # All analytical queries
│
└── README.md
```

---

## Skills Demonstrated

- Relational schema design (3NF normalization)
- Multi-table JOIN operations
- Window functions and CTEs for ranked reporting
- Aggregation and conditional logic in SQL
- MIS-style reporting query patterns

---

## Author

**Gautam Nath** · [LinkedIn](https://linkedin.com/in/gautam-nath-230574139) · gautamnath715@gmail.com
