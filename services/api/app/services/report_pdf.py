from io import BytesIO
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.schemas.analysis import ReportRequest


def build_assessment_report(payload: ReportRequest) -> bytes:
    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="SARA-PRAGYA Research Assessment Report",
        author="SARA-PRAGYA",
    )
    styles = _styles()
    assessment = payload.assessment
    analysis = payload.analysis.result
    story = [
        Paragraph("SARA-PRAGYA", styles["brand"]),
        Paragraph("Research Assessment Report", styles["title"]),
        Paragraph("Recorded observations and AI-assisted research summary", styles["subtitle"]),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=12),
        Paragraph("AI research summary", styles["section"]),
        Paragraph(analysis.summary, styles["body"]),
        Paragraph("Recorded Dhatu Sarata observations", styles["section"]),
        _table(
            [["Dhatu", "Recorded score", "Observation points"]]
            + [
                [item.dhatu, f"{item.score} / {item.maximum}", f"{item.percentage}%"]
                for item in assessment.sarata_profile
            ],
            [62 * mm, 46 * mm, 52 * mm],
            styles,
        ),
        Paragraph("Assessment context", styles["section"]),
        _table(
            [
                ["Prakriti pattern", assessment.prakriti_pattern],
                [
                    "Vikriti observations",
                    "; ".join(
                        f"{item.dosha}: {item.score} ({item.percentage}%)"
                        for item in assessment.vikriti_profile
                    ),
                ],
            ],
            [50 * mm, 110 * mm],
            styles,
            include_header=False,
        ),
        Paragraph("Clinical history", styles["section"]),
        _table(
            [
                ["Chief complaint", assessment.clinical_history.chief_complaint],
                ["Duration", assessment.clinical_history.duration or "Not recorded"],
                ["Presenting symptoms", assessment.clinical_history.presenting_symptoms],
                [
                    "Associated symptoms",
                    assessment.clinical_history.associated_symptoms or "Not recorded",
                ],
                [
                    "Relevant history",
                    assessment.clinical_history.relevant_history or "Not recorded",
                ],
                ["Notes", assessment.clinical_history.notes or "Not recorded"],
            ],
            [50 * mm, 110 * mm],
            styles,
            include_header=False,
        ),
        Paragraph("Verified supporting documents", styles["section"]),
    ]
    if assessment.documents:
        for item in assessment.documents:
            story.extend(
                [
                    Paragraph(f"{item.kind.title()} - {item.filename}", styles["document"]),
                    Paragraph(item.verified_text, styles["body"]),
                ]
            )
            if item.measurements:
                story.append(
                    _table(
                        [["Parameter", "Value", "Reference range"]]
                        + [
                            [
                                measurement.name,
                                " ".join(
                                    part
                                    for part in [measurement.value, measurement.unit]
                                    if part
                                )
                                or "Not recorded",
                                measurement.reference_range or "Not recorded",
                            ]
                            for measurement in item.measurements
                        ],
                        [60 * mm, 48 * mm, 52 * mm],
                        styles,
                    )
                )
    else:
        story.append(Paragraph("No supporting documents were included.", styles["body"]))

    story.extend(
        [
            Paragraph("Observed patterns", styles["section"]),
            _bullet_list(analysis.observations, styles),
            Paragraph("Research focus", styles["section"]),
            _bullet_list(analysis.research_focus, styles),
            Spacer(1, 5 * mm),
            Paragraph(
                "Research support output only. This report records supplied observations and "
                "AI-assisted research notes; it does not establish a diagnosis, treatment, "
                "risk score, or clinical certainty.",
                styles["notice"],
            ),
        ]
    )
    document.build(story)
    return buffer.getvalue()


def _styles() -> dict[str, ParagraphStyle]:
    sample = getSampleStyleSheet()
    return {
        "brand": ParagraphStyle(
            "brand", parent=sample["BodyText"], fontName="Helvetica-Bold", fontSize=9,
            leading=12, textColor=colors.HexColor("#0F766E"), spaceAfter=5,
        ),
        "title": ParagraphStyle(
            "title", parent=sample["Title"], fontName="Helvetica-Bold", fontSize=22,
            leading=26, textColor=colors.HexColor("#172554"), spaceAfter=3,
        ),
        "subtitle": ParagraphStyle(
            "subtitle", parent=sample["BodyText"], fontSize=9, leading=12,
            textColor=colors.HexColor("#475569"), spaceAfter=5,
        ),
        "section": ParagraphStyle(
            "section", parent=sample["Heading2"], fontName="Helvetica-Bold", fontSize=12,
            leading=16, textColor=colors.HexColor("#0F766E"), spaceBefore=12, spaceAfter=7,
        ),
        "body": ParagraphStyle(
            "body", parent=sample["BodyText"], fontSize=9.5, leading=14,
            textColor=colors.HexColor("#1E293B"), spaceAfter=7,
        ),
        "table": ParagraphStyle(
            "table", parent=sample["BodyText"], fontSize=8.5, leading=11,
            textColor=colors.HexColor("#1E293B"),
        ),
        "document": ParagraphStyle(
            "document", parent=sample["BodyText"], fontName="Helvetica-Bold", fontSize=9.5,
            leading=13, textColor=colors.HexColor("#172554"), spaceBefore=5, spaceAfter=3,
        ),
        "notice": ParagraphStyle(
            "notice", parent=sample["BodyText"], fontSize=8.5, leading=12,
            textColor=colors.HexColor("#7C2D12"), backColor=colors.HexColor("#FFF7ED"),
            borderColor=colors.HexColor("#FDBA74"), borderWidth=0.5, borderPadding=6,
        ),
        "footer": ParagraphStyle(
            "footer", parent=sample["BodyText"], fontSize=8, leading=10,
            textColor=colors.HexColor("#64748B"), spaceBefore=8,
        ),
    }


def _paragraph(value: str, styles: dict[str, ParagraphStyle]) -> Paragraph:
    return Paragraph(escape(value), styles["table"])


def _table(
    rows: list[list[str]],
    widths: list[float],
    styles: dict[str, ParagraphStyle],
    *,
    include_header: bool = True,
) -> Table:
    table = Table([[_paragraph(value, styles) for value in row] for row in rows], colWidths=widths)
    commands = [
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CBD5E1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if include_header:
        commands.extend(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F766E")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ]
        )
    else:
        commands.append(("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")))
    table.setStyle(TableStyle(commands))
    return table


def _bullet_list(items: list[str], styles: dict[str, ParagraphStyle]) -> Table:
    return Table(
        [[_paragraph("-", styles), _paragraph(item, styles)] for item in items],
        colWidths=[6 * mm, 154 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        ),
    )
