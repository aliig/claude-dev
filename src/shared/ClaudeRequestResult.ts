export interface ClaudeRequestResult {
	didEndLoop: boolean
	inputTokens: number
	outputTokens: number
	cacheReadTokens: number
	cacheWriteTokens: number
}
