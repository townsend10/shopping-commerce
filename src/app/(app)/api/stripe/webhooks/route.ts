import Stripe from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ExpandedLineItems } from "@/modules/checkout/types";
export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknow error";

    if (error! instanceof Error) {
      console.log(`Error Message: ${errorMessage}`);
    }
    return NextResponse.json(
      { message: `Weboohk error: ${errorMessage}` },
      { status: 400 }
    );
  }
  console.log("sucess:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
  ];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;

          if (!data.metadata?.userId) {
            throw new Error("User Id is required");
          }

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) {
            throw new Error("User not found");
          }

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            { expand: ["line_items.data.price.product"] },
            { stripeAccount: event.account }
          );

          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items?.data.length
          ) {
            throw new Error("No line items find");
          }

          const lineItems = expandedSession.line_items
            .data as ExpandedLineItems[];

          for (const item of lineItems) {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                stripeAccountId: event.account,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.name,
              },
            });
          }
          break;
        case "account.updated":
          data = event.data.object as Stripe.Account;
          await payload.update({
            collection: "tenants",
            where: {
              stripeAccountId: {
                equals: data.id,
              },
            },
            data: {
              stripeDetailsSubmitted: data.details_submitted,
            },
          });
        default:
          throw new Error(`Unhaled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: `Weboohk handler failed` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}

// import Stripe from "stripe";
// import { getPayload } from "payload";
// import config from "@payload-config";
// import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";
// import { ExpandedLineItems } from "@/modules/checkout/types";

// export async function POST(req: Request) {
//   console.log("1. Webhook request received!"); // Adicione aqui

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       await (await req.blob()).text(),
//       req.headers.get("stripe-signature") as string,
//       process.env.STRIPE_WEBHOOK_SECRET as string
//     );
//     console.log("2. Event constructed successfully:", event.id); // Adicione aqui
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     console.error(`3. Error in event construction: ${errorMessage}`); // Use console.error para destacar
//     return NextResponse.json(
//       { message: `Webhook error: ${errorMessage}` },
//       { status: 400 }
//     );
//   }
//   console.log("4. Processing permitted events..."); // Adicione aqui

//   const permittedEvents: string[] = ["checkout.session.completed"];
//   const payload = await getPayload({ config });

//   if (permittedEvents.includes(event.type)) {
//     let data;
//     try {
//       console.log(`5. Handling event type: ${event.type}`); // Adicione aqui
//       switch (event.type) {
//         case "checkout.session.completed":
//           data = event.data.object as Stripe.Checkout.Session;
//           console.log("6. Checkout session completed data:", data.id); // Adicione aqui

//           // if (!data.metadata?.userId) {
//           //   throw new Error("User Id is required");
//           // }
//           // console.log("7. User ID found:", data.metadata.userId);

//           const user = await payload.findByID({
//             collection: "users",
//             id: "6859dc31ce1d557a20ad0998",
//           });

//           if (!user) {
//             throw new Error("User not found");
//           }
//           console.log("8. User found:", user.id);

//           const expandedSession = await stripe.checkout.sessions.retrieve(
//             data.id,
//             { expand: ["line_items.data.price.product"] }
//           );
//           console.log("9. Expanded session retrieved.");

//           if (
//             !expandedSession.line_items?.data ||
//             !expandedSession.line_items?.data.length
//           ) {
//             throw new Error("No line items find");
//           }
//           console.log("10. Line items found.");

//           const lineItems = expandedSession.line_items
//             .data as ExpandedLineItems[];

//           for (const item of lineItems) {
//             console.log(
//               "11. Creating order for product:",
//               (item.price.product as Stripe.Product).name
//             ); // Cast para Product para acessar name
//             await payload.create({
//               collection: "orders",
//               data: {
//                 stripeCheckoutSessionId: data.id,
//                 user: user.id,
//                 product: item.price.product.metadata.id,
//                 name: item.price.product.name,
//               },
//             });
//           }
//           console.log("12. All orders created.");
//           break;
//         default:
//           throw new Error(`Unhaled event: ${event.type}`);
//       }
//     } catch (error: any) {
//       // Capture o erro como 'any' ou 'unknown' para verificar a instância
//       console.error("13. Error in webhook handler:", error.message || error); // Log o erro específico
//       return NextResponse.json(
//         { message: `Webhook handler failed` },
//         { status: 500 }
//       );
//     }
//   }
//   console.log("14. Webhook processing finished.");
//   return NextResponse.json({ message: "Received" }, { status: 200 });
// }
