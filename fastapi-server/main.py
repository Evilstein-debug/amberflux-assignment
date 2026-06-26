from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Quote Analysis Service")


class AnalyzeRequest(BaseModel):
    quote_id: str
    project: str
    estimated_value: float


class AnalyzeResponse(BaseModel):
    risk: str
    missing_items: list[str]
    confidence: int


def get_risk(estimated_value: float) -> str:
    if estimated_value > 50_000:
        return "High"
    elif estimated_value >= 20_000:
        return "Medium"
    else:
        return "Low"


def get_missing_items(project: str, estimated_value: float) -> list[str]:
    missing: list[str] = []
    p = project.lower()

    if estimated_value > 100_000:
        missing.append("Structural drawings")
        missing.append("Load requirements")

    if any(kw in p for kw in ("renovation", "remodel", "retrofit")):
        missing.append("As-built drawings")

    if any(kw in p for kw in ("expansion", "structure", "structural", "parking")):
        missing.append("Geotechnical report")

    if any(kw in p for kw in ("medical", "clinic", "hospital", "healthcare")):
        missing.append("ADA compliance report")

    if any(kw in p for kw in ("data center", "power", "electrical", "hvac")):
        missing.append("Electrical load schedule")

    if estimated_value > 50_000 and "permits" not in p:
        missing.append("Building permits")

    return missing


def get_confidence(missing_items: list[str]) -> int:
    # Confidence decreases with each missing item; floor at 65
    return max(65, 97 - len(missing_items) * 7)


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    risk = get_risk(request.estimated_value)
    missing_items = get_missing_items(request.project, request.estimated_value)
    confidence = get_confidence(missing_items)

    return AnalyzeResponse(
        risk=risk,
        missing_items=missing_items,
        confidence=confidence,
    )
