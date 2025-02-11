export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(await env.ASSETS.fetch(request)); // Serve static HTML
    }

    if (request.method === "POST" && url.pathname === "/submit") {
      return await handleSubmit(request, env);
    }

    return new Response("Not Found", { status: 404 });
  },
};

async function handleSubmit(request, env) {
  try {
    const data = await request.json(); // Get JSON body

    // Extract variables from the form data
    const vehicle = data.Vehicles || "N/A";
    const callOut = data.CallOut || "N/A";
    const client = data.client || "Unknown Client";
    const jobnr = data.jobnr || "00000";
    const calloutTotal = Number(data.calloutTotal) || 0;
    const Traveltotal = Number(data.Traveltotal) || 0;
    const labourTotal = Number(data.labourTotal) || 0;
    const towtotal = Number(data.towtotal) || 0;
    const ADDtotal = Number(data.ADDtotal) || 0;
    const Tolltotal = Number(data.Tolltotal) || 0;
    const totalExclVAT = Number(data.totalExclVAT) || 0;
    const totalVAT = Number(data.totalVAT) || 0;

    // Get the next available ID
    const { results } = await env.DB.prepare("SELECT MAX(qoutenr) AS last_id FROM CalculatedCosts").all();
    const nextId = (results[0]?.last_id || 0) + 1;
    const qoutenr = "Q00" + nextId;
    const date = Date.now();

    // Insert into D1 database
    await env.DB.prepare(`
      INSERT INTO CalculatedCosts (date, fullqoutenr, qoutenr, vehicle, callout, callouttotal, perkm, labourprep, kmtowed, additional, toll, totalexlvat, totalinclvat, client, jobnr)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(date, qoutenr, nextId, vehicle, callOut, calloutTotal, Traveltotal, labourTotal, towtotal, ADDtotal, Tolltotal, totalExclVAT, totalVAT, client, jobnr)
      .run();

    return new Response(JSON.stringify({ message: "Data saved successfully", totalVAT }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Database query failed:", err);
    return new Response(JSON.stringify({ error: "Database query failed" }), { status: 500 });
  }
}
