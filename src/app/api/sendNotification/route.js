// pages/api/sendNotification.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";

var keyyy =
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCobK7ooZMfgsSf\nGUMtZVI33kSsCasoR8jObeft7wa1PYscrzGYTGOudQgMvi8x0/WmK6pYzGizVPNk\n2oYczhd8UFDsAIU/v4Xsq4TkMJBe5cp6Rro2qMzKmQ02hfJ6M9I2x8N+uOpXiMOd\n/rkWFoUD4MsnwbRRXyGgzk5sII1J5ywF2O/GiBbnHc2gcl/DZ8gmMJnv/94oX1fU\nhDpkLJlN6laLGz5e6IcxHy2JtKVF4BfHptZf/83qkqtFhwNK7RpJDsWpr0ToBjF6\n/B4UBz534dC4D1yTKD7sEP/EjcBMJ5nR/1dlV5VruiTceMy5/yofgHaZNs3bfSIF\nZ/zkKL65AgMBAAECggEABdtZrb9IpXTfr4SqYF7AoC67hpwDdrAgXIVX5l9EhXLx\nbnrtJ5Wodb2eHQtUCtCLH08vak0ZavsOR7iNp1zHVkxYtAxElfXsC1HfmivSKWqm\nQuBIw3PVQ0pVOksoJnW83qjNtI9rnsWjv8/G0ezQjVT425YR1i6Ptc7WzU3IfARe\na0Vcb00FGVVeUW0qOUmcburI5eGMcfwhTv2iAS5zvyp9WScCCBer4hHsD5sL5Gr9\nxiAHMvHgUL0moplfF8ucbwFoY+Zr6BJ6rmiCUn/vVF3RK/eFgP/IZBVNynYk4BJo\n8zTrGDRkAk4OD6H2gtvFaGK21STG6Da3k2uLCFnwLQKBgQC5NOIsDODZVWq9Ge/s\n71k8BTKRECXYLB9qG5F1guR6HjlKbaGqJmc0mouoFkP3AfK9QmhHZzywJ7AjX9z5\nVz9AKdWl/ip6wyd1Xq0BAVEGUWHlVtRDKIpuRnQFg8BR52PMlDBNg0dqvkuZfVez\nPKxSUddj1PFdIFUJTlfPjm5fFwKBgQDozZ5k2Cfs/SWRZBUUFVbOkaKBqqteqoVt\nilaEwq06E3hgENqchZjNZNYBhCpOZU1fyXNt8yMhD+QPu21qT+9tUTpQnHzV/tv0\nScgCyXGa2sXXL0dKVXdatyvDWaJ7vJMpDt6eXpUkMk+c0V292S2E/6IyWO169EMx\nE0XR6P7yrwKBgQCxCWIhZXYRidrsRDzaKbkM7JL3o43pY9Pro8qZn7MzIGz3PnDI\nqskAubJBzHbPSKd2TmJLzt1uLaHrTpl2JvYpKVQ2xgxpKN8xDH0ndtCyz1xa03M3\ndytMWkBRfS17nUoCpqy9i33bBWhSokQQ6zB1yBGyNj06Hcvrh13c43ORpQKBgEMp\nhue7AJG7Woo+YGJh4aBInaRg832lHkdC4MD+VPFrSpAUbK05UaL301GuqnHhgdf/\ni0COI3VXW0k6nk9MbluQUo2NB+rI0vYADybWrOKq+OaiqiOE0qEmNQbvphOijKYM\ntybjTI2bwiIQuMWbkSlMgqOZyjFtpLDUyZDMcjjbAoGATFM42jhea61S+NveBxGJ\nf74LJhyrawzdp+npt8h8bxaUpUSoZk+Rx/WSqGuViundlr8TdbDSHSHS2N4mGNPM\nHQR5bw3JR2RrV1Y7GbPkNK8tV8Lho/f/mLvw1GeZVwkLdvYl3REqGfWXNAjZaoIp\nntscRNVW6T+jc7sVoAeehf4=\n-----END PRIVATE KEY-----\n";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "portfilio-nextjs",
      privateKey: keyyy?.replace(/\\n/g, "\n"),
      clientEmail:
        "firebase-adminsdk-llem6@portfilio-nextjs.iam.gserviceaccount.com",
    }),
  });
}

export async function POST(req) {
  try {
    const { token, title, body } = await req.json();

    const message = {
      notification: { title, body },
      token,
    };

    console.log("message", message);

    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("FCM Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
