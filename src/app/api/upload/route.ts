import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/admins";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limit";

// The browser uploads photos directly to Vercel Blob. Before it can, it asks
// this route for a token. We only issue one to the signed-in admin.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const { data: session } = await auth.getSession();
        if (!session?.user || !isAdminEmail(session.user.email)) {
          throw new Error("Not authorized to upload.");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to do — we save the returned URL when the post form submits.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
