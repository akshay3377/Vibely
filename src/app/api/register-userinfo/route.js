import os from "os";
import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const uploadedFiles = formData.getAll("FILE");

    const name = formData.get("name");
    const role = formData.get("role");

    if (!name || !role) {
      return new Response(
        JSON.stringify({ success: false, message: "Name or role is missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No file uploaded" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const uploadedFile = uploadedFiles[0];

    if (!uploadedFile || typeof uploadedFile.arrayBuffer !== "function") {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid file format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fileName = uuidv4();
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    const tempFilePath = path.join(os.tmpdir(), `${fileName}.pdf`);

    // Save file temporarily
    await fs.writeFile(tempFilePath, fileBuffer);

    const pdfParser = new PDFParser(null, 1);

    let resumeText = "";

    await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) =>
        reject(errData.parserError)
      );
      pdfParser.on("pdfParser_dataReady", () => {
        const rawText = pdfParser.getRawTextContent().trim();
        if (!rawText) {
          reject(new Error("PDF is empty or unreadable"));
        } else {
          resumeText = rawText;
          resolve();
        }
      });

      pdfParser.loadPDF(tempFilePath);
    });

    await connectToDB();

    // Save to DB
    const user = await User.create({
      name,
      role,
      resumeText,
      fileName,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Resume uploaded and saved successfully",
        user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in POST /api:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Something went wrong",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
