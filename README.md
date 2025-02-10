# PromptBrew - Iterate on LLM Prompts

### What is PromptBrew?

PromptBrew offers AI-powered assistance in creating high-performing and reliable prompts. Whether you're starting with your project goals or a draft prompt, PromptBrew guides you through a few simple steps to generate and provide new candidate prompts for enhancement. These improved prompts can then be seamlessly integrated into your project and leaderboard.

PromptBrew leverages popular, research-backed, high-performing prompting techniques. For instance, a Chain-of-Thought (COT) prompt encourages the model to break down a problem into discrete steps, often leading to significantly improved outcomes.

Using PromptBrew not only saves time and reduces frustration but also ensures you're employing effective techniques to enhance your project's performance. This confidence comes from having access to better prompts and the ability to experiment with various strategies.

Inspired by [a paper](<(https://arxiv.org/abs/2310.12953)>) entitled <i>Luminate: Structured Generation and Exploration of Design Space with Large Language Models for Human-AI Co-Creation</i>

Please visit the [Verta PromptBrew docs](https://docs.verta.ai/verta-workbench-documentation/workbench-features/autoprompt-automatic-prompt-generation) for more information.

### Prompts

PromptBrew leverages four types of prompting strategies to handle different use cases:

1. Simple: Standard instructional prompt

2. Zero-Shot Chain-of-Thought: Instructional prompt to return complex reasoning steps

3. Few-Shot Chain-of-Thought: Instructional prompt to return complex reasoning steps with reference example

4. Assumed Expertise: Instructional prompt that constrains the LLM to be an assumed expert

### Before using PromptBrew

PromptBrew is accessible within the Prompt Playground of your project. If you haven't yet set up your first project, explore a starter kit and follow a sample process from start to finish to familiarize yourself with how things work.

It's important to remember that PromptBrew cannot solve your business problems for you—at least, not yet. Ensure you have a clear and specific task in mind that you want the model to address. Complex objectives may require multiple steps or models. Consider how you would approach hiring for a human task, such as writing, where you might employ both a writer and an editor, providing each with separate success criteria. Apply a similar strategy when working with LLMs and other generative models: avoid attempting to tackle an overly broad range of problems with a single prompt. If you need assistance, Verta is always here to help.

### Using PromptBrew

PromptBrew operates like an interactive form, simulating a conversation between you and our LLM-powered technology.

1. Start with your project goals. Defining clear goals often leads to better outcomes. Below are some examples to follow:

- Write catchy LinkedIn Posts for me
- I want to write blog posts based on content I find online
- I want to write children's stories

2. Fill out a custom form based on prompt attributes. Think of this as selecting from a menu of options for your desired outputs. For instance, if requesting prompts for short stories, we might ask, "Who is the audience for these stories: children, young adults, technical readers, a mix, or others?" This process helps refine your focus and ensures the prompts are tailored to your specific needs. </br></br>
   The form will include attributes like "audience" or "tone," with 6 to 10 options available. You'll have the flexibility to add or delete options as needed.

3. Describe the source data for your model. Most prompts will have variables that you will substitute with unique values for each API call. When setting up your project, samples of this data were uploaded, allowing us to populate the column headers of the data you provided. We ask you to describe what each column header represents, enabling us to craft prompts that expertly incorporate your variables.

4. Review a generated deck of prompts. After you complete the form, we will present you with a selection of prompts for your review. Flip through the deck and select "Add to prompt list" for any prompts you're considering adding to your project. Additionally, you have the option to enter the playground to test or edit any of the candidate prompts. </br></br> Feel free to restart or regenerate prompts using different attribute values whenever you desire.

### Common Issues

The most frequent issue encountered with this setup is that the output might attempt to complete your task directly rather than generate a refined set of instructions for accomplishing the task.

For instance, if you seed PromptBrew with "Give me a plan for endurance running," you might receive an actual plan in response. However, your goal might have been to obtain an improved version of the prompt, "Give me an endurance running plan."

To avoid this issue, it's more effective to describe your tasks and goals rather than submitting draft prompts directly. If you find this happening frequently, please don't hesitate to reach out for assistance. We're here to ensure you receive the precise prompts you need.

## Installation

Follow the [standard instructions](https://docs.cloudera.com/machine-learning/cloud/applied-ml-prototypes/topics/ml-amp-add-catalog.html) for installing this AMP into your CML workspace.
The "File Name" to use is `catalog-entry.yaml`.

For configuring the project, you will need to provide some environment variables that enable using the OpenAI LLM of your choice.

If you are using Azure-hosted OpenAI models, you will need to provide the following environment variables:

- `AZURE_OPENAI_ENDPOINT`
- `OPENAI_MODEL`
- `OPENAI_API_KEY`

If you are using the OpenAI publicly hosted models, you will need to provide the following environment variables:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` note: Optional; defaults to `gpt-3.5-turbo`

## Developer Information

Ignore this section unless you are working on developing or enhancing this AMP.

### FE Setup

- Navigate to the FE subdirectory (`cd ./FeApp`)
- Make sure node is installed (if not, run `brew install node@22`)
- Run `npm install`
- Run `npm run build` to get the contents of the webapp built for the python app to serve it up
- Start the dev server (`npm run dev`) [if you want to run the dev server standalone, for debugging, for instance?]

### Python Setup

- Install Python (via [pyenv](https://github.com/pyenv/pyenv), probably) (directly via brew, if you must)
- `cd prompt_brew`
- Create a virtual environment (`python -m venv venv; source venv/bin/activate`)
- Specify env variables:
  - AZURE
    - AZURE_OPENAI_ENDPOINT=https://verta.openai.azure.com
    - OPENAI_MODEL=gpt4-32k
    - OPENAI_API_KEY=PLEASE ASK
  - Non-AZURE
    - OPENAI_API_KEY=Please ask or provide your own
    - OPENAI_MODEL=Optional; defaults to `gpt-3.5-turbo`
- Install dependencies (`python -m pip install -r requirements.txt`)
- `fastapi dev`
  - ends up running on port 8000

## The Fine Print

IMPORTANT: Please read the following before proceeding. This AMP includes or otherwise depends on certain third party software packages. Information about such third party software packages are made available in the notice file associated with this AMP. By configuring and launching this AMP, you will cause such third party software packages to be downloaded and installed into your environment, in some instances, from third parties' websites. For each third party software package, please see the notice file and the applicable websites for more information, including the applicable license terms. If you do not wish to download and install the third party software packages, do not configure, launch or otherwise use this AMP. By configuring, launching or otherwise using the AMP, you acknowledge the foregoing statement and agree that Cloudera is not responsible or liable in any way for the third party software packages.
