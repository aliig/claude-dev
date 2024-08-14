export type ApiProvider = "anthropic" | "openrouter" | "bedrock"

export interface ApiHandlerOptions {
	apiModelId?: ApiModelId
	apiKey?: string // anthropic
	openRouterApiKey?: string
	awsAccessKey?: string
	awsSecretKey?: string
	awsRegion?: string
	usePromptCaching?: boolean // New option for prompt caching
}

export type ApiConfiguration = ApiHandlerOptions & {
	apiProvider?: ApiProvider
}

// Models

export interface ModelInfo {
	maxTokens: number
	supportsImages: boolean
	inputPrice: number
	outputPrice: number
	cacheInputPrice?: number
	cacheOutputPrice?: number
}

export type ApiModelId = AnthropicModelId | OpenRouterModelId | BedrockModelId

// Anthropic
// https://docs.anthropic.com/en/docs/about-claude/models
export type AnthropicModelId = keyof typeof anthropicModels
export const anthropicDefaultModelId: AnthropicModelId = "claude-3-5-sonnet-20240620"
export const anthropicModels = {
	"claude-3-5-sonnet-20240620": {
		maxTokens: 8192,
		supportsImages: true,
		inputPrice: 3.0, // $3 per million input tokens
		outputPrice: 15.0, // $15 per million output tokens
		cacheInputPrice: 3.75, // $3.75 per million cache input tokens (cache writes)
		cacheOutputPrice: 0.30, // $0.30 per million cache output tokens (cache hits)
	},
	"claude-3-opus-20240229": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 15.0,
		outputPrice: 75.0,
		cacheInputPrice: 18.75,
		cacheOutputPrice: 1.50,
	},
	"claude-3-sonnet-20240229": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 3.0,
		outputPrice: 15.0,
		cacheInputPrice: 3.75,
		cacheOutputPrice: 0.30,
	},
	"claude-3-haiku-20240307": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 0.25,
		outputPrice: 1.25,
		cacheInputPrice: 0.30,
		cacheOutputPrice: 0.03,
	},
} as const satisfies Record<string, ModelInfo> // as const assertion makes the object deeply readonly

// AWS Bedrock
// https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html
export type BedrockModelId = keyof typeof bedrockModels
export const bedrockDefaultModelId: BedrockModelId = "anthropic.claude-3-5-sonnet-20240620-v1:0"
export const bedrockModels = {
	"anthropic.claude-3-5-sonnet-20240620-v1:0": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic.claude-3-opus-20240229-v1:0": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 15.0,
		outputPrice: 75.0,
	},
	"anthropic.claude-3-sonnet-20240229-v1:0": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic.claude-3-haiku-20240307-v1:0": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 0.25,
		outputPrice: 1.25,
	},
} as const satisfies Record<string, ModelInfo>

// OpenRouter
// https://openrouter.ai/models?order=newest&supported_parameters=tools
export type OpenRouterModelId = keyof typeof openRouterModels
export const openRouterDefaultModelId: OpenRouterModelId = "anthropic/claude-3.5-sonnet:beta"
export const openRouterModels = {
	"anthropic/claude-3.5-sonnet:beta": {
		maxTokens: 8192,
		supportsImages: true,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic/claude-3-opus:beta": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 15,
		outputPrice: 75,
	},
	"anthropic/claude-3-sonnet:beta": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 3,
		outputPrice: 15,
	},
	"anthropic/claude-3-haiku:beta": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 0.25,
		outputPrice: 1.25,
	},
	"openai/gpt-4o-2024-08-06": {
		maxTokens: 16384,
		supportsImages: true,
		inputPrice: 2.5,
		outputPrice: 10,
	},
	"openai/gpt-4o-mini-2024-07-18": {
		maxTokens: 16384,
		supportsImages: true,
		inputPrice: 0.15,
		outputPrice: 0.6,
	},
	"openai/gpt-4-turbo": {
		maxTokens: 4096,
		supportsImages: true,
		inputPrice: 10,
		outputPrice: 30,
	},
	"deepseek/deepseek-coder": {
		maxTokens: 4096,
		supportsImages: false,
		inputPrice: 0.14,
		outputPrice: 0.28,
	},
	"mistralai/mistral-large": {
		maxTokens: 8192,
		supportsImages: false,
		inputPrice: 3,
		outputPrice: 9,
	},
} as const satisfies Record<string, ModelInfo>
