export function buildContext() {
  // Combine prompts: webhook (AI_INSTRUCTIONS) + pipeline (CUSTOM_AGENT_PROMPT)
  const webhookAppPrompt = process.env.AI_INSTRUCTIONS || "";
  const pipelinePrompt = process.env.CUSTOM_AGENT_PROMPT || "";
  let combinedPrompt = "";
  if (webhookAppPrompt && pipelinePrompt) {
    combinedPrompt = `${webhookAppPrompt.trim()}\n\n---\n# Pipeline Additions\n${pipelinePrompt.trim()}`;
  } else {
    combinedPrompt = webhookAppPrompt || pipelinePrompt || "";
  }

  return {
    projectPath: process.env.AI_PROJECT_PATH,
    author: process.env.AI_AUTHOR,
    resourceType: process.env.AI_RESOURCE_TYPE,
    resourceId: process.env.AI_RESOURCE_ID,
    discussionId: process.env.AI_DISCUSSION_ID,
    prompt: process.env.DIRECT_PROMPT,
    branch: process.env.AI_BRANCH,
    email: process.env.AI_GITLAB_EMAIL,
    username: process.env.AI_GITLAB_USERNAME,
    aiModel: process.env.AI_MODEL,
    aiInstructions: combinedPrompt,
    gitlabToken: process.env.GITLAB_TOKEN,
    host: process.env.CI_SERVER_HOST || "gitlab.com",
    projectId: process.env.CI_PROJECT_ID,
    serverUrl: process.env.CI_SERVER_URL || "https://gitlab.com",
    checkoutDir: "./repo",
  };
}