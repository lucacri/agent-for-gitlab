export function validateConfig(context) {
  if (!context.gitlabToken) throw new Error("Missing GITLAB_TOKEN environment variable");
  if (!context.projectId) throw new Error("Missing CI_PROJECT_ID environment variable");

  if (!context.projectPath) {
    throw new Error("Missing project path. Set AI_PROJECT_PATH or CI_PROJECT_PATH (e.g. group/subgroup/project)");
  }

  // AI_MODEL is optional - defaults to "sonnet" in claude.js
}
