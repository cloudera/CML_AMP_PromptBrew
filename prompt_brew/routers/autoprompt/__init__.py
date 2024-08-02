# ###########################################################################
#
#  CLOUDERA APPLIED MACHINE LEARNING PROTOTYPE (AMP)
#  (C) Cloudera, Inc. 2024
#  All rights reserved.
#
#  Applicable Open Source License: Apache 2.0
#
#  NOTE: Cloudera open source products are modular software products
#  made up of hundreds of individual components, each of which was
#  individually copyrighted.  Each Cloudera open source product is a
#  collective work under U.S. Copyright Law. Your license to use the
#  collective work is as provided in your written agreement with
#  Cloudera.  Used apart from the collective work, this file is
#  licensed for your use pursuant to the open source license
#  identified above.
#
#  This code is provided to you pursuant a written agreement with
#  (i) Cloudera, Inc. or (ii) a third-party authorized to distribute
#  this code. If you do not have a written agreement with Cloudera nor
#  with an authorized and properly licensed third party, you do not
#  have any rights to access nor to use this code.
#
#  Absent a written agreement with Cloudera, Inc. (“Cloudera”) to the
#  contrary, A) CLOUDERA PROVIDES THIS CODE TO YOU WITHOUT WARRANTIES OF ANY
#  KIND; (B) CLOUDERA DISCLAIMS ANY AND ALL EXPRESS AND IMPLIED
#  WARRANTIES WITH RESPECT TO THIS CODE, INCLUDING BUT NOT LIMITED TO
#  IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND
#  FITNESS FOR A PARTICULAR PURPOSE; (C) CLOUDERA IS NOT LIABLE TO YOU,
#  AND WILL NOT DEFEND, INDEMNIFY, NOR HOLD YOU HARMLESS FOR ANY CLAIMS
#  ARISING FROM OR RELATED TO THE CODE; AND (D)WITH RESPECT TO YOUR EXERCISE
#  OF ANY RIGHTS GRANTED TO YOU FOR THE CODE, CLOUDERA IS NOT LIABLE FOR ANY
#  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR
#  CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED TO, DAMAGES
#  RELATED TO LOST REVENUE, LOST PROFITS, LOSS OF INCOME, LOSS OF
#  BUSINESS ADVANTAGE OR UNAVAILABILITY, OR LOSS OR CORRUPTION OF
#  DATA.
#
# ###########################################################################

"""PromptBrew API routes."""

import logging

import requests
from fastapi import APIRouter, HTTPException
from jinja2 import Template
from pydantic import BaseModel

from .dimensions import get_dimensions
from .open_ai import call_open_ai, get_refined_prompt, run_prompt
from .prompts import PromptStyle

logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/promptbrew",
    tags=["promptbrew"],
)


class AutopromptGenerateDimensionsRequest(BaseModel):
    """Request schema for /generate-dimensions."""

    prompt: str


class AutopromptGenerateDimensionsResponse(BaseModel):
    """Response schema for /generate-dimensions."""

    prompt: str
    dimensions: dict[str, list[str]]


@router.post(
    "/generate-dimensions",
    summary="Generate prompt dimensions",
)
def generate_dimensions(
    request: AutopromptGenerateDimensionsRequest,
) -> AutopromptGenerateDimensionsResponse:
    """Given a prompt, generate and return suggested nominal and ordinal dimensions."""
    logger.info("Running /generate-dimensions")
    try:
        out = get_dimensions(request.prompt)
        return AutopromptGenerateDimensionsResponse(
            prompt=request.prompt,
            dimensions=out,
        )
    except HTTPException as e:
        logger.exception("Encountered error")
        raise e
    except requests.exceptions.HTTPError as e:
        logger.exception("Encountered HTTP error")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.text,
        ) from e
    except Exception as e:
        logger.exception("Encountered internal error")
        raise HTTPException(
            status_code=500,
            detail=str(e),
        ) from e


class AutopromptGenerateRefinedPromptRequest(BaseModel):
    """Request schema for /generate-refined-prompt."""

    prompt: str
    dimensions: dict[str, str] = {}
    input_variables: dict[str, str] = {}
    prompt_style: PromptStyle = PromptStyle.SIMPLE


class AutopromptGenerateRefinedPromptResponse(BaseModel):
    """Request schema for /generate-refined-prompt."""

    refined_prompt: str
    input_variables: dict[str, str] = {}
    prompt_style: PromptStyle


@router.post(
    "/generate-refined-prompt",
    summary="Generate refined prompt",
)
def generate_refined_prompt(
    request: AutopromptGenerateRefinedPromptRequest,
) -> AutopromptGenerateRefinedPromptResponse:
    """
    Given a prompt, dimensions, and variables, generate and return a refined prompt.

    """
    logger.info("Running /generate-refined-prompt")
    try:
        out = get_refined_prompt(
            prompt=request.prompt,
            requirements=request.dimensions,
            input_variables=request.input_variables,
            prompt_style=request.prompt_style,
        )
        return AutopromptGenerateRefinedPromptResponse(
            refined_prompt=out,
            input_variables=request.input_variables,
            prompt_style=request.prompt_style,
        )
    except HTTPException as e:
        logger.exception("Encountered error")
        raise e
    except requests.exceptions.HTTPError as e:
        logger.exception("Encountered HTTP error")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.text,
        ) from e
    except Exception as e:
        logger.exception("Encountered internal error")
        raise HTTPException(
            status_code=500,
            detail=str(e),
        ) from e


class TestPromptRequest(BaseModel):
    """Request schema for /test-prompt."""

    prompt: str
    input_variables: dict[str, str] = {}


@router.post(
    "/test-prompt",
    summary="Test a prompt against an LLM",
)
def test_prompt(request: TestPromptRequest) -> str:
    """Given a prompt and variables, generate an LLM response."""
    logger.info("Running /test-prompt")
    try:
        template = Template(request.prompt)
        prompt = template.render(request.input_variables)
        return run_prompt(prompt)
    except HTTPException as e:
        logger.exception("Encountered error")
        raise e
    except requests.exceptions.HTTPError as e:
        logger.exception("Encountered HTTP error")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.text,
        ) from e
    except Exception as e:
        logger.exception("Encountered internal error")
        raise HTTPException(
            status_code=500,
            detail=str(e),
        ) from e
