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
import { Button, Flex, Form } from "antd";
import { FieldTypeTaskDescription } from "../types";
import TextArea from "antd/es/input/TextArea";
import SampleTasksButtons from "./SuggestedTasksButtons";

export const TaskDescription = ({
  handleGenerateDimensions,
  generateDimensionsPending,
}: {
  handleGenerateDimensions: (taskDescription: FieldTypeTaskDescription) => void;
  generateDimensionsPending: boolean;
}) => {
  const [form] = Form.useForm();

  const handleSuggestionClick = (suggestion: string) => {
    form.setFieldValue("taskDescription", suggestion);
    form.validateFields();
    handleGenerateDimensions({
      taskDescription: form.getFieldValue("taskDescription"),
    });
  };

  return (
    <Form
      name="attributes-gen"
      form={form}
      initialValues={{ remember: true }}
      onFinish={(values: FieldTypeTaskDescription) => {
        handleGenerateDimensions(values);
      }}
      autoComplete="off"
    >
      <Flex align="center" vertical>
        <div style={{ width: 800 }}>
          <Form.Item
            name="taskDescription"
            style={{ marginBottom: 0 }}
            hasFeedback
            rules={[{ required: true, message: <></> }]}
          >
            <TextArea
              style={{ padding: 10 }}
              placeholder='Task description (eg. "I want to write short stories..")'
              autoSize={{ minRows: 4, maxRows: 6 }}
            />
          </Form.Item>
        </div>
        <Form.Item>
          <SampleTasksButtons handleSuggestionClick={handleSuggestionClick} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={generateDimensionsPending}
          >
            Generate Attributes
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};
