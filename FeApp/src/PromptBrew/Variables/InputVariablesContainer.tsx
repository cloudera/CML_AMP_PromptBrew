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
import { Button, Flex, Input, Typography, Col, Row, Tooltip, Form } from "antd";
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Variable } from "../types";

const { Text } = Typography;

export const InputVariablesInitialState = (): Variable => {
  return {
    name: undefined,
    description: undefined,
    key: uuidv4(),
  };
};

export const InputVariablesContainer = ({
  inputVariables,
  setInputVariables,
}: {
  inputVariables: Variable[];
  setInputVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
}) => {
  const handleAppendVariable = () => {
    setInputVariables([...inputVariables, InputVariablesInitialState()]);
  };
  const handleInputFieldChange = (updatedVariable: Variable) => {
    const variables = inputVariables.map((value) => {
      if (value.key === updatedVariable.key) {
        return updatedVariable;
      }
      return value;
    });
    setInputVariables(variables);
  };
  return (
    <Flex vertical gap={10} align="start">
      <Text type="secondary">
        Include placeholders for inputs that you will manually provide to the
        model (e.g., a blog URL or set of notes){" "}
        <Tooltip title="Both the variable name and description are required.  PromptBrew will insert these variables as placeholders into the generated prompts">
          <InfoCircleOutlined />
        </Tooltip>
      </Text>
      {inputVariables.map((variable) => {
        return (
          <Row key={variable.key} style={{ width: "100%" }} gutter={20}>
            <Col flex={1}>
              <Form.Item
                name={variable.key}
                rules={[
                  {
                    pattern: /^[a-zA-Z_]+$/g,
                    message: "Only letters and underscores.",
                  },
                ]}
              >
                <Input
                  placeholder="Variable name"
                  onChange={(event) =>
                    handleInputFieldChange({
                      ...variable,
                      name: event.target.value,
                    })
                  }
                  value={variable.name}
                />
              </Form.Item>
            </Col>
            <Col flex={20}>
              <Input
                placeholder="Description"
                style={{ width: "60%" }}
                onChange={(event) =>
                  handleInputFieldChange({
                    ...variable,
                    description: event.target.value,
                  })
                }
                value={variable.description}
              />
            </Col>
          </Row>
        );
      })}
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={handleAppendVariable}
      >
        Add Variable
      </Button>
    </Flex>
  );
};
