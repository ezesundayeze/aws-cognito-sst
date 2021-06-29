export async function handler() {
    const rand =  Math.floor(Math.random() * 10);

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/json" },
      body: `Public Random Number: ${rand}`,
    };
}
  