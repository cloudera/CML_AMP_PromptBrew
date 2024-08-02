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
import { Collapse, CollapseProps, Divider, Flex, Typography } from "antd";
import Link from "antd/es/typography/Link";
import CallToAction from "src/CallToAction";

const InformationSection = () => {
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <Typography.Text strong>What is PromptBrew?</Typography.Text>,
      children: (
        <>
          <Typography.Paragraph>
            PromptBrew offers AI-powered assistance in creating high-performing
            and reliable prompts. Whether you're starting with your project
            goals or a draft prompt, PromptBrew guides you through a few simple
            steps to generate and provide new candidate prompts for enhancement.
            These improved prompts can then be seamlessly integrated into your
            project and leaderboard.
          </Typography.Paragraph>
          <Typography.Paragraph>
            PromptBrew leverages popular, research-backed, high-performing
            prompting techniques. For instance, a Chain-of-Thought (COT) prompt
            encourages the model to break down a problem into discrete steps,
            often leading to significantly improved outcomes.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Using PromptBrew not only saves time and reduces frustration but
            also ensures you're employing effective techniques to enhance your
            project's performance. This confidence comes from having access to
            better prompts and the ability to experiment with various
            strategies.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Please visit the{" "}
            <Link
              href="https://docs.verta.ai/verta-workbench-documentation/workbench-features/autoprompt-automatic-prompt-generation"
              target="_blank"
            >
              Verta PromptBrew docs
            </Link>{" "}
            for more information.
          </Typography.Paragraph>
        </>
      ),
    },
    {
      key: "2",
      label: <Typography.Text strong>Before using PromptBrew</Typography.Text>,
      children: (
        <>
          <Typography.Paragraph>
            PromptBrew is accessible within the Prompt Playground of your
            project. If you haven't yet set up your first project, explore a
            starter kit and follow a sample process from start to finish to
            familiarize yourself with how things work.
          </Typography.Paragraph>
          <Typography.Paragraph>
            It's important to remember that PromptBrew cannot solve your
            business problems for you—at least, not yet. Ensure you have a clear
            and specific task in mind that you want the model to address.
            Complex objectives may require multiple steps or models. Consider
            how you would approach hiring for a human task, such as writing,
            where you might employ both a writer and an editor, providing each
            with separate success criteria. Apply a similar strategy when
            working with LLMs and other generative models: avoid attempting to
            tackle an overly broad range of problems with a single prompt. If
            you need assistance, Verta is always here to help.
          </Typography.Paragraph>
        </>
      ),
    },
    {
      key: "3",
      label: <Typography.Text strong>Using PromptBrew</Typography.Text>,
      children: (
        <>
          <Typography.Paragraph>
            PromptBrew operates like an interactive form, simulating a
            conversation between you and our LLM-powered technology.
          </Typography.Paragraph>

          <ol>
            <li>
              <Typography.Paragraph>
                <b>Start with your project goals.</b> Defining clear goals often
                leads to better outcomes. Below are some examples to follow:
              </Typography.Paragraph>
            </li>

            <ul>
              <li>
                <Typography.Paragraph>
                  Write catchy LinkedIn Posts for me
                </Typography.Paragraph>
              </li>

              <li>
                <Typography.Paragraph>
                  I want to write blog posts based on content I find online
                </Typography.Paragraph>
              </li>

              <li>
                <Typography.Paragraph>
                  I want to write children's stories
                </Typography.Paragraph>
              </li>
            </ul>
            <li>
              <Typography.Paragraph>
                <b>Fill out a custom form based on prompt attributes.</b> Think
                of this as selecting from a menu of options for your desired
                outputs. For instance, if requesting prompts for short stories,
                we might ask, "Who is the audience for these stories: children,
                young adults, technical readers, a mix, or others?" This process
                helps refine your focus and ensures the prompts are tailored to
                your specific needs.
              </Typography.Paragraph>

              <Typography.Paragraph>
                The form will include attributes like "audience" or "tone," with
                6 to 10 options available. You'll have the flexibility to add or
                delete options as needed.
              </Typography.Paragraph>
            </li>

            <li>
              <Typography.Paragraph>
                <b>Describe the source data for your model.</b> Most prompts
                will have variables that you will substitute with unique values
                for each API call. When setting up your project, samples of this
                data were uploaded, allowing us to populate the column headers
                of the data you provided. We ask you to describe what each
                column header represents, enabling us to craft prompts that
                expertly incorporate your variables.
              </Typography.Paragraph>
            </li>

            <li>
              <b>Review a generated deck of prompts.</b> After you complete the
              form, we will present you with a selection of prompts for your
              review. Flip through the deck and select "Add to prompt list" for
              any prompts you're considering adding to your project.
              Additionally, you have the option to enter the playground to test
              or edit any of the candidate prompts.
            </li>
          </ol>

          <Typography.Paragraph>
            Feel free to restart or regenerate prompts using different attribute
            values whenever you desire.
          </Typography.Paragraph>
        </>
      ),
    },
    {
      key: "4",
      label: <Typography.Text strong>Common Issues</Typography.Text>,
      children: (
        <>
          <Typography.Paragraph>
            The most frequent issue encountered with this setup is that the
            output might attempt to complete your task directly rather than
            generate a refined set of instructions for accomplishing the task.
          </Typography.Paragraph>

          <Typography.Paragraph>
            For instance, if you seed PromptBrew with "Give me a plan for
            endurance running," you might receive an actual plan in response.
            However, your goal might have been to obtain an improved version of
            the prompt, "Give me an endurance running plan."
          </Typography.Paragraph>

          <Typography.Paragraph>
            To avoid this issue, it's more effective to describe your tasks and
            goals rather than submitting draft prompts directly. If you find
            this happening frequently, please don't hesitate to reach out for
            assistance. We're here to ensure you receive the precise prompts you
            need.
          </Typography.Paragraph>
        </>
      ),
    },
  ];

  return (
    <Flex vertical align="center" gap={20} style={{ marginBottom: 100 }}>
      <CallToAction />
      <Divider />
      <Typography.Title level={3} style={{ margin: 0 }}>
        About PromptBrew
      </Typography.Title>
      <Collapse ghost style={{ width: 800 }} items={items}></Collapse>
    </Flex>
  );
};

export default InformationSection;
