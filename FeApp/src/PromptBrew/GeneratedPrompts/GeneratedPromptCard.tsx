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
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Flex, Row, Tooltip, Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import _ from "lodash";
import { useState } from "react";

import { GenerateRefinedPromptResponse } from "src/api/apis";
import { TestPromptModal } from "./TestModalPrompt";

const { Text } = Typography;

const infoText = {
  SIMPLE: "Standard instructional prompt",
  ZERO_SHOT_CHAIN_OF_THOUGHT:
    "Instructional prompt to return complex reasoning steps",
  FEW_SHOT_CHAIN_OF_THOUGHT:
    "Instructional prompt to return complex reasoning steps with reference examples",
  ASSUMED_EXPERTISE:
    "Instructional prompt that constrains the LLM to be an assumed expert",
};

export const GeneratedPromptCard = ({
  prompt,
}: {
  prompt: GenerateRefinedPromptResponse;
}) => {
  const [modalPrompt, setModalPrompt] =
    useState<GenerateRefinedPromptResponse>();
  const handleOpenModal = (prompt: GenerateRefinedPromptResponse) => {
    setModalPrompt(prompt);
  };
  return (
    <Flex key={prompt.key}>
      <TestPromptModal
        modalPrompt={modalPrompt}
        setModalPrompt={setModalPrompt}
      />
      <Card
        style={{ minHeight: 200, width: 800 }}
        title={
          <Row align="middle">
            <Col span={12}>
              <Text style={{ textWrap: "pretty" }}>
                {_.startCase(
                  prompt.prompt_style.toLowerCase().replace(/_/g, " "),
                )}{" "}
                Prompt
                {infoText[prompt.prompt_style] ? (
                  <Tooltip title={infoText[prompt.prompt_style]}>
                    <InfoCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                ) : null}
              </Text>
            </Col>
            <Col span={8} offset={4}>
              <Flex justify="end">
                <Button onClick={() => handleOpenModal(prompt)}>
                  Test Prompt
                </Button>
              </Flex>
            </Col>
          </Row>
        }
      >
        <Paragraph
          style={{ whiteSpace: "pre-wrap" }}
          ellipsis={{ rows: 8, expandable: true }}
          copyable
        >
          {prompt.refined_prompt}
        </Paragraph>
      </Card>
    </Flex>
  );
};
