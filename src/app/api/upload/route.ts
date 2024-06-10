import { NextRequest, NextResponse } from "next/server";
import { Dropbox } from "dropbox";
import fetch from "node-fetch";
import { NextApiResponse } from "next";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const dbx = new Dropbox({
    clientId: "v379w9xzvjkxzia",
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    fetch,
  });

  try {
    await dbx.filesUpload({
      path: "/" + file.name,
      contents: file,
    });

    const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: "/" + file.name,
    });

    const fileUrl = sharedLinkResponse.result.url.replace(
      "www.dropbox.com",
      "dl.dropbox.com"
    );

    return NextResponse.json({
      fileUrl,
      fileName: file.name,
      size: file.size,
      lastModified: new Date(file.lastModified),
    });
  } catch (error) {
    console.error(error);

    console.log("DROPBOX_ACCESS_TOKEN:", process.env.DROPBOX_ACCESS_TOKEN);

    return NextResponse.json(
      {
        error: "Ошибка при загрузке файла на Dropbox",
        errorDetails: error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, res: NextApiResponse) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const dbx = new Dropbox({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    fetch,
  });

  try {
    await dbx.filesUpload({
      path: "/" + file.name,
      contents: file,
    });

    await dbx.filesDeleteV2({ path: "/" + file.name });

    return NextResponse.json({
      fileName: file.name,
      size: file.size,
      lastModified: new Date(file.lastModified),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Ошибка при загрузке файла на Dropbox",
      },
      { status: 500 }
    );
  }
}
