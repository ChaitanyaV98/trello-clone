import formatTodosForAI from "./formatTodosForAI";
const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board);
  console.log("FORMATTED TODOS to send >>", todos);
  console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);
  const res = await fetch("api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });
  const GPTdata = await res.json();
  const { content } = GPTdata;
  return content;
};

export default fetchSuggestion;
