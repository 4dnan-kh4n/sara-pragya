from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf"


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(text.replace("&", "&amp;"), style)


def build_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "notice": ParagraphStyle(
            "notice",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#9A3412"),
            backColor=colors.HexColor("#FFF7ED"),
            borderColor=colors.HexColor("#FDBA74"),
            borderWidth=0.6,
            borderPadding=6,
            spaceAfter=14,
        ),
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#172554"),
            spaceAfter=5,
        ),
        "meta": ParagraphStyle(
            "meta",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#475569"),
            spaceAfter=3,
        ),
        "heading": ParagraphStyle(
            "heading",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#0F766E"),
            spaceBefore=12,
            spaceAfter=7,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=15,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#1E293B"),
            spaceAfter=8,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#64748B"),
            spaceBefore=15,
        ),
    }


def report_header(title: str, subtitle: str, styles: dict[str, ParagraphStyle]) -> list:
    return [
        paragraph("DEMONSTRATION SAMPLE - FICTIONAL DATA ONLY - NOT FOR CLINICAL USE", styles["notice"]),
        paragraph(title, styles["title"]),
        paragraph(subtitle, styles["meta"]),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=8),
    ]


def key_value_table(rows: list[tuple[str, str]], styles: dict[str, ParagraphStyle]) -> Table:
    data = [[paragraph(label, styles["meta"]), paragraph(value, styles["body"])] for label, value in rows]
    table = Table(data, colWidths=[48 * mm, 116 * mm], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def results_table(rows: list[tuple[str, str, str]], styles: dict[str, ParagraphStyle]) -> Table:
    data = [[paragraph("Test", styles["meta"]), paragraph("Result", styles["meta"]), paragraph("Reference range", styles["meta"])]]
    data.extend(
        [[paragraph(name, styles["body"]), paragraph(value, styles["body"]), paragraph(reference, styles["body"])]
        for name, value, reference in rows
        ]
    )
    table = Table(data, colWidths=[66 * mm, 48 * mm, 50 * mm], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F766E")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def build_document(filename: str, story: list, title: str) -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT / filename),
        pagesize=A4,
        leftMargin=22 * mm,
        rightMargin=22 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title=title,
        author="SARA-PRAGYA demonstration data",
    )
    document.build(story)


def main() -> None:
    styles = build_styles()

    lab_story = report_header("Sample Laboratory Report", "Fictional record for PDF upload testing", styles)
    lab_story.extend(
        [
            key_value_table(
                [("Record", "DEMO-LAB-001"), ("Collected", "14 September 2026"), ("Subject", "Demo Record - no patient identity")],
                styles,
            ),
            paragraph("Complete blood count", styles["heading"]),
            results_table(
                [
                    ("Hemoglobin", "12.8 g/dL", "12.0 - 16.0 g/dL"),
                    ("RBC", "4.5 million/uL", "4.0 - 5.2 million/uL"),
                    ("WBC", "6.8 10^3/uL", "4.0 - 11.0 10^3/uL"),
                    ("Platelets", "252 10^3/uL", "150 - 450 10^3/uL"),
                ],
                styles,
            ),
            paragraph("Biochemistry", styles["heading"]),
            results_table(
                [
                    ("Fasting glucose", "91 mg/dL", "70 - 99 mg/dL"),
                    ("Creatinine", "0.8 mg/dL", "0.6 - 1.1 mg/dL"),
                    ("TSH", "2.1 mIU/L", "0.4 - 4.0 mIU/L"),
                ],
                styles,
            ),
            paragraph("This document is intentionally fictional and contains no clinical interpretation.", styles["footer"]),
        ]
    )
    build_document("demo-laboratory-report.pdf", lab_story, "Sample Laboratory Report")

    physiology_story = report_header("Sample Physiology Record", "Fictional observations for PDF upload testing", styles)
    physiology_story.extend(
        [
            key_value_table(
                [("Record", "DEMO-PHYS-001"), ("Recorded", "14 September 2026"), ("Context", "Routine demonstration measurement")], styles
            ),
            paragraph("Recorded measurements", styles["heading"]),
            results_table(
                [
                    ("Height", "168 cm", "Recorded value"),
                    ("Weight", "62 kg", "Recorded value"),
                    ("BMI", "22.0 kg/m2", "18.5 - 24.9 kg/m2"),
                    ("Heart rate", "72 bpm", "60 - 100 bpm"),
                    ("Respiratory rate", "16 breaths/min", "12 - 20 breaths/min"),
                    ("SpO2", "98 %", "95 - 100 %"),
                    ("Temperature", "36.8 C", "36.1 - 37.2 C"),
                ],
                styles,
            ),
            paragraph("No inference, diagnosis, or recommendation is contained in this sample record.", styles["footer"]),
        ]
    )
    build_document("demo-physiology-record.pdf", physiology_story, "Sample Physiology Record")

    examination_story = report_header("Sample Examination Findings", "Fictional note for PDF upload testing", styles)
    examination_story.extend(
        [
            key_value_table(
                [("Record", "DEMO-EXAM-001"), ("Recorded", "14 September 2026"), ("Subject", "Demo Record - no patient identity")], styles),
            paragraph("General observations", styles["heading"]),
            paragraph("Demonstration note: the subject is described as comfortable at rest and able to communicate clearly. This is sample text only and is not a real examination finding.", styles["body"]),
            paragraph("Observation summary", styles["heading"]),
            key_value_table(
                [
                    ("Appearance", "Fictional sample entry for testing text extraction."),
                    ("Skin observation", "Fictional sample entry: no interpretation included."),
                    ("Mobility", "Fictional sample entry: routine movement observed."),
                    ("Notes", "For SARA-PRAGYA demonstration upload only."),
                ],
                styles,
            ),
            paragraph("This document must not be used for a real person, clinical review, or clinical decision-making.", styles["footer"]),
        ]
    )
    build_document("demo-examination-findings.pdf", examination_story, "Sample Examination Findings")


if __name__ == "__main__":
    main()
