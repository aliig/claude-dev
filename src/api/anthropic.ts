import { Anthropic } from "@anthropic-ai/sdk"
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
	): Promise<Anthropic.Messages.Message> {
		const systemMessages: Anthropic.Messages.SystemMessageParam[] = [
			{
				role: "system",
				content: [
					{
						type: "text",
						text: systemPrompt,
						...(this.options.usePromptCaching ? { cache_control: { type: "ephemeral" } } : {})
					}
				]
			}
		]

		const cachedTools = this.options.usePromptCaching
			? tools.map((tool, index) => ({
					...tool,
					cache_control: index === tools.length - 1 ? { type: "ephemeral" } : undefined
			  }))
			: tools

		const createMessageFunc = this.options.usePromptCaching
			? this.client.beta.prompt_caching.messages.create
			: this.client.messages.create

		return await createMessageFunc(
			{
				model: this.getModel().id,
				max_tokens: this.getModel().info.maxTokens,
				system: systemMessages,
				messages,
				tools: cachedTools,
				tool_choice: { type: "auto" },
			},
			{
				headers: {
					...(this.options.usePromptCaching ? { "anthropic-beta": "prompt-caching-2024-07-31" } : {}),
					...(this.getModel().id === "claude-3-5-sonnet-20240620" ? { "anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15" } : {})
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
			system: [
				{
					role: "system",
					content: [
						{
							type: "text",
							text: "(see SYSTEM_PROMPT in src/ClaudeDev.ts)",
							...(this.options.usePromptCaching ? { cache_control: { type: "ephemeral" } } : {})
						}
					]
				}
			],
			messages: [{ conversation_history: "..." }, { role: "user", content: withoutImageData(userContent) }],
			tools: `(see tools in src/ClaudeDev.ts) ${this.options.usePromptCaching ? "(with cache_control added)" : ""}`,
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
