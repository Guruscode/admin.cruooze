import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("Authorization") || ""

    // For development/testing, we can simulate a successful logout
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode: Returning mock logout response")
      return NextResponse.json({
        success: true,
        message: "Logged out successfully",
      })
    }

    // Forward the request to the actual API
    const response = await axios.post(
      "https://api.Cruooze.com.ng/users/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        timeout: 10000, // 10 second timeout
      },
    )

    // Return the API response
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("API proxy error:", error)

    // Handle axios errors
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { message: error.response.data.message || "API request failed" },
        { status: error.response.status },
      )
    }

    // Handle other errors
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
