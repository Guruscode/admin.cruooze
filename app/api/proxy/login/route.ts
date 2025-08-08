import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()

    // Always return a successful mock response for testing
    return NextResponse.json({
      success: true,
      token: "mock-token-for-testing",
      user: {
        name: body.email.split("@")[0],
        email: body.email,
      },
    })

    /* Commented out actual API call for now
    // Forward the request to the actual API
    const response = await axios.post("https://api.Cruooze.com.ng/users/login", body, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Return the API response
    return NextResponse.json(response.data)
    */
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
