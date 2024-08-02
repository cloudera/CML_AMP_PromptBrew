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

"""Helper functions for calling OpenAI."""

import logging

from openai import AzureOpenAI, OpenAI

from ...config import settings
from .prompts import GEN_EXAMPLES, PROMPT_GEN_PROMPT_TEMPLATE, PromptStyle

logger = logging.getLogger(__name__)


def get_refined_prompt(
    prompt: str,
    requirements: dict[str, str],
    input_variables: dict[str, str],
    temperature: float = 0.3,
    metaprompt_template: str = PROMPT_GEN_PROMPT_TEMPLATE,
    prompt_style: PromptStyle = PromptStyle.SIMPLE,
) -> str:
    """Given a prompt, dimensions, and variables, generate and return a refined prompt.

    Parameters
    ----------
    prompt : str
        User prompt to refine.
    requirements : dict of str to str
        User-selected dimensions and values for the LLM to augment `prompt`.
    input_variables : dict or str to str
        User-specified variable names and descriptions for the LLM to templatize into `prompt`.
    temperature : float between 0 and 2, default 0.3
        How much randomness the LLM should employ when generating its response.
    metaprompt_template : f-str, default :const:`~prompt_brew.routers.autoprompt.prompts.PROMPT_GEN_PROMPT_TEMPLATE`
        Prompt to send to the LLM to refine `prompt`.
    prompt_style : :class:`~prompt_brew.routers.autoprompt.prompts.PromptStyle`, default ``PromptStyle.SIMPLE``
        What strategy to use for prompt refinement.

    Returns
    -------
    str
        Refined `prompt`.

    """
    logger.info(
        "Generating refined prompt with style: %s",
        prompt_style,
    )

    joined_requirements = "\n" + "\n".join(
        [f"{k}: {v}" for k, v in requirements.items()],
    )
    joined_input_variables = "\n" + "\n".join(
        [f"{k}: {v}" for k, v in input_variables.items()],
    )
    system_message = """You are an expert at creating instructional prompts for LLMs."""
    prompt_gen_messages = [
        {"role": "system", "content": system_message},
        {
            "role": "user",
            "content": metaprompt_template.format(
                prompt=prompt,
                requirements=joined_requirements,
                input_variables=joined_input_variables,
                examples=GEN_EXAMPLES[prompt_style],
            ),
        },
    ]

    logger.debug(
        "Calling OpenAI to generate refined prompt: %s",
        prompt_gen_messages,
    )
    prompt_gen_response = call_open_ai(
        messages=prompt_gen_messages,
        temperature=temperature,
    )
    logger.debug(
        "OpenAI response with refined prompt: %s",
        prompt_gen_response,
    )
    return prompt_gen_response


def call_open_ai(
    messages: list[dict[str, str]],
    temperature: float,
) -> str:
    """Send chat messages to an LLM and return its response.

    Parameters
    ----------
    messages : list of dict of str to str
        Conversation messages to send to the LLM. For the format, see
        https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages.
    temperature : float between 0 and 2
        How much randomness the LLM should employ when generating its response.

    Returns
    -------
    str
        LLM response.

    """
    client = _build_client()
    model = settings.openai.openai_model
    completions = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
    )
    completion = completions.choices[0]
    if completion.finish_reason == "length":
        raise ValueError(
            f'incomplete model output for model "{model}" due to token limit'
        )
    elif completion.finish_reason == "content_filter":
        raise ValueError(f'omitted content due to content filter from model "{model}"')

    if not (
        completion.message.content.startswith('"')
        or completion.message.content.endswith('"')
    ):
        return completion.message.content

    return completion.message.content.strip('"')


def _build_client() -> AzureOpenAI | OpenAI:
    """Instantiate and return an OpenAI client.

    Returns
    -------
    :class:`openai.AzureOpenAI` or :class:`openai.OpenAI`
        OpenAI client.

    """
    if settings.openai.azure_openai_endpoint:
        client = AzureOpenAI(
            api_key=settings.openai.openai_api_key,
            api_version=settings.openai.api_version,
        )
    else:
        client = OpenAI()
    return client


def run_prompt(prompt: str) -> str:
    """Send a prompt to an LLM and return its response.

    Parameters
    ----------
    prompt : str
        Prompt to send to the LLM.

    Returns
    -------
    str
        LLM response.

    """
    prompt_gen_messages = [
        {
            "role": "user",
            "content": prompt,
        },
    ]
    return call_open_ai(
        messages=prompt_gen_messages,
        temperature=0.3,
    )
