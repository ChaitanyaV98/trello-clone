import { NextResponse } from "next/server";
import openai from "@/openai";

// Define a type for todos if needed
type Todo = {
  id: string;
  title: string;
  status: "Todo" | "In Progress" | "Done"; // Adjust as needed
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const todos: Todo[] = await request.json();
    console.log("Received todos:", todos);
    console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);

    // Communicate with OpenAI GPT
    const response = await openai.chat.completions.create({
      model: "text-embedding-3-small",
      temperature: 0.8,
      n: 1,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "When responding, welcome the user always as Chaitanya and say 'Welcome to Todo app!'. Limit response to 200 characters.",
        },
        {
          role: "user",
          content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as Todo, In Progress, and Done. Then tell the user to have a productive day! Here's the data ${JSON.stringify(
            todos
          )}`,
        },
      ],
    });

    // Safely access the response content
    const messageContent = response.choices[0]?.message.content;
    if (!messageContent) {
      console.error("OpenAI response content is null.");
      return NextResponse.json({ error: "Unexpected response from OpenAI" });
    }

    console.log("Response from OpenAI:", messageContent);

    return NextResponse.json({ message: messageContent });
  } catch (error) {
    console.error("Error handling the POST request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
