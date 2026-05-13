export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://pg.ronzzyt.id/api/transaction/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.PG_API_KEY,
          code: "qris",
          amount: body.amount,
          description: body.description,
        }),
      }
    );

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    return Response.json({
      status: false,
      message: "Server Error",
    });
  }
}
