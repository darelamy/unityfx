import { NextRequest, NextResponse } from "next/server";
import { Dropbox } from "dropbox";
import fetch from "node-fetch";
import { NextApiResponse } from "next";

export async function POST(req: NextRequest, res: NextApiResponse) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const dbx = new Dropbox({
      clientId: "v379w9xzvjkxzia",
      accessToken: process.env.DROPBOX_ACCESS_TOKEN,
      fetch,
    });

    const CHUNK_SIZE = 8 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    let sessionId = null;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const arrayBuffer = await chunk.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      if (i === 0) {
        // Start upload session
        const response = await dbx.filesUploadSessionStart({
          contents: uint8Array,
        });
        sessionId = response.result.session_id;
      } else {
        // Append or finish upload session
        await dbx.filesUploadSessionAppendV2({
          cursor: {
            session_id: sessionId as string,
            offset: start,
          },
          close: i === totalChunks - 1,
          contents: uint8Array,
        });
      }
    }

    // Finish the upload session
    const commitInfo = {
      path: "/" + file.name,
      mode: "add",
      autorename: true,
      mute: false,
    };

    const result = await dbx.filesUploadSessionFinish({
      cursor: {
        session_id: sessionId as string,
        offset: file.size,
      },
      commit: commitInfo as any,
    });

    const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: result.result.path_lower as string,
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
    console.error("Error uploading file to Dropbox:", error);

    return NextResponse.json(
      {
        error: "Ошибка при загрузке файла на Dropbox",
        details: error,
      },
      { status: 500 }
    );
  }
}
