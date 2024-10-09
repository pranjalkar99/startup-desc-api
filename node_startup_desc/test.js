import { ChatPromptTemplate } from "@langchain/core/prompts";

async function run() {
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    ["user", "Tell me a joke about {topic}"],
  ]);

  const res = await promptTemplate.invoke({ topic: "cats" });
  console.log(res);
}

run();
