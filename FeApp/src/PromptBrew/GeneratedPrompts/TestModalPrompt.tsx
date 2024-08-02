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
import {
  Button,
  Collapse,
  CollapseProps,
  Divider,
  Flex,
  Modal,
  Typography,
  message,
} from "antd";
import { GenerateRefinedPromptResponse } from "src/api/apis";
import { useState } from "react";
import _ from "lodash";
import { InputVariableInput } from "./InputVariableInput";
import { onErrorHandler } from "src/api/utils";
import { useTestPromptMutation } from "src/api/mutations";

const { Paragraph, Text } = Typography;

const ModelResponse = ({ modelResponse }: { modelResponse?: string }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Divider>
        <Typography>Response</Typography>
      </Divider>
      {modelResponse ? (
        <Paragraph copyable style={{ whiteSpace: "pre-wrap" }}>
          {modelResponse}
        </Paragraph>
      ) : (
        <Text type="secondary">Run test to generate response!</Text>
      )}
    </div>
  );
};

export const TestPromptModal = ({
  modalPrompt,
  setModalPrompt,
}: {
  modalPrompt?: GenerateRefinedPromptResponse;
  setModalPrompt: React.Dispatch<
    React.SetStateAction<GenerateRefinedPromptResponse | undefined>
  >;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [inputVariableValues, setInputVariableValues] = useState<{
    [key: string]: string;
  }>(() => {
    const initialValue = Object.assign({}, modalPrompt?.input_variables);
    Object.keys(initialValue).forEach((key) => (initialValue[key] = ""));
    return modalPrompt?.input_variables || {};
  });
  const [modelResponse, setModelResponse] = useState("");
  const { mutate: testPromptMutate, isPending: isTestPromptPending } =
    useTestPromptMutation({
      onSuccess: setModelResponse,
      onError: (error: Error) => onErrorHandler(error, messageApi),
    });

  const handlePromptTest = () => {
    testPromptMutate({
      input_variables: inputVariableValues,
      prompt: modalPrompt?.refined_prompt || "",
    });
  };

  const handleModalClose = () => {
    setModalPrompt(undefined);
    setModelResponse("");
    setInputVariableValues({});
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Test Prompt",
      children: (
        <Typography style={{ whiteSpace: "pre-wrap" }}>
          {modalPrompt?.refined_prompt}
        </Typography>
      ),
    },
  ];

  return (
    <Modal
      title={`${_.startCase(
        modalPrompt?.prompt_style.toLowerCase().replace(/_/g, " "),
      )} Prompt`}
      open={Boolean(modalPrompt)}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      destroyOnClose
      width={800}
      footer={null}
    >
      {contextHolder}
      <Flex gap={20} vertical>
        <Collapse style={{ marginTop: 20 }} items={items} />
        {Object.keys(modalPrompt?.input_variables || {}).length > 0 ? (
          <Divider>
            <Typography>Variables</Typography>
          </Divider>
        ) : null}
        {Object.keys(modalPrompt?.input_variables || {}).map((name) => (
          <InputVariableInput
            name={name}
            key={name}
            inputVariableValues={inputVariableValues}
            modalPrompt={modalPrompt}
            setInputVariableValues={setInputVariableValues}
          />
        ))}
        <div>
          <Button
            type="primary"
            loading={isTestPromptPending}
            onClick={handlePromptTest}
          >
            Test Prompt
          </Button>
        </div>
        <ModelResponse modelResponse={modelResponse} />
      </Flex>
    </Modal>
  );
};
