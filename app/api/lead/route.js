// import { createClient } from "@supabase/supabase-js";

// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY

// async function sendWhatsApp(phone, product) {
//   // Replace this with Interakt/Gupshup/MSG91 API later
//   console.log("Send WhatsApp to:", phone, "for:", product);

//   return true;
// }

// export async function POST(req) {
//   try {
//     const { phone, product } = await req.json();

//     if (!phone || !product) {
//       return Response.json({ error: "Missing phone or product" }, { status: 400 });
//     }

//     const fullPhone = `+91${phone}`;

//     const { data: existing } = await supabaseAdmin
//       .from("leads")
//       .select("*")
//       .eq("phone", fullPhone)
//       .single();

//     if (existing) {
//       return Response.json({
//         success: true,
//         alreadyExists: true,
//         message: "Number already exists. WhatsApp not sent again.",
//       });
//     }

//     const whatsappSent = await sendWhatsApp(fullPhone, product);

//     const { error } = await supabaseAdmin.from("leads").insert([
//       {
//         phone: fullPhone,
//         product_page: product,
//         whatsapp_sent: whatsappSent,
//       },
//     ]);

//     if (error) {
//       return Response.json({ error: error.message }, { status: 500 });
//     }

//     return Response.json({
//       success: true,
//       alreadyExists: false,
//       whatsappSent,
//     });
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }