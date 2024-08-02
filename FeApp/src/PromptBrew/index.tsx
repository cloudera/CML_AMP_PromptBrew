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
import { useEffect, useState } from "react";
import { Button, Collapse, Flex, Form, message } from "antd";
import { GenerateRefinedPromptResponse } from "../api/apis";
import { InputVariablesInitialState } from "./Variables/InputVariablesContainer.tsx";
import { GeneratedPromptsContainer } from "./GeneratedPrompts/GeneratePromptsContainer.tsx";
import {
  useGenerateDimensionsMutation,
  useRefinePromptMutation,
} from "src/api/mutations.tsx";

import { translateInputVariables } from "./utils.ts";
import {
  FieldTypeTaskDescription,
  MappedDimension,
  Variable,
} from "./types.ts";
import { onErrorHandler, transformSuggestedDimensions } from "src/api/utils.ts";
import { TaskDescription } from "./TaskDescription/index.tsx";
import { collapseDimensions, dimensionPanelName } from "./Dimensions/index.tsx";
import { collapseVariables, variablesPanelName } from "./Variables/index.tsx";

const PromptBrew = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDimensions, setSelectedDimensions] = useState<
    MappedDimension[]
  >([]);
  const [inputVariables, setInputVariables] = useState<Variable[]>([
    InputVariablesInitialState(),
  ]);
  const [form] = Form.useForm();
  const [canGeneratePrompts, setCanGeneratePrompts] = useState(false);
  const [selectPrompt, setRequestedPrompt] = useState("");
  const [generatedPrompts, setGeneratedPrompts] = useState<
    GenerateRefinedPromptResponse[]
  >([]);

  const {
    mutate: generateDimensionsMutate,
    isPending: generateDimensionsPending,
  } = useGenerateDimensionsMutation({
    onSuccess: (result) => {
      const suggestedDimensions = transformSuggestedDimensions(result);
      setSelectedDimensions(suggestedDimensions);
      setRequestedPrompt(result.prompt);
    },
    onError: (error: Error) => onErrorHandler(error, messageApi),
  });

  const { mutate: refinePromptMutate, isPending: isRefinePromptPending } =
    useRefinePromptMutation({
      onSuccess: (result) => setGeneratedPrompts(result),
      onError: (error: Error) => onErrorHandler(error, messageApi),
    });

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setCanGeneratePrompts(true))
      .catch(() => setCanGeneratePrompts(false));
  }, [form, values]);

  const handleGenerateDimensions = (
    taskDescription: FieldTypeTaskDescription,
  ) => {
    setSelectedDimensions([]);
    setInputVariables([InputVariablesInitialState()]);
    setGeneratedPrompts([]);
    generateDimensionsMutate(taskDescription);
  };

  const handleGenerateRefinedPrompt = () => {
    setGeneratedPrompts([]);
    const dimensions = {};
    selectedDimensions.forEach((dim) => {
      if (dim.selectedValue !== "") {
        Object.assign(dimensions, { [dim.name]: dim.selectedValue });
      }
    });

    refinePromptMutate({
      promptStyles: [
        "SIMPLE",
        "ZERO_SHOT_CHAIN_OF_THOUGHT",
        "FEW_SHOT_CHAIN_OF_THOUGHT",
        "ASSUMED_EXPERTISE",
      ],
      inputs: {
        prompt: selectPrompt,
        dimensions: dimensions,
        input_variables: translateInputVariables(inputVariables),
      },
    });
  };

  const [dimensionsVisiblePane, setDimensionsVisiblePane] = useState([
    dimensionPanelName,
  ]);
  const [variablesVisiblePane, setVariablesVisiblePane] = useState([
    variablesPanelName,
  ]);
  const collapseBothPanels = () => {
    setDimensionsVisiblePane([]);
    setVariablesVisiblePane([]);
  };

  return (
    <Flex vertical align="center" justify="center" gap={30}>
      {contextHolder}
      <TaskDescription
        handleGenerateDimensions={handleGenerateDimensions}
        generateDimensionsPending={generateDimensionsPending}
      />
      {/* 2nd form starts here  TODO: break into separate components */}
      {selectedDimensions.length > 0 ? (
        <>
          <Form form={form}>
            <Flex align="center" vertical gap={30}>
              <Collapse
                style={{ width: 800 }}
                items={collapseDimensions(
                  selectedDimensions,
                  setSelectedDimensions,
                )}
                defaultActiveKey={[dimensionPanelName]}
                activeKey={dimensionsVisiblePane}
                onChange={() =>
                  setDimensionsVisiblePane(
                    dimensionsVisiblePane.length == 1
                      ? []
                      : [dimensionPanelName],
                  )
                }
              />
              <Collapse
                style={{ width: 800 }}
                items={collapseVariables(inputVariables, setInputVariables)}
                defaultActiveKey={[variablesPanelName]}
                activeKey={variablesVisiblePane}
                onChange={() =>
                  setVariablesVisiblePane(
                    variablesVisiblePane.length == 1
                      ? []
                      : [variablesPanelName],
                  )
                }
              />
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!canGeneratePrompts}
                  onClick={() => {
                    collapseBothPanels();
                    handleGenerateRefinedPrompt();
                  }}
                  loading={isRefinePromptPending}
                >
                  Generate Prompts
                </Button>
              </Form.Item>
            </Flex>
          </Form>
          <GeneratedPromptsContainer generatedPrompts={generatedPrompts} />
        </>
      ) : null}
    </Flex>
  );
};

export default PromptBrew;
