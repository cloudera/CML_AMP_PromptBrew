/*
 * ****************************************************************************
 *
 *  CLOUDERA APPLIED MACHINE LEARNING PROTOTYPE (AMP)
 *  (C) Cloudera, Inc. 2024
 *  All rights reserved.
 *
 *  Applicable Open Source License: Apache 2.0
 *
 *  NOTE: Cloudera open source products are modular software products
 *  made up of hundreds of individual components, each of which was
 *  individually copyrighted.  Each Cloudera open source product is a
 *  collective work under U.S. Copyright Law. Your license to use the
 *  collective work is as provided in your written agreement with
 *  Cloudera.  Used apart from the collective work, this file is
 *  licensed for your use pursuant to the open source license
 *  identified above.
 *
 *  This code is provided to you pursuant a written agreement with
 *  (i) Cloudera, Inc. or (ii) a third-party authorized to distribute
 *  this code. If you do not have a written agreement with Cloudera nor
 *  with an authorized and properly licensed third party, you do not
 *  have any rights to access nor to use this code.
 *
 *  Absent a written agreement with Cloudera, Inc. (“Cloudera”) to the
 *  contrary, A) CLOUDERA PROVIDES THIS CODE TO YOU WITHOUT WARRANTIES OF ANY
 *  KIND; (B) CLOUDERA DISCLAIMS ANY AND ALL EXPRESS AND IMPLIED
 *  WARRANTIES WITH RESPECT TO THIS CODE, INCLUDING BUT NOT LIMITED TO
 *  IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND
 *  FITNESS FOR A PARTICULAR PURPOSE; (C) CLOUDERA IS NOT LIABLE TO YOU,
 *  AND WILL NOT DEFEND, INDEMNIFY, NOR HOLD YOU HARMLESS FOR ANY CLAIMS
 *  ARISING FROM OR RELATED TO THE CODE; AND (D)WITH RESPECT TO YOUR EXERCISE
 *  OF ANY RIGHTS GRANTED TO YOU FOR THE CODE, CLOUDERA IS NOT LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR
 *  CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED TO, DAMAGES
 *  RELATED TO LOST REVENUE, LOST PROFITS, LOSS OF INCOME, LOSS OF
 *  BUSINESS ADVANTAGE OR UNAVAILABILITY, OR LOSS OR CORRUPTION OF
 *  DATA.
 *
 * ***************************************************************************
 */
import { v4 as uuidv4 } from "uuid";

export enum QueryKeys {
  "testPrompt",
  "generateRefinedPrompt",
  "generateDimensions",
}

type DimensionsType = { [key: string]: string };
type InputVariablesType = { [key: string]: string };
export type PromptStyleType =
  | "SIMPLE"
  | "ZERO_SHOT_CHAIN_OF_THOUGHT"
  | "FEW_SHOT_CHAIN_OF_THOUGHT"
  | "ASSUMED_EXPERTISE";

export type FieldTypeTaskDescription = {
  taskDescription?: string;
};
export type GenerateDimensionsResponse = {
  prompt: string;
  dimensions: { [key: string]: string[] };
};

export type GenerateRefinedPromptPayload = {
  prompt: string;
  dimensions: DimensionsType;
  input_variables: InputVariablesType;
  prompt_style?: PromptStyleType;
};

export type GenerateRefinedPromptResponse = {
  refined_prompt: string;
  input_variables: InputVariablesType;
  key: string;
  prompt_style: PromptStyleType;
};

export type TestPromptPayload = {
  prompt: string;
  input_variables: InputVariablesType;
};

const promptBrewPath = "promptbrew";

const commonHeaders = {
  "Content-type": "application/json",
};

const baseUrl: string = import.meta.env.DEV
  ? `http://localhost:8000/${promptBrewPath}`
  : `/${promptBrewPath}`;

export const generateDimensionsMutationFn = async (
  inputs: FieldTypeTaskDescription,
): Promise<GenerateDimensionsResponse> => {
  const response = await fetch(`${baseUrl}/generate-dimensions`, {
    body: JSON.stringify({ prompt: inputs.taskDescription }),
    method: "POST",
    headers: commonHeaders,
  });
  return await response.json();
};

export const generateRefinedPrompt = async (
  inputs: GenerateRefinedPromptPayload,
): Promise<GenerateRefinedPromptResponse> => {
  const response = await fetch(`${baseUrl}/generate-refined-prompt`, {
    body: JSON.stringify(inputs),
    method: "POST",
    headers: commonHeaders,
  });
  const res = await response.json();
  return { ...res, key: uuidv4() };
};

export const generateRefinedPrompts = async ({
  inputs,
  promptStyles,
}: {
  promptStyles: PromptStyleType[];
  inputs: GenerateRefinedPromptPayload;
}): Promise<GenerateRefinedPromptResponse[]> => {
  const promises = promptStyles.map((promptStyle) =>
    generateRefinedPrompt({
      ...inputs,
      prompt_style: promptStyle,
    }),
  );
  return await Promise.all(promises);
};

export const testPromptMutationFn = async (
  inputs: TestPromptPayload,
): Promise<string> => {
  const response = await fetch(`${baseUrl}/test-prompt`, {
    body: JSON.stringify(inputs),
    method: "POST",
    headers: commonHeaders,
  });
  return await response.json();
};
