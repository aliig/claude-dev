import { Anthropic } from "@anthropic-ai/sdk"
import { ExtendedUsage } from "../shared/Beta"
import { ApiHandler, withoutImageData } from "."
import { anthropicDefaultModelId, AnthropicModelId, anthropicModels, ApiHandlerOptions, ModelInfo } from "../shared/api"

export class AnthropicHandler implements ApiHandler {
	private options: ApiHandlerOptions
	private client: Anthropic

	constructor(options: ApiHandlerOptions) {
		this.options = options
		this.client = new Anthropic({ apiKey: this.options.apiKey })
	}

	async createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
		tools: Anthropic.Messages.Tool[]
	): Promise<Anthropic.Messages.Message & { usage: ExtendedUsage }> {
		return await this.client.beta.promptCaching.messages.create(
			{
				model: this.getModel().id,
				max_tokens: this.getModel().info.maxTokens,
				system: systemPrompt,
				messages,
				tools,
				tool_choice: { type: "auto" },
			},
			{
				headers: {
					...(this.getModel().id === "claude-3-5-sonnet-20240620"
						? { "anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15" }
						: {}),
				},
			}
		)
	}

	createUserReadableRequest(
		userContent: Array<
			| Anthropic.TextBlockParam
			| Anthropic.ImageBlockParam
			| Anthropic.ToolUseBlockParam
			| Anthropic.ToolResultBlockParam
		>
	): any {
		return {
			model: this.getModel().id,
			max_tokens: this.getModel().info.maxTokens,
			system: "(see SYSTEM_PROMPT in src/ClaudeDev.ts)",
			messages: [{ conversation_history: "..." }, { role: "user", content: withoutImageData(userContent) }],
			tools: "(see tools in src/ClaudeDev.ts)",
			tool_choice: { type: "auto" },
		}
	}

	getModel(): { id: AnthropicModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId
		if (modelId && modelId in anthropicModels) {
			const id = modelId as AnthropicModelId
			return { id, info: anthropicModels[id] }
		}
		return { id: anthropicDefaultModelId, info: anthropicModels[anthropicDefaultModelId] }
	}
}
