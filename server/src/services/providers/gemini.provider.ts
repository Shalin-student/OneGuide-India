import { GoogleGenerativeAI, SchemaType, FunctionDeclaration, GenerateContentRequest } from '@google/generative-ai';
import { 
  AiProviderAdapter, 
  AiProviderType, 
  AiMessage, 
  AiGenerateOptions, 
  AiGenerateResult, 
  AiTool,
  AiProviderError
} from '../ai.gateway';

export class GeminiProvider implements AiProviderAdapter {
  private genAI: GoogleGenerativeAI;
  private defaultModel: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.defaultModel = process.env.AI_PRIMARY_MODEL || 'gemini-2.5-flash';
  }

  getProviderName(): AiProviderType {
    return 'gemini';
  }

  supportsTools(): boolean {
    return true;
  }

  supportsStructuredOutput(): boolean {
    return true;
  }

  /**
   * Converts provider-neutral AiTool (JSON Schema-like) to Gemini FunctionDeclaration
   */
  private convertToolToGemini(tool: AiTool): FunctionDeclaration {
    return {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: SchemaType.OBJECT,
        properties: Object.keys(tool.parameters?.properties || {}).reduce((acc, key) => {
          // Simplified mapping assuming string parameters for our current search tools
          acc[key] = { type: SchemaType.STRING, description: tool.parameters.properties[key].description || '' };
          return acc;
        }, {} as Record<string, any>),
        required: tool.parameters?.required || []
      }
    };
  }

  /**
   * Normalizes Gemini errors into AiProviderError
   */
  private handleError(error: any): never {
    const status = error?.status || 500;
    let isRetryable = false;
    let message = error?.message || 'Unknown error';

    if (status === 429 || message.includes('Quota exceeded') || message.includes('429')) {
      isRetryable = true;
    } else if (status >= 500 && status < 600) {
      isRetryable = true;
    }

    throw new AiProviderError(
      this.getProviderName(),
      status,
      message,
      isRetryable
    );
  }

  async generateChat(messages: AiMessage[], options?: AiGenerateOptions): Promise<AiGenerateResult> {
    try {
      const modelName = options?.model || this.defaultModel;
      
      const requestOptions: GenerateContentRequest = {
        contents: []
      };

      if (options?.systemInstruction) {
        requestOptions.systemInstruction = {
          role: 'system',
          parts: [{ text: options.systemInstruction }]
        };
      }

      // Convert messages
      for (const msg of messages) {
        if (msg.role === 'system') continue; // Handled by systemInstruction for Gemini
        requestOptions.contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }

      // Convert tools
      const tools = [];
      if (options?.tools && options.tools.length > 0) {
        tools.push({
          functionDeclarations: options.tools.map(this.convertToolToGemini)
        });
      }

      const model = this.genAI.getGenerativeModel({ 
        model: modelName,
        tools: tools.length > 0 ? tools : undefined
      });

      const result = await model.generateContent(requestOptions);
      const response = result.response;
      
      const functionCalls = response.functionCalls();
      let textResult = '';
      try {
        textResult = response.text();
      } catch(e) {
        // text() can throw if response is blocked by safety or only contains function calls
      }

      return {
        text: textResult,
        toolCalls: functionCalls ? functionCalls.map(call => ({
          name: call.name,
          args: call.args as Record<string, any>
        })) : undefined,
        provider: this.getProviderName(),
        model: modelName,
        usage: response.usageMetadata ? {
          promptTokens: response.usageMetadata.promptTokenCount || 0,
          completionTokens: response.usageMetadata.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata.totalTokenCount || 0
        } : undefined
      };
      
    } catch (error) {
      this.handleError(error);
    }
  }
}
