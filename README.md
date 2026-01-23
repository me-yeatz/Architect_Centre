<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Architect Centre

Your AI Studio Manager. Automate client updates, generate copywriting, and manage project tasks directly from your workflow canvas.

## Overview

AI Architect Centre is a visual workflow automation platform designed specifically for architecture professionals. It combines the visual workflow approach of tools like Zapier with AI-powered content generation to automate client communication, marketing materials, and project updates.

### Key Features
- **Visual Workflow Builder**: Drag-and-drop interface for creating automated workflows
- **AI-Powered Content Generation**: Uses Google's Gemini API to create emails, social media captions, and client updates
- **Multi-channel Communication**: Simulated WhatsApp integration with preview and send capabilities
- **Real-time Monitoring**: Live logs and status indicators for workflow execution
- **Project Context Awareness**: AI understands project details to generate relevant content
- **Local Storage**: Persists content and communications in browser storage

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser

## Architecture

The application follows a modular React architecture with the following key components:

- `App.tsx`: Main application component with workflow execution logic
- `Canvas.tsx`: Visual workflow editor with node positioning and connections
- `Node.tsx`: Individual workflow nodes with different types (trigger, action, condition, response)
- `WhatsAppSimulator.tsx`: Communication interface for client interactions
- `services/geminiService.ts`: AI integration layer
- `services/storageService.ts`: Local storage management

## Workflow Types

The platform supports four types of workflow nodes:

- **Trigger**: Initiates workflow execution (e.g., project milestone reached)
- **Action**: Performs operations like AI content generation
- **Condition**: Decision points in the workflow
- **Response**: Output actions like sending messages or saving content

## Configuration

The application can be customized through:

- `constants.ts`: Initial workflow definitions and mock project data
- `types.ts`: Data structure definitions
- `vite.config.ts`: Development server and build configurations

## Deployment

For production deployment:

1. Build the application: `npm run build`
2. Serve the `dist/` folder using a static web server
3. Ensure environment variables are properly configured for the target environment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

For more information about the AI capabilities, visit the [Google AI Studio](https://ai.google.dev/).
