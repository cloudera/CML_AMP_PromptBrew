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

"""Helper functions for generating prompt dimensions."""

import json
import logging

from .open_ai import call_open_ai
from .prompts import NOM_GEN_PROMPT, ORD_GEN_PROMPT

logger = logging.getLogger(__name__)


def get_dimensions(
    prompt: str,
    cat_num_nominal: int = 5,
    val_num_nominal: int = 5,
    cat_num_ordinal: int = 5,
) -> dict[str, list[str]]:
    """Given a prompt, generate and return suggested nominal and ordinal dimensions.

    Parameters
    ----------
    prompt : str
        User prompt to generate dimensions for.
    cat_num_nominal : int greater than 0, default 5
        Number of nominal dimensions to generate.
    val_num_nominal : int greater than 0, default 5
        Number of possible values to generate for each nominal dimension.
    cat_num_ordinal : int greater than 0, default 5
        Number of ordinal dimensions to generate.

    Returns
    -------
    dict of str to list of str
        Mapping of dimension names to possible values.

    """
    nominal_dimensions = get_nomimal_dimensions(
        prompt=prompt,
        cat_num=cat_num_nominal,
        val_num=val_num_nominal,
    )
    ordinal_dimensions = get_ordinal_dimensions(
        prompt=prompt,
        cat_num=cat_num_ordinal,
    )
    return dict(nominal_dimensions | ordinal_dimensions)


def get_nomimal_dimensions(
    prompt: str,
    cat_num: int = 5,
    val_num: int = 5,
    temperature: float = 0.3,
    metaprompt: str = NOM_GEN_PROMPT,
) -> dict[str, list[str]]:
    """Given a prompt, generate and return suggested nominal dimensions.

    Nominal dimensions are categorical properties that can be applied to the prompt.
    For example: What genre of short story should the LLM generate?

    Parameters
    ----------
    prompt : str
        User prompt to generate dimensions for.
    cat_num : int greater than 0, default 5
        Number of dimensions to generate.
    val_num : int greater than 0, default 5
        Number of possible values to generate for each dimension.
    temperature : float between 0 and 2, default 0.3
        How much randomness the LLM should employ when generating its response.
    metaprompt : f-str, default :const:`~prompt_brew.routers.autoprompt.prompts.NOM_GEN_PROMPT`
        Prompt to send to the LLM to generate dimensions for `prompt`.

    Returns
    -------
    dict of str to list of str
        Mapping of dimension names to possible values.

    """
    logger.debug("Getting nominal dimensions")
    nom_messages = [
        {
            "role": "user",
            "content": metaprompt.format(
                cat_num=cat_num,
                val_num=val_num,
                prompt=prompt,
            ),
        },
    ]

    logger.debug(
        "Calling OpenAI for nominal dimensions: %s",
        nom_messages,
    )
    nom_response = call_open_ai(
        messages=nom_messages,
        temperature=temperature,
    )
    logger.debug(
        "OpenAI response with nominal dimensions: %s",
        nom_response,
    )
    nominal_dimensions = json.loads(nom_response)
    return nominal_dimensions


def get_ordinal_dimensions(
    prompt: str,
    cat_num: int = 5,
    temperature: float = 0.3,
    metaprompt: str = ORD_GEN_PROMPT,
) -> dict[str, list[str]]:
    """Given a prompt, generate and return suggested ordinal dimensions.

    Ordinal dimensions are quantitatively adjustable properties that that can be
    applied to the prompt. For example: How healthy of a recipe should the LLM
    generate?

    Parameters
    ----------
    prompt : str
        User prompt to generate dimensions for.
    cat_num : int greater than 0, default 5
        Number of dimensions to generate.
    temperature : float between 0 and 2, default 0.3
        How much randomness the LLM should employ when generating its response.
    metaprompt : f-str, default :const:`~prompt_brew.routers.autoprompt.prompts.ORD_GEN_PROMPT`
        Prompt to send to the LLM to generate dimensions for `prompt`.

    Returns
    -------
    dict of str to list of str
        Mapping of dimension names to possible values (e.g. ``"Most"``, ``"Least"``).

    """
    logger.debug("Getting ordinal dimensions")
    ord_messages = [
        {
            "role": "user",
            "content": metaprompt.format(
                cat_num=cat_num,
                prompt=prompt,
            ),
        },
    ]
    logger.debug(
        "Calling OpenAI for ordinal dimensions: %s",
        ord_messages,
    )
    ord_response = call_open_ai(
        messages=ord_messages,
        temperature=temperature,
    )
    logger.debug(
        "OpenAI response with ordinal dimensions: %s",
        ord_response,
    )
    ordinal_dimensions = json.loads(ord_response)
    return ordinal_dimensions
