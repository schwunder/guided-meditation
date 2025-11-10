#!/usr/bin/env bun
/**
 * Prompt enhancer for skills-first workflow
 * Reminds Claude to follow CLAUDE.md conventions
 *
 * Note: Testing hook chain trigger
 * Final test - TypeScript auto-fix v2
 */

export {};

const input = await Bun.stdin.text();
const { userPrompt = "" } = JSON.parse(input);

// Detect new feature requests
const isNewFeature = /\b(create|build|add|implement|new)\b.*(feature|component|ui|interface)/i.test(
  userPrompt,
);

if (isNewFeature) {
  const enhanced = `⚠️ New feature → Follow CLAUDE.md: Read CONTEXT.md first, then use skills workflow\n\n${userPrompt}`;
  console.log(
    JSON.stringify({
      userPrompt: enhanced,
      systemMessage: "Skills workflow reminder",
    }),
  );
} else {
  console.log(JSON.stringify({ systemMessage: "Success" }));
}
