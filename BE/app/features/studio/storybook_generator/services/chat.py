"""
High-level chat services for the Studio experience.
"""

from typing import Iterable

from app.shared.llm.base import Provider, generate_structured, generate_text
from app.shared.llm.llm_config import DEFAULT_REWRITE_MODEL, DEFAULT_REWRITE_PROVIDER

from ..models.classification import ClassificationSchema
from ..output_schemas.draft import FinalScriptSchema, SpreadScript

CLASSIFICATION_PROMPT = """You are a classifier for requests inside a children's story editing studio.

User message:
\"\"\"{message}\"\"\"

Decide whether the user wants to MODIFY the story (action = "edit") or is only ASKING ABOUT the story without requesting changes (action = "question").

Rules:
- Return action "edit" when the user asks to rewrite, change, adjust tone/length/style, add/remove content, or otherwise modify the story.
- Return action "question" when the user only seeks clarification, summaries, themes, or any information without demanding modifications.
- If both appear, prefer "edit".

Output strict JSON: {"action": "edit"} or {"action": "question"}.
"""

QUESTION_ANSWER_PROMPT = """You are a helpful assistant for parents reviewing a children's picture book story.

Story context (14 spreads, left/right pages):
{story_context}

User question:
\"\"\"{question}\"\"\"

Answer the question in 2-4 sentences:
- Reference relevant story details.
- Keep language friendly, supportive, and suitable for discussing stories for ages 4-5.
- If the question cannot be answered from the provided story, politely say so.
"""


def classify_message(message: str) -> ClassificationSchema:
    """Classify the incoming chat message using an LLM."""
    result = generate_structured(
        provider=Provider(DEFAULT_REWRITE_PROVIDER),
        model=DEFAULT_REWRITE_MODEL,
        input_text=CLASSIFICATION_PROMPT.format(message=message),
        schema=ClassificationSchema,
    )
    return result.parsed


def answer_question(script: FinalScriptSchema, message: str) -> str:
    """
    Provide a natural-language answer to a question about the current story.
    """
    story_context = _build_story_context(script.spreads)
    prompt = QUESTION_ANSWER_PROMPT.format(
        story_context=story_context,
        question=message,
    )
    result = generate_text(
        provider=Provider(DEFAULT_REWRITE_PROVIDER),
        model=DEFAULT_REWRITE_MODEL,
        input_text=prompt,
    )
    if not result.text:
        raise ValueError("Failed to generate an answer for the question.")
    return result.text


def _build_story_context(spreads: Iterable[SpreadScript]) -> str:
    """
    Convert spreads into a compact textual context for prompting.
    """
    lines: list[str] = []
    for spread in spreads:
        lines.append(
            f"Spread {spread.spread_number}: "
            f"Left='{spread.script_1}' | Right='{spread.script_2}'"
        )
    return "\n".join(lines)


