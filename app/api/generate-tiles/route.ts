import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { content } = await request.json()

        // Replace this with your actual AI API call (OpenAI, Anthropic, etc.)

        // Example with AI SDK:
        // import { generateText } from 'ai'
        // const { text } = await generateText({
        //   model: 'openai/gpt-4-mini',
        //   prompt: `Generate 5 SEO-friendly titles for this content:\n\n${content}`
        // })

        // Mock response for demonstration
        const mockTitles = [
            "Hướng dẫn chi tiết về " + content.substring(0, 20).toLowerCase(),
            "Tất cả những gì bạn cần biết về chủ đề này",
            "5 điều quan trọng không nên bỏ qua",
            "Giải pháp toàn diện cho vấn đề của bạn",
        ]

        return NextResponse.json({
            titles: mockTitles,
        })
    } catch (error) {
        console.error("Error generating titles:", error)
        return NextResponse.json(
            { error: "Failed to generate titles" },
            { status: 500 }
        )
    }
}
