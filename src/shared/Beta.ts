import { Anthropic } from "@anthropic-ai/sdk"
import { PromptCachingBetaUsage } from "@anthropic-ai/sdk/resources/beta/prompt-caching/messages"

export type ExtendedUsage = Anthropic.Messages.Usage & Partial<PromptCachingBetaUsage>;