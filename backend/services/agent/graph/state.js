import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation(),
  aiResponse: Annotation(),
  agent: Annotation(),
  conversationId:Annotation(),
  agentFallback: Annotation(),
  routerMeta: Annotation(),
  attachments: Annotation(),
  history: Annotation(),
  searchResults:Annotation(),
  images:Annotation(),
  artifacts:Annotation(),
  userId:Annotation(),
  creditDeduction: Annotation(),
  file:Annotation(),
});
