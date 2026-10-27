import re, sqlite3, csv, subprocess, math, os  # standard library only

# Usage: python3 scripts/build_db.py <result.pdf> [out_dir]
# Needs the `pdftotext` command (poppler-utils). Writes folio.db and folio.csv to out_dir (default ./data).
import sys
PDF = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else "data"
os.makedirs(OUT, exist_ok=True)
DB  = f"{OUT}/folio.db"
CSV = f"{OUT}/folio.csv"
BATCH, SEMESTER = "BBA 32nd Batch", "1st Year 1st Semester Final 2026"
COURSES = ["1101", "1102", "1103", "1104", "1105"]

txt = subprocess.run(["pdftotext", "-layout", PDF, "-"], capture_output=True, text=True).stdout

def num(x):
    return None if x == "-" else float(x)
def txtv(x):
    return None if x == "-" else x

students = []   # (exam_roll, class_roll, sgpa, status, raw_line, results[])
for line in txt.splitlines():
    t = line.split()
    # main-section rows only: 30 tokens, exam roll repeated at end, class roll starts with 32
    if len(t) != 30 or t[0] != t[-1] or not t[1].startswith("32"):
        continue
    i = 2
    res = []
    for c in COURSES:
        if c == "1103":
            mid, prac, fin, tot, gr, gp = t[i:i+6]; i += 6
        else:
            mid, fin, tot, gr, gp = t[i:i+5]; i += 5
            prac = None
        res.append(dict(course=c, mid=num(mid), prac=num(prac) if prac is not None else None,
                        final=num(fin), total=num(tot), grade=txtv(gr), gp=num(gp)))
    sgpa = num(t[i])
    complete = all(r["total"] is not None for r in res) and sgpa is not None
    students.append((t[0], t[1], sgpa, "complete" if complete else "incomplete", " ".join(t), res))

students.sort(key=lambda s: s[0])

# ---------- SQLite ----------
BATCH_CODE, BATCH_NAME = "bba-32", "BBA 32nd Batch"
EXAM_CODE, EXAM_NAME = "y1s1-final-2026", "1st Year 1st Semester Final Examination 2026"
if os.path.exists(DB): os.remove(DB)
con = sqlite3.connect(DB)
con.execute("PRAGMA foreign_keys = ON")
con.executescript("""
CREATE TABLE batches (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,          -- e.g. 'bba-32'
  name TEXT NOT NULL,                 -- shown in the dropdown
  department TEXT,
  university TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE exams (
  id INTEGER PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES batches(id),
  code TEXT NOT NULL,                 -- e.g. 'y1s1-final-2026'
  name TEXT NOT NULL,                 -- shown in the dropdown
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  UNIQUE (batch_id, code)
);
CREATE TABLE courses (
  course_code TEXT PRIMARY KEY,
  course_name TEXT NOT NULL,
  has_practical INTEGER NOT NULL DEFAULT 0,
  mid_max REAL NOT NULL,
  practical_max REAL,
  final_max REAL NOT NULL,
  total_max REAL NOT NULL DEFAULT 100
);
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES batches(id),
  class_roll TEXT NOT NULL,
  UNIQUE (batch_id, class_roll)
);
CREATE TABLE exam_records (            -- one row per student per exam
  id INTEGER PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id),
  student_id INTEGER NOT NULL REFERENCES students(id),
  exam_roll TEXT NOT NULL,            -- exam roll can differ between exams
  sgpa REAL,
  status TEXT NOT NULL,               -- 'complete' | 'incomplete'
  raw_line TEXT NOT NULL,             -- original PDF row, for auditing
  UNIQUE (exam_id, student_id),
  UNIQUE (exam_id, exam_roll)
);
CREATE TABLE results (
  id INTEGER PRIMARY KEY,
  exam_record_id INTEGER NOT NULL REFERENCES exam_records(id),
  course_code TEXT NOT NULL REFERENCES courses(course_code),
  mid_quiz REAL,
  practical REAL,                     -- only course 1103
  final_exam REAL,
  total REAL,
  letter_grade TEXT,
  grade_point REAL,
  UNIQUE (exam_record_id, course_code)
);
CREATE INDEX idx_exam_records_lookup ON exam_records (exam_id, exam_roll);
CREATE INDEX idx_students_lookup ON students (batch_id, class_roll);
""")
con.executemany("INSERT INTO courses VALUES (?,?,?,?,?,?,?)", [
  ("1101", "Introduction to Financial Accounting", 0, 40, None, 60, 100),
  ("1102", "Introduction to Business", 0, 40, None, 60, 100),
  ("1103", "Computer Concepts and Applications", 1, 40, 30, 30, 100),
  ("1104", "Mathematics for Business Decisions - I", 0, 40, None, 60, 100),
  ("1105", "Business Communication", 0, 40, None, 60, 100),
])
bid = con.execute("INSERT INTO batches (code,name,department,university,sort_order) VALUES (?,?,?,?,1)",
                  (BATCH_CODE, BATCH_NAME, "Department of Accounting", "University of Dhaka")).lastrowid
eid = con.execute("INSERT INTO exams (batch_id,code,name,sort_order) VALUES (?,?,?,1)",
                  (bid, EXAM_CODE, EXAM_NAME)).lastrowid
for er, cr, sg, st, raw, res in students:
    sid = con.execute("INSERT INTO students (batch_id,class_roll) VALUES (?,?)", (bid, cr)).lastrowid
    rid = con.execute("INSERT INTO exam_records (exam_id,student_id,exam_roll,sgpa,status,raw_line) VALUES (?,?,?,?,?,?)",
                      (eid, sid, er, sg, st, raw)).lastrowid
    con.executemany("INSERT INTO results (exam_record_id,course_code,mid_quiz,practical,final_exam,total,letter_grade,grade_point) VALUES (?,?,?,?,?,?,?,?)",
                    [(rid, r["course"], r["mid"], r["prac"], r["final"], r["total"], r["grade"], r["gp"]) for r in res])
con.commit(); con.close()

# ---------- CSV (flat, one row per student) ----------
hdr = ["batch", "semester", "exam_roll", "class_roll"]
for c in COURSES:
    hdr += [f"c{c}_mid_quiz"] + ([f"c{c}_practical"] if c == "1103" else []) + \
           [f"c{c}_final_exam", f"c{c}_total", f"c{c}_letter_grade", f"c{c}_grade_point"]
hdr += ["sgpa", "status"]
with open(CSV, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(hdr)
    for er, cr, sg, st, raw, res in students:
        row = [BATCH, SEMESTER, er, cr]
        for r in res:
            row += [r["mid"]] + ([r["prac"]] if r["course"] == "1103" else []) + [r["final"], r["total"], r["grade"], r["gp"]]
        row += [sg, st]
        w.writerow(["" if v is None else v for v in row])

# ---------- Report (informational only; data is stored exactly as in the PDF) ----------
def scale(p):
    for lo, g, pt in [(80,"A+",4.0),(75,"A",3.75),(70,"A-",3.5),(65,"B+",3.25),(60,"B",3.0),
                      (55,"B-",2.75),(50,"C+",2.5),(45,"C",2.25),(40,"D",2.0)]:
        if p >= lo: return g, pt
    return "F", 0.0
issues = []
for er, cr, sg, st, raw, res in students:
    if st != "complete": continue
    for r in res:
        parts = (r["mid"] or 0) + (r["prac"] or 0) + (r["final"] or 0)
        if abs(parts - r["total"]) > 1: issues.append((er, r["course"], "sum", parts, r["total"]))
        if scale(r["total"]) != (r["grade"], r["gp"]): issues.append((er, r["course"], "grade", scale(r["total"]), (r["grade"], r["gp"])))
    avg = sum(r["gp"] for r in res) / 5
    if abs(avg - sg) > 0.0051: issues.append((er, "-", "sgpa", round(avg,3), sg))
print("students:", len(students), "| complete:", sum(s[3]=="complete" for s in students), "| incomplete:", [s[0] for s in students if s[3]!="complete"])
print("exam roll range:", students[0][0], "-", students[-1][0])
print("mismatches:", len(issues)); [print(i) for i in issues]
